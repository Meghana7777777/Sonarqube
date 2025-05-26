import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PalletRollMapEntity } from "../entities/pallet-roll-map.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { PalletRollMapHistoryEntity } from "../entities/pallet-roll-map-history.entity";

@Injectable()
export class PalletRollMapHistoryRepo extends Repository<PalletRollMapHistoryEntity>{
    constructor(dataSource: DataSource) {
        super(PalletRollMapHistoryEntity, dataSource.createEntityManager());
    }
}