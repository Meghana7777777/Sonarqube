import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoKnitJobRatioSubLineEntity } from "../entities/po-knit-job-ratio-sub-line-entity";
import { PoKnitJobRatioLineEntity } from "../entities/po-knit-job-ratio-line-entity";
import { PoKnitJobRatioEntity } from "../entities/po-knit-job-ratio-entity";
import { PoProductEntity } from "../entities/po-product-entity";

@Injectable()
export class PoKnitJobRatioSubLineRepository extends Repository<PoKnitJobRatioSubLineEntity> {
    constructor(private dataSource: DataSource) {
        super(PoKnitJobRatioSubLineEntity, dataSource.createEntityManager());
    }

   

}