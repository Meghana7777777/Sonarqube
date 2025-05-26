import { Injectable } from '@nestjs/common';
import { redisJobConfigs } from '../../../config/redis/redis-config';
import { WMSBullJobNames } from '@xpparel/shared-models';

@Injectable()
export class BullArenaUIProvider {
  constructor() {

  }

  createArenaQueues() {
    const BULLJSQUEUENAMES = [WMSBullJobNames.AUDIO, WMSBullJobNames.UPDATE_SHOW_INVENTORY];
    return Object.keys(BULLJSQUEUENAMES).map(key => {
      return {
        type: 'bull',
        
        // Name of the bull queue, this name must match up exactly with what you've defined in bull.
        name: BULLJSQUEUENAMES[key],

        // Hostname or queue prefix, you can put whatever you want.
        hostId: 'WAREHOUSE',

        // Redis auth.
        redis: {
          ...redisJobConfigs.redis
        },

      }
    });

  }



}