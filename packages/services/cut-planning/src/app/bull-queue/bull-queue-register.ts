import { BullModule } from "@nestjs/bull";
import { redisJobConfigs } from '../../config/redis/redis-config';
import { CPS_BULLJSJOBNAMES } from "@xpparel/shared-models";

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
        name: CPS_BULLJSJOBNAMES.CPS_DOC_BUN_GEN,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_DOC_BUN_GEN,
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
        name: CPS_BULLJSJOBNAMES.CPS_DOC_BUN_PANEL_GEN,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_DOC_BUN_PANEL_GEN,
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
        name: CPS_BULLJSJOBNAMES.CPS_PO_DOC_SER_GEN,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_PO_DOC_SER_GEN,
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
        name: CPS_BULLJSJOBNAMES.CPS_DOC_CON,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_DOC_CON,
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
        name: CPS_BULLJSJOBNAMES.CPS_UN_LOCK_DOC_MATERIAL,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_UN_LOCK_DOC_MATERIAL,
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
        name: CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REP,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REP,
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
        name: CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REV,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_LAY_CUT_REV,
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
        name: CPS_BULLJSJOBNAMES.CPS_DB_CUT_REP,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_DB_CUT_REP,
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
        name: CPS_BULLJSJOBNAMES.CPS_CUT_NUMBER_GEN,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_CUT_NUMBER_GEN,
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
        name: CPS_BULLJSJOBNAMES.CPS_UPDATE_CONSUMED_FAB_TO_EXT_SYS,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_UPDATE_CONSUMED_FAB_TO_EXT_SYS,
            redis: {
                ...redisJobConfigs.redis,
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions,
                backoff: 120000,
                attempts: 10,
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings,
            }
        }),
    }),
    BullModule.registerQueueAsync({
        name: CPS_BULLJSJOBNAMES.CPS_PEN_ROLLS_TO_ONFLOOR,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_PEN_ROLLS_TO_ONFLOOR,
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
        name: CPS_BULLJSJOBNAMES.CPS_UPDATE_ALLOC_FAB_TO_EXT_SYS,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_UPDATE_ALLOC_FAB_TO_EXT_SYS,
            redis: {
                ...redisJobConfigs.redis,
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions,
                backoff: 120000,
                attempts: 10,
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings,
            }
        }),
    }),
    BullModule.registerQueueAsync({
        name: CPS_BULLJSJOBNAMES.CPS_UPDATE_ISSUE_FAB_TO_EXT_SYS,
        useFactory: () => ({
            name: CPS_BULLJSJOBNAMES.CPS_UPDATE_ISSUE_FAB_TO_EXT_SYS,
            redis: {
                ...redisJobConfigs.redis,
            },
            defaultJobOptions: {
                ...redisJobConfigs.bullJobOptions,
                backoff: 120000,
                attempts: 10,
            },
            settings: {
                ...redisJobConfigs.bullAdvancedSettings,
            }
        }),
    }),

]