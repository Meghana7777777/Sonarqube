import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { EmbOpLineEntity } from "../entity/emb-op-line.entity";
import { EmbTransactionLogEntity } from "../entity/emb-transaction-log.entity";
import { BarcodeScanQtysQueryResponse } from "./query-response/barcode-scan-qtys.query.response";
import { JobScanQtyQueryResposne } from "./query-response/job-scan-qty.query.response";

@Injectable()
export class EmbTransactionLogRepository extends Repository<EmbTransactionLogEntity> {
    constructor(private dataSource: DataSource) {
        super(EmbTransactionLogEntity, dataSource.createEntityManager());
    }

    async getGoodAndRejQtyForBarcodeAndOp(barcode: string, operationCode: string, companyCode: string, unitCode: string): Promise<BarcodeScanQtysQueryResponse> {
        return await this.createQueryBuilder('trans_log')
        .select(` barcode, operation_code, SUM(good_quantity) as g_qty, SUM(rejected_quantity) as r_qty, color, size `)
        .where(` barcode = '${barcode}' AND operation_code = '${operationCode}' AND company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
        .getRawOne();
    }

    async getBundleWiseGoodAndRejQtyForEmbJob(embJobNumber: string, operationCodes: string[], companyCode: string, unitCode: string): Promise<BarcodeScanQtysQueryResponse[]> {
        const query = this.createQueryBuilder('trans_log')
        .select(` barcode, operation_code, SUM(good_quantity) as g_qty, SUM(rejected_quantity) as r_qty, color, size `)
        .where(` emb_job_number = '${embJobNumber}' AND company_code = '${companyCode}' AND unit_code = '${unitCode}' `);
        if (operationCodes.length > 0) {
            query.andWhere(` operation_code IN(:...ops) `, { ops: operationCodes });
        }
        query.groupBy(`barcode, operation_code`);
        return await query.getRawMany();
    }

    async getCumulativeGoodAndRejQtyForEmbJobWithoutColorSize(embJobNumber: string, operationCodes: string[], companyCode: string, unitCode: string): Promise<JobScanQtyQueryResposne[]> {
        const query = this.createQueryBuilder('trans_log')
        .select(` emb_job_number, operation_code, SUM(good_quantity) as g_qty, SUM(rejected_quantity) as r_qty `)
        .where(` emb_job_number = '${embJobNumber}' AND company_code = '${companyCode}' AND unit_code = '${unitCode}' `);
        if (operationCodes.length > 0) {
            query.andWhere(` operation_code IN(:...ops) `, { ops: operationCodes });
        }
        query.groupBy(`emb_job_number, operation_code`);
        return await query.getRawMany();
    }
}

