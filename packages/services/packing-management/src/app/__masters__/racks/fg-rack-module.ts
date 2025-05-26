import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FgRacksAdapter } from "./dto/racks-create.adpter";
import { FgMRackEntity } from "./entity/fg-m-rack.entity";
import { FgRacksController } from "./fg-racks.controller";
import { FgRacksService } from "./fg-racks.service";
import { FgRacksRepository } from "./repository/fg-racks-repository";
import { FgLocationModule } from "../location/fg-location-module";




@Module({
    imports: [
        TypeOrmModule.forFeature([FgMRackEntity]),
        forwardRef(() => FgLocationModule)
    ],
    controllers: [FgRacksController],
    providers: [FgRacksService, FgRacksRepository, FgRacksAdapter],
    exports: [FgRacksService]
})

export class FgRackModule { }