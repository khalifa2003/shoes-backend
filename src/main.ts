import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/exceptions.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
