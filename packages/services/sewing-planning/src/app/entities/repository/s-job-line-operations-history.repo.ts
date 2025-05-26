import { Injectable } from "@nestjs/common";
import { SJobLineOperationsHistoryEntity } from "../s-job-line-operations-history";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SJobLineOperationsHistoryRepo extends Repository<SJobLineOperationsHistoryEntity> {
  constructor(dataSource: DataSource) {
    super(SJobLineOperationsHistoryEntity, dataSource.createEntityManager());
  }
}