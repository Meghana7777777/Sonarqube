
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgBundleEntity } from "../fg-bundle.entity";
import { BundleTransEntity } from "../bundle-trans.entity";
import { FixedOpCodeEnum, MoPslIdProcessTypeReq, ProcessTypeEnum } from "@xpparel/shared-models";

@Injectable()
export class BundleTransRepository extends Repository<BundleTransEntity> {
    constructor(private dataSource: DataSource) {
        super(BundleTransEntity, dataSource.createEntityManager());
    }

    async getGoodAndRejQtyForBundleBarcode(barcode: string, opGroups: string[], companyCode: string, unitCode: string): Promise<BundleOpQtyQueryResponse[]> {
        const query = this.createQueryBuilder('t')
            .select(`bundle_barcode as barcode, op_group, proc_serial, SUM(g_qty) as g_qty, SUM(r_qty) as r_qty, op_code`)
            .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND bundle_barcode = '${barcode}' `);
        if (opGroups.length > 0) {
            query.andWhere(` op_group IN (:...opg)`, { opg: opGroups });
        }
        query.groupBy(`barcode, op_group, proc_serial, op_code`);
        const result: BundleOpQtyQueryResponse[] = await query.getRawMany();
        return result;
    }

    async getQtyInfoForGivenPslIdAndProcType(req: MoPslIdProcessTypeReq): Promise<{ completedQty: number, rejectedQty: number, processType: string }[]> {
        const { processType, moPslIds, companyCode, unitCode } = req
        const query = this.createQueryBuilder('t')
            .select(`proc_type as processType, SUM(g_qty) as completedQty, SUM(r_qty) as rejectedQty`)
            .where(`proc_type = '${processType}' AND op_group = '${req.lastOpGroup}' AND psl_id IN (:...ids)`, { ids: moPslIds })
            .andWhere(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND op_code = 99`)
            .groupBy(`proc_type`);
        return await query.getRawMany();
    }

    async getGoodAndRejQtyForBundleBarcodesAndFixedOp(barcodes: string[], opGroup: string, fixedOp: FixedOpCodeEnum, companyCode: string, unitCode: string): Promise<BundleOpQtyQueryResponse[]> {
        const query = this.createQueryBuilder('t')
            .select(`bundle_barcode as barcode, op_group, proc_serial, SUM(g_qty) as g_qty, SUM(r_qty) as r_qty, op_code`)
            .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND op_group = '${opGroup}' AND op_code = '${fixedOp}' AND bundle_barcode IN (:...brcds)`, { brcds: barcodes });
        query.groupBy(`barcode, op_group, proc_serial, op_code`);
        const result: BundleOpQtyQueryResponse[] = await query.getRawMany();
        return result;
    }
}

export interface BundleOpQtyQueryResponse {
    barcode: string;
    proc_serial: number;
    g_qty: number;
    r_qty: number;
    op_code: FixedOpCodeEnum;
    op_group: string;
}

