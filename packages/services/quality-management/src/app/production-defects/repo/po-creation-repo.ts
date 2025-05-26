import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PoViewFilterReq } from "@xpparel/shared-models";
import { Repository } from "typeorm";
import { PoCreationEntity } from "../../po-creation/entites/po-creation.entity";

@Injectable()
export class PoCreationRepository extends Repository<PoCreationEntity> {
    constructor(@InjectRepository(PoCreationEntity) private pocreation: Repository<PoCreationEntity>) {
        super(pocreation.target, pocreation.manager, pocreation.queryRunner);
    }

    // async getPoViewSewingInfo(req: PoViewFilterReq): Promise<any[]> {
    //     let query = this.createQueryBuilder('po')
    //         .select(
    //             `
    //         po.po_id AS po_id,
    //         sd.po_number AS poNumber,
    //         sd.customer_id AS customerId,
    //         sd.style_id AS styleId,
    //         sd.color_id AS colorId,
    //         sd.operation_id AS operationId,
    //         sd.defect_id AS defectId,
    //         sd.employee_name AS employeeName,
    //         sd.quality_type_id AS qualityTypeId,
    //         sd.test_result AS testResult,
    //         oc.operationname,
    //         co.color AS colorName,
    //         s.style_name AS styleName,
    //         CONCAT(cu.first_name, ' ', cu.last_name) AS buyerName,
    //         qt.quality_type AS qualityType,
    //         po.status,
    //         po.quantity,
    //         po.estimated_close_date AS estimatedClosedDate,
    //         COUNT(CASE WHEN sd.test_result = 'Pass' THEN 1 END) AS pass,
    //         COUNT(CASE WHEN sd.test_result = 'Failed' THEN 1 END) AS fail,
    //         COUNT(CASE WHEN sd.test_result = 'Pass with Defect' THEN 1 END) AS passWithDefect
    //         `
    //         )
    //         .leftJoin(SewingDefectEntity, 'sd', `sd.po_number = po.po_number`)
    //         .leftJoin(ColorEntity, `co`, `co.color_id=po.color_id`)
    //         .leftJoin(CustomersEntity, `cu`, `cu.customers_id=po.buyer_id`)
    //         .leftJoin(StylesEntity, `s`, `s.style_id=po.style_id`)
    //         .leftJoin(QualityType, `qt`, `qt.id = sd.quality_type_id`)
    //         .leftJoin(OperationCodeEntity, `oc`, `oc.operation_code_id = sd.operation_id`)
    //         .leftJoin(DefectCodeEntity, `dc`, `dc.defect_code_id = sd.defect_id`)
    //         .where(`sd.test_result IS NOT NULL`)
    //     if (req.poId) {
    //         query.andWhere(`po.po_id = ${req.poId}`)
    //     }
    //     if (req.buyerId) {
    //         query.andWhere(`po.buyer_id = ${req.buyerId}`)
    //     }
    //     query.groupBy(`sd.po_number, sd.test_result, oc.operationname, co.color, s.style_name, cu.first_name, cu.last_name, qt.quality_type, po.status order by po.created_at desc`)
    //     return await query.getRawMany()
    // }

    // async getPoViewEndlineInfo(req: PoViewFilterReq): Promise<any[]> {
    //     let query = this.createQueryBuilder('po')
    //         .select(`po.po_id,po.po_number,po.buyer,po.color,po.style,po.quantity,po.estimated_close_date,sum(ed.no_of_pices_inspected) as endlineInsp,sum(ed.no_of_pices_rejected) as endlineRej,ed.test_result as endlineRes,po.is_Active as isActive,po.version_flag as versionFlag,po.status`)
    //         .leftJoin(EndLineDefectEntity, 'ed', `ed.po_number = po.po_number`)
    //         .where(`po.po_id > 0`)
    //     if (req.poId) {
    //         query.andWhere(`po.po_id = ${req.poId}`)
    //     }
    //     if (req.buyerId) {
    //         query.andWhere(`po.buyer_id = ${req.buyerId}`)
    //     }
    //     query.groupBy(`ed.test_result,po.po_number`)
    //     return await query.getRawMany()
    // }

    // async getPoViewPackingInfo(req: PoViewFilterReq): Promise<any[]> {
    //     let query = this.createQueryBuilder('po')
    //         .select(`po.po_id,po.po_number,po.buyer,po.color,po.style,po.quantity,po.estimated_close_date,sum(pd.no_of_pices_inspected) as packingInsp,sum(pd.no_of_pices_rejected) as packingRej,pd.test_result as packingRes,po.is_Active as isActive,po.version_flag as versionFlag,po.status`)
    //         .leftJoin(PackingDefectEntity, 'pd', `pd.po_number = po.po_number`)
    //         .where(`po.po_id > 0`)
    //     if (req.poId) {
    //         query.andWhere(`po.po_id = ${req.poId}`)
    //     }
    //     if (req.buyerId) {
    //         query.andWhere(`po.buyer_id = ${req.buyerId}`)
    //     }
    //     query.groupBy(`pd.test_result,po.po_number`)
    //     return await query.getRawMany()
    // }
    

}