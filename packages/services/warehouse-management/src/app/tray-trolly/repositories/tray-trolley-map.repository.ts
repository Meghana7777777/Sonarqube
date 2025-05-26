import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { TrayTrolleyMapHistoryEntity } from "../entities/tray-trolley-map-history.entity";
import { TrayTrolleyMapEntity } from "../entities/tray-trolley-map.entity";

@Injectable()
export class TrayTrolleyMapRepo extends Repository<TrayTrolleyMapEntity>{

    constructor(dataSource: DataSource) {
        super(TrayTrolleyMapEntity, dataSource.createEntityManager());
    }
}