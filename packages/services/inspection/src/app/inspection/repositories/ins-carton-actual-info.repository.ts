import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InsCartonActualInfoEntity } from "../../entities/ins_cartons_actual_info.entity";


@Injectable()
export class InsCartonActualInfoRepo extends Repository<InsCartonActualInfoEntity> {
    constructor(private dataSource: DataSource) {
        super(InsCartonActualInfoEntity, dataSource.createEntityManager());
    }

   
}