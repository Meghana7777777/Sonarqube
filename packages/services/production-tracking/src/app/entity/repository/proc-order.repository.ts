
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TranLogEntity } from "../tran-log.entity";
import { OpOrderTypeEnum } from "@xpparel/shared-models";
import { ProcOrderEntity } from "../proc-order.entity";

@Injectable()
export class ProcOrderRepository extends Repository<ProcOrderEntity> {
    constructor(private dataSource: DataSource) {
        super(ProcOrderEntity, dataSource.createEntityManager());
    }

}



