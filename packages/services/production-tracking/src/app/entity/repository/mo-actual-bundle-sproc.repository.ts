
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { MoActualBundleSProcEntity } from "../mo-actual-bundle-sproc.entity";

@Injectable()
export class MoActualBundleSProcRepository extends Repository<MoActualBundleSProcEntity> {
    constructor(private dataSource: DataSource) {
        super(MoActualBundleSProcEntity, dataSource.createEntityManager());
    }

}