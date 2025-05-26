import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisHelperService } from "../../config/redis/redis-helper.service";
import { InvsBullQueueController } from "./invs-bull-jobs.controller";
import { InvsBullQueueService } from "./invs-bull-jobs.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
    ],
    controllers: [InvsBullQueueController],
    providers: [InvsBullQueueService,RedisHelperService],
    exports: []
})

export class InvsBullJobsModule {}

