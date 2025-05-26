import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../../database/common-repositories";
import { PackTypeEntity } from "../entities/pack-type.entity";
import { PackTypeRepoInterface } from "./pack-type.repo.interface";
import { CommonRequestAttrs } from "@xpparel/shared-models";

@Injectable()
export class PackTypeRepo extends BaseAbstractRepository<PackTypeEntity> implements PackTypeRepoInterface {
  constructor(
    @InjectRepository(PackTypeEntity)
    private readonly PTEntity: Repository<PackTypeEntity>,
  ) {
    super(PTEntity);
  }


  async getPackTypeDropDown(dto: CommonRequestAttrs) {
    const query = await this.PTEntity.createQueryBuilder('pt')
      .select(`CONCAT( pt.code,'-',pt.desc) AS packTypeDesc,pt.id,pt.pack_method AS packMethod`)
      .where(`pt.company_code='${dto.companyCode}' and pt.unit_code='${dto.unitCode}' and pt.is_active = 1 `)
      .getRawMany()
    return query
  }
}