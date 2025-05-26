import { Injectable } from '@nestjs/common';
import { redisJobConfigs } from '../../../config/redis/redis-config';
import { CPS_BULLJSJOBNAMES, BULLJSQUEUENAMESTOMODULEMAP } from '@xpparel/shared-models';

@Injectable()
export class BullArenaUIProvider {
  constructor() {

  }

  createArenaQueues() {
    return Object.keys(CPS_BULLJSJOBNAMES).map(key => {
      return {
        type: 'bull',
        
        // Name of the bull queue, this name must match up exactly with what you've defined in bull.
        name: CPS_BULLJSJOBNAMES[key],

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