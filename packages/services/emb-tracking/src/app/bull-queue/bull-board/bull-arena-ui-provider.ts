import { Injectable } from '@nestjs/common';
import { redisJobConfigs } from '../../../config/redis/redis-config';
import {  BULLJSQUEUENAMESTOMODULEMAP, ETS_BULLJSJOBNAMES } from '@xpparel/shared-models';

@Injectable()
export class BullArenaUIProvider {
  constructor() {

  }

  createArenaQueues() {
    return Object.keys(ETS_BULLJSJOBNAMES).map(key => {
      return {
        type: 'bull',
        
        // Name of the bull queue, this name must match up exactly with what you've defined in bull.
        name: ETS_BULLJSJOBNAMES[key],

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