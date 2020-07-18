import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import * as OpenID from 'openid';
import { environment } from '../shared/env/env';
import { SteamProfile } from './steam-profile.entity';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { User } from '../auth/user/user.entity';
import { UserService } from '../auth/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamProfileRepository } from './steam-profile.repository';
import { PlayerService } from '../player/player.service';
import { ScorePlayerService } from '../score/score-player/score-player.service';

@Injectable()
export class SteamService {
  constructor(
    private http: HttpService,
    private userService: UserService,
    @InjectRepository(SteamProfileRepository)
    private steamProfileRepository: SteamProfileRepository,
    private playerService: PlayerService,
    private scorePlayerService: ScorePlayerService
  ) {}

  relyingParty = new OpenID.RelyingParty(
    'http://localhost:3000/api/steam/auth',
    'http://localhost:3000',
    true,
    true,
    []
  );

  async openIdUrl(user: User): Promise<string> {
    this.relyingParty.returnUrl = `http://localhost:3000/api/steam/auth?idUser=${user.id}`;
    return new Promise((resolve, reject) => {
      this.relyingParty.authenticate(
        environment.steamOpenIDUrl,
        false,
        (error, authUrl) => {
          if (error) return reject('Authentication failed: ' + error);
          if (!authUrl) return reject('Authentication failed.');
          resolve(authUrl);
        }
      );
    });
  }

  async authenticate(req: Request, idUser: number): Promise<SteamProfile> {
    return new Promise((resolve, reject) => {
      this.relyingParty.verifyAssertion(req, async (error, result) => {
        if (error) return reject(error.message);
        if (!result || !result.authenticated) {
          return reject('Failed to authenticate user.');
        }
        if (
          !/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(
            result.claimedIdentifier
          )
        ) {
          return reject('Claimed identity is not valid.');
        }
        try {
          const steamProfile = await this.getPlayerSummary(
            result.claimedIdentifier.replace(
              'https://steamcommunity.com/openid/id/',
              ''
            )
          );
          return resolve(await this.checkUser(steamProfile, idUser));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  async checkUser(
    steamProfile: SteamProfile,
    idUser: number
  ): Promise<SteamProfile> {
    const player = await this.playerService.findByUserId(idUser);
    let steamProfileDatabase = await this.steamProfileRepository.findOne(
      player.idSteamProfile
    );
    if (steamProfileDatabase && steamProfileDatabase.id !== player.idSteamProfile) {
      const playerSteamProfile = await this.playerService.findBySteamProfileId(steamProfileDatabase.id);
      await this.scorePlayerService.updatePlayer(playerSteamProfile.id, player.id);
      await this.playerService.delete(playerSteamProfile.id);
    }
    if (
      !steamProfileDatabase ||
      steamProfileDatabase.steamid === steamProfile.steamid
    ) {
      steamProfileDatabase = await this.steamProfileRepository.save(
        new SteamProfile().extendDto({
          ...steamProfileDatabase,
          ...steamProfile,
        })
      );
      if (!player.idSteamProfile) {
        await this.playerService.update(player.id, {
          idSteamProfile: steamProfileDatabase.id,
        });
      }
    } else if (steamProfileDatabase.steamid !== steamProfile.steamid) {
      throw new BadRequestException(
        'User already have a steam profile associated'
      );
    }
    return steamProfileDatabase;
  }

  async updateSteamProfile(idSteamProfile: number): Promise<SteamProfile> {
    const steamProfile = await this.steamProfileRepository.findOne(
      idSteamProfile
    );
    if (!steamProfile?.steamid) {
      throw new BadRequestException('Steam Profile does not exist');
    }
    await this.steamProfileRepository.update(idSteamProfile, {
      ...(await this.getPlayerSummary(steamProfile.steamid)),
    });
    return await this.steamProfileRepository.findOne(idSteamProfile);
  }

  async getPlayerSummary(steamId: string): Promise<SteamProfile> {
    return this.http
      .get<{ response: { players: SteamProfile[] } }>(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002`,
        {
          params: {
            key: environment.steamKey,
            steamids: steamId,
          },
        }
      )
      .pipe(map(response => response?.data?.response?.players?.[0]))
      .toPromise();
  }
}
