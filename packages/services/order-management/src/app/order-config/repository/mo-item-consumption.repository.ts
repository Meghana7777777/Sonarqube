
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";

import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoItemConsumptionEntity } from "../entity/mo-item-consumption.entity";

@Injectable()
export class MoItemConsumptionRepository extends Repository<MoItemConsumptionEntity> {
    constructor(private dataSource: DataSource) {
        super(MoItemConsumptionEntity, dataSource.createEntityManager());
    }

}




