import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProcessTypeEnum } from "@xpparel/shared-models";
import { MoPoSubLineResp } from "./query-response/mo-po-sub-line.resp";
import { PoLineEntity } from "../po-line-entity";
import { PoSubLineEntity } from "../po-sub-line-entity";
import { ProductSubLineFeaturesEntity } from "../product-sub-line-features-entity";
import { InventoryBundleEntity } from "../inventory-bundle.entity";

@Injectable()
export class InventoryBundleRepository extends Repository<InventoryBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(InventoryBundleEntity, dataSource.createEntityManager());
    }

}