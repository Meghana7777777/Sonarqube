import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ShadeDetailsQryResp } from "./query-response/ins-shade-details.qry.resp";
import { InsShrinkageEntity } from "../../entities/ins-shrinkage.entity";

@Injectable()
export class InsShadeRepo extends Repository<InsShrinkageEntity>{
    constructor(dataSource: DataSource) {
        super(InsShrinkageEntity, dataSource.createEntityManager());
    }

    /**
     * REPOSITORY TO GET ITEM LINE ACTUAL INFORMATION FOR THE SHADE 
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */


}