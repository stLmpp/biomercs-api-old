import './polyfills/polyfills';
import './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './shared/env/env';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';

import * as helmet from 'helmet';
import * as compression from 'compression';
import * as expressRateLimit from 'express-rate-limit';
import * as morgan from 'morgan';
import { useContainer } from 'class-validator';
import { ValidationModule } from './validation/validation.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(
    expressRateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })
  );
  app.use(compression());
  app.use(morgan('combined'));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  useContainer(app.select(ValidationModule), { fallbackOnErrors: true });

  if (!environment.production) {
    app.enableCors();
    const options = new DocumentBuilder()
      .setTitle('Biomercs api')
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, options, {});
    SwaggerModule.setup('help', app, document);
  }

  await app.listen(environment.port, environment.host);
}

bootstrap()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Biomercs API initialized!');
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log(err);
  });
