import {DataSource,Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SizesEntity } from "../entity/sizes.entity";

@Injectable()
export class SizesRepository extends Repository<SizesEntity> {
    constructor(private dataSource: DataSource) {
        super(SizesEntity, dataSource.createEntityManager());
    }

}

