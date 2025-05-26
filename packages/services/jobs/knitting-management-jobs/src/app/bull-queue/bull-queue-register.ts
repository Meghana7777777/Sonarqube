import { BullModule } from "@nestjs/bull";
import { redisJobConfigs } from '../../config/redis/redis-config';
import { KmsBullJobNames } from "@xpparel/shared-models";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: KmsBullJobNames.AUDIO,
        useFactory: () => ({
            name: KmsBullJobNames.AUDIO,
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