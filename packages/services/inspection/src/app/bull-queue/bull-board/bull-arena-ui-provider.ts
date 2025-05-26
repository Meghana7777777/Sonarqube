import { Injectable } from '@nestjs/common';
import { redisJobConfigs } from '../../../config/redis/redis-config';
import { InspectionBullJobNames } from '@xpparel/shared-models';

@Injectable()
export class BullArenaUIProvider {
  constructor() {

  }

  createArenaQueues() {
    const BULLJSQUEUENAMES = [InspectionBullJobNames.RM_INSPECTION_GEN,InspectionBullJobNames.FG_INSPECTION_GEN];
    return Object.keys(BULLJSQUEUENAMES).map(key => {
      return {
        type: 'bull',
        
        // Name of the bull queue, this name must match up exactly with what you've defined in bull.
        name: BULLJSQUEUENAMES[key],

        // Hostname or queue prefix, you can put whatever you want.
        hostId: 'NOT_ASSIGNED',

        // Redis auth.
        redis: {
          ...redisJobConfigs.redis
        },

      }
    });

  }



}