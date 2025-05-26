import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoInfoEntity } from "../entity/mo-info.entity";
import { ManufacturingOrderPreviewData, MoDataForSoSummaryModel, MOHeaderInfoModel, MoPreviewMoLine, MoSummaryPreviewData, RawOrderInfoModel, RawOrderLineInfoModel, RawOrderSubLineInfoModel, SI_ManufacturingOrderInfoAbstractModel, SI_ManufacturingOrderInfoModel, SI_MoAttributesModel, SI_MoLineAttributesModel, SI_MoLineProdAttributesModel, SI_MoProdAttributesModel, SI_MoProdSubLineAttr } from "@xpparel/shared-models";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { MoLineProductEntity } from "../entity/mo-line-product.entity";
import { MoLineEntity } from "../entity/mo-line.entity";
@Injectable()
export class MoInfoRepository extends Repository<MoInfoEntity> {
  constructor(private dataSource: DataSource) {
    super(MoInfoEntity, dataSource.createEntityManager());
  }

  async getManufacturingOrdersList(companyCode: string, unitCode: string): Promise<SI_ManufacturingOrderInfoAbstractModel[]> {
    const query = this.createQueryBuilder('moInfo')
      .select(`mo_number as moNumber,id as moPk, is_confirmed as confirmed, style_code as style,mo_progress_status as moProgressStatus, mo_creation_date as moCreationDate`)
      .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}'`)
    const result: SI_ManufacturingOrderInfoAbstractModel[] = await query.getRawMany();

