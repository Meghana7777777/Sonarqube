import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SoInfoEntity } from "../entity/mo-info.entity";
@Injectable()
export class SoInfoRepository extends Repository<SoInfoEntity> {
  constructor(private dataSource: DataSource) {
    super(SoInfoEntity, dataSource.createEntityManager());
  }
   
   
}
