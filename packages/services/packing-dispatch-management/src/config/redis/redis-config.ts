export const redisJobConfigs = {
    redis: {
        host: process.env[`REDIS_HOST`] || 'localhost',
        port: parseInt(process.env[`REDIS_PORT`])|| 6378,
        password: process.env[`REDIS_PASSWORD`] || 'password',
        // tls: {
        //     rejectUnauthorized: false,
        // }
    },
    bullJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
        attempts: 1
    },
    bullAdvancedSettings: {
        lockDuration: 300000,
        stalledInterval: 300000,
        maxStalledCount: 1,
        guardInterval: 5000,
        retryProcessDelay: 5000,
        drainDelay: 5, // Wait time for brpoplpush in empty queue
    }
};
export default redisJobConfigs;