import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoDocketLayShadeEntity } from "../entity/po-docket-lay-shade.entity";


@Injectable()
export class PoDocketLayShadeRepository extends Repository<PoDocketLayShadeEntity>{
    constructor(private datasource: DataSource) {
        super(PoDocketLayShadeEntity, datasource.createEntityManager());
    }
}