import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_TYPEORM_CONFIG } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { SiteModule } from './site/site.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { environment } from './shared/env/env';
import { APP_FILTER } from '@nestjs/core';
import { HandleErrorFilter } from './shared/error/handle-error.filter';
import { LikeModule } from './like/like.module';
import { ValidationModule } from './validation/validation.module';
import { GameModule } from './game/game.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { ScoreModule } from './score/score.module';
import { ReportModule } from './report/report.module';
import { CHECK_PARAMS_DEFAULT } from './shared/pipes/check-params.pipe';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_TYPEORM_CONFIG),
    MailerModule.forRoot({
      transport: {
        service: environment.get('MAIL_SERVICE'),
        auth: {
          user: environment.get('MAIL'),
          pass: environment.get('MAIL_PASS'),
        },
      },
      defaults: {
        from: `"Biomercs" <${environment.get('MAIL')}>`,
      },
      template: {
        dir: join(__dirname, '..', '..', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MulterModule.register({ dest: environment.config('FILE_UPLOAD_PATH') }),
    AuthModule,
    SiteModule,
    LikeModule,
    GameModule,
    ValidationModule,
    FileUploadModule,
    ScoreModule,
    ReportModule,
    RegionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HandleErrorFilter,
    },
    {
      provide: CHECK_PARAMS_DEFAULT,
      useValue: true,
    },
  ],
})
export class AppModule {}
