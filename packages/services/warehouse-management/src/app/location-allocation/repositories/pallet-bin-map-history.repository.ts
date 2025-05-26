import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PalletBinMapEntity } from "../entities/pallet-bin-map.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { PalletBinMapHistoryEntity } from "../entities/pallet-bin-map-history.entity";

@Injectable()
export class PalletBinMapHistoryRepo extends Repository<PalletBinMapHistoryEntity>{

    constructor(dataSource: DataSource) {
        super(PalletBinMapHistoryEntity, dataSource.createEntityManager());
    }
}