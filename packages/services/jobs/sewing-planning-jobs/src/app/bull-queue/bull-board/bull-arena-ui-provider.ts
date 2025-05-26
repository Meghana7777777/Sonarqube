import { Injectable } from '@nestjs/common';
import { redisJobConfigs } from '../../../config/redis/redis-config';
import { SPS_BULLJSJOBNAMES } from '@xpparel/shared-models';

@Injectable()
export class BullArenaUIProvider {
  constructor() {

  }

  createArenaQueues() {
    const BULLJSQUEUENAMES = [SPS_BULLJSJOBNAMES.AUDIO];
    return Object.keys(BULLJSQUEUENAMES).map(key => {
      return {
        type: 'bull',
        
        // Name of the bull queue, this name must match up exactly with what you've defined in bull.
        name: BULLJSQUEUENAMES[key],

        // Hostname or queue prefix, you can put whatever you want.
        hostId: 'SEWING-PLANNING',

        // Redis auth.
        redis: {
          ...redisJobConfigs.redis
        },

      }
    });

  }



}