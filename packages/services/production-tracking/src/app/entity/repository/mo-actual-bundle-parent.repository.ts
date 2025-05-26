
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { MoActualBundleParentEntity } from "../mo-actual-bundle-parent.entity";

@Injectable()
export class MoActualBundleParentRepository extends Repository<MoActualBundleParentEntity> {
    constructor(private dataSource: DataSource) {
        super(MoActualBundleParentEntity, dataSource.createEntityManager());
    }

}