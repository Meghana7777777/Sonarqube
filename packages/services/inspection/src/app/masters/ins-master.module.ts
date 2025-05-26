import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonsAdapter } from './dto/reasons-create.adapter';
import { IReasonEntity } from './entity/i-reason.entity';
import { ReasonsDataController } from './masters-services/reasons/ins-reasons.controller';
import { ReasonsDataService } from './masters-services/reasons/ins-reasons.service';
import { IReasonRepo } from './repositories/i-reason.repository';
import { InsConfigEntity } from './entity/ins-config.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([IReasonEntity,InsConfigEntity]),
  ],
  controllers: [ReasonsDataController],
  providers: [ReasonsDataService,IReasonRepo, ReasonsAdapter,],
  exports: [ReasonsDataService]
})

export class InsMasterDataModule {}
