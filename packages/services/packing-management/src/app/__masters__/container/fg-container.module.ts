import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FgMLocationEntity } from "../location/entities/fgm-location.entity";
import { FgMRackEntity } from "../racks/entity/fg-m-rack.entity";
import { FgContainerAdapter } from "./dto/fg-container-adapter";
import { FgMContainerEntity } from "./entities/fgm-container.entity";
import { FgContainerDataController } from "./fg-container-data.controller";
import { FgContainerDataService } from "./fg-container-data-service";
import { FgMContainerRepo } from "./repositories/fgm-container-Repo";
import { SequenceHandlingModule } from "../../__common__/sequence-handling/sequence-handling.module";
import { FGMWareHouseEntity } from "../warehouse-masters/entities/fg-m-warehouse.entity";



@Module({
    imports: [
        TypeOrmModule.forFeature([FgMContainerEntity, FgMRackEntity, FgMLocationEntity,FGMWareHouseEntity]),
        SequenceHandlingModule
    ],
    controllers: [FgContainerDataController],
    providers: [FgContainerDataService, FgContainerAdapter, FgMContainerRepo],
    exports: [FgContainerDataService]
})
export class FGContainerModule { }








