import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const ormConfig: (
  configService: ConfigService,
) => TypeOrmModuleOptions = (configService) => ({
  type: 'postgres',
  username: configService.get('DB_USER', 'postgres'),
  password: configService.get('DB_PASS', 'Tatva@123'),
  port: configService.get('DB_PORT', 5432),
  host: configService.get('DB_HOST', 'localhost'),
  database: configService.get('DB_INSTANCE', 'BookRentalSystem'),
  synchronize: false,
  schema: configService.get('DB_SCHEMA', 'public'),
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, '**/migrations/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  logging: true,
});

config();

const configService = new ConfigService();

//configuration for typeorm cli
export default new DataSource({
  type: 'postgres',
  username: configService.get('DB_USER', 'postgres'),
  password: configService.get('DB_PASS', 'Tatva@123'),
  port: configService.get('DB_PORT', 5432),
  host: configService.get('DB_HOST', 'localhost'),
  database: configService.get('DB_INSTANCE', 'BookRentalSystem'),
  synchronize: false,
  schema: configService.get('DB_SCHEMA', 'public'),
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, '**/migrations/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
});
