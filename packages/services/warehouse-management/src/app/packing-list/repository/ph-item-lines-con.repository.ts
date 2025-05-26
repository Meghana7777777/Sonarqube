import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhItemLinesEntity } from "../entities/ph-item-lines.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { PhBatchLotRollRequest, PhLinesGrnStatusEnum } from "@xpparel/shared-models";
import { GrnRollInfoQryResp } from "./query-response/grn-roll-info.qry.resp";
import { BasicRollInfoQryResp } from "./query-response/roll-basic-info.qry.resp";
import { SupplierAndPLQryResp } from "./query-response/supplier-pl-info.qry.resp";
import { PhItemLinesActualEntity } from "../entities/ph-item-lines-actual.entity";
import { PhItemsEntity } from "../entities/ph-items.entity";
import { PhLinesEntity } from "../entities/ph-lines.entity";
import { PackingListEntity } from "../entities/packing-list.entity";
import { PhItemLinesConEntity } from "../entities/ph-item-lines-con.entity";

@Injectable()
export class PhItemLinesConRepo extends Repository<PhItemLinesConEntity>{
    constructor(dataSource: DataSource) {
        super(PhItemLinesConEntity, dataSource.createEntityManager());
    }

}

