import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../../package.json';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Biomercs api')
    .setVersion(version)
    .addBearerAuth({
      scheme: 'bearer',
      type: 'http',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options, {});
  SwaggerModule.setup('help', app, document, {
    customCss: `.scheme-container { position: sticky; top: 0; z-index: 1; margin-bottom: 0; }`,
  });
}
