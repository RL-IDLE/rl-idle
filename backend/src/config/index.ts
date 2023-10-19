import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfiguration from './app.configuration';
import databaseConfiguration from './database.configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

export default [
  ConfigModule.forRoot({
    load: [appConfiguration, databaseConfiguration],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: configService.getOrThrow<string>('db_kind') as 'postgres',
      host: configService.getOrThrow<string>('db_host'),
      port: configService.getOrThrow<number>('db_port'),
      username: configService.getOrThrow<string>('db_user'),
      password: configService.getOrThrow<string>('db_pass'),
      database: configService.getOrThrow<string>('db_name'),
      entities: [],
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
  }),
  ScheduleModule.forRoot(),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'public'),
    serveRoot: '/public',
  }),
];

const configService = new ConfigService();
export const BACKHEALTH_API_KEY =
  configService.get<string>('BACKHEALTH_API_KEY');
export const ENVIRONMENT = configService.getOrThrow<string>('ENV');
