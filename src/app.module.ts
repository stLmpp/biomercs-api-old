import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_TYPEORM_CONFIG } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { SiteModule } from './site/site.module';
import { HandlebarsAdapter, MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { getEnvVar } from './util/env';
import { APP_FILTER } from '@nestjs/core';
import { HandleErrorFilter } from './shared/error/handle-error.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_TYPEORM_CONFIG),
    MailerModule.forRoot({
      transport: {
        service: getEnvVar('MAIL_SERVICE'),
        auth: {
          user: getEnvVar('MAIL'),
          pass: getEnvVar('MAIL_PASS'),
        },
      },
      defaults: {
        from: `"Biomercs" <${getEnvVar('MAIL')}>`,
      },
      template: {
        dir: join(__dirname, '..', '..', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HandleErrorFilter,
    },
  ],
})
export class AppModule {}
