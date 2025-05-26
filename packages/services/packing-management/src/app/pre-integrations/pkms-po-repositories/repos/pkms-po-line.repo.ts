import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PKMSPoLineEntity } from "../../pkms-po-entities/pkms-po-line-entity";
import { PKMSPoSubLineEntity } from "../../pkms-po-entities/pkms-po-sub-line-entity";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSPoLineRepoInterface } from "../interfaces/pkms-po-line.repo.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonRequestAttrs, PlLineInfo } from "@xpparel/shared-models";
import { PKMSProductSubLineFeaturesEntity } from "../../pkms-po-entities/pkms-product-sub-line-features-entity";
import { PKMSPoProductEntity } from "../../pkms-po-entities/pkms-po-product-entity";

@Injectable()
export class PKMSPoLineRepository extends BaseAbstractRepository<PKMSPoLineEntity> implements PKMSPoLineRepoInterface {
    constructor(
        @InjectRepository(PKMSPoLineEntity)
        private readonly poLineEntity: Repository<PKMSPoLineEntity>,
    ) {
        super(poLineEntity);
    }


    async getPKMSPSLTotalOrdQtyForMoNumbers(moNumbers: string[], unitCode: string, companyCode: String): Promise<{
        quantity: string, poslId: string
    }[]> {
        const query = await this.poLineEntity.createQueryBuilder('psl')
            .select('SUM(posl.quantity) as quantity,posl.mo_product_sub_line_id as poslId')
            .leftJoin(PKMSPoSubLineEntity, 'posl', 'posl.po_line_id = psl.id')
            .where('psl.mo_number IN (:...moNumbers)', { moNumbers },)
            .andWhere(`posl.company_code = "${companyCode}" and posl.unit_code = "${unitCode}"`)
            .groupBy('posl.mo_product_sub_line_id')
            .getRawMany();

        return query
    }

    async getProcessingOrderFeatures(processingSerial: number, moId?: number, moLineId?: number, poLineId?: number,
        moPslId?: number) {
        const query = await this.poLineEntity.createQueryBuilder('pl')
            .select(`GROUP_CONCAT(DISTINCT pl.mo_number) AS moNumber,GROUP_CONCAT(DISTINCT pl.mo_line_number) AS     moLineNumber
                ,GROUP_CONCAT(pslf.destination) AS destination,GROUP_CONCAT(pslf.delivery_date) AS planDeliveryDate
                ,GROUP_CONCAT(pslf.plan_prod_date) AS planProductionDate,GROUP_CONCAT(pslf.plan_cut_date) AS planCutDate,GROUP_CONCAT(pslf.style_name) AS styleName
                ,GROUP_CONCAT(pslf.style_description) AS styleDescription,GROUP_CONCAT(pslf.business_head) AS businessHead,GROUP_CONCAT(pslf.mo_creation_date) AS moCreationDate
                ,GROUP_CONCAT(pslf.mo_closed_date) AS moClosedDate,GROUP_CONCAT(pslf.ex_factory_date) AS exFactoryDate,GROUP_CONCAT(pslf.schedule) AS schedule,
                GROUP_CONCAT(z_feature) AS zFeature,GROUP_CONCAT(pslf.style_code) AS styleCode,GROUP_CONCAT(pslf.customer_code) AS customerCode,pslf.oq_type AS oqType`)
            .leftJoin(PKMSPoSubLineEntity, 'psl', 'psl.processing_serial = pl.processing_serial  AND psl.po_line_id = pl.id')
            .leftJoin(PKMSProductSubLineFeaturesEntity, 'pslf', 'pslf.mo_product_sub_line_id = psl.mo_product_sub_line_id')
            .where(`pl.processing_serial = ${processingSerial} `)
        if (moId) {
            query.andWhere(`pl.mo_id = ${moId}`)
        }
        if (moLineId) {
            query.andWhere(`pl.mo_line_id = ${moLineId}`)
        }
        if (moPslId) {
            query.andWhere(`psl.mo_product_sub_line_id = ${moPslId}`)
        }

        return await query.getRawMany();
    };


    async findDistinctMoNumbers(req: CommonRequestAttrs): Promise<{ moNumber: string, moId: number }[]> {
        const query = await this.poLineEntity.createQueryBuilder('po')
            .select('DISTINCT po.mo_number AS moNumber,po.mo_id as moId')
            .where('po.unitCode = :unitCode', { unitCode: req.unitCode })
            .andWhere('po.companyCode = :companyCode', { companyCode: req.companyCode })
            .orderBy('po.createdAt', 'DESC')
            .getRawMany();
        return query
    }
    async getMoInfoForGivenPo(poId: number): Promise<{moId: number, moNumber: string, poId: number}[]> {
        const moInfoRecords:{moId: number, moNumber: string, poId: number}[] = await this.poLineEntity
            .createQueryBuilder("poLine")
            .select("poLine.moId", "moId")
            .addSelect(["poLine.moNumber as moNumber", "poLine.poId as poId"]) 
            .where("poLine.poId = :poId", { poId })
            .groupBy("poLine.moId")
            .getRawMany();
        return moInfoRecords
    }

}