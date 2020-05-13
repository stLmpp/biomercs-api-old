import { EntityRepository, Repository } from 'typeorm';
import { Type } from './type.entity';
import { TypeParamsDto } from './type.dto';

@EntityRepository(Type)
export class TypeRepository extends Repository<Type> {
  async findByParams({
    idGame,
    idMode,
    ...dto
  }: TypeParamsDto): Promise<Type[]> {
    const qb = this.createQueryBuilder('type');
    if (idGame || idMode) {
      qb.innerJoin('type.gameModeTypes', 'gmt').innerJoin('gmt.gameMode', 'gm');
      if (idGame) {
        qb.andWhere('gm.idGame = :idGame', { idGame });
      }
      if (idMode) {
        qb.andWhere('gm.idMode = :idMode', { idMode });
      }
    }
    return this.fillAndWhere('type', dto, qb).getMany();
  }
}
