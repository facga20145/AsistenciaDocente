import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Asistencia Docente API')
    .setDescription('API para el control en tiempo real del inicio y fin de clases de docentes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/api-json', (req, res) => {
    res.json(document);
  });

  app.use('/docs', apiReference({
    spec: {
      url: '/api-json',
    },
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
