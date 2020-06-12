import { EntityRepository, Repository } from 'typeorm';
import { GameModeStage } from './game-mode-stage.entity';

@EntityRepository(GameModeStage)
export class GameModeStageRepository extends Repository<GameModeStage> {
  async findIdByIds(
    idGame: number,
    idMode: number,
    idStage: number
  ): Promise<number> {
    return (
      await this.createQueryBuilder('gms')
        .select('gms.id')
        .innerJoin('gms.gameMode', 'gm')
        .andWhere('gm.idGame = :idGame', { idGame })
        .andWhere('gm.idMode = :idMode', { idMode })
        .andWhere('gms.idStage = :idStage', { idStage })
        .getOne()
    ).id;
  }
}
