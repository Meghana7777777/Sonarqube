import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SewSequence } from "../entity/sew-seq.entity";
import { SewRawMaterial } from "../entity/sew-raw-material-entity";

@Injectable()
export class SewRawMaterialRepository extends Repository<SewRawMaterial> {
    constructor(private dataSource: DataSource) {
        super(SewRawMaterial, dataSource.createEntityManager());
    }

}

