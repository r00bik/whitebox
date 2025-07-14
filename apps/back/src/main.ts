import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: true,
    }),
  );

  // Настраиваем CORS так, чтобы при запросах с учётом учётных данных (cookies, авторизация)
  // заголовок Access-Control-Allow-Origin не был "*", а совпадал с источником запроса.
  app.enableCors({
    origin: [
      "http://localhost:5173", // RSBuild dev-сервер и preview
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Включаем глобальную валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix("v1");

  const config = new DocumentBuilder()
    .setTitle("Whitebox API")
    .setDescription("Whitebox service API documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Введите JWT токен",
        in: "header",
      },
      "JWT-auth", // Это ключ, который можно использовать в контроллерах
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("v1/docs", app, document);

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || "0.0.0.0";

  await app.listen(port, host);
  console.log(`Приложение запущено на http://${host}:${port}`);
}

bootstrap();
