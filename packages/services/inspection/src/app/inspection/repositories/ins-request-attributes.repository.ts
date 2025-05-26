import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { InsRequestAttributeEntity } from "../../entities/ins-request-attributes.entity";


@Injectable()
export class InsRequestAttributeRepo extends Repository<InsRequestAttributeEntity>{
    constructor(private dataSource: DataSource) {
        super(InsRequestAttributeEntity, dataSource.createEntityManager());
    }
}