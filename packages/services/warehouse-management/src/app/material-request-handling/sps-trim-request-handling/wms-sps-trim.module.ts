import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterDataModule } from "../../master-data/master-data.module";
import { WhMatRequestHeaderEntity } from "../entities/wh-mat-request-header.entity";
import { WhMatRequestLineItemEntity } from "../entities/wh-mat-request-line-item.entity";
import { WhMatRequestLineEntity } from "../entities/wh-mat-request-line.entity";
import { WmsSpsTrimRequestController } from "./wms-sps-trim.controller";
import { WmsSpsTrimRequestService } from "./wms-sps-trim.service";
import { KnittingJobMaterialAllocationService, ProcessingJobsService } from "@xpparel/shared-services";
import { MaterialIssuanceService } from "../../location-allocation/material-issuance.service";
import { PhItemIssuanceRepo } from "../../packing-list/repository/ph-item-issuance.repository";
import { FabricRequestCreationHelperService } from "../fabric-request-creation/fabric-request-creation-helper.service";
import { WhMatIssLogHeaderRepo } from "../repositories/wh-mat-issuance-header.repository";
import { WhRequestHeaderRepo } from "../repositories/wh-request-header.repository";
import { WhRequestLineItemRepo } from "../repositories/wh-request-line-item.repository";
import { WhRequestLineRepo } from "../repositories/wh-request-line.repository";
import { LocationAllocationModule } from "../../location-allocation/location-allocation.module";
import { PackingListModule } from "../../packing-list/packing-list.module";
import { TrayTrolleyModule } from "../../tray-trolly/tray-trolley.module";
import { FabricRequestCreationModule } from "../fabric-request-creation/fabric-request-creation.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WhMatRequestHeaderEntity, WhMatRequestLineEntity, WhMatRequestLineItemEntity
    ]),
    MasterDataModule,
    FabricRequestCreationModule,
    LocationAllocationModule,
    TrayTrolleyModule,
    forwardRef(() => PackingListModule)
  ],
  controllers: [WmsSpsTrimRequestController],
  providers: [WmsSpsTrimRequestService,
    WhRequestHeaderRepo, WhRequestLineRepo, WhRequestLineItemRepo, WhMatIssLogHeaderRepo, PhItemIssuanceRepo,
    KnittingJobMaterialAllocationService,
    FabricRequestCreationHelperService,
    MaterialIssuanceService,
    ProcessingJobsService
  ],
  exports: [
    WmsSpsTrimRequestService
  ]
})
export class WmsSpsTrimRequestModule { }