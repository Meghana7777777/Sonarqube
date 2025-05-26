import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PoViewFilterReq } from "@xpparel/shared-models";
import { Repository } from "typeorm";
import { ProductionDefectEntity } from "../../production-defects/entites/production-defects.entity";
import { QualityTypeEntity } from "../../quality-type/entites/quality-type-entity";
import { PoCreationEntity } from "../entites/po-creation.entity";
@Injectable()
export class PoCreationRepository extends Repository<PoCreationEntity> {
    constructor(@InjectRepository(PoCreationEntity) private pocreation: Repository<PoCreationEntity>) {
        super(pocreation.target, pocreation.manager, pocreation.queryRunner);
    }

    async getPoViewSewingInfo(req: PoViewFilterReq): Promise<any[]> {
        let query = this.createQueryBuilder('po')
            .select(
                `
            po.po_id AS po_id,
            pd.po_number AS poNumber,
            pd.customer_id AS customerId,
            pd.style_id AS styleId,
            pd.color_id AS colorId,
            pd.operation_id AS operationId,
            pd.defect_id AS defectId,
            pd.employee_name AS employeeName,
            pd.quality_type_id AS qualityTypeId,
            pd.test_result AS testResult,
            qt.quality_type AS qualityType,
            po.status,
            po.quantity,
            po.estimated_close_date AS estimatedClosedDate,
            COUNT(CASE WHEN pd.test_result = 'Pass' THEN 1 END) AS pass,
            COUNT(CASE WHEN pd.test_result = 'Fail' THEN 1 END) AS fail
            `)
            .leftJoin(ProductionDefectEntity, 'pd', `pd.po_number = po.po_number`)
            .leftJoin(QualityTypeEntity, `qt`, `qt.id = pd.quality_type_id`)
            .where(`pd.test_result IS NOT NULL`)
        if (req.poId) {
            query.andWhere(`po.po_id = ${req.poId}`)
        }
        if (req.buyerId) {
            query.andWhere(`po.buyer_id = ${req.buyerId}`)
        }
        query.groupBy(`pd.po_number, pd.test_result, qt.quality_type, po.status order by po.created_at desc`)
        return await query.getRawMany()
    }

}