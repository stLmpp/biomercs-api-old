import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { GameModeStage } from './game-mode-stage.entity';
import { GameModeStageParamsDto } from './game-mode-stage.dto';

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

  private findByParamsBase({
    idGame,
    idMode,
    ...dto
  }: GameModeStageParamsDto): SelectQueryBuilder<GameModeStage> {
    const qb = this.createQueryBuilder('gms');
    if (idGame || idMode) {
      qb.innerJoin('gms.gameMode', 'gm');
      if (idGame) {
        qb.andWhere('gm.idGame = :idGame', { idGame });
      }
      if (idMode) {
        qb.andWhere('gm.idMode = :idMode', { idMode });
      }
    }
    return this.fillAndWhere('gms', dto, qb);
  }

  async findByParams(dto: GameModeStageParamsDto): Promise<GameModeStage[]> {
    return await this.findByParamsBase(dto).getMany();
  }

  async findOneByParams(dto: GameModeStageParamsDto): Promise<GameModeStage> {
    return await this.findByParamsBase(dto).getOne();
  }
}
