import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobPslEntity } from "../s-job-psl-entity";


@Injectable()
export class SJobPslRepository extends Repository<SJobPslEntity> {
  constructor(dataSource: DataSource) {
    super(SJobPslEntity, dataSource.createEntityManager());
  }

  
}

