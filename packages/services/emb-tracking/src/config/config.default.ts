import { ConfigDataType } from './config.interface';

export const DEFAULT_CONFIG: ConfigDataType = {
  env: 'development',
  port: 8009,
  logLevel: 'info',
  maxPayloadSize: '1000mb',
  responseTimeOut: 600,
  staticFilesFolder: 'files',
  database: {
    type: 'mysql',
    host: '143.244.137.137',
    port: 3306,
    username: 'dev_admin',
    password: 'dev@admin',
    dbName: 'xpparel_ets',
    poolLimit: 20,
    charset: 'utf8_general_ci'
  },
  rateLimiting: {
    ttl: 60,
    limit: 10,
    maxLoginAttempts: 3
  },
  appSepcific: {
    
  }
};
