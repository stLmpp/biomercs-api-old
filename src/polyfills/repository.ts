import { FindConditions, ObjectLiteral, Repository } from 'typeorm';

declare module 'typeorm/repository/Repository' {
  interface Repository<Entity> {
    exists(
      where?:
        | FindConditions<Entity>[]
        | FindConditions<Entity>
        | ObjectLiteral
        | string
    ): Promise<boolean>;
  }
}

Repository.prototype.exists = async function(where) {
  try {
    return !!(await this.findOne({ where, select: ['id' as any] }));
  } catch (e) {
    return !!(await this.findOne({ where }));
  }
};
