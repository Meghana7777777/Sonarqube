import { ConfigDataType } from './config.interface';

export const DEFAULT_CONFIG: ConfigDataType = {
  env: 'development',
  port: 8008,
  logLevel: 'info',
  maxPayloadSize: '1000mb',
  responseTimeOut: 600,
  staticFilesFolder: 'files',
  database: {
    type: 'mysql',
    host: '143.198.233.137',
    port: 3306,
    username: 'dev_admin',
    password: 'dev@admin',
    dbName: 'xpparel_cps',
    poolLimit: 20,
    charset: 'utf8_general_ci'
  },
  rateLimiting: {
    ttl: 60,
    limit: 10,
    maxLoginAttempts: 3
  },
  appSepcific: {
    PANELS_GENERATION: false,
    ACTUAL_PRODUCT_BUNDLE_TRACK: true
  }
};
