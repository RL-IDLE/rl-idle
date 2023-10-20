import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import { logger } from './lib/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (env.ENV !== 'development') {
    logger.info('Enabling CORS');
    app.enableCors({
      origin: /huort\.com$/,
    });
  } else {
    app.enableCors();
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
