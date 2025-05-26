import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { InsGsmEntity } from "../../entities/ins-gsm.entity";
import { GsmDetailsQryResp } from "./query-response/ins-gsm-details.qry.resp";

@Injectable()
export class InsGsmRepo extends Repository<InsGsmEntity>{
    constructor(dataSource: DataSource) {
        super(InsGsmEntity, dataSource.createEntityManager());
    }

    /**
     * REPOSITORY METHOD TO GET THE ITEM LINES ACTUAL GSM VALUES
     * @param rollId 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    

   


}