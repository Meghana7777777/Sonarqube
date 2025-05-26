import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WmsBullQueueService } from "./wms-bull-jobs.service";
import { WmsBullQueueController } from "./wms-bull-jobs.controller";
import { RedisHelperService } from "../../config/redis/redis-helper.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    controllers: [WmsBullQueueController],
    providers: [WmsBullQueueService,RedisHelperService],
    exports: []
})

export class WmsBullJobsModule {}

