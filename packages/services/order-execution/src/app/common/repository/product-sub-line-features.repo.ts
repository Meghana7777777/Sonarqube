import { Injectable, Query } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductSubLineFeaturesEntity } from "../entities/product-sub-line-features-entity";
import { KnitHeaderInfoModel, KnitHeaderInfoResoponse, OrderFeatures, ProcessTypeEnum } from "@xpparel/shared-models";

@Injectable()
export class ProductSubLineFeaturesRepository extends Repository<ProductSubLineFeaturesEntity> {
    constructor(private dataSource: DataSource) {
        super(ProductSubLineFeaturesEntity, dataSource.createEntityManager());
    }

    /**
     * Repo method to get Features for given MO Sub Line Ids 
     * @param moProductSubLineIds 
     * @param processingSerial 
     * @param processingType 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getFeaturesForGivenMoSubLineIds(moProductSubLineIds: number[], processingSerial: number, processingType: ProcessTypeEnum, unitCode: string, companyCode: string): Promise<OrderFeatures> {
        const queryResult = await this.createQueryBuilder("pslf")
            .select([
                "GROUP_CONCAT(DISTINCT pslf.mo_number) AS moNumber",
                "GROUP_CONCAT(DISTINCT pslf.mo_line_number) AS moLineNumber",
                "GROUP_CONCAT(DISTINCT pslf.mo_product_sub_line_id) AS moOrderSubLineNumber",
                "GROUP_CONCAT(DISTINCT pslf.delivery_date) AS planDeliveryDate",
                "GROUP_CONCAT(DISTINCT pslf.plan_prod_date) AS planProductionDate",
                "GROUP_CONCAT(DISTINCT pslf.plan_cut_date) AS planCutDate",
                "GROUP_CONCAT(DISTINCT pslf.co_number) AS coNumber",
                "pslf.style_name AS styleName",
                "pslf.style_description AS styleDescription",
                "GROUP_CONCAT(DISTINCT pslf.business_head) AS businessHead",
                "GROUP_CONCAT(DISTINCT pslf.mo_creation_date) AS moCreationDate",
                "GROUP_CONCAT(DISTINCT pslf.mo_closed_date) AS moClosedDate",
                "GROUP_CONCAT(DISTINCT pslf.ex_factory_date) AS exFactoryDate",
                "GROUP_CONCAT(DISTINCT pslf.schedule) AS schedule",
                "GROUP_CONCAT(DISTINCT pslf.z_feature) AS zFeature",
                "GROUP_CONCAT(DISTINCT pslf.style_code) AS styleCode",
                "GROUP_CONCAT(DISTINCT pslf.customer_name) AS customerName",
                "pslf.oq_type AS oqType"
            ])
            .where("pslf.mo_product_sub_line_id IN (:...moProductSubLineIds)", { moProductSubLineIds })
            .andWhere("pslf.processing_serial = :processingSerial", { processingSerial })
            .andWhere("pslf.process_type = :processingType", { processingType })
            .andWhere(`pslf.unit_code = '${unitCode}' AND pslf.company_code = '${companyCode}'`)
            .groupBy("pslf.style_name, pslf.style_description")
            .getRawOne();

        return new OrderFeatures(
            queryResult?.moNumber?.split(",") || [],
            queryResult?.moLineNumber?.split(",") || [],
            queryResult?.moOrderSubLineNumber?.split(",") || [],
            queryResult?.planDeliveryDate?.split(",") || [],
            queryResult?.planProductionDate?.split(",") || [],
            queryResult?.planCutDate?.split(",") || [],
            queryResult?.coNumber?.split(",") || [],
            queryResult?.styleName || "",
            queryResult?.styleDescription || "",
            queryResult?.businessHead?.split(",") || [],
            queryResult?.moCreationDate?.split(",") || [],
            queryResult?.moClosedDate?.split(",") || [],
            queryResult?.exFactoryDate?.split(",") || [],
            queryResult?.schedule?.split(",") || [],
            queryResult?.zFeature?.split(",") || [],
            queryResult?.styleCode?.split(",") || [],
            queryResult?.customerName?.split(",") || [],
            queryResult?.oqType || ""
        );
    }

    async getMoHeaderInfoData(processingSerial: number, companyCode: string, unitCode: string): Promise<KnitHeaderInfoModel> {
        const [raw] = await this.createQueryBuilder('pslf')
            .select([
                'GROUP_CONCAT(DISTINCT pslf.style_name) AS style',
                'GROUP_CONCAT(DISTINCT pslf.style_description) AS styleDesc',
                'GROUP_CONCAT(DISTINCT pslf.co_number) AS buyerPo',
                'GROUP_CONCAT(DISTINCT pslf.customer_code) AS customerName',
                'GROUP_CONCAT(DISTINCT pslf.mo_line_id) AS moLines',
                'GROUP_CONCAT(DISTINCT pslf.profit_center_name) AS profitCentreName',
                'GROUP_CONCAT(DISTINCT pslf.product_code) AS productTypes',
                'GROUP_CONCAT(DISTINCT pslf.style_code) AS plantStyleRef'
            ])
            .where('pslf.processing_serial = :processingSerial', { processingSerial })
            .andWhere(`pslf.unit_code = '${unitCode}' AND pslf.company_code = '${companyCode}'`)

            .getRawMany();

        const model = new KnitHeaderInfoModel(
            raw?.style?.split(',') ?? [],
            raw?.styleDesc?.split(',') ?? [],
            raw?.buyerPo?.split(',') ?? [],
            raw?.customerName?.split(',') ?? [],
            raw?.moLines?.split(',') ?? [],
            raw?.profitCentreName?.split(',') ?? [],
            raw?.productTypes?.split(',') ?? [],
            raw?.plantStyleRef?.split(',') ?? [],
            [],
            [],
            [],
            [],
            []
        );

        return model;
    }

    async getHeaderInfoForProcSerial(processingSerial: number, companyCode: string, unitCode: string): Promise<KnitHeaderInfoModel> {
        const [raw] = await this.createQueryBuilder('pslf')
            .select([
                'GROUP_CONCAT(DISTINCT pslf.style_name) AS style',
                'GROUP_CONCAT(DISTINCT pslf.style_description) AS styleDesc',
                'GROUP_CONCAT(DISTINCT pslf.co_number) AS buyerPo',
                'GROUP_CONCAT(DISTINCT pslf.customer_code) AS customerName',
                'GROUP_CONCAT(DISTINCT pslf.mo_line_id) AS moLines',
                'GROUP_CONCAT(DISTINCT pslf.profit_center_name) AS profitCentreName',
                'GROUP_CONCAT(DISTINCT pslf.product_code) AS productTypes',
                'GROUP_CONCAT(DISTINCT pslf.style_code) AS plantStyleRef',
                'GROUP_CONCAT(DISTINCT pslf.product_code) as productCodes',
                'GROUP_CONCAT(DISTINCT pslf.delivery_date) as delDates',
                'GROUP_CONCAT(DISTINCT pslf.destination) as destinations',
                'GROUP_CONCAT(DISTINCT pslf.fgColor) as fgColors',
                'GROUP_CONCAT(DISTINCT pslf.size) as sizes',
                'GROUP_CONCAT(DISTINCT pslf.mo_number) as moNumbers'
            ])
            .where('pslf.processing_serial = :processingSerial', { processingSerial })
            .andWhere(`pslf.unit_code = '${unitCode}' AND pslf.company_code = '${companyCode}'`)
            .getRawMany();

        const model = new KnitHeaderInfoModel(
            raw?.style?.split(',') ?? [],
            raw?.styleDesc?.split(',') ?? [],
            raw?.buyerPo?.split(',') ?? [],
            raw?.customerName?.split(',') ?? [],
            raw?.moLines?.split(',') ?? [],
            raw?.profitCentreName?.split(',') ?? [],
            raw?.productTypes?.split(',') ?? [],
            raw?.plantStyleRef?.split(',') ?? [],
            raw?.productCodes?.split(','),
            raw?.delDates?.split(','),
            raw?.destinations?.split(','),
            raw?.fgColors?.split(','),
            raw?.sizes?.split(','),
            raw?.moNumbers?.split(','),
        );

        return model;
    }


}