import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnvVar, isProd } from '../util/env';
import { YkNamingStategy } from './naming-strategy';

export const DB_TYPEORM_CONFIG: TypeOrmModuleOptions = {
  type: 'mysql',
  host: getEnvVar('DB_HOST'),
  port: getEnvVar('DB_PORT'),
  username: getEnvVar('DB_USERNAME'),
  password: getEnvVar('DB_PASSWORD'),
  database: getEnvVar('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: getEnvVar('DB_SYNC'),
  logging: !isProd ? 'all' : false,
  bigNumberStrings: false,
  namingStrategy: new YkNamingStategy(),
  charset: getEnvVar('DB_CHARSET'),
  extra: {
    collate: getEnvVar('DB_COLLATE'),
  },
  dropSchema: false,
};
