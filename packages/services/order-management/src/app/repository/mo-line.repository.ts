import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MoLineEntity } from "../entity/mo-line.entity";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { MoPreviewColorWiseSizes, MoPreviewMoLine, MoPreviewSizeWiseQuantities, MOSummaryColorSizes } from "@xpparel/shared-models";
@Injectable()
export class MoLineRepository extends Repository<MoLineEntity> {
  constructor(private dataSource: DataSource) {
    super(MoLineEntity, dataSource.createEntityManager());
  }

  async getMoLinesByPslIds(pslIds: number[], companyCode: string, unitCode: string): Promise<MoLineEntity[]> {
    const query = await this.createQueryBuilder('moLine')
      .select()
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moLine.company_code AND moPsl.unit_code = moLine.unit_code AND moPsl.mo_number = moLine.mo_number AND moPsl.mo_line_number = moLine.mo_line_number')
      .where('moLine.company_code = :companyCode AND moLine.unit_code = :unitCode AND moPsl.id IN (:...pslIds)', { companyCode, unitCode, pslIds })
      .getMany();

    return query;
  }


  async getMoLinesByProductCodeFgColor(moNumber: string, productCode: string, fgColor: string, companyCode: string, unitCode: string) {
    const query = await this.createQueryBuilder('moLine')
      .select('moLine.mo_line_number as moLineNumber ,moLine.id as id')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moLine.company_code AND moPsl.unit_code = moLine.unit_code AND moPsl .mo_number = moLine.mo_number AND moPsl.mo_line_number = moLine.mo_line_number ')
      .where('moLine.company_code = :companyCode AND moLine.unit_code = :unitCode AND moLine.mo_number = :moNumber AND moPsl.product_code = :productCode AND moPsl.fg_color = :fgColor', { companyCode, unitCode, moNumber, productCode, fgColor })
      .groupBy('moLine.id')
      .getRawMany();

    return query
  }

  async getMoLineInfoForMoPreview(moNumber: string, companyCode: string, unitCode: string): Promise<MoPreviewMoLine[]> {
    const query = this.createQueryBuilder('moLine')
      .select('moLine.mo_line_number as moLineNumber,GROUP_CONCAT(DISTINCT moPsl.product_code) as productCode,GROUP_CONCAT(DISTINCT moPsl.product_type) as productType,GROUP_CONCAT(DISTINCT moPsl.destination) as destination,GROUP_CONCAT(DISTINCT moPsl.delivery_date) as deliveryDate,GROUP_CONCAT(DISTINCT moPsl.z_feature) as zFeature')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moLine.company_code AND moPsl.unit_code = moLine.unit_code AND moPsl.mo_number = moLine.mo_number AND moPsl.mo_line_number = moLine.mo_line_number')
      .where('moLine.company_code = :companyCode AND moLine.unit_code = :unitCode AND moLine.mo_number = :moNumber', { companyCode, unitCode, moNumber })
      .groupBy('moLine.mo_line_number')
      .getRawMany();
    return query
  }

  async getUniqueColorsForTheLine(moNumber: string, moLineNumber: string, companyCode: string, unitCode: string):Promise<MoPreviewColorWiseSizes[]>{
    const query = this.createQueryBuilder('moLine')
      .select('DISTINCT moPsl.fg_color as color')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moLine.company_code AND moPsl.unit_code = moLine.unit_code AND moPsl.mo_number = moLine.mo_number AND moPsl.mo_line_number = moLine.mo_line_number')
      .where('moLine.company_code = :companyCode AND moLine.unit_code = :unitCode AND moLine.mo_number = :moNumber AND moLine.mo_line_number= :moLineNumber', { companyCode, unitCode, moNumber, moLineNumber })
      .getRawMany();


      return query
  }

  
  async getSizeWiseQuantsForColor(moNumber: string, moLineNumber: string,color:string, companyCode: string, unitCode: string):Promise<MoPreviewSizeWiseQuantities[]>{
    const query = this.createQueryBuilder('moLine')
      .select('moPsl.product_code as productCode, moPsl.size as size,moPsl.quantity as qty')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moLine.company_code AND moPsl.unit_code = moLine.unit_code AND moPsl.mo_number = moLine.mo_number AND moPsl.mo_line_number = moLine.mo_line_number')
      .where('moLine.company_code = :companyCode AND moLine.unit_code = :unitCode AND moLine.mo_number = :moNumber AND moLine.mo_line_number= :moLineNumber AND moPsl.fg_color = :color', { companyCode, unitCode, moNumber, moLineNumber,color})
      .getRawMany();

      return query
  }



  async getUniqueColorsForTheMo(moNumber: string, companyCode: string, unitCode: string):Promise<MOSummaryColorSizes[]>{
    const query = this.createQueryBuilder('moLine')
      .select('DISTINCT moPsl.fg_color as color')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moLine.company_code AND moPsl.unit_code = moLine.unit_code AND moPsl.mo_number = moLine.mo_number AND moPsl.mo_line_number = moLine.mo_line_number')
      .where('moLine.company_code = :companyCode AND moLine.unit_code = :unitCode AND moLine.mo_number = :moNumber', { companyCode, unitCode, moNumber })
      .getRawMany();


      return query
  }


  async getSizeWiseQuantsForColorAndMo(moNumber: string, color:string, companyCode: string, unitCode: string):Promise<MoPreviewSizeWiseQuantities[]>{
    console.log("Entering in this method")
    const query = this.createQueryBuilder('moLine')
      .select('moPsl.product_code as productCode, moPsl.size as size,moPsl.quantity as qty')
      .leftJoin(MoProductSubLineEntity, 'moPsl', 'moPsl.company_code = moLine.company_code AND moPsl.unit_code = moLine.unit_code AND moPsl.mo_number = moLine.mo_number AND moPsl.mo_line_number = moLine.mo_line_number')
      .where('moLine.company_code = :companyCode AND moLine.unit_code = :unitCode AND moLine.mo_number = :moNumber AND moPsl.fg_color = :color', { companyCode, unitCode, moNumber,color})
      .getRawMany();

      return query
  }
}
