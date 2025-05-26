import { BullModule } from "@nestjs/bull";
import { redisJobConfigs } from '../../config/redis/redis-config';
import { WMSBullJobNames } from "@xpparel/shared-models";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: WMSBullJobNames.AUDIO,
        useFactory: () => ({
            name: WMSBullJobNames.AUDIO,
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
        name: WMSBullJobNames.UPDATE_SHOW_INVENTORY,
        useFactory: () => ({
            name: WMSBullJobNames.UPDATE_SHOW_INVENTORY,
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
        name: WMSBullJobNames.UPDATE_SHADE,
        useFactory: () => ({
            name: WMSBullJobNames.UPDATE_SHADE,
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
    })
]