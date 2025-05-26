import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RmInfoEntity } from "../entity/rm-info.entity";

@Injectable()
export class RawMaterialInfoRepository extends Repository<RmInfoEntity> {
  constructor(private dataSource: DataSource) {
    super(RmInfoEntity, dataSource.createEntityManager());
  }
   
   
}
