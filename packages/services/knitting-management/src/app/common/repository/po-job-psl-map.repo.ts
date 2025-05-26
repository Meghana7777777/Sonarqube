import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PoJobPslMapEntity } from "../entities/po-job-psl-map-entity";
import { MC_ProductSubLineQtyModel, MoPslIdProcessTypeReq } from "@xpparel/shared-models";

@Injectable()
export class PoJobPslMapRepository extends Repository<PoJobPslMapEntity> {
    constructor(private dataSource: DataSource) {
        super(PoJobPslMapEntity, dataSource.createEntityManager());
    }

    async getSubLineWiseQuantitiesForPoJob(processingSerial: number, productRef: string, fgColor: string, size: string, groupCode: string): Promise<MC_ProductSubLineQtyModel[]> {
        return await this.createQueryBuilder('knitJob')
            .select('knitJob.moProductSubLineId', 'moProductSubLineId')
            .addSelect('SUM(knitJob.quantity)', 'quantity')
            .where('knitJob.processingSerial = :processingSerial', { processingSerial })
            .andWhere('knitJob.fgColor = :fgColor', { fgColor })
            .andWhere('knitJob.size = :size', { size })
            .andWhere('knitJob.productRef = :productRef', { productRef })
            .andWhere(`group_code = '${groupCode}'`)
            .groupBy('knitJob.moProductSubLineId')
            .getRawMany();
    }

    async getJobNumbersForMoPsdlIds(req: MoPslIdProcessTypeReq): Promise<{ jobNumber: string }[]> {
        const query = await this.createQueryBuilder('knitJob')
            .select('knitJob.jobNumber', 'jobNumber')
            .where(`process_type = '${req.processType}'`)
            .andWhere('knitJob.mo_product_sub_line_id IN (:...moPslIds)', { moPslIds: req.moPslIds })
            .andWhere(`knitJob.company_code = '${req.companyCode}' AND knitJob.unit_code = '${req.unitCode}'`)
        return await query.getRawMany();

    }
}        