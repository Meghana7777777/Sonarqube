import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../../database/common-repositories";
import { MaterialTypeEntity } from "../entities/material-type.entity";
import { MaterialTypeRepoInterface } from "./material-type.repo.interface";
import { CommonRequestAttrs } from "@xpparel/shared-models";
import { ItemsEntity } from "../../items/entities/items.entity";

@Injectable()
export class MaterialTypeRepo extends BaseAbstractRepository<MaterialTypeEntity> implements MaterialTypeRepoInterface {
  constructor(
    @InjectRepository(MaterialTypeEntity)
    private readonly mtEntity: Repository<MaterialTypeEntity>,
    private dataSource: DataSource
  ) {
    super(mtEntity);
  }


  async getMaterialToItems() {
    const query = await this.mtEntity.createQueryBuilder('mt')
      .select(`id,CONCAT (mt.code,'-',mt.desc) as materialTypeDesc`)
      .where(`is_active = 1`)
      .getRawMany()
    return query
  }


  async materialIdExist(req: CommonRequestAttrs, materialId: number): Promise<boolean> {
    const query = await this.dataSource.getRepository(ItemsEntity).createQueryBuilder()
      .where(`company_code='${req.companyCode}' and unit_code='${req.unitCode}' and material_type='${materialId}'`)
      .getExists()
    return query
  }
}