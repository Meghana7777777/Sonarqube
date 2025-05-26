import { Module } from "@nestjs/common/decorators/modules";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FgMLocationEntity } from "./entities/fgm-location.entity";
import { FgLocationsController } from "./fg-location.controller";
import { FgLocationsService } from "./fg-location.services";
import { FgLocationsCreateAdapter } from "./dto/fg-locations-create.adapter";
import { FgRacksAdapter } from "../racks/dto/racks-create.adpter";

import { FgMLocationsRepo } from "./repo/fg-locations.repository";


import { forwardRef } from "@nestjs/common";
import { FgRackModule } from "../racks/fg-rack-module";
import { FgRacksService } from "../racks/fg-racks.service";

import { LocationAllocationModule } from "../../location-allocation/location-allocation.module";
import { FgRacksRepository } from "../racks/repository/fg-racks-repository";


@Module({
    imports: [
        TypeOrmModule.forFeature([FgMLocationEntity]),
        forwardRef(() => FgRackModule),
        forwardRef(() => LocationAllocationModule)
    ],
    controllers: [FgLocationsController],
    providers: [FgLocationsService, FgRacksService, FgMLocationsRepo, FgRacksRepository, FgLocationsCreateAdapter, FgRacksAdapter],
    exports: [FgLocationsService]
})

export class FgLocationModule { }