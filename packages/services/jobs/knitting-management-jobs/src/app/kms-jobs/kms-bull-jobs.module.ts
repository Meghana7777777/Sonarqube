import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisHelperService } from "../../config/redis/redis-helper.service";
import { KmsBullQueueController } from "./kms-bull-jobs.controller";
import { KmsBullQueueService } from "./kms-bull-jobs.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    controllers: [KmsBullQueueController],
    providers: [KmsBullQueueService,RedisHelperService],
    exports: []
})

export class KmsBullJobsModule {}

