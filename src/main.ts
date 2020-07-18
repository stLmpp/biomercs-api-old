import './polyfills/polyfills';
import './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './shared/env/env';
import { ValidationPipe } from '@nestjs/common';

import * as helmet from 'helmet';
import * as compression from 'compression';
import * as expressRateLimit from 'express-rate-limit';
import * as morgan from 'morgan';
import { useContainer } from 'class-validator';
import { ValidationModule } from './validation/validation.module';
import { setupSwagger } from './swagger/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  useContainer(app.select(ValidationModule), { fallbackOnErrors: true });

  if (!environment.production) {
    app.enableCors();
    setupSwagger(app);
  } else {
    app.use(helmet());
    app.use(
      expressRateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
      })
    );
    app.use(compression());
    app.use(morgan('combined'));
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
