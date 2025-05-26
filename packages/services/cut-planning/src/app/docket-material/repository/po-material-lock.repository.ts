import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoMaterialLockEntity } from "../entity/po-material-lock.entity";

@Injectable()
export class PoMaterialLockRepository extends Repository<PoMaterialLockEntity> {
    constructor(private dataSource: DataSource) {
        super(PoMaterialLockEntity, dataSource.createEntityManager());
    }


}

