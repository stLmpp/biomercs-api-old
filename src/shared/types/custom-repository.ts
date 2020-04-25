import { FindConditions, Repository, ObjectLiteral } from 'typeorm';

export class CustomRepository<Entity> extends Repository<Entity> {
  async exists(
    where?:
      | FindConditions<Entity>[]
      | FindConditions<Entity>
      | ObjectLiteral
      | string
  ): Promise<boolean> {
    try {
      return !!(await this.findOne({ where, select: ['id' as any] }));
    } catch (e) {
      return !!(await this.findOne({ where }));
    }
  }

  async findRandom(length = 20, select?: (keyof Entity)[]): Promise<Entity[]> {
    const queryBuilder = this.createQueryBuilder()
      .orderBy('rand()')
      .limit(length);
    if (select?.length) {
      queryBuilder.addSelect(select as string[]);
    }
    return queryBuilder.getMany();
  }

  /*customUpdate(id: number, partialEntity: QueryDeepPartialEntity<Entity>, idKey: keyof Entity | string = 'id'): Promise<Entity> {
    return this.save<Entity>(partialEntity)
  }*/
}
