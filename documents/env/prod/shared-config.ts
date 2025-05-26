// require('dotenv').config();
export interface ConfigTypo {
    APP_WMS_SERVICE_URL: string,
    APP_OMS_SERVICE_URL: string,
    APP_CPS_SERVICE_URL: string,
    APP_OES_SERVICE_URL: string,
    APP_UMS_SERVICE_URL: string,
    APP_ETS_SERVICE_URL: string,
    APP_DMS_SERVICE_URL: string,
    APP_IAM_SERVER_URL: string,
    APP_IAM_CLIENT_ID: string,
    APP_WHATSAPP_NOTIFICATION_URL: string,
    APP_WHATSAPP_BROADCAST_URL: string,
    APP_REQ_RETRY_MAX_ATTEMPTS: number,
    APP_REQ_RETRY_STATUS_CODES: string,
    APP_REQ_RETRY_DELAY: number,
    APP_RETRY_CODES: string;
    
}
export const configVariables: ConfigTypo = {
    APP_WMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WMS_SERVICE_URL'] : process.env['APP_WMS_SERVICE_URL'] || 'https://norlanka-wms.xpparel.com',
    APP_OMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_OMS_SERVICE_URL'] : process.env['APP_OMS_SERVICE_URL'] || 'https://norlanka-oms.xpparel.com',
    APP_OES_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_OES_SERVICE_URL'] : process.env['APP_OES_SERVICE_URL'] || 'https://norlanka-oes.xpparel.com',
    APP_CPS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_CPS_SERVICE_URL'] : process.env['APP_CPS_SERVICE_URL'] || 'https://norlanka-cps.xpparel.com',
    APP_UMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_UMS_SERVICE_URL'] : process.env['APP_UMS_SERVICE_URL'] || 'https://norlanka-ums.xpparel.com',
    APP_ETS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_ETS_SERVICE_URL'] : process.env['APP_ETS_SERVICE_URL'] || 'https://norlanka-emb.xpparel.com',
    APP_DMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_DMS_SERVICE_URL'] : process.env['APP_DMS_SERVICE_URL'] || 'https://norlanka-dms.xpparel.com',
    APP_IAM_SERVER_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_IAM_SERVER_URL'] : process.env['APP_IAM_SERVER_URL'] || 'https://iam-live-backend.xpparel.com',
    APP_IAM_CLIENT_ID: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_IAM_CLIENT_ID'] : process.env['APP_IAM_CLIENT_ID'] || 'https://iam-live-backend.xpparel.com',

    APP_WHATSAPP_NOTIFICATION_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WHATSAPP_NOTIFICATION_URL'] : process.env[`APP_WHATSAPP_NOTIFICATION_URL`],
    APP_WHATSAPP_BROADCAST_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WHATSAPP_BROADCAST_URL'] : process.env[`APP_WHATSAPP_BROADCAST_URL`],
    APP_REQ_RETRY_MAX_ATTEMPTS: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_REQ_RETRY_MAX_ATTEMPTS'] : process.env[`APP_REQ_RETRY_MAX_ATTEMPTS`] || 3,
    APP_REQ_RETRY_STATUS_CODES: (typeof window !== 'undefined') ? window[`_env_`]?.[`APP_REQ_RETRY_STATUS_CODES`] : process.env[`APP_REQ_RETRY_STATUS_CODES`] || '429,502',
    APP_REQ_RETRY_DELAY: (typeof window !== 'undefined') ? window[`_env_`]?.[`APP_REQ_RETRY_DELAY`] : process.env[`APP_REQ_RETRY_DELAY`] || 2000,
    APP_RETRY_CODES: (typeof window !== 'undefined') ? window[`_env_`]?.[`APP_RETRY_CODES`] : process.env[`APP_RETRY_CODES`] || 'ECONNABORTED',
}

export const whatsAppConfig = {
    PHONE_NUMBER_ID: '107287678965552',
    ACCESS_TOKEN: 'EAABtPfqQEJ0BAGLwjcos2nyZAaptYdOdPAoZBig7xgkZC82x10w72Fzw7xna1TAJ7YCG86ZAg9Vf083i2eSpSRBtlp4cZBZB1bvrZBEEhBNbe4GoMc6YHiHZAlivhzOkZAIv8c8bjHZAszqdZBIIGuGM9smQ6MZCZAtvbUUNKGqrlK6GWMSqFyfH3iLA0ZAPHlMfxTGYJJb41bPkbmwAZDZD',
    contacts: ['917036045967'],
    VERSION: 'v16.0',
}