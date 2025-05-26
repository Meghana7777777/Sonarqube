import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisHelperService } from "../../config/redis/redis-helper.service";
import { OmsBullQueueController } from "./oms-bull-jobs.controller";
import { OmsBullQueueService } from "./oms-bull-jobs.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    controllers: [OmsBullQueueController],
    providers: [OmsBullQueueService,RedisHelperService],
    exports: []
})

export class OmsBullJobsModule {}

