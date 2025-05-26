import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { GroupedSewingJobFeatureResult, KnitHeaderInfoModel, OrderFeatures, PJ_BundlePropsModel, PJ_ProcessingSerialTypeAndFeatureGroupReq, ProcessTypeEnum, SewingCreationOptionsEnum } from "@xpparel/shared-models";
import { ProductSubLineFeaturesEntity } from "../product-sub-line-features-entity";

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
                "GROUP_CONCAT(DISTINCT pslf.customer_name) AS customerName"
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
            queryResult?.customerName?.split(",") || []
        );
    }


    /**
     * Service to get Mo Product sub line Ids for the given feature group
     * @param groupInfo 
     * @param unitCode 
     * @param companyCode 
     * @param processingSerial 
     * @returns 
    */
    async getMoProductSubLineIdsForFeatureGroup(groupInfo: { [key in SewingCreationOptionsEnum]?: string }, unitCode: string, companyCode: string, processingSerial: number) {
        let queryBuilder = this.createQueryBuilder('sub_line_features')
            .select(`DISTINCT mo_product_sub_line_id`)
            .where(`processing_serial = ${processingSerial} AND unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
        Object.keys(groupInfo).forEach((key) => {
            if (groupInfo[key as keyof typeof groupInfo]) {
                const actValue = groupInfo[key];
                queryBuilder = queryBuilder.andWhere(`${key} IN (${actValue.split(',').map(item => `'${item.trim()}'`).join(',')})`);
            }
        });
        const queryResult: { mo_product_sub_line_id: string }[] = await queryBuilder.getRawMany();
        const subLineIds = queryResult.map(each => Number(each.mo_product_sub_line_id));
        return subLineIds;
    }


    /**
    * Repository method to get grouped or distinct concatenated sewing job feature data
    * @param req SewingJobFeatureGroupReq object
    * @returns Array of grouped or distinct concatenated sewing job feature data including osl_ref_id
    */
    async getGroupedSewingJobFeatures(req: PJ_ProcessingSerialTypeAndFeatureGroupReq): Promise<GroupedSewingJobFeatureResult[]> {
        const queryBuilder = this.createQueryBuilder('sfg');
        // Check if specific options are selected
        if (req.groupOptions.length > 0) {
            // Dynamically create SELECT and GROUP BY based on options
            const selectedColumns = req.groupOptions.map(
                (option) =>
                    `${option} AS \`${option}\``
            );
            console.log(selectedColumns);
            // Include  GROUP_CONCAT(DISTINCT osl_ref_id)
            selectedColumns.push('GROUP_CONCAT(DISTINCT sfg.mo_product_sub_line_id) AS `mo_product_sub_line_id`');
            queryBuilder.select(selectedColumns.join(', '))
            queryBuilder.where('sfg.processing_serial = :processingSerial', { processingSerial: req.processingSerial });
            queryBuilder.andWhere(`unit_code = '${req.unitCode}' AND company_code = '${req.companyCode}'`)
            queryBuilder.groupBy(
                req.groupOptions
                    .map((option) => option)
                    .join(', ')
            );
        } else {
            // If no options are selected, select all columns with DISTINCT and GROUP_CONCAT
            const allColumns = Object.values(SewingCreationOptionsEnum).map(
                (column) => `GROUP_CONCAT(DISTINCT ${column}) AS \`${column}\``
            );
            // Include GROUP_CONCAT(DISTINCT osl_ref_id)
            allColumns.push('GROUP_CONCAT(DISTINCT sfg.mo_product_sub_line_id) AS `mo_product_sub_line_id`');
            queryBuilder.select(allColumns.join(', '));
            queryBuilder.where('sfg.processing_serial = :processingSerial', { processingSerial: req.processingSerial });
        }
        const result = await queryBuilder.getRawMany();
        // The return type will now use the enum values as keys and include osl_ref_id
        return result as GroupedSewingJobFeatureResult[];
    }

    /**
     * Repo method to get the feature details for the given product sub line Ids
     * @param moProductSubLineIds 
     * @param processingSerial 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getFeatureForProductSubLineIds(moProductSubLineIds: number[], processingSerial: number, unitCode: string, companyCode: string): Promise<PJ_BundlePropsModel> {
        return await this.createQueryBuilder('mo_features')
        .select('GROUP_CONCAT( DISTINCT mo_number) as moNumbers, GROUP_CONCAT( DISTINCT style_name)  as style, GROUP_CONCAT(DISTINCT mo_line_number) as moLineNo, GROUP_CONCAT( DISTINCT destination) as destination, GROUP_CONCAT( DISTINCT delivery_date) as plannedDelDate, GROUP_CONCAT( DISTINCT plan_prod_date) as planProdDate, GROUP_CONCAT( DISTINCT plan_cut_date ) as planCutDate, GROUP_CONCAT( DISTINCT co_number) coNumber,GROUP_CONCAT(DISTINCT product_name) as productName, GROUP_CONCAT (DISTINCT fg_color) as fgColor, GROUP_CONCAT (DISTINCT size) as size')
        .where("mo_features.mo_product_sub_line_id IN (:...moProductSubLineIds)", { moProductSubLineIds })
        .andWhere("mo_features.processing_serial = :processingSerial", { processingSerial })
        .andWhere(`mo_features.unit_code = '${unitCode}' AND mo_features.company_code = '${companyCode}'`)
        .getRawOne()
    }

        
    async getHeaderInfoForSewSerial(processingSerial: number, companyCode:string, unitCode:string): Promise<KnitHeaderInfoModel> {
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