import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PKMSProductSubLineFeaturesEntity } from "../../pkms-po-entities/pkms-product-sub-line-features-entity";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSProductSubLineFeaturesInterface } from "../interfaces/pkms-po-sub-line-feature.repo.interface";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PKMSProductSubLineFeaturesRepository extends BaseAbstractRepository<PKMSProductSubLineFeaturesEntity> implements PKMSProductSubLineFeaturesInterface {
    constructor(
        @InjectRepository(PKMSProductSubLineFeaturesEntity)
        private readonly pkFgEntity: Repository<PKMSProductSubLineFeaturesEntity>,
    ) {
        super(pkFgEntity);
    }

}