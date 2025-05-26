import { Injectable } from '@nestjs/common';
import { CPS_BULLJSJOBNAMES, BULLJSQUEUENAMESTOMODULEMAP, SPS_BULLJSJOBNAMES } from '@xpparel/shared-models';
import redisJobConfigs from '../../config/redis/redis-config';

@Injectable()
export class BullArenaUIProvider {
  constructor() {

  }

  createArenaQueues() {
    return Object.keys(SPS_BULLJSJOBNAMES).map(key => {
      return {
        type: 'bull',
        
        // Name of the bull queue, this name must match up exactly with what you've defined in bull.
        name: SPS_BULLJSJOBNAMES[key],

        // Hostname or queue prefix, you can put whatever you want.
        hostId: BULLJSQUEUENAMESTOMODULEMAP[key] ?? 'NOT_ASSIGNED',

        // Redis auth.
        redis: {
          ...redisJobConfigs.redis
        },

      }
    });

  }



}