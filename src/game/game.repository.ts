import { EntityRepository, Repository } from 'typeorm';
import { Game } from './game.entity';
import { GameParamsDto } from './game.dto';

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
  async findByParams({ idPlatform, ...dto }: GameParamsDto): Promise<Game[]> {
    const qb = this.createQueryBuilder('game');
    if (idPlatform) {
      qb.innerJoin('game.gameModes', 'gm')
        .innerJoin('gm.gameModePlatforms', 'gmp')
        .andWhere('gmp.idPlatform = :idPlatform', { idPlatform });
    }
    return this.fillAndWhere('game', dto, qb).getMany();
  }
}
