import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisHelperService } from "../../config/redis/redis-helper.service";
import { InsBullQueueController } from "./ins-bull-jobs.controller";
import { InsBullQueueService } from "./ins-bull-jobs.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    controllers: [InsBullQueueController],
    providers: [InsBullQueueService,RedisHelperService],
    exports: []
})

export class InsBullJobsModule {}

