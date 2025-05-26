import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PalletGroupItemsEntity } from "../entities/pallet-group/pallet-group-items.entity";

@Injectable()
export class PalletGroupItemsRepo extends Repository<PalletGroupItemsEntity>{
    constructor(dataSource: DataSource) {
        super(PalletGroupItemsEntity, dataSource.createEntityManager());
    }
}