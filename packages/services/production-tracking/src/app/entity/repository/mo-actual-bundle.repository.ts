
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { MoActualBundleEntity } from "../mo-actual-bundle.entity";

@Injectable()
export class MoActualBundleRepository extends Repository<MoActualBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(MoActualBundleEntity, dataSource.createEntityManager());
    }

}