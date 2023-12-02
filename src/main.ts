import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port || 3000;

  await app.listen(port);
}
bootstrap();
