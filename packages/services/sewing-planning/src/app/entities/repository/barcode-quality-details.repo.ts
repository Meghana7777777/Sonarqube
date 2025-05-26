import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BarcodeQualityResultsEntity } from "../barcode-quality-results.entity";

@Injectable()
export class BarcodeQualityResultsRepo extends Repository<BarcodeQualityResultsEntity> {
    constructor(dataSource: DataSource) {
        super(BarcodeQualityResultsEntity, dataSource.createEntityManager());
    }

    
}