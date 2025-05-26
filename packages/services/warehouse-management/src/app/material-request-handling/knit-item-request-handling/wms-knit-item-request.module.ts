import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KnittingJobMaterialAllocationService } from "@xpparel/shared-services";
import { MasterDataModule } from "../../master-data/master-data.module";
import { PackingListModule } from "../../packing-list/packing-list.module";
import { WhMatRequestHeaderEntity } from "../entities/wh-mat-request-header.entity";
import { WhMatRequestLineItemEntity } from "../entities/wh-mat-request-line-item.entity";
import { WhMatRequestLineEntity } from "../entities/wh-mat-request-line.entity";
import { FabricRequestCreationHelperService } from "../fabric-request-creation/fabric-request-creation-helper.service";
import { FabricRequestCreationModule } from "../fabric-request-creation/fabric-request-creation.module";
import { WhRequestHeaderRepo } from "../repositories/wh-request-header.repository";
import { WhRequestLineItemRepo } from "../repositories/wh-request-line-item.repository";
import { WhRequestLineRepo } from "../repositories/wh-request-line.repository";
import { WmsKnitItemRequestController } from "./wms-knit-item-request.controller";
import { WmsKnitItemRequestService } from "./wms-knit-item-request.service";
import { MaterialIssuanceService } from "../../location-allocation/material-issuance.service";
import { LocationAllocationModule } from "../../location-allocation/location-allocation.module";
import { TrayTrolleyModule } from "../../tray-trolly/tray-trolley.module";
import { WhMatIssLogHeaderRepo } from "../repositories/wh-mat-issuance-header.repository";
import { PhItemIssuanceRepo } from "../../packing-list/repository/ph-item-issuance.repository";
import { WhMatIssLogHeaderEntity } from "../entities/wh-mat-issuance-header.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WhMatRequestHeaderEntity, WhMatRequestLineEntity, WhMatRequestLineItemEntity,WhMatIssLogHeaderEntity
    ]),
    MasterDataModule,
    FabricRequestCreationModule,
    LocationAllocationModule,
    TrayTrolleyModule,
    forwardRef(() => PackingListModule)
  ],
  controllers: [WmsKnitItemRequestController],
  providers: [
    WhRequestHeaderRepo, WhRequestLineRepo, WhRequestLineItemRepo,WhMatIssLogHeaderRepo,PhItemIssuanceRepo,
    WmsKnitItemRequestService,
    KnittingJobMaterialAllocationService,
    FabricRequestCreationHelperService,
    MaterialIssuanceService

  ],
  exports: [
    WmsKnitItemRequestService
  ]
})
export class WmsKnitItemRequestModule { }