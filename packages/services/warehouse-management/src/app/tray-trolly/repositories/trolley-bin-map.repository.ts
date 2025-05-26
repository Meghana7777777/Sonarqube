import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { TrolleyBinMapEntity } from "../entities/trolley-bin-map.entity";

@Injectable()
export class TrolleyBinMapRepo extends Repository<TrolleyBinMapEntity>{

    constructor(dataSource: DataSource) {
        super(TrolleyBinMapEntity, dataSource.createEntityManager());
    }
}