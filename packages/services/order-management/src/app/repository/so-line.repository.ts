import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { SoLineEntity } from "../entity/so-line.entity";
import { SoPreviewColorWiseSizes, SoPreviewSizeWiseQuantities, SoPreviewSoLine } from "@xpparel/shared-models";
import { SoProductSubLineEntity } from "../entity/so-product-sub-line.entity";

@Injectable()
export class SoLineRepository extends Repository<SoLineEntity> {
    constructor(private dataSource: DataSource) {
        super(SoLineEntity, dataSource.createEntityManager());
    }

    async getSoLineInfoForSoPreview(soNumber: string, companyCode: string, unitCode: string): Promise<SoPreviewSoLine[]> {
        const query = this.createQueryBuilder('soLine')
            .select('soLine.so_line_number as soLineNumber,GROUP_CONCAT(DISTINCT soPsl.product_code) as productCode,GROUP_CONCAT(DISTINCT soPsl.product_type) as productType,GROUP_CONCAT(DISTINCT soPsl.destination) as destination,GROUP_CONCAT(DISTINCT soPsl.delivery_date) as deliveryDate,GROUP_CONCAT(DISTINCT soPsl.z_feature) as zFeature, GROUP_CONCAT(DISTINCT soPsl.buyer_po) as buyerPo')
            .leftJoin(SoProductSubLineEntity, 'soPsl', 'soPsl.company_code = soLine.company_code AND soPsl.unit_code = soLine.unit_code AND soPsl.so_number = soLine.so_number AND soPsl.so_line_number = soLine.so_line_number')
            .where('soLine.company_code = :companyCode AND soLine.unit_code = :unitCode AND soLine.so_number = :soNumber', { companyCode, unitCode, soNumber })
            .groupBy('soLine.so_line_number')
            .getRawMany();
        return query
    }

    async getUniqueColorsForTheLine(soNumber: string, soLineNumber: string, companyCode: string, unitCode: string): Promise<SoPreviewColorWiseSizes[]> {
        const query = this.createQueryBuilder('soLine')
            .select('DISTINCT soPsl.fg_color as color')
            .leftJoin(SoProductSubLineEntity, 'soPsl', 'soPsl.company_code = soLine.company_code AND soPsl.unit_code = soLine.unit_code AND soPsl.so_number = soLine.so_number AND soPsl.so_line_number = soLine.so_line_number')
            .where('soLine.company_code = :companyCode AND soLine.unit_code = :unitCode AND soLine.so_number = :soNumber AND soLine.so_line_number= :soLineNumber', { companyCode, unitCode, soNumber, soLineNumber })
            .getRawMany();


        return query
    }


    async getSizeWiseQuantsForColor(soNumber: string, soLineNumber: string,color:string, companyCode: string, unitCode: string):Promise<SoPreviewSizeWiseQuantities[]>{
        const query = this.createQueryBuilder('soLine')
          .select('soPsl.product_code as productCode, soPsl.size as size,soPsl.quantity as qty')
          .leftJoin(SoProductSubLineEntity, 'soPsl', 'soPsl.company_code = soLine.company_code AND soPsl.unit_code = soLine.unit_code AND soPsl.so_number = soLine.so_number AND soPsl.so_line_number = soLine.so_line_number')
          .where('soLine.company_code = :companyCode AND soLine.unit_code = :unitCode AND soLine.so_number = :soNumber AND soLine.so_line_number= :soLineNumber AND soPsl.fg_color = :color', { companyCode, unitCode, soNumber, soLineNumber,color})
          .getRawMany();
    
          return query
      }
}