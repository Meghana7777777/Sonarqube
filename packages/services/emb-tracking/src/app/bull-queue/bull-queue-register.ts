import { BullModule } from "@nestjs/bull";
import { redisJobConfigs } from '../../config/redis/redis-config';
import { CPS_BULLJSJOBNAMES, ETS_BULLJSJOBNAMES } from "@xpparel/shared-models";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: 'audio',
        useFactory: () => ({
            name: 'audio',
            redis: {
                ...redisJobConfigs.redis
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings
            }
        }),
    }),
    BullModule.registerQueueAsync({
        name: ETS_BULLJSJOBNAMES.ETS_EMB_REQ_GEN,
        useFactory: () => ({
            name: ETS_BULLJSJOBNAMES.ETS_EMB_REQ_GEN,
            redis: {
                ...redisJobConfigs.redis
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings
            }
        }),
    }),
    BullModule.registerQueueAsync({
        name: ETS_BULLJSJOBNAMES.ETS_EMB_LINE_DEL,
        useFactory: () => ({
            name: ETS_BULLJSJOBNAMES.ETS_EMB_LINE_DEL,
            redis: {
                ...redisJobConfigs.redis
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings
            }
        }),
    }),
    BullModule.registerQueueAsync({
        name: ETS_BULLJSJOBNAMES.ETS_EMB_HEADER_DEL,
        useFactory: () => ({
            name: ETS_BULLJSJOBNAMES.ETS_EMB_HEADER_DEL,
            redis: {
                ...redisJobConfigs.redis
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings
            }
        }),
    }),
    BullModule.registerQueueAsync({
        name: ETS_BULLJSJOBNAMES.ETS_EMB_OP_QTY_UPD,
        useFactory: () => ({
            name: ETS_BULLJSJOBNAMES.ETS_EMB_OP_QTY_UPD,
            redis: {
                ...redisJobConfigs.redis
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings
            }
        }),
    }),
]