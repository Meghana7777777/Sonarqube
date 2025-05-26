import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { PalletGroupEntity } from "../entities/pallet-group/pallet-group.entity";

@Injectable()
export class PalletGroupRepo extends Repository<PalletGroupEntity>{
    constructor(dataSource: DataSource) {
        super(PalletGroupEntity, dataSource.createEntityManager());
    }
}