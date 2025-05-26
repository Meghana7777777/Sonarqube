import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { TrayTrolleyMapHistoryEntity } from "../entities/tray-trolley-map-history.entity";

@Injectable()
export class TrayTrolleyMapHistoryRepo extends Repository<TrayTrolleyMapHistoryEntity>{

    constructor(dataSource: DataSource) {
        super(TrayTrolleyMapHistoryEntity, dataSource.createEntityManager());
    }
}