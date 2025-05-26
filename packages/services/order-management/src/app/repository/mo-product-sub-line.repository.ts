import { Injectable } from "@nestjs/common";
import { MC_MoStyleProdDetailModel, MoCombinationRequest, MoPreviewBomInfo, MOSummaryBomInfo, OrderFeatures, SI_MoProductOpModel, SI_MoProductRmModel, SI_MoRmModel, StyleProductCodeFgColor, StyleProductCodeFgColorRequest, StyleProductRequest } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { PslOperationRmEntity } from "../entity/psl-operation-rm.entity";
import { PslOperationEntity } from "../entity/psl-operation.entity";
import { RmInfoEntity } from "../entity/rm-info.entity";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { MoInfoEntity } from "../entity/mo-info.entity";

@Injectable()
export class MoProductSubLineRepository extends Repository<MoProductSubLineEntity> {
  constructor(private dataSource: DataSource) {
    super(MoProductSubLineEntity, dataSource.createEntityManager());
  }

  async getRmInfoByProductId(productId: number, companyCode: string, unitCode: string): Promise<SI_MoProductRmModel[]> {
    const query = await this.createQueryBuilder('psl')
      .select([
        'rmInfo.item_code as itemCode',
        'rmInfo.item_desc as itemDesc',
        'SUM(rmInfo.consumption) as avgCons',
        'rmInfo.item_color as itemColor',
        'rmInfo.sequence as seq'
      ])
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = psl.companyCode AND pslOp.unit_code = psl.unitCode AND pslOp.mo_product_sub_line_id = psl.id')
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = psl.companyCode AND pslOpRm.unit_code = psl.unitCode AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.companyCode AND rmInfo.unit_code = pslOpRm.unitCode AND rmInfo.item_code = pslOpRm.item_code')
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode AND psl.mo_line_product_id = :productId', { companyCode, unitCode, productId })
      .groupBy('psl.id, pslOp.id, pslOpRm.item_code, rmInfo.item_code, rmInfo.item_desc, rmInfo.item_color, rmInfo.sequence')
      .getRawMany();

    return query;
  }


  async getOpInfoByProductId(productId: number, companyCode: string, unitCode: string): Promise<SI_MoProductOpModel[]> {
    const query = await this.createQueryBuilder('psl')
      .select('op_code as opCode,process_type as processType,op_name as opName,op_smv as smv')
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = psl.companyCode AND pslOp.unit_code = psl.unitCode AND pslOp.mo_product_sub_line_id=psl.id')
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode AND psl.mo_line_product_id = :productId', { companyCode, unitCode, productId })
      .getRawMany()


    return query
  }


  async getOpRmInfoByProductId(productId: number, companyCode: string, unitCode: string) {
    const query = await this.createQueryBuilder('psl')
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = psl.companyCode AND pslOp.unit_code = psl.unitCode AND pslOp.mo_product_sub_line_id=psl.id')
      // .leftJoin()
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode AND psl.mo_line_product_id = :productId', { companyCode, unitCode, productId })
      .getRawMany()

    return query;


  }

