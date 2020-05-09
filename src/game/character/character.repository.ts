import { EntityRepository, Repository } from 'typeorm';
import { Character } from './character.entity';
import { CharacterParamsDto } from './character.dto';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  async findByParams({
    idGame,
    idMode,
    ...dto
  }: CharacterParamsDto): Promise<Character[]> {
    const qb = this.createQueryBuilder('char');
    if (idGame || idMode) {
      qb.innerJoin('char.gameModeCharacters', 'gmc').innerJoin(
        'gmc.gameMode',
        'gm'
      );
      if (idGame) {
        qb.andWhere('gm.idGame = :idGame', { idGame });
      }
      if (idMode) {
        qb.andWhere('gm.idMode = :idMode', { idMode });
      }
    }
    return this.fillAndWhere('char', dto, qb).getMany();
  }
}
