import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = ['https://meet.zayuh.me', 'https://api-meet.zayuh.me', 'http://localhost:4200', 'http://localhost:3000'];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error())
      }
    },
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Meet')
    .setDescription('The Meet API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('user')
    .addTag('room')
    .addTag('message')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(3000);
}
bootstrap();
