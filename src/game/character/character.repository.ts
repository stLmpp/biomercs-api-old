import { EntityRepository, Repository } from 'typeorm';
import { Character } from './character.entity';
import { GameModeCharacter } from '../game-mode-character/game-mode-character.entity';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  async findByParam(
    idGameMode?: number,
    idGame?: number,
    idMode?: number
  ): Promise<Character[]> {
    const qb = this.createQueryBuilder('char');
    if (idGameMode || idGame || idMode) {
      qb.andExists(sbq => {
        const subQuery = sbq
          .from(GameModeCharacter, 'gmc')
          .andWhere('char.id = gmc.idCharacter');
        if (idGameMode) {
          subQuery.andWhere('gmc.idGameMode = :idGameMode', { idGameMode });
        }
        if (idGame || idMode) {
          subQuery.innerJoin('gmc.gameMode', 'gm');
          if (idGame) {
            subQuery.andWhere('gm.idGame = :idGame', { idGame });
          }
          if (idMode) {
            subQuery.andWhere('gm.idMode = :idMode', { idMode });
          }
        }
        return subQuery;
      });
    }
    return qb.getMany();
  }
}
