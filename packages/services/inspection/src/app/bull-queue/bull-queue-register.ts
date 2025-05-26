import { BullModule } from "@nestjs/bull";
import { redisJobConfigs } from '../../config/redis/redis-config';
import { InspectionBullJobNames } from "@xpparel/shared-models";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: InspectionBullJobNames.FG_INSPECTION_GEN,
        useFactory: () => ({
            name: InspectionBullJobNames.FG_INSPECTION_GEN,
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
        name: InspectionBullJobNames.RM_INSPECTION_GEN,
        useFactory: () => ({
            name: InspectionBullJobNames.RM_INSPECTION_GEN,
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