    return result;
  }

  async getmanufacturingOrderInfoByStatus(companyCode: string, unitCode: string, confirmed: boolean): Promise<SI_ManufacturingOrderInfoModel[]> {
    const confirm = confirmed ? 1 : 0
    const query = this.createQueryBuilder('moInfo')
      .select(`mo_number as moNumber,id as moPk,is_confirmed as confirmed,style as style`)
      .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_confirmed = ${confirm}`)
      .orderBy('created_at', 'ASC')

    const result: SI_ManufacturingOrderInfoModel[] = await query.getRawMany();

    return result;
  }


  async getMoAttributesByManufacturingOrderNo(moNumber: string, unitCode: string, companyCode: string): Promise<SI_MoAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT slp.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moInfo.mo_number = '${moNumber}'`)
      .getRawMany();


    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query.forEach(r => {
      delDates.push(...r?.delDates?.split(','));
      destinations?.push(...r?.destinations?.split(','));
      styles?.push(...r?.styles?.split(','));
      products?.push(...r?.products?.split(','));
      coNumbers?.push(...r?.coNumbers?.split(','));
    });


    return new SI_MoAttributesModel(delDates, destinations, styles, products, coNumbers, []);
  }

  async getMoLineAttrsByMOLineNumber(moNumber: string, moLineNumber: string, companyCode: string, unitCode: string): Promise<SI_MoLineAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT slp.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moInfo.mo_number = '${moNumber}' AND moPsl.mo_line_number = '${moLineNumber}'`)
      .getRawMany();
    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query?.forEach(r => {
      delDates?.push(...r?.delDates?.split(','));
      destinations?.push(...r?.destinations?.split(','));
      styles?.push(...r?.styles?.split(','));
      products?.push(...r?.products?.split(','));
      coNumbers?.push(...r?.coNumbers?.split(','));
    });

    return new SI_MoLineAttributesModel(delDates, destinations, styles, products, coNumbers, []);
  }

  async getMoLineProdAttrsByMoProdName(moNumber: string, moLineNumber: string, productName: string, companyCode: string, unitCode: string): Promise<SI_MoLineProdAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT slp.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moInfo.mo_number = '${moNumber}' AND moPsl.mo_line_number = '${moLineNumber}' AND slp.product_name = '${productName}'`)
      .getRawMany();
    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query.forEach(r => {
      delDates.push(...r.delDates?.split(','));
      destinations.push(...r.destinations?.split(','));
      styles.push(...r.styles?.split(','));
      products.push(...r.products?.split(','));
      coNumbers.push(...r.coNumbers?.split(','));
    });
    return new SI_MoLineProdAttributesModel(delDates, destinations, styles, products, coNumbers, null)

  }

  async getMoSubLineAttrsBySubLineId(moNumber: string, moLineNumber: string, productName: string, subLineId: number, companyCode: string, unitCode: string): Promise<SI_MoProdSubLineAttr> {
    const query = await this.createQueryBuilder('moInfo')
      .select("moPsl.delivery_date as delDate,moPsl.destination as destination,  moInfo.style as style,moPsl.product_name as prodName,moPsl.product_code as prodCode,moPsl.product_type as prodType, moInfo.coNumber as co,moPsl.fg_color  as color,moPsl.size as size,moPsl.quantity as qty,moPsl.ext_ref_number1 as refNo,moPsl.mo_number as moNumber,moPsl.mo_line_number as moLineNumber,moPsl.buyer_po as buyerPo")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moPsl.id = '${subLineId}'`)
      .getRawMany();
    const totalQuantity = query.reduce((accum, curr) => accum + parseFloat(curr.qty), 0);
    return new SI_MoProdSubLineAttr(query[0]?.destination, query[0]?.delDate, query[0]?.vpo, query[0]?.prodName, query[0]?.co, query[0]?.style, query[0]?.color, query[0]?.delDate?.size, totalQuantity, query[0]?.refNo, query[0]?.moNumber, query[0]?.moLineNumber,query[0].buyerPo);

  }




  //helper methods for getOrderInfoByManufacturingOrderProductCodeFgColor

  async getMoAttributesByManufacturingOrderNoProductCodeFgColor(moNumber: string, productCode: string, fgColor: string, unitCode: string, companyCode: string): Promise<SI_MoAttributesModel> {

    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT moPsl.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moInfo.mo_number = '${moNumber}' AND moPsl.product_code = '${productCode}' AND moPsl.fg_color = '${fgColor}'`)
      .getRawMany();


    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query.forEach(r => {
      delDates.push(...r.delDates?.split(','));
      destinations?.push(...r?.destinations?.split(','));
      styles?.push(...r?.styles?.split(','));
      products?.push(...r?.products?.split(','));
      coNumbers?.push(...r?.coNumbers?.split(','));
    });


    return new SI_MoAttributesModel(delDates, destinations, styles, products, coNumbers, []);
  }

  async getMoLineAttrsByMOLineNumberProductCodeFgColor(moNumber: string, productCode: string, fgColor: string, moLineNumber: string, companyCode: string, unitCode: string): Promise<SI_MoLineAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT moPsl.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moInfo.mo_number = '${moNumber}' AND moPsl.mo_line_number = '${moLineNumber}' AND  moPsl.product_code = '${productCode}' AND moPsl.fg_color = '${fgColor}'`)
      .getRawMany();
    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query?.forEach(r => {
      delDates?.push(...r?.delDates?.split(','));
      destinations?.push(...r?.destinations?.split(','));
      styles?.push(...r?.styles?.split(','));
      products?.push(...r?.products?.split(','));
      coNumbers?.push(...r?.coNumbers?.split(','));
    });
    return new SI_MoLineAttributesModel(delDates, destinations, styles, products, coNumbers, []);
  }

  async getMoLineProdAttrsByMoProdNameProductCodeFgColor(moNumber: string, moLineNumber: string, productName: string, productCode: string, fgColor: string, companyCode: string, unitCode: string): Promise<SI_MoLineProdAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT moPsl.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moInfo.mo_number = '${moNumber}' AND moPsl.mo_line_number = '${moLineNumber}' AND slp.product_name = '${productName}' AND moPsl.product_code = '${productCode}' AND moPsl.fg_color = '${fgColor}'`)
      .getRawMany();
    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query.forEach(r => {
      delDates.push(...r.delDates?.split(','));
      destinations.push(...r.destinations?.split(','));
      styles.push(...r.styles?.split(','));
      products.push(...r.products?.split(','));
      coNumbers.push(...r.coNumbers?.split(','));
    });
    return new SI_MoLineProdAttributesModel(delDates, destinations, styles, products, coNumbers, null)

  }

  async getMoSubLineAttrsBySubLineIdProductCodeFgColor(moNumber: string, moLineNumber: string, productName: string, subLineId: number, companyCode: string, unitCode: string): Promise<SI_MoProdSubLineAttr> {
    const query = await this.createQueryBuilder('moInfo')
      .select("moPsl.delivery_date as delDate,moPsl.destination as destination,  moInfo.style as style,moPsl.product_name as prodName,moPsl.product_code as prodCode,moPsl.product_type as prodType, moInfo.customer_order_no as co,moPsl.fg_color  as color,moPsl.size as size,moPsl.quantity as qty,moPsl.ext_ref_number1 as refNo,moPsl.mo_number as moNumber,moPsl.mo_line_number as moLineNumber,moPsl.buyer_po as buyerPo ")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moPsl.id = '${subLineId}'`)
      .getRawMany();
    const totalQuantity = query.reduce((accum, curr) => accum + parseFloat(curr.qty), 0);
    return new SI_MoProdSubLineAttr(query[0]?.destination, query[0]?.delDate, query[0]?.vpo, query[0]?.prodName, query[0]?.co, query[0]?.style, query[0]?.color, query[0]?.delDate?.size, totalQuantity, query[0]?.refNo, query[0]?.moNumber, query[0]?.moLineNumber,query[0].buyerPo)

  }


  async getMosByPslIds(pslIds: number[], companyCode: string, unitCode: string): Promise<MoInfoEntity[]> {
    const query = await this.createQueryBuilder('moInfo')
      .select()
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number')
      .where('moInfo.company_code = :companyCode AND moInfo.unit_code = :unitCode AND moPsl.id IN (:...pslIds)', { companyCode, unitCode, pslIds })
      .getMany();

    return query;
  }


  async getMoLineAttrsByPslIds(pslIds: number[], companyCode: string, unitCode: string): Promise<SI_MoLineAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT moPsl.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moPsl.id IN (${pslIds.join(',')})`)
      .getRawMany();
    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query?.forEach(r => {
      delDates?.push(...r?.delDates?.split(','));
      destinations?.push(...r?.destinations?.split(','));
      styles?.push(...r?.styles?.split(','));
      products?.push(...r?.products?.split(','));
      coNumbers?.push(...r?.coNumbers?.split(','));
    });
    return new SI_MoLineAttributesModel(delDates, destinations, styles, products, coNumbers, []);
  }


  async getMoLineProdAttrsByPslIds(pslIds: number[], companyCode: string, unitCode: string): Promise<SI_MoLineProdAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT moPsl.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moPsl.id IN (${pslIds.join(',')})`)
      .getRawMany();
    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query.forEach(r => {
      delDates.push(...r.delDates?.split(','));
      destinations.push(...r.destinations?.split(','));
      styles.push(...r.styles?.split(','));
      products.push(...r.products?.split(','));
      coNumbers.push(...r.coNumbers?.split(','));
    });
    return new SI_MoLineProdAttributesModel(delDates, destinations, styles, products, coNumbers, null)

  }

  async getMoAttributesByPslIds(moNumber: string, pslIds: number[], unitCode: string, companyCode: string): Promise<SI_MoAttributesModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select("GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT moPsl.destination) as destinations, GROUP_CONCAT(DISTINCT moInfo.style) as styles, GROUP_CONCAT(DISTINCT slp.product_name) as products,GROUP_CONCAT(DISTINCT moInfo.coNumber) as coNumbers")
      .leftJoin(MoLineProductEntity, 'slp', "slp.company_code = moInfo.company_code AND slp.unit_code = moInfo.unit_code AND slp.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(` moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moInfo.mo_number = '${moNumber}' AND moPsl.id IN (${pslIds.join(',')})`)
      .getRawMany();


    const delDates: string[] = [];
    const destinations: string[] = [];
    const styles: string[] = [];
    const products: string[] = [];
    const coNumbers: string[] = [];

    query.forEach(r => {
      delDates.push(...r?.delDates?.split(','));
      destinations?.push(...r?.destinations?.split(','));
      styles?.push(...r?.styles?.split(','));
      products?.push(...r?.products?.split(','));
      coNumbers?.push(...r?.coNumbers?.split(','));
    });


    return new SI_MoAttributesModel(delDates, destinations, styles, products, coNumbers, []);
  }

  async getMoDataBySoForSoSummary(soNumber: string, unitCode: string, companyCode: string): Promise<MoDataForSoSummaryModel[]> {
    try {
      const query = await this.createQueryBuilder('moi')
        .select(['moi.mo_number AS moNumber', 'mopsl.so_number AS soNumber', 'mol.id AS moLineId', 'mol.mo_line_number AS moLine', 'mopsl.so_line_number AS soLine', 'mopl.id AS moProdId', 'mopsl.product_name AS productName', 'mopsl.product_code AS productCode', 'mopsl.product_type AS productType', 'mopsl.fg_color AS fgColor', 'mopsl.size AS size', 'SUM(mopsl.quantity) AS moSlQty', 'GROUP_CONCAT(DISTINCT mopsl.id ORDER BY mopsl.id) AS moPslIds'])
        .leftJoin(MoLineEntity, 'mol', 'mol.mo_id = moi.id')
        .leftJoin(MoLineProductEntity, 'mopl', 'mopl.mo_line_id = mol.id')
        .leftJoin(MoProductSubLineEntity, 'mopsl', 'mopsl.mo_line_product_id = mopl.id')
        .where('moi.mo_number = :soNumber AND moi.unit_code = :unitCode AND moi.company_code = :companyCode', { soNumber, unitCode, companyCode })
        .groupBy('moi.mo_number, mopsl.product_name, mol.id, mopsl.size')
        .getRawMany();
      console.log('Query Result:', query.length, 'records fetched');
      return query.map((row) => {
        const moPslIds = row.moPslIds ? row.moPslIds.split(',').map((id: string) => parseInt(id, 10)).filter(Number.isFinite) : [];

        return new MoDataForSoSummaryModel(moPslIds, parseFloat(row.moSlQty), row.moLineId, row.moProdId, row.size, row.fgColor, row.productName, row.moNumber, row.soNumber, row.soLine, row.moLine);
      });

    } catch (error) {
      console.error('Error in getMoDataBySoForSoSummary:', error);
      throw new Error('Failed to fetch MO data.');
    }
  }

  async getMoInfoByStatusForOrderSummaries(companyCode: string, unitCode: string, confirmed: number, moProgressStatus: number): Promise<SI_ManufacturingOrderInfoModel[]> {
    const query = this.createQueryBuilder('moInfo')
      .select(`mo_number as moNumber,id as moPk,is_confirmed as confirmed,style as style`)
      .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_confirmed = ${confirmed} AND mo_progress_status=${moProgressStatus}`)
      .orderBy('updated_at', 'ASC')

    const result: SI_ManufacturingOrderInfoModel[] = await query.getRawMany();

    return result;
  }

  async getMoInfoHeader(monumber: string, companyCode: string, unitCode: string): Promise<MOHeaderInfoModel[]> {
    const query = await this.createQueryBuilder('moInfo')
      .select(`
      moInfo.style as style,
      moInfo.style_description as styleDesc,
      GROUP_CONCAT(DISTINCT mpse.buyer_po) as buyerPo,
      moInfo.customer_name as customerName,
      moInfo.profit_center_name as profitCentreName,
      moInfo.plant_style_ref as plantStyleRef,
      GROUP_CONCAT(DISTINCT mle.mo_line_number) as moLines,
      GROUP_CONCAT(DISTINCT mpse.product_type) as productTypes,
      GROUP_CONCAT(DISTINCT mpse.product_code) as productCodes,
      GROUP_CONCAT(DISTINCT mpse.delivery_date) as delDates,
      GROUP_CONCAT(DISTINCT mpse.destination) as destinations,
      GROUP_CONCAT(DISTINCT mpse.fgColor) as fgColors,
      GROUP_CONCAT(DISTINCT mpse.size) as sizes,
      GROUP_CONCAT(DISTINCT mpse.so_number) as soNumbers
    `)
      .leftJoin(MoLineEntity, 'mle', "mle.company_code = moInfo.company_code AND mle.unit_code = moInfo.unit_code AND mle.mo_number = moInfo.mo_number")
      .leftJoin(MoProductSubLineEntity, 'mpse', "mpse.company_code = moInfo.company_code AND mpse.unit_code = moInfo.unit_code AND mpse.mo_number = moInfo.mo_number")
      .where(`moInfo.mo_number = '${monumber}' AND moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}'`)
      .groupBy('moInfo.mo_number, mpse.product_type')
      .getRawMany();

    const formattedResult: MOHeaderInfoModel[] = query.map(row => ({
      ...row,
      moLines: row.moLines ? row.moLines.split(',') : [],
      productTypes: row.productTypes ? row.productTypes.split(',') : [],
      productCodes: row.productCodes ? row.productCodes.split(',') : [],
      delDates: row.delDates ? row.delDates.split(',') : [],
      destinations: row.destinations ? row.destinations.split(',') : [],
      fgColors: row.fgColors ? row.fgColors.split(',') : [],
      sizes: row.sizes ? row.sizes.split(',') : [],
      soNumbers: row.soNumbers ? row.soNumbers.split(',') : [],
    }));

    return formattedResult;
  }

  async getMoInfoByMoNumberForMoPreview(monumber: string, companyCode: string, unitCode: string): Promise<ManufacturingOrderPreviewData> {
    const query = this.createQueryBuilder('moInfo')
      .select('moInfo.mo_number as moNumber,moInfo.uploaded_date as uploadDate,moInfo.style as styleName, moInfo.customer_name as buyer, moInfo.customer_order_no as poNo, moInfo.style_code  as styleCode, moInfo.pack_method as packMethod,moInfo.is_confirmed as isMoConfirmed')
      .where(`moInfo.mo_number = '${monumber}' AND moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}'`)
      .getRawOne()

    return query
  }

  async getMoInfoByMoNumberForMoSummaryPreview(monumber: string, companyCode: string, unitCode: string): Promise<MoSummaryPreviewData> {

    const query = this.createQueryBuilder('moInfo')
      .select('moInfo.uploaded_date as uploadDate,moInfo.mo_number as moNumber,moInfo.style as styleName,moInfo.customer_order_no as poNo, moInfo.customer_name as buyerName,moInfo.customer_order_no as cpo,moInfo.ex_factory_date as deliveryDate,GROUP_CONCAT(DISTINCT moprod.product_type) as productType,GROUP_CONCAT(DISTINCT moprod.product_code) as productCodes,moInfo.mo_proceeding_status as isMoProceeded')
      .leftJoin(MoLineProductEntity, 'moprod', "moprod.company_code = moInfo.company_code AND moprod.unit_code = moInfo.unit_code AND moprod.mo_number = moInfo.mo_number")
      .where(`moInfo.mo_number = '${monumber}' AND moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}'`)
      .getRawOne()

    return query
  }


  async getRawOrderInfo(moNumber: string, unitCode: string, companyCode: string): Promise<RawOrderInfoModel> {
    const query = await this.createQueryBuilder('moInfo')
      .select(`
      moInfo.id as orderIdPk,
      moInfo.mo_number as orderNo ,
      GROUP_CONCAT(DISTINCT moPsl.buyer_po) as purOrdNo, 
      GROUP_CONCAT(DISTINCT moPsl.product_type) as prodType,
      moInfo.style as style,
      moInfo.customer_styles_design_no as customerStyle,
      moInfo.customer_order_no as customerOrderNo,
      moInfo.customer_name as buyerName,
      GROUP_CONCAT(DISTINCT moPsl.size) as sizes,
      moInfo.is_confirmed as moConfirmed, 
      GROUP_CONCAT(DISTINCT moPsl.buyer_po) as buyerPo, 
      moInfo.plant_style_ref as plantStyle,
      GROUP_CONCAT(DISTINCT moPsl.plan_cut_date) as plannedCutDate,
      SUM(moPsl.quantity) AS quantity
      `)
      .leftJoin(MoProductSubLineEntity, 'moPsl', "moPsl.company_code = moInfo.company_code AND moPsl.unit_code = moInfo.unit_code AND moPsl.mo_number = moInfo.mo_number")
      .where(`moInfo.mo_number = '${moNumber}' AND moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}'`)
      .getRawOne()

    return query

  }


  async getRawOrderLinesInfo(moNumber: string, unitCode: string, companyCode: string): Promise<RawOrderLineInfoModel[]> {

    const query = await this.createQueryBuilder('moInfo')
      .select(`
      moLine.id as orderLineId,
      moLine.mo_line_number as orderLineNo ,
      GROUP_CONCAT(DISTINCT moPsl.fg_color) as fgColor, 
      GROUP_CONCAT(DISTINCT moPsl.delivery_date) as delDate,
      GROUP_CONCAT(DISTINCT moPsl.destination) as dest,
      moInfo.ex_factory_date as exFactory,
      GROUP_CONCAT(DISTINCT moPsl.product_type) as prodType,
      GROUP_CONCAT(DISTINCT moPsl.product_code) as productCode,
      GROUP_CONCAT(DISTINCT moPsl.size) as sizes,
      GROUP_CONCAT(DISTINCT moPsl.buyer_po) as buyerPo, 
      GROUP_CONCAT(DISTINCT moPsl.product_name) as productName,
      GROUP_CONCAT(DISTINCT moPsl.plan_cut_date) as plannedCutDate,
      GROUP_CONCAT(DISTINCT moPsl.plan_prod_date) as plannedProductionDate,
      SUM(moPsl.quantity) AS quantity,
      moLine.mo_id as parentId
      `)
      .leftJoin(MoLineEntity, 'moLine', 'moLine.mo_id = moInfo.id')
      .leftJoin(MoLineProductEntity, 'moLiPr', 'moLiPr.mo_line_id = moLine.id')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.mo_line_product_id = moLiPr.id')
      .where(`moInfo.mo_number = '${moNumber}' AND moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}'`)
      .groupBy('moLine.id')
      .getRawMany()

    return query

  }


  async getRawOrderLineSubLinesInfoByLineId(moLineId: number, moNumber: string, unitCode: string, companyCode: string): Promise<RawOrderSubLineInfoModel[]> {


    const query = await this.createQueryBuilder('moInfo')
      .select(`
      moLine.id as orderLineId,
      moPsl.id as orderSubLineId,
      moPsl.product_code as productCode,
      moPsl.fg_color as fgColor, 
      moPsl.size as size,
      moPsl.quantity as quantity,
      moPsl.schedule as schedule,
      moPsl.mo_number as extSysRefNo
      `)
      .leftJoin(MoLineEntity, 'moLine', 'moLine.mo_id = moInfo.id')
      .leftJoin(MoLineProductEntity, 'moLiPr', 'moLiPr.mo_line_id = moLine.id')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.mo_line_product_id = moLiPr.id')
      .where(`moInfo.mo_number = '${moNumber}' AND moInfo.company_code = '${companyCode}' AND moInfo.unit_code = '${unitCode}' AND moLine.id = '${moLineId}'`)
      .groupBy('moPsl.id')
      .getRawMany()

    return query

  }
}