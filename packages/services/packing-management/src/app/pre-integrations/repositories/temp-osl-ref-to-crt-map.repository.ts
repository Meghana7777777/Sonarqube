
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TempOSLRefToCartonMapEntity } from "../entities/temp-osl-ref-to-crt-map.entity";

@Injectable()
export class TempOSLRefToCrtMapRepository extends Repository<TempOSLRefToCartonMapEntity> {
    constructor(private dataSource: DataSource) {
        super(TempOSLRefToCartonMapEntity, dataSource.createEntityManager());
    }
}

