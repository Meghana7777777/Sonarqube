import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SoLineEntity } from "../entity/mo-line.entity";
@Injectable()
export class SoLineRepository extends Repository<SoLineEntity> {
  constructor(private dataSource: DataSource) {
    super(SoLineEntity, dataSource.createEntityManager());
  }
   
   
}
