import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoLineProductEntity } from "../entity/mo-line-product.entity";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { PslOperationEntity } from "../entity/psl-operation.entity";
import { PslOperationRmEntity } from "../entity/psl-operation-rm.entity";
import { RmInfoEntity } from "../entity/rm-info.entity";
import { RawOrderLineRmModel, RawOrderOpInfoModel } from "@xpparel/shared-models";

@Injectable()
export class MoLineProductRepository extends Repository<MoLineProductEntity> {
  constructor(private dataSource: DataSource) {
    super(MoLineProductEntity, dataSource.createEntityManager());
  }

  async getMoLineProductsByPslIds(lineId: number, pslIds: number[], companyCode: string, unitCode: string): Promise<MoLineProductEntity[]> {
    const query = await this.createQueryBuilder('mlp')
      .select()
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = mlp.company_code AND moPsl.unit_code = mlp.unit_code AND moPsl.mo_number = mlp.mo_number AND moPsl.mo_line_number = mlp.mo_line_number')
      .where('mlp.company_code = :companyCode AND mlp.unit_code = :unitCode AND moPsl.id IN (:...pslIds)', { companyCode, unitCode, pslIds })
      .andWhere(`mlp.mo_line_id = '${lineId}'`)
      .groupBy('mlp.id')
      .getMany();

    return query;
  }

  async getMoLineOpByLineId(moLineId: number, companyCode: string, unitCode: string): Promise<RawOrderOpInfoModel[]> {
    const query = await this.createQueryBuilder('mlp')
      .select('DISTINCT pslOp.op_code as opCode ,pslOp.op_name as opName,pslOp.process_type as opCat,GROUP_CONCAT(DISTINCT pslOpRm.item_code) as itemCodes')
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.mo_line_product_id =mlp.id")
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = moPsl.companyCode AND pslOp.unit_code = moPsl.unitCode AND pslOp.mo_product_sub_line_id = moPsl.id')
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = moPsl.companyCode AND pslOpRm.unit_code = moPsl.unitCode AND pslOpRm.psl_operation_id = pslOp.id')
      .where('mlp.company_code = :companyCode AND mlp.unit_code = :unitCode AND mlp.mo_line_id = :moLineId', { companyCode, unitCode, moLineId })
      .groupBy('pslOp.id')
      .getRawMany()



    query.forEach(r => {
      r.itemCodes = r?.itemCodes?.split(',')
    })

    return query;

  }


  async getMoLineRmByLineId(moLineId: number, companyCode: string, unitCode: string): Promise<RawOrderLineRmModel[]> {

    const query = await this.createQueryBuilder('mlp')
      .select('DISTINCT rmInfo.item_code as iCode ,rmInfo.item_desc as iDesc,rmInfo.item_type as iType,rmInfo.item_sub_type as iSubType,rmInfo.consumption as consumption,rmInfo.wastage as wastage')
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.mo_line_product_id =mlp.id")
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = moPsl.companyCode AND pslOp.unit_code = moPsl.unitCode AND pslOp.mo_product_sub_line_id = moPsl.id')
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = moPsl.companyCode AND pslOpRm.unit_code = moPsl.unitCode AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.companyCode AND rmInfo.unit_code = pslOpRm.unitCode AND rmInfo.item_code = pslOpRm.item_code AND rmInfo.mo_number = pslOpRm.mo_number')
      .where('mlp.company_code = :companyCode AND mlp.unit_code = :unitCode AND mlp.mo_line_id = :moLineId', { companyCode, unitCode, moLineId })
      .groupBy('rmInfo.id')
      .getRawMany()


    return query;

  }
}
