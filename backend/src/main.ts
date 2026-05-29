import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  const config = new DocumentBuilder()  // помогает описать базовую информацию об API: название, описание, версию и т.д.
    .setTitle('Auto Parts Store')
    .setDescription('Документация API для магазина')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalResponse({ status: 500, description: 'Internal server error' })
    .addGlobalResponse({ status: 400, description: 'Bad request' })
    .build();  // собирает итоговый объект конфигурации

  // Для создания полного документа (со всеми определенными Http-маршрутами) мы используем метод createDocument()
  const document = SwaggerModule.createDocument(app, config);  
  SwaggerModule.setup('api/docs', app, document);  // тут мы поднимаем Swagger UI по пути api/docs
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
