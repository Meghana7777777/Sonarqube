import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PKMSProcessingOrderEntity } from "../../pkms-po-entities/pkms-processing-order-entity";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSProcessingOrderRepoInterface } from "../interfaces/pkms-processing-order.repo.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { PLGenQtyInfoModel, StyleMoRequest } from "@xpparel/shared-models";
import { PKMSPoLineEntity } from "../../pkms-po-entities/pkms-po-line-entity";
import { PKMSPoSubLineEntity } from "../../pkms-po-entities/pkms-po-sub-line-entity";

@Injectable()
export class PKMSProcessingOrderRepository extends BaseAbstractRepository<PKMSProcessingOrderEntity> implements PKMSProcessingOrderRepoInterface {

    constructor(
        @InjectRepository(PKMSProcessingOrderEntity)
        private readonly processingEntity: Repository<PKMSProcessingOrderEntity>,
    ) {
        super(processingEntity);
    }


    async getPoData(companyCode: string, unitCode: string, packSerial: number): Promise<PLGenQtyInfoModel> {
        const query = await this.processingEntity.createQueryBuilder('poData')
            .select('poData.id as poId,poData.processing_serial,SUM(sb.quantity) as qty')
            .leftJoin(PKMSPoSubLineEntity, 'sb', 'sb.processing_serial = poData.processing_serial')
            .where(`poData.processing_serial='${packSerial}' AND poData.unitCode = '${unitCode}' AND poData.companyCode = '${companyCode}'`)
            .groupBy('poData.id')
            .getRawOne()
        return new PLGenQtyInfoModel(query.poId, query.processing_serial, query.delivery_date, query.qty, [])
    }



    async getMaxPoSerialForUnitCode(unitCode: string, companyCode: string): Promise<number> {
        const qryResult: { processing_serial: number } = await this.processingEntity.createQueryBuilder('po')
            .select('MAX(processing_serial) as processing_serial')
            .where(`unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .getRawOne();
        return qryResult ? qryResult.processing_serial : 0;
    }


    async getPoOrderDes(poIds: number[], unitCode: string, companyCode: string): Promise<{ id: number, description: string, poNumber: string }[]> {
        const query = await this.processingEntity.createQueryBuilder()
            .select(`id, prc_ord_description AS description,processing_serial AS  poNumber`)
            .where(`unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .andWhereInIds(poIds)
            .getRawMany()
        return query
    };

    async getPackOrderIds(ManufacturingOrderIds: number[], unitCode: string, companyCode: string): Promise<{ id: string }> {
        const query = await this.processingEntity.createQueryBuilder()
            .select('GROUP_CONCAT (Distinct id) as id')
            .where(`unit_code = '${unitCode}' AND company_code = '${companyCode}'`)
            .andWhere(`order_ref_id In(${ManufacturingOrderIds})`)
            .getRawOne();
        return query
    }


    async getPKMSPoSerialsForGivenStyleAndMONumbers(req: StyleMoRequest): Promise<{ processing_serial: number }[]> {
        const { styleCode, moNumber, companyCode, unitCode } = req
        return await this.processingEntity.createQueryBuilder('po')
            .select([
                'DISTINCT(po.processing_serial)',
                'po.created_at',
            ]).leftJoin(PKMSPoLineEntity, 'pol', 'pol.po_id = po.id')
            .where(`po.style_code='${styleCode}'`)
            .andWhere('pol.mo_number IN (:...moNumber)', { moNumber })
            .andWhere(`po.status = '${req.status}'`)
            .andWhere(`po.company_code = '${companyCode}' and po.unit_code = '${unitCode}'`)
            .orderBy(`po.created_at`, 'DESC')
            .getRawMany()

    }

}


