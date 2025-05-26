import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MasterController } from "./master-controller";
import { MasterService } from "./master-service";

import { GlobalConfigEntity } from "./entity/global-config-entity";
import { GlobalConfigMasterRepository } from "./repo/global-config-master-repo";
import { ConfigMasterRepository } from "./repo/config-master-repo";
import { ConfigMasterEntity } from "./entity/config-master-entity";
import { ConfigMasterAttributesMappingRepository } from "./repo/config-master-attributes-repo";
import { ConfigMasterAttributesMappingEntity } from "./entity/config-master-attributes-entity";
import { AttributesMasterEntity } from "./entity/attributes-master-entity";
import { AttributesMasterRepository } from "./repo/attributes-repo";
import { AssetLocationsService } from "@xpparel/shared-services";
import { GlobalConfigHelperController } from "./global-config-helper-controller";
import { GlobalConfigHelperService } from "./global-config-helper-service";
import { DepartmentEntity } from "./entity/department-master.entity";
import { DepartmentMasterRepo } from "./repo/department-master.repo";
import { LocationEntity } from "./entity/location-entity";
import { SectionEntity } from "./entity/section-entity";
import { LocationRepository } from "./repo/location-repo";
import { SectionRepository } from "./repo/section-repo";

@Module({
    imports: [TypeOrmModule.forFeature([
        GlobalConfigEntity, ConfigMasterEntity, ConfigMasterAttributesMappingEntity, AttributesMasterEntity,DepartmentEntity,LocationEntity, SectionEntity
    ])],
    controllers: [MasterController, GlobalConfigHelperController],
    providers: [MasterService, GlobalConfigMasterRepository, ConfigMasterRepository, ConfigMasterAttributesMappingRepository, AttributesMasterRepository, AssetLocationsService, GlobalConfigHelperService, DepartmentMasterRepo,LocationRepository,SectionRepository],

})
export class MasterModule { }