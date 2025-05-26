import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisHelperService } from "../../config/redis/redis-helper.service";
import { PtsBullQueueController } from "./pts-bull-jobs.controller";
import { PtsBullQueueService } from "./pts-bull-jobs.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    controllers: [PtsBullQueueController],
    providers: [PtsBullQueueService,RedisHelperService],
    exports: []
})

export class PtsBullJobsModule {}

