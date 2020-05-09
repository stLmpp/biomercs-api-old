import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { environment } from '../shared/env/env';
import { YkNamingStategy } from './naming-strategy';

export const DB_TYPEORM_CONFIG: TypeOrmModuleOptions = {
  type: 'mysql',
  ...environment.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: !environment.production ? 'all' : false,
  bigNumberStrings: false,
  namingStrategy: new YkNamingStategy(),
  extra: {
    collate: environment.get('DB_COLLATE'),
  },
  dropSchema: false,
};
