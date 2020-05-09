import {
  FindConditions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

declare module 'typeorm/repository/Repository' {
  interface Repository<Entity> {
    exists(
      where?:
        | FindConditions<Entity>[]
        | FindConditions<Entity>
        | ObjectLiteral
        | string
    ): Promise<boolean>;
    fillAndWhere(
      name: string,
      dto: FindConditions<Entity>,
      queryBuilder: SelectQueryBuilder<Entity>
    ): SelectQueryBuilder<Entity>;
  }
}

Repository.prototype.exists = async function(where) {
  try {
    return !!(await this.findOne({ where, select: ['id' as any] }));
  } catch (e) {
    return !!(await this.findOne({ where }));
  }
};

Repository.prototype.fillAndWhere = function(name, dto, queryBuilder) {
  return Object.entries(dto).reduce((builder, [key, item]) => {
    return builder.andWhere(`${name}.${key} = :${key}`, { [key]: item });
  }, queryBuilder);
};
