import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { TrolleyBinMapHistoryEntity } from "../entities/trolley-bin-map-history.entity";

@Injectable()
export class TrolleyBinMapHistoryRepo extends Repository<TrolleyBinMapHistoryEntity>{

    constructor(dataSource: DataSource) {
        super(TrolleyBinMapHistoryEntity, dataSource.createEntityManager());
    }
}