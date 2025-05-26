
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { MoBundleEntity } from "../mo-bundle.entity";

@Injectable()
export class MoBundleRepository extends Repository<MoBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(MoBundleEntity, dataSource.createEntityManager());
    }

}