
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TranLogEntity } from "../tran-log.entity";
import { OpOrderTypeEnum } from "@xpparel/shared-models";
import { ProcOrderEntity } from "../proc-order.entity";
import { ProcOrderOslEntity } from "../proc-order-osl.entity";

@Injectable()
export class ProcOrderOslRepository extends Repository<ProcOrderOslEntity> {
    constructor(private dataSource: DataSource) {
        super(ProcOrderOslEntity, dataSource.createEntityManager());
    }

}



