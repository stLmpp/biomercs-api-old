import { FindConditions, Repository, SelectQueryBuilder } from 'typeorm';
import { ObjectID } from 'typeorm/driver/mongodb/typings';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { isPrimitive } from 'is-what';

declare module 'typeorm/repository/Repository' {
  interface Repository<Entity> {
    exists(
      id?: string | number | Date | ObjectID,
      options?: FindOneOptions<Entity>
    ): Promise<boolean>;
    exists(
      options?: FindConditions<Entity> | FindConditions<Entity>[]
    ): Promise<boolean>;
    exists(
      idOrOptions?:
        | string
        | number
        | Date
        | ObjectID
        | FindConditions<Entity>
        | FindConditions<Entity>[],
      options?: FindOneOptions<Entity>
    ): Promise<boolean>;
    fillAndWhere(
      name: string,
      dto: FindConditions<Entity>,
      queryBuilder: SelectQueryBuilder<Entity>
    ): SelectQueryBuilder<Entity>;
  }
}

Repository.prototype.exists = async function(where) {
  if (isPrimitive(where)) {
    return !!(await this.findOne(where, { select: ['id'] }));
  } else {
    return !!(await this.findOne({ select: ['id'], where }));
  }
};

Repository.prototype.fillAndWhere = function(name, dto, queryBuilder) {
  return Object.entries(dto).reduce((builder, [key, item]) => {
    return builder.andWhere(`${name}.${key} = :${key}`, { [key]: item });
  }, queryBuilder);
};
