import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { LTrolleyEntity } from "../entities/l-trolly.entity";


@Injectable()
export class LTrollyRepo extends Repository<LTrolleyEntity>{
    constructor(private dataSource: DataSource) {
        super(LTrolleyEntity, dataSource.createEntityManager());
    }
}