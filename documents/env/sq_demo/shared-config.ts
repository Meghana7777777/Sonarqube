// require('dotenv').config();
export interface ConfigTypo {
    APP_UMS_SERVICE_URL: string,
    APP_WMS_SERVICE_URL: string,
    APP_OMS_SERVICE_URL: string,
    APP_OES_SERVICE_URL: string,
    APP_CPS_SERVICE_URL: string,
    APP_ETS_SERVICE_URL: string,
    APP_DMS_SERVICE_URL: string,
    APP_SPS_SERVICE_URL: string,
    APP_PTS_SERVICE_URL:string,
    APP_QMS_SERVICE_URL: string,
    APP_PKMS_SERVICE_URL: string,
    APP_PKDMS_SERVICE_URL: string,
    APP_INS_SERVICE_URL: string,
    APP_KMS_SERVICE_URL: string,
    APP_GATEX_SERVICE_URL: string,
    APP_IAM_SERVER_URL: string,
    APP_IAM_CLIENT_ID: string,
    APP_PDFE_SERVICE_URL: string,//packing data feed
    APP_WHATSAPP_NOTIFICATION_URL: string,
    APP_WHATSAPP_BROADCAST_URL: string,
    APP_REQ_RETRY_MAX_ATTEMPTS: number,
    APP_REQ_RETRY_STATUS_CODES: string,
    APP_REQ_RETRY_DELAY: number,
    APP_RETRY_CODES: string,
    APP_ASSET_SERVICE_URL: string,
    APP_ASSETS_SERVICE_URL: string,

}
export const configVariables: ConfigTypo = {
    APP_UMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_UMS_SERVICE_URL'] : process.env['APP_UMS_SERVICE_URL'] || 'https://xpparel-dev-ums.schemaxtech.in',
    APP_WMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WMS_SERVICE_URL'] : process.env['APP_WMS_SERVICE_URL'] || 'https://xpparel-dev-wms.schemaxtech.in',
    APP_OMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_OMS_SERVICE_URL'] : process.env['APP_OMS_SERVICE_URL'] || 'https://xpparel-dev-oms.schemaxtech.in',
    APP_OES_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_OES_SERVICE_URL'] : process.env['APP_OES_SERVICE_URL'] || 'https://xpparel-dev-oes.schemaxtech.in',
    APP_CPS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_CPS_SERVICE_URL'] : process.env['APP_CPS_SERVICE_URL'] || 'https://xpparel-dev-cps.schemaxtech.in',
    APP_INS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_INS_SERVICE_URL'] : process.env['APP_INS_SERVICE_URL'] || 'https://xpparel-dev-ins.schemaxtech.in',
    APP_GATEX_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_GATEX_SERVICE_URL'] : process.env['APP_GATEX_SERVICE_URL'] || 'https://gatex-dev-be.schemaxtech.in/api/',
    APP_ETS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_ETS_SERVICE_URL'] : process.env['APP_ETS_SERVICE_URL'] || 'https://xpparel-dev-ets.schemaxtech.in',
    APP_DMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_DMS_SERVICE_URL'] : process.env['APP_DMS_SERVICE_URL'] || 'https://xpparel-dev-dms.schemaxtech.in',
    APP_SPS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_SPS_SERVICE_URL'] : process.env['APP_SPS_SERVICE_URL'] || 'https://xpparel-dev-sps.schemaxtech.in',
    APP_PTS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_PTS_SERVICE_URL'] : process.env['APP_PTS_SERVICE_URL'] || 'https://xpparel-dev-pts.schemaxtech.in',
    APP_QMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_QMS_SERVICE_URL'] : process.env['APP_QMS_SERVICE_URL'] || 'https://xpparel-dev-qms.schemaxtech.in',
    APP_PKMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_PKMS_SERVICE_URL'] : process.env['APP_PKMS_SERVICE_URL'] || 'https://xpparel-dev-pms.schemaxtech.in',
    APP_KMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_KMS_SERVICE_URL'] : process.env['APP_KMS_SERVICE_URL'] || 'https://xpparel-dev-kms.schemaxtech.in',
    APP_PKDMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_PKDMS_SERVICE_URL'] : process.env['APP_PKDMS_SERVICE_URL'] || 'https://xpparel-dev-pkdms.schemaxtech.in',
    APP_ASSET_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_ASSET_SERVICE_URL'] : process.env['APP_ASSET_SERVICE_URL'] || 'https://demoassets-be.schemaxtech.in/erpx',   
    APP_ASSETS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_ASSETS_SERVICE_URL'] : process.env['APP_ASSETS_SERVICE_URL'] || 'https://demoassets-be.schemaxtech.in/api',  
    APP_IAM_SERVER_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_IAM_SERVER_URL'] : process.env['APP_IAM_SERVER_URL'] || 'http://143.198.233.137:8001',
    APP_IAM_CLIENT_ID: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_IAM_CLIENT_ID'] : process.env['APP_IAM_CLIENT_ID'] || 'http://143.198.233.137:8001',
    
    APP_PDFE_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_PDFE_SERVICE_URL'] : process.env['APP_PDFE_SERVICE_URL'] || 'https://centric-backend.shahiapps.in/api',
   
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