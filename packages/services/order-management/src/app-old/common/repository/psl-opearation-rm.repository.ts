import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PslOperationRmEntity } from "../entity/psl-operation-rm.entity";

@Injectable()
export class PslOpRawMaterialRepository extends Repository<PslOperationRmEntity> {
  constructor(private dataSource: DataSource) {
    super(PslOperationRmEntity, dataSource.createEntityManager());
  }
   
}
