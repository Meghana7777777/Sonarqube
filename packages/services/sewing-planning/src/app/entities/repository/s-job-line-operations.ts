import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SJobLineOperationsEntity } from "../s-job-line-operations";
import { OperationalTrackInfo, SequencedIJobOperationModel } from "@xpparel/shared-models";

@Injectable()
export class SJobLineOperationsRepo extends Repository<SJobLineOperationsEntity> {
  constructor(dataSource: DataSource) {
    super(SJobLineOperationsEntity, dataSource.createEntityManager());
  }

  async getOperationsByJobNo(jobNumber: string, unitCode: string, companyCode: string): Promise<SJobLineOperationsEntity[]> {
    return await this.find({ where: { jobNumber, unitCode, companyCode, } });
  }

  async getOperationalTrackInfo(jobNo: string, unitCode: string, companyCode: string): Promise<OperationalTrackInfo[]> {
    const result = await this.createQueryBuilder('operation')
      .select([
        'operation.operationCode',
        'COUNT(operation.operationCode) AS totalOperations',
        'SUM(CASE WHEN operation.inputQty = operation.goodQty THEN 1 ELSE 0 END) AS completedOperations',
        'SUM(operation.openRejections) AS openRejections',
      ])
      .where('operation.sJobLineId = :jobNo', { jobNo })
      .andWhere("operation.unit_code = :unitCode", { unitCode })
      .andWhere("operation.company_code = :companyCode", { companyCode })
      .groupBy('operation.operationCode')
      .getRawMany();

    return result.map((data) => {
      return new OperationalTrackInfo(
        data.operationCode,
        parseInt(data.totalOperations, 10),
        parseInt(data.completedOperations, 10),
        parseInt(data.openRejections, 10),
      );
    });
  }

  async getSequencedOperationsByJobId(jobNo: string, unitCode: string, companyCode: string): Promise<SJobLineOperationsEntity[]> {
    return await this.createQueryBuilder("operations")
      .select(["operations.job_number as jobNo", "operations.operationCode", "operations.originalQty", "operations.inputQty", "operations.goodQty", "operations.rejectionQty", "operations.openRejections", "operations.operationSequence", "operations.smv", "operations.processingSerial", "operations.processType", "operations.jobNumber", "operations.operationGroup"])
      .where("operations.job_number = :jobNo", { jobNo: jobNo })
      .andWhere("operations.unit_code = :unitCode", { unitCode })
      .andWhere("operations.company_code = :companyCode", { companyCode })
      .orderBy("operations.operationSequence", "ASC")
      .getMany();
  }
  



  async getTotalSmvByJobNo(jobNo: string, unitCode: string, companyCode: string): Promise<{
    smv: number,
    original_qty: number
  }> {
    return await this.createQueryBuilder('job_ops')
      .select('sum(smv) as smv, original_qty')
      .where(`job_number = '${jobNo}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}' AND is_active = true`)
      .getRawOne();
  }


  async getInputReportedQtyByJobNo(jobNo: string, unitCode: string, companyCode: string): Promise<number> {
    const qryResp: {
      inputReportedQty: number
    } = await this.createQueryBuilder('job_ops')
      .select('(good_qty + rejection_qty) as inputReportedQty')
      .where(`job_number = '${jobNo}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}' AND is_active = true`)
      .orderBy(`operation_sequence`, 'ASC')
      .limit(1)
      .getRawOne();
    return Number(qryResp.inputReportedQty);
  }


  
  async getInputQtyByJobNo(jobNo: string, unitCode: string, companyCode: string): Promise<number> {
    const qryResp: {
      input_qty: number
    } = await this.createQueryBuilder('job_ops')
      .select('input_qty')
      .where(`job_number = '${jobNo}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}' AND is_active = true`)
      .orderBy(`operation_sequence`, 'ASC')
      .limit(1)
      .getRawOne();
    return Number(qryResp.input_qty);
  }

  async getOutReportedQtyByJobNo(jobNo: string, unitCode: string, companyCode: string): Promise<number> {
    const qryResp: {
      outPutReportedQty: number
    } = await this.createQueryBuilder('job_ops')
      .select('(good_qty + rejection_qty) as outPutReportedQty')
      .where(`job_number = '${jobNo}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}' AND is_active = true`)
      .orderBy(`operation_sequence`, 'DESC')
      .limit(1)
      .getRawOne();
    return Number(qryResp.outPutReportedQty);
  }



  async getDistinctOperationsByJobNo(jobNo: string, unitCode: string, companyCode: string): Promise<string[]> {
    const opObj: { opCode: string }[] = await this.createQueryBuilder('operation')
      .select('DISTINCT operation.operation_code as opCode')
      .where('operation.job_no = :jobNo', { jobNo })
      .andWhere("operation.unit_code = :unitCode", { unitCode })
      .andWhere("operation.company_code = :companyCode", { companyCode })
      .groupBy('operation.operationCode')
      .getRawMany();
    return opObj.map(eachOp => eachOp.opCode);
  }

  async getTotalRejectedQtyByJobNo(jobNo: string, unitCode: string, companyCode: string): Promise<number> {
    const qryResp: {
      rejectedQty: number
    } = await this.createQueryBuilder('job_ops')
      .select('SUM (rejection_qty) as rejectedQty')
      .where(`job_no = '${jobNo}' AND unit_code = '${unitCode}' AND company_code = '${companyCode}' AND is_active = true`)
      .orderBy(`operation_sequence`, 'ASC')
      .getRawOne();
    return Number(qryResp.rejectedQty);
  }
}

