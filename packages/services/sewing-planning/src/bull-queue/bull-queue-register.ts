import { BullModule } from "@nestjs/bull";
import { CPS_BULLJSJOBNAMES, SPS_BULLJSJOBNAMES } from "@xpparel/shared-models";
import redisJobConfigs from "../config/redis/redis-config";

export const BullQueueRegister = [
    BullModule.registerQueueAsync({
        name: SPS_BULLJSJOBNAMES.SEW_FG_POPULATION,
        useFactory: () => ({
            name: SPS_BULLJSJOBNAMES.SEW_FG_POPULATION,
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