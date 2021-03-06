import { SelectQueryBuilder } from 'typeorm';
import { UnaryFunction } from 'rxjs';
export type OperatorFunction<T, R = T> = UnaryFunction<
  SelectQueryBuilder<T>,
  SelectQueryBuilder<R>
>;

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    andExists(
      subQuery: (
        queryBuilder: SelectQueryBuilder<Entity>
      ) => SelectQueryBuilder<any>
    ): this;
    orExists(
      subQuery: (
        queryBuilder: SelectQueryBuilder<Entity>
      ) => SelectQueryBuilder<any>
    ): this;
    andNotExists(
      subQuery: (
        queryBuilder: SelectQueryBuilder<Entity>
      ) => SelectQueryBuilder<any>
    ): this;
    orNotExists(
      subQuery: (
        queryBuilder: SelectQueryBuilder<Entity>
      ) => SelectQueryBuilder<any>
    ): this;
    pipe<R = Entity>(
      ...operators: OperatorFunction<Entity, R>[]
    ): SelectQueryBuilder<R>;
  }
}

SelectQueryBuilder.prototype.andExists = function(subQuery) {
  return this.andWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.orExists = function(subQuery) {
  return this.orWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.andNotExists = function(subQuery) {
  return this.andWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `NOT EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.orNotExists = function(subQuery) {
  return this.orWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `NOT EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.pipe = function(...operators) {
  if (!operators.length) {
    return this;
  }
  return operators.reduce((acc, operator) => {
    return operator(this);
  }, this);
};
