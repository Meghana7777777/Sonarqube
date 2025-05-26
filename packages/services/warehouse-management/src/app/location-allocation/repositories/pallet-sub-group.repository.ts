import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PalletSubGroupEntity } from "../entities/pallet-group/pallet-sub-group.entity";

@Injectable()
export class PalletSubGroupRepo extends Repository<PalletSubGroupEntity>{
    constructor(dataSource: DataSource) {
        super(PalletSubGroupEntity, dataSource.createEntityManager());
    }
}