import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
  } from '@nestjs/typeorm';
  import { DataSourceOptions } from 'typeorm';
  import { SnakeNamingStrategy } from '../strategies';
  import 'dotenv/config';
  import { ConfigService } from '@nestjs/config';
  import configuration from '../../config/configuration';
  
  const databaseConfig = configuration().database;
  export const typeOrmConfig: DataSourceOptions = {
    type: databaseConfig.type,
    host: '165.22.209.220',
    port: 3306,
    username: 'xpparel_Prod',
    password: 'Xpp@rel_Pr0d',
    database: 'xpparel-kms',
    timezone: 'UTC',
    migrations: ['dist/database/migrations/*.js*{.ts,.js}'],
    extra: {
      connectionLimit: databaseConfig.poolLimit,
      charset: databaseConfig.charset
    },
    poolSize: databaseConfig.poolLimit
  };
  
  export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
      return {
        ...typeOrmConfig,
        synchronize: false, // never use TRUE in production!
        logging: true,
        subscribers: [],
        //namingStrategy: new SnakeNamingStrategy(),
        //logger: new QueryLogger(new PinoLogger({ pinoHttp: { level: configService.get().logLevel } })),
        autoLoadEntities: true
      }
    },
  };
  
  