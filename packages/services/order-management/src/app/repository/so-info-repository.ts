import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { SoInfoEntity } from "../entity/so-info-entity";
import { SaleOrderPreviewData, SI_SaleOrderInfoAbstractModel, SI_SaleOrderInfoModel, SI_SoAttributesModel, SI_SoLineAttributesModel, SI_SoLineProdAttributesModel, SI_SoProdSubLineAttr, SOHeaderInfoModel } from "@xpparel/shared-models";
import { SoLineProductEntity } from "../entity/so-line-product.entity";
import { SoProductSubLineEntity } from "../entity/so-product-sub-line.entity";
import { SoLineEntity } from "../entity/so-line.entity";

@Injectable()
export class SoInfoRepository extends Repository<SoInfoEntity> {
    constructor(private dataSource: DataSource) {
        super(SoInfoEntity, dataSource.createEntityManager());
    }

    async getSaleOrdersList(companyCode: string, unitCode: string): Promise<SI_SaleOrderInfoAbstractModel[]> {
        const query = this.createQueryBuilder('soInfo')
            .select(`so_number as soNumber,id as soPk, is_confirmed as confirmed, style_code as style,so_progress_status as soProgressStatus, so_creation_date as soCreationDate`)
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}'`)
            .orderBy('updated_at', 'ASC')
        const result: SI_SaleOrderInfoAbstractModel[] = await query.getRawMany();

