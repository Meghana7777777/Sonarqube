import { BullModule } from "@nestjs/bull";
import { redisJobConfigs } from '../../config/redis/redis-config';
import { PtsBullJobNames } from "@xpparel/shared-models";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: PtsBullJobNames.AUDIO,
        useFactory: () => ({
            name: PtsBullJobNames.AUDIO,
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