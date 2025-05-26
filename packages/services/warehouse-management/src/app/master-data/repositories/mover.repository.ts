import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { MoverEntity } from "../entities/mover.entity";


@Injectable()
export class MoverRepo extends Repository<MoverEntity>{
    constructor(private dataSource: DataSource) {
        super(MoverEntity, dataSource.createEntityManager());
    }
}