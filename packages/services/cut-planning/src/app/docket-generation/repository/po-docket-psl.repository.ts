import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoDocketPslEntity } from "../entity/po-docket-psl.entity";

@Injectable()
export class PoDocketPslRepository extends Repository<PoDocketPslEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketPslEntity, dataSource.createEntityManager());
    }
}