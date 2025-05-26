import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PslOperationEntity } from "../entity/psl-operation.entity";

@Injectable()
export class PslOperationRepository extends Repository<PslOperationEntity> {
  constructor(private dataSource: DataSource) {
    super(PslOperationEntity, dataSource.createEntityManager());
  }
   
   
}