        return result;
    }

    async getSaleOrderInfoByStatus(companyCode: string, unitCode: string, confirmed: boolean): Promise<SI_SaleOrderInfoModel[]> {
        const confirm = confirmed ? 1 : 0
        const query = this.createQueryBuilder('soInfo')
            .select(`so_number as soNumber,id as soPk,is_confirmed as confirmed,style as style`)
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_confirmed = ${confirm}`)
            .orderBy('updated_at', 'ASC')
        const result: SI_SaleOrderInfoModel[] = await query.getRawMany();

        return result;
    }


    async getSoAttributesBySaleOrderNo(soNumber: string, unitCode: string, companyCode: string): Promise<SI_SoAttributesModel> {
        const query = await this.createQueryBuilder('soInfo')
            .select("GROUP_CONCAT(DISTINCT soPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT soPsl.destination) as destinations, GROUP_CONCAT(DISTINCT soInfo.style) as styles, GROUP_CONCAT(DISTINCT slp.product_name) as products,GROUP_CONCAT(DISTINCT soInfo.coNumber) as coNumbers")
            .leftJoin(SoLineProductEntity, 'slp', "slp.company_code = soInfo.company_code AND slp.unit_code = soInfo.unit_code AND slp.so_number = soInfo.so_number")
            .leftJoin(SoProductSubLineEntity, 'soPsl', "soPsl.company_code = soInfo.company_code AND soPsl.unit_code = soInfo.unit_code AND soPsl.so_number = soInfo.so_number")
            .where(` soInfo.company_code = '${companyCode}' AND soInfo.unit_code = '${unitCode}' AND soInfo.so_number = '${soNumber}'`)
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


        return new SI_SoAttributesModel(delDates, destinations, styles, products, coNumbers, []);
    }


    async getSoLineAttrsBySOLineNumber(soNumber: string, soLineNumber: string, companyCode: string, unitCode: string): Promise<SI_SoLineAttributesModel> {
        const query = await this.createQueryBuilder('soInfo')
            .select("GROUP_CONCAT(DISTINCT soPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT soPsl.destination) as destinations, GROUP_CONCAT(DISTINCT soInfo.style) as styles, GROUP_CONCAT(DISTINCT slp.product_name) as products,GROUP_CONCAT(DISTINCT soInfo.coNumber) as coNumbers")
            .leftJoin(SoLineProductEntity, 'slp', "slp.company_code = soInfo.company_code AND slp.unit_code = soInfo.unit_code AND slp.so_number = soInfo.so_number")
            .leftJoin(SoProductSubLineEntity, 'soPsl', "soPsl.company_code = soInfo.company_code AND soPsl.unit_code = soInfo.unit_code AND soPsl.so_number = soInfo.so_number")
            .where(` soInfo.company_code = '${companyCode}' AND soInfo.unit_code = '${unitCode}' AND soInfo.so_number = '${soNumber}' AND soPsl.so_line_number = '${soLineNumber}'`)
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

        return new SI_SoLineAttributesModel(delDates, destinations, styles, products, coNumbers, []);
    }

    async getSoLineProdAttrsBySoProdName(soNumber: string, soLineNumber: string, productName: string, companyCode: string, unitCode: string): Promise<SI_SoLineProdAttributesModel> {
        const query = await this.createQueryBuilder('soInfo')
            .select("GROUP_CONCAT(DISTINCT soPsl.delivery_date) as delDates,GROUP_CONCAT(DISTINCT soPsl.destination) as destinations, GROUP_CONCAT(DISTINCT soInfo.style) as styles, GROUP_CONCAT(DISTINCT slp.product_name) as products,GROUP_CONCAT(DISTINCT soInfo.coNumber) as coNumbers")
            .leftJoin(SoLineProductEntity, 'slp', "slp.company_code = soInfo.company_code AND slp.unit_code = soInfo.unit_code AND slp.so_number = soInfo.so_number")
            .leftJoin(SoProductSubLineEntity, 'soPsl', "soPsl.company_code = soInfo.company_code AND soPsl.unit_code = soInfo.unit_code AND soPsl.so_number = soInfo.so_number")
            .where(` soInfo.company_code = '${companyCode}' AND soInfo.unit_code = '${unitCode}' AND soInfo.so_number = '${soNumber}' AND soPsl.so_line_number = '${soLineNumber}' AND slp.product_name = '${productName}'`)
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
        return new SI_SoLineProdAttributesModel(delDates, destinations, styles, products, coNumbers, null)

    }

    async getSoSubLineAttrsBySubLineId(subLineId: number, companyCode: string, unitCode: string): Promise<SI_SoProdSubLineAttr> {
        const query = await this.createQueryBuilder('soInfo')
            .select("soPsl.delivery_date as delDate,soPsl.destination as destination,  soInfo.style as style,soPsl.product_name as prodName, soInfo.coNumber as co,soPsl.fg_color  as color,soPsl.size as size,soPsl.quantity as qty,soPsl.ext_ref_number1 as refNo,soPsl.buyer_po as buyerPo,soPsl.product_code as productCode,soPsl.style_code as styleCode")
            .leftJoin(SoProductSubLineEntity, 'soPsl', "soPsl.company_code = soInfo.company_code AND soPsl.unit_code = soInfo.unit_code AND soPsl.so_number = soInfo.so_number")
            .where(` soInfo.company_code = '${companyCode}' AND soInfo.unit_code = '${unitCode}' AND soPsl.id = '${subLineId}'`)
            .getRawMany();
        const totalQuantity = query.reduce((accum, curr) => accum + parseFloat(curr.qty), 0);
        return new SI_SoProdSubLineAttr(query[0]?.destination, query[0]?.delDate, query[0]?.vpo, query[0]?.prodName, query[0]?.co, query[0]?.style, query[0]?.color, query[0]?.delDate?.size, totalQuantity, query[0]?.refNo, query[0]?.buyerPo)

    }

    async getSoInfoHeader(sonumber: string, companyCode: string, unitCode: string): Promise<SOHeaderInfoModel[]> {
        const query = await this.createQueryBuilder('soInfo')
            .select(`
            soInfo.style as style,
            soInfo.style_description as styleDesc,
            GROUP_CONCAT(DISTINCT spse.buyer_po) as buyerPo,
            soInfo.customer_name as customerName,
            soInfo.profit_center_name as profitCentreName,
            soInfo.plant_style_ref as plantStyleRef,
            GROUP_CONCAT(DISTINCT sle.so_line_number) as moLines,
            GROUP_CONCAT(DISTINCT spse.product_type) as productTypes
          `)
            .leftJoin(SoLineEntity, 'sle', "sle.company_code = soInfo.company_code AND sle.unit_code = soInfo.unit_code AND sle.so_number = soInfo.so_number")
            .leftJoin(SoProductSubLineEntity, 'spse', "spse.company_code = soInfo.company_code AND spse.unit_code = soInfo.unit_code AND spse.so_number = soInfo.so_number")
            .where(`soInfo.so_number = '${sonumber}' AND soInfo.company_code = '${companyCode}' AND soInfo.unit_code = '${unitCode}'`)
            .groupBy('soInfo.so_number, spse.product_type')
            .getRawMany();

        const formattedResult: SOHeaderInfoModel[] = query.map(row => ({
            ...row,
            soLines: row.soLines ? row.soLines.split(',') : [],
            buyerPo: row.buyerPo ? row.buyerPo.split(',') : [],
            productTypes: row.productTypes ? row.productTypes.split(',') : [],
        }));

        return formattedResult;
    }


    async getSoInfoBySoNumberForSoPreview(soNumber: string, companyCode: string, unitCode: string): Promise<SaleOrderPreviewData> {
        const query = this.createQueryBuilder('soInfo')
            .select('soInfo.so_number as soNumber,soInfo.uploaded_date as uploadDate,soInfo.style_name as styleName, soInfo.customer_name as buyerName,soInfo.customer_order_no as coNumber, soInfo.customer_order_no as poNo, soInfo.style_code  as styleCode, soInfo.pack_method as packMethod, soInfo.is_confirmed as isSoConfirmed')
            .where(`soInfo.so_number = '${soNumber}' AND soInfo.company_code = '${companyCode}' AND soInfo.unit_code = '${unitCode}'`)
            .getRawOne()

        return query
    }

}