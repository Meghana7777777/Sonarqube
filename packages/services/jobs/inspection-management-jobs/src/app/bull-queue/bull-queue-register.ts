import { BullModule } from "@nestjs/bull";
import { redisJobConfigs } from '../../config/redis/redis-config';
import { InspectionBullJobNames } from "@xpparel/shared-models";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: InspectionBullJobNames.AUDIO,
        useFactory: () => ({
            name: InspectionBullJobNames.AUDIO,
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