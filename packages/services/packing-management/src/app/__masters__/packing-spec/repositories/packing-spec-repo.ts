import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PackingSpecEntity } from "../entities/packing-spec.entity";
import { PackingSpecRepoInterface } from "./packing-spec-repo-interface";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PackSerialNumberReqDto, PackSpecDropDownDtoModel } from "@xpparel/shared-models";
import { PackOrderBomEntity } from "../../../packing-list/entities/pack-bom.entity";
import { BoxMapEntity } from "../entities/box-map.entity";
import { ItemsEntity } from "../../items/entities/items.entity";
import { PKMSProcessingOrderEntity } from "../../../pre-integrations/pkms-po-entities/pkms-processing-order-entity";

@Injectable()
export class PackingSpecRepo extends BaseAbstractRepository<PackingSpecEntity> implements PackingSpecRepoInterface {
  constructor(
    @InjectRepository(PackingSpecEntity)
    private readonly psEntity: Repository<PackingSpecEntity>,
    private dataSource: DataSource
  ) {
    super(psEntity);
  }

 


  async getMappedBomSpec(req: PackSerialNumberReqDto): Promise<PackSpecDropDownDtoModel[]> {
    const commonReq = { companyCode: req.companyCode, unitCode: req.unitCode }
    const findPoId = await this.dataSource.getRepository(PKMSProcessingOrderEntity).findOne({ select: ['id'], where: { processingSerial: req.packSerial, ...commonReq } });
    const subQuery = this.dataSource.createQueryBuilder()
      .select('1')
      .from(BoxMapEntity, 'box')
      .where('box.spec_id = spec.id')
      .andWhere(qb => {
        const sub = qb.subQuery()
          .select('bom.bom_id')
          .from(PackOrderBomEntity, 'bom')
          .where('bom.pack_order_id = :packOrderId', { packOrderId: findPoId.id })
          .getQuery();
        return `box.item_id NOT IN ${sub}`;
      });

    const validSpecs = await this.dataSource.getRepository(PackingSpecEntity).createQueryBuilder('spec')
      .select(`spec.id,spec.code,spec.desc`)
      .where(`NOT EXISTS(${subQuery.getQuery()})`)
      .setParameter('packOrderId', `${findPoId.id}`)
      .getRawMany();
    return validSpecs
  }


}