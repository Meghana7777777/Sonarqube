import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PslOperationRmEntity } from "../entity/psl-operation-rm.entity";
import { MoPreviewBomInfo, MOSummaryBomInfo, SI_MoProductRmModel } from "@xpparel/shared-models";
import { RmInfoEntity } from "../entity/rm-info.entity";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { PslOperationEntity } from "../entity/psl-operation.entity";

@Injectable()
export class PslOpRawMaterialRepository extends Repository<PslOperationRmEntity> {
  constructor(private dataSource: DataSource) {
    super(PslOperationRmEntity, dataSource.createEntityManager());
  }


  async getBomInfoByOpCode(moNumber: string, opCode: string, companyCode: string, unitCode: string): Promise<SI_MoProductRmModel[]> {

    const query = await this.createQueryBuilder('pslOpRm')
      .select('rmInfo.item_code as itemCode,rmInfo.item_desc as itemDesc,SUM(rmInfo.consumption) as avgCons,rmInfo.item_color as itemColor,rmInfo.sequence as seq')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number=pslOpRm.mo_number AND rmInfo.item_code=pslOpRm.item_code')
      .where(`pslOpRm.company_code = '${companyCode}' AND pslOpRm.unit_code = '${unitCode}' AND pslOpRm.mo_number = '${moNumber}' AND pslOpRm.op_code = '${opCode}'`)
      .groupBy('rmInfo.item_code,rmInfo.item_desc,rmInfo.item_color,rmInfo.sequence')
      .getRawMany();


    return query

  }


  //helper methods for getOrderInfoByManufacturingOrderProductCodeFgColor

  async getBomInfoByOpCodeProductCodeFgColor(moNumber: string, opCode: string, productCode: string, fgColor: string, companyCode: string, unitCode: string): Promise<SI_MoProductRmModel[]> {

    const query = await this.createQueryBuilder('pslOpRm')
      .select('rmInfo.item_code as itemCode,rmInfo.item_desc as itemDesc,SUM(rmInfo.consumption) as avgCons,rmInfo.item_color as itemColor,rmInfo.sequence as seq, rmInfo.item_type as itemType')
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = pslOpRm.company_code AND moPsl.unit_code = pslOpRm.unit_code AND moPsl.mo_number = pslOpRm.mo_number")
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number=pslOpRm.mo_number AND rmInfo.item_code=pslOpRm.item_code')
      .where(`pslOpRm.company_code = '${companyCode}' AND pslOpRm.unit_code = '${unitCode}' AND pslOpRm.mo_number = '${moNumber}' AND pslOpRm.op_code = '${opCode}' AND moPsl.product_code = '${productCode}' AND moPsl.fg_color = '${fgColor}'`)
      .groupBy('rmInfo.item_code,rmInfo.item_desc,rmInfo.item_color,rmInfo.sequence')
      .getRawMany();

    return query

  }


  // async getBomInfoByOpCodes(moNumber: string, opCode: string[], companyCode: string, unitCode: string): Promise<MoPreviewBomInfo[]> {//TODO


  //   const query = await this.createQueryBuilder('pslOpRm')
  //     .select([
  //       'pslOp.process_type as routeProcess',
  //       'rmInfo.item_code as itemCode',
  //       'rmInfo.item_desc as itemDesc',
  //       'rmInfo.consumption as avgCons',
  //       'rmInfo.item_color as itemColor',
  //       'rmInfo.sequence as seq',
  //       'rmInfo.item_name as itemName',
  //     ])
  //     .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = pslOpRm.company_code AND pslOp.unit_code = pslOpRm.unit_code AND pslOp.op_code = pslOpRm.op_code AND pslOp.id = pslOpRm.psl_operation_id')
  //     .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number = pslOpRm.mo_number AND rmInfo.item_code = pslOpRm.item_code')
  //     .where('pslOpRm.company_code = :companyCode', { companyCode })
  //     .andWhere('pslOpRm.unit_code = :unitCode', { unitCode })  
  //     .andWhere('pslOpRm.mo_number = :moNumber', { moNumber })
  //     .andWhere('pslOpRm.op_code IN (:...opCode)', { opCode })
  //     .groupBy('rmInfo.item_code, rmInfo.item_desc, rmInfo.item_color, rmInfo.sequence, pslOpRm.op_code, pslOp.process_type, rmInfo.item_type')
  //     .getRawMany();

  //   return query;

  // }

  // async getBomInfoByOpCodesWithColor(moNumber: string, opCode: string[], companyCode: string, unitCode: string): Promise<MOSummaryBomInfo[]> {//TODO


  //   const query = await this.createQueryBuilder('pslOpRm')
  //     .select([
  //       'pslOp.process_type as routeProcess',
  //       'rmInfo.item_code as itemCode',
  //       'rmInfo.item_desc as itemDesc',
  //       'rmInfo.consumption as avgCons',
  //       'rmInfo.item_color as itemColor',
  //       'rmInfo.sequence as seq',
  //       'rmInfo.item_name as itemName',
  //       'moPsl.fg_color as fgColor',
  //     ])
  //     .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = pslOpRm.company_code AND pslOp.unit_code = pslOpRm.unit_code AND pslOp.op_code = pslOpRm.op_code AND  pslOpRm.psl_operation_id=pslOp.id')
  //     .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = pslOpRm.company_code AND moPsl.unit_code = pslOpRm.unit_code AND moPsl.mo_number = pslOpRm.mo_number AND  moPsl.id=pslOp.mo_product_sub_line_id ")
  //     .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number = pslOpRm.mo_number AND rmInfo.item_code = pslOpRm.item_code')
  //     .where('pslOpRm.company_code = :companyCode', { companyCode })
  //     .andWhere('pslOpRm.unit_code = :unitCode', { unitCode })  
  //     .andWhere('pslOpRm.mo_number = :moNumber', { moNumber })
  //     .andWhere('pslOpRm.op_code IN (:...opCode)', { opCode })
  //     .groupBy('rmInfo.item_code, rmInfo.item_desc, rmInfo.item_color, rmInfo.sequence, pslOpRm.op_code, pslOp.process_type, rmInfo.item_type')
  //     .getRawMany();

  //   return query;

  // }

}
