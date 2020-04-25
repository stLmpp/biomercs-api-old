import { Connection, FindOperator, FindOperatorType } from 'typeorm';

interface ICreateFindOperatorOptions<T = { [key: string]: any }> {
  sql: (aliasPath: string, parameters: string[], extraOptions?: T) => string;
  useParameter?: boolean;
  multipleParameters?: boolean;
}

const createFindOperator = <U>(options: ICreateFindOperatorOptions) => <T>(
  value: FindOperator<T> | T,
  extraOptions?: U
): FindOperator<T> => {
  const toSql = (
    connection: Connection,
    aliasPath: string,
    parameters: string[]
  ): string => options.sql(aliasPath, parameters, extraOptions);
  const operator = new FindOperator(
    'custom' as FindOperatorType,
    value,
    options.useParameter,
    options.multipleParameters
  );
  operator.toSql = toSql;
  return operator;
};

export const LikeLowercase = createFindOperator({
  sql: (aliasPath, parameters) =>
    `lower(${aliasPath}) like lower(${parameters[0]})`,
});
export const LikeUppercase = createFindOperator({
  sql: (aliasPath, parameters) =>
    `upper(${aliasPath}) like upper(${parameters[0]})`,
});
