import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisHelperService } from "../../config/redis/redis-helper.service";
import { SpsBullQueueController } from "./sps-bull-jobs.controller";
import { SpsBullQueueService } from "./sps-bull-jobs.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    controllers: [SpsBullQueueController],
    providers: [SpsBullQueueService,RedisHelperService],
    exports: []
})

export class SpsBullJobsModule {}

