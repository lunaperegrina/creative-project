import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  // Ativar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades extras do payload
      forbidNonWhitelisted: true, // Lança erro para propriedades desconhecidas
      transform: true, // Transforma payload para os tipos do DTO
    }),
  );

  // API DOCS WITH SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Creative API')
    .setDescription('description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);

  const url = await app.getUrl();
  if (url.split(':')[0] === 'http') {
    console.log(`Application is running on: ${url}`);
    console.log(`Swagger is running on: ${url}/docs`);
  }
}
bootstrap();
