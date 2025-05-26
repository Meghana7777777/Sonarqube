import { BullModule } from "@nestjs/bull";
import { PackingBullJobNames } from "@xpparel/shared-models";
import redisJobConfigs from "../../config/redis/redis-config";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: PackingBullJobNames.PACK_FG_POPULATION,
        useFactory: () => ({
            name: PackingBullJobNames.PACK_FG_POPULATION,
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
        name: PackingBullJobNames.PACK_JOB_GEN,
        useFactory: () => ({
            name: PackingBullJobNames.PACK_JOB_GEN,
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
        name: PackingBullJobNames.PACK_OSL_INFO_GEN,
        useFactory: () => ({
            name: PackingBullJobNames.PACK_OSL_INFO_GEN,
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
        name: PackingBullJobNames.PACK_OSL_INFO_DEL,
        useFactory: () => ({
            name: PackingBullJobNames.PACK_OSL_INFO_DEL,
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