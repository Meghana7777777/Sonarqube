import { DataSource,Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoAdbEntity } from "../entity/po-adb.entity";
import { PoAdbRollEntity } from "../entity/po-adb-roll.entity";

@Injectable()
export class PoAdbRollRepository extends Repository<PoAdbRollEntity> {
    constructor(private dataSource: DataSource) {
        super(PoAdbRollEntity, dataSource.createEntityManager());
    }


}

