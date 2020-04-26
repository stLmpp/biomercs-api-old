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
import { LikeModule } from './like/like.module';
import { ValidationModule } from './validation/validation.module';
import { GameModule } from './game/game.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MulterModule } from '@nestjs/platform-express';

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
    MulterModule.register({ dest: getEnvVar('CONFIG_FILE_UPLOAD_PATH') }),
    AuthModule,
    SiteModule,
    LikeModule,
    GameModule,
    ValidationModule,
    FileUploadModule,
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
