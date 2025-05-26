import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { TrayRollMapHistoryEntity } from "../entities/tray-roll-map-history.entity";

@Injectable()
export class TrayRollMapHistoryRepo extends Repository<TrayRollMapHistoryEntity>{

    constructor(dataSource: DataSource) {
        super(TrayRollMapHistoryEntity, dataSource.createEntityManager());
    }
}