  /**
   * Repository method to get style product style color info
   * @param moNumber 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getStyleProductColorInfoForMO(moNumber: string, unitCode: string, companyCode: string): Promise<StyleProductCodeFgColor[]> {
    return await this.createQueryBuilder('psl')
      .select('product_code as productCode, fg_color as fgColor, style_code as styleCode, product_type as productType,product_name as productName')
      .where(`mo_number = '${moNumber}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
      .groupBy('product_code, fg_color, style_code')
      .getRawMany()
  }


  /**
   * Repository method to get style product style color info
   * @param moNumber 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getStyleProductTypeInfoForMO(moNumber: string, unitCode: string, companyCode: string): Promise<StyleProductRequest[]> {
    return await this.createQueryBuilder('psl')
      .select('style_code as styleCode, product_type as productType')
      .where(`mo_number = '${moNumber}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
      .groupBy('product_type, style_code')
      .getRawMany()
  }


  //helper methods for getOrderInfoByManufacturingOrderProductCodeFgColor

  async getRmInfoByProductIdProductCodeFgColor(productId: number, productCode: string, fgColor: string, companyCode: string, unitCode: string): Promise<SI_MoProductRmModel[]> {
    const query = await this.createQueryBuilder('psl')
      .select([
        'rmInfo.item_code as itemCode',
        'rmInfo.item_desc as itemDesc',
        'SUM(rmInfo.consumption) as avgCons',
        'rmInfo.item_color as itemColor',
        'rmInfo.sequence as seq'
      ])
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = psl.companyCode AND pslOp.unit_code = psl.unitCode AND pslOp.mo_product_sub_line_id = psl.id')
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = psl.companyCode AND pslOpRm.unit_code = psl.unitCode AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.companyCode AND rmInfo.unit_code = pslOpRm.unitCode AND rmInfo.item_code = pslOpRm.item_code AND rmInfo.mo_number = pslOpRm.mo_number')
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode AND psl.mo_line_product_id = :productId AND psl.product_code =:productCode AND  psl.fg_color = :fgColor', { companyCode, unitCode, productId, productCode, fgColor })
      .groupBy(' rmInfo.item_code, rmInfo.item_desc, rmInfo.item_color, rmInfo.sequence')
      .orderBy('rmInfo.sequence')
      .getRawMany();

    return query;
  }


  async getOpInfoByProductIdProductCodeFgColor(productId: number, productCode: string, fgColor: string, companyCode: string, unitCode: string): Promise<SI_MoProductOpModel[]> {
    const query = await this.createQueryBuilder('psl')
      .select('DISTINCT op_code as opCode,process_type as processType,op_name as opName,op_smv as smv')
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = psl.companyCode AND pslOp.unit_code = psl.unitCode AND pslOp.mo_product_sub_line_id=psl.id')
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode AND psl.mo_line_product_id = :productId  AND psl.product_code = :productCode AND psl.fg_color = :fgColor', { companyCode, unitCode, productId, productCode, fgColor })
      .groupBy('pslOp.id')
      .getRawMany()


    return query
  }

  /**
   * Repo method to get style product group for given mo product sub line ids
   * @param moProductSubLineIds 
   * @param companyCode 
   * @param unitCode 
   * @returns 
  */
  async getMoStyleProductInfoForGivenIds(moProductSubLineIds: number[], companyCode: string, unitCode: string): Promise<MC_MoStyleProdDetailModel[]> {
    return await this.createQueryBuilder('psl')
      .select('mo_number as moNumber, style_code as styleCode, product_code as productCode, fg_color as fgColor')
      .groupBy('mo_number, style_code, product_code, fg_color')
      .where('id IN (:...ids)', { ids: moProductSubLineIds })
      .andWhere(`unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
      .getRawMany();
  }


  async getRmInfoByPslIds(productId: number, pslIds: number[], companyCode: string, unitCode: string): Promise<SI_MoProductRmModel[]> {
    const query = await this.createQueryBuilder('psl')
      .select([
        'rmInfo.item_code as itemCode',
        'rmInfo.item_desc as itemDesc',
        'SUM(rmInfo.consumption) as avgCons',
        'rmInfo.item_color as itemColor',
        'rmInfo.sequence as seq'
      ])
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = psl.companyCode AND pslOp.unit_code = psl.unitCode AND pslOp.mo_product_sub_line_id = psl.id')
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = psl.companyCode AND pslOpRm.unit_code = psl.unitCode AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.companyCode AND rmInfo.unit_code = pslOpRm.unitCode AND rmInfo.item_code = pslOpRm.item_code')
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode  AND psl.mo_line_product_id = :productId AND  psl.id IN (:...pslIds)', { companyCode, unitCode, productId, pslIds })
      .groupBy('psl.id, pslOp.id, pslOpRm.item_code, rmInfo.item_code, rmInfo.item_desc, rmInfo.item_color, rmInfo.sequence')
      .getRawMany();

    return query;
  }


  async getOpInfoByPslIds(productId: number, pslIds: number[], companyCode: string, unitCode: string): Promise<SI_MoProductOpModel[]> {
    const query = await this.createQueryBuilder('psl')
      .select('op_code as opCode,process_type as processType,op_name as opName,op_smv as smv')
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = psl.companyCode AND pslOp.unit_code = psl.unitCode AND pslOp.mo_product_sub_line_id=psl.id')
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode  AND psl.mo_line_product_id = :productId AND  psl.id IN (:...pslIds)', { companyCode, unitCode, productId, pslIds })
      .getRawMany()


    return query
  }


  async getOrdFeaturesBySubLineId(subLineId: number, companyCode: string, unitCode: string): Promise<OrderFeatures> {
    const query = await this.createQueryBuilder('psl')
      .select(`GROUP_CONCAT(DISTINCT psl.mo_number) as moNumber ,GROUP_CONCAT(DISTINCT psl.mo_line_number) as moLineNumber,
      GROUP_CONCAT(DISTINCT psl.ext_ref_number1) as moOrderSubLineNumber,
      GROUP_CONCAT(DISTINCT psl.delivery_date) as planDeliveryDate,
      GROUP_CONCAT(DISTINCT psl.plan_prod_date) as planProductionDate,
      GROUP_CONCAT(DISTINCT psl.plan_cut_date) as planCutDate,
      GROUP_CONCAT(DISTINCT moInfo.customer_order_no) as coNumber,
      moInfo.style_name as styleName,
      moInfo.style_description as styleDescription,
      GROUP_CONCAT(DISTINCT moInfo.business_head) as businessHead,
      GROUP_CONCAT(DISTINCT moInfo.mo_creation_date) as moCreationDate,
      GROUP_CONCAT(DISTINCT moInfo.mo_closed_date) as moClosedDate,
      GROUP_CONCAT(DISTINCT moInfo.ex_factory_date) as exFactoryDate,
      GROUP_CONCAT(DISTINCT psl.schedule) as schedule,
      GROUP_CONCAT(DISTINCT psl.z_feature) as zFeature,
      GROUP_CONCAT(DISTINCT psl.style_code) as styleCode,
      GROUP_CONCAT(DISTINCT moInfo.customer_name) as customerName 
      `)
      .leftJoin(MoInfoEntity, 'moInfo', 'moInfo.company_code = psl.company_code AND moInfo.unit_code = psl.unit_code AND moInfo.mo_number = psl.mo_number')
      .where('psl.company_code = :companyCode AND psl.unit_code = :unitCode AND psl.id = :subLineId', { companyCode, unitCode, subLineId })
      .getRawMany()

    const moNumber: string[] = []
    const moLineNumber: string[] = []
    const moOrderSubLineNumber: string[] = []
    const planDeliveryDate: string[] = []
    const planProductionDate: string[] = []
    const planCutDate: string[] = []
    const coNumber: string[] = []
    const styleName: string = query[0].styleName
    const styleDescription: string = query[0].styleDescription
    const businessHead: string[] = []
    const moCreationDate: string[] = []
    const moClosedDate: string[] = []
    const exFactoryDate: string[] = []
    const schedule: string[] = []
    const zFeature: string[] = []
    const styleCode: string[] = []
    const customerName: string[] = []

    function safeSplit(value: string, separator: string = ','): string[] {
      return value ? value.split(separator) : []
    }
    query.forEach((r) => {
      moNumber.push(...safeSplit(r?.moNumber))
      moLineNumber.push(...safeSplit(r?.moLineNumber))
      moOrderSubLineNumber.push(...safeSplit(r?.moOrderSubLineNumber))
      planDeliveryDate.push(...safeSplit(r?.planDeliveryDate))
      planProductionDate.push(...safeSplit(r?.planProductionDate))
      planCutDate.push(...safeSplit(r?.planCutDate))
      coNumber.push(...safeSplit(r?.coNumber))
      businessHead.push(...safeSplit(r?.businessHead))
      moCreationDate.push(...safeSplit(r?.moCreationDate))
      moClosedDate.push(...safeSplit(r?.moClosedDate))
      exFactoryDate.push(...safeSplit(r?.exFactoryDate))
      schedule.push(...safeSplit(r?.schedule))
      zFeature.push(...safeSplit(r?.zFeature))
      styleCode.push(...safeSplit(r?.styleCode))
      customerName.push(...safeSplit(r?.customerName))
    })

    const result = new OrderFeatures(moNumber, moLineNumber, moOrderSubLineNumber, planDeliveryDate, planProductionDate, planCutDate, coNumber, styleName, styleDescription, businessHead, moCreationDate, moClosedDate, exFactoryDate, schedule, zFeature, styleCode, customerName)

    return result;
  }


  async getMoSizesInfoForMoProduct(moNumber: string, productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<{
    moPslIds: string;
    size: string
  }[]> {
    return await this.createQueryBuilder('psl')
      .select('GROUP_CONCAT(DISTINCT id)as moPslIds, size')
      .where(`psl.product_code = '${productCode}' AND psl.fg_color = '${fgColor}' AND mo_number = '${moNumber}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}' and is_active = true`)
      .groupBy('psl.size')
      .getRawMany();
  }


  /**
 * Repository method to get style product style color info
 * @param moNumber 
 * @param unitCode 
 * @param companyCode 
 * @returns 
*/
  async getStyleProductCodeFgColorInfoForMO(moNumber: string, unitCode: string, companyCode: string): Promise<StyleProductCodeFgColorRequest[]> {
    return await this.createQueryBuilder('psl')
      .select('style_code as styleCode, product_code as productCode, fg_color as fgColor')
      .where(`mo_number = '${moNumber}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
      .groupBy('product_code, style_code,fg_color')
      .getRawMany()
  }

  async getBomInfoByOpCodesWithColor(moNumber: string, opCode: string[], companyCode: string, unitCode: string): Promise<MOSummaryBomInfo[]> {


    const query = await this.createQueryBuilder('moPsl')
      .select([
        'pslOp.process_type as routeProcess',
        'rmInfo.item_code as itemCode',
        'rmInfo.item_desc as itemDesc',
        'rmInfo.consumption as avgCons',
        'rmInfo.item_color as itemColor',
        'rmInfo.sequence as seq',
        'rmInfo.item_name as itemName',
        'rmInfo.wastage as wastage',
        'moPsl.fg_color as fgColor',
      ])
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = moPsl.company_code AND pslOp.unit_code = moPsl.unit_code AND  pslOp.mo_product_sub_line_id=moPsl.id')
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = pslOp.company_code AND pslOpRm.unit_code = pslOp.unit_code AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number = pslOpRm.mo_number AND rmInfo.item_code = pslOpRm.item_code')
      .where('moPsl.company_code = :companyCode', { companyCode })
      .andWhere('moPsl.unit_code = :unitCode', { unitCode })
      .andWhere('moPsl.mo_number = :moNumber', { moNumber })
      .andWhere('pslOpRm.op_code IN (:...opCode)', { opCode })
      .groupBy('rmInfo.item_code, rmInfo.item_desc, rmInfo.item_color, pslOp.process_type, rmInfo.item_type,moPsl.fg_color')
      .getRawMany();

    return query;

  }


  async getBomInfoByOpCodes(moNumber: string, opCode: string[], companyCode: string, unitCode: string): Promise<MoPreviewBomInfo[]> {


    const query = await this.createQueryBuilder('moPsl')
      .select([
        'pslOp.process_type as routeProcess',
        'rmInfo.item_code as itemCode',
        'rmInfo.item_desc as itemDesc',
        'rmInfo.consumption as avgCons',
        'rmInfo.item_color as itemColor',
        'rmInfo.sequence as seq',
        'rmInfo.item_name as itemName',
        'rmInfo.wastage as wastage',
      ])
      .leftJoin(PslOperationEntity, 'pslOp', 'pslOp.company_code = moPsl.company_code AND pslOp.unit_code = moPsl.unit_code AND  pslOp.mo_product_sub_line_id=moPsl.id')
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = pslOp.company_code AND pslOpRm.unit_code = pslOp.unit_code AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number = pslOpRm.mo_number AND rmInfo.item_code = pslOpRm.item_code')
      .where('moPsl.company_code = :companyCode', { companyCode })
      .andWhere('moPsl.unit_code = :unitCode', { unitCode })
      .andWhere('moPsl.mo_number = :moNumber', { moNumber })
      .andWhere('pslOpRm.op_code IN (:...opCode)', { opCode })
      .groupBy('rmInfo.item_code, rmInfo.item_desc, rmInfo.item_color, pslOp.process_type, rmInfo.item_type')
      .getRawMany();

    return query;

  }

  async getPslIdsForMoCombinaitons(req: MoCombinationRequest): Promise<{ pslIds: string, destination: string, deliveryDate: string, productCode: string, fgColor: string, moNumber: string }[]> {
    const { combinationFlags } = req
    const query = await this.createQueryBuilder('psl')
      .select('GROUP_CONCAT(id) as pslIds,destination,delivery_date as deliveryDate,product_code as productCode,fg_color as fgColor,mo_number as moNumber')
      .where(`mo_number = '${req.moNumber}' AND unit_code = '${req.unitCode}' AND company_code = '${req.companyCode}'`)
    if (combinationFlags.product) {
      await query.groupBy('product_code')
    }
    if (combinationFlags.deliveryDate) {
      await query.addGroupBy('psl.delivery_date')
    }
    if (combinationFlags.destination) {
      await query.addGroupBy('psl.destination')
    }
    if (combinationFlags.color) {
      await query.addGroupBy('psl.fg_color')
    }

    return await query.getRawMany()
  }

  async getBomInfoByOpCodeProductCodeFgColor(moNumber: string, opCode: string, productCode: string, fgColor: string, companyCode: string, unitCode: string): Promise<SI_MoProductRmModel[]> {

    const query = await this.createQueryBuilder('moPsl')
      .select('rmInfo.item_code as itemCode,rmInfo.item_desc as itemDesc,SUM(rmInfo.consumption) as avgCons,rmInfo.item_color as itemColor,rmInfo.sequence as seq, rmInfo.item_type as itemType')
      .leftJoin(PslOperationEntity, 'pslOp', "pslOp.company_code = moPsl.company_code AND pslOp.unit_code = moPsl.unit_code AND pslOp.mo_product_sub_line_id=moPsl.id ")
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = pslOp.company_code AND pslOpRm.unit_code = pslOp.unit_code AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number=pslOpRm.mo_number AND rmInfo.item_code=pslOpRm.item_code')
      .where(`moPsl.company_code = '${companyCode}' AND moPsl.unit_code = '${unitCode}' AND moPsl.mo_number = '${moNumber}' AND pslOpRm.op_code = '${opCode}' AND moPsl.product_code = '${productCode}' AND moPsl.fg_color = '${fgColor}'`)
      .groupBy('rmInfo.item_code,rmInfo.item_desc,rmInfo.item_color,rmInfo.sequence')
      .getRawMany();

    return query
  }

  async getMoRmByManufacturingOrderNoProductCodeFgColor(moNumber: string, productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<SI_MoRmModel[]> {
    const query = await this.createQueryBuilder('moPsl')
      .select('rmInfo.item_code as itemCode,rmInfo.item_desc as itemDesc,SUM(rmInfo.consumption) as avgCons,rmInfo.item_color as itemColor,rmInfo.sequence as seq, rmInfo.item_type as itemType')
      .leftJoin(PslOperationEntity, 'pslOp', "pslOp.company_code = moPsl.company_code AND pslOp.unit_code = moPsl.unit_code AND pslOp.mo_product_sub_line_id=moPsl.id ")
      .leftJoin(PslOperationRmEntity, 'pslOpRm', 'pslOpRm.company_code = pslOp.company_code AND pslOpRm.unit_code = pslOp.unit_code AND pslOpRm.psl_operation_id = pslOp.id')
      .leftJoin(RmInfoEntity, 'rmInfo', 'rmInfo.company_code = pslOpRm.company_code AND rmInfo.unit_code = pslOpRm.unit_code AND rmInfo.mo_number=pslOpRm.mo_number AND rmInfo.item_code=pslOpRm.item_code')
      .where(`moPsl.company_code = '${companyCode}' AND moPsl.unit_code = '${unitCode}' AND moPsl.mo_number = '${moNumber}' AND moPsl.product_code = '${productCode}' AND moPsl.fg_color = '${fgColor}'`)
      .groupBy('rmInfo.item_code,rmInfo.item_desc,rmInfo.item_color,rmInfo.sequence')
      .getRawMany();

    return query
  }

}
