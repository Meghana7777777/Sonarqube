import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SoLineProductEntity } from "../entity/mo-line-product.entity";

@Injectable()
export class SoLineProductRepository extends Repository<SoLineProductEntity> {
  constructor(private dataSource: DataSource) {
    super(SoLineProductEntity, dataSource.createEntityManager());
  }
   
   
}
