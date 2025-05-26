import { GlobalResponseObject, PTS_C_ProductionJobNumberRequest } from "@xpparel/shared-models";
import { FgCreationHelperService } from "./fg-creation-helper.service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ProcOrderRepository } from "../entity/repository/proc-order.repository";
import { Injectable } from "@nestjs/common";
import { MoActualBundleSProcRepository } from "../entity/repository/mo-actual-bundle-sproc.repository";
import { MoActualBundleSProcEntity } from "../entity/mo-actual-bundle-sproc.entity";

@Injectable()
export class JobCreationService {
    constructor(
        private dataSource: DataSource,
        private fgHelperService: FgCreationHelperService,
        private procOrderRepo: ProcOrderRepository,
        private moActBundleSProcRepo: MoActualBundleSProcRepository,
    ) {
        
    }

    // Called from SPS after the actual bundles allocation / jobs generation
    async mapActualBundlesForJob(req: PTS_C_ProductionJobNumberRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, procSerial, jobNumber} = req;
            if(!procSerial || !jobNumber) {
                throw new ErrorResponse(0, `Job number, process type and proc serial are required. But few are not provided`);
            }
            // get the job info from the SPS
            const jobInfo = await this.fgHelperService.getJobInfoByJobNumber(jobNumber, procSerial, companyCode, unitCode);
            const bundlesInfo = jobInfo.bundles;
            const procType = jobInfo.procType;
            const subProc = jobInfo.subProc;
            // first check if the proc serial created in PTS
            const procSerialRec = await this.procOrderRepo.findOne({select: ['id'], where: {companyCode, unitCode, procSerial: procSerial, procType: procType }});
            if(!procSerialRec) {
                throw new ErrorResponse(0, `No records exist in PTS for the process type : ${procType} and serial : ${procSerial}`);
            }
            // const bSubProcEnts: MoActualBundleSProcEntity[] = [];
            const bSubProcEnts: MoActualBundleSProcEntity[] = [];
            await transManager.startTransaction();
            for(const bun of bundlesInfo) {
                // get the actual barcode record
                const b2 = new MoActualBundleSProcEntity();
                b2.abBarcode = bun.bunBrcd;
                b2.pslId = bun.pslId;
                b2.procType = procType;
                b2.subProc = subProc;
                b2.jobNumber = jobNumber;
                bSubProcEnts.push(b2);
                
                // DONT REMOVE THIS COMMENTED CODE
                // const abSubProcRec = await this.moActBundleSProcRepo.findOne({select: ['abBarcode'], where: { abBarcode: bun.bunBrcd, procType: procType, subProc: subProc, pslId: bun.pslId }});
                // if(!abSubProcRec) {
                //     throw new ErrorResponse(0, `Bundle : ${bun.bunBrcd} is not found in PTS. MORE INFO - proc serial : ${procSerialRec} proc type: ${procType}`);
                // }
                // // map the sewing job for the specific process type, sub process and the bundle
                // await transManager.getRepository(MoActualBundleSProcEntity).update({pslId: bun.pslId, procType: procType, subProc: subProc, abBarcode: bun.bunBrcd}, {jobNumber: jobNumber});
            }
            await transManager.getRepository(MoActualBundleSProcEntity).save(bSubProcEnts, {reload: false});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Production job created in PTS');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // Called from SPS after the sewing job un mapped from the bundles
    async unMapActualBundlesForJob(req: PTS_C_ProductionJobNumberRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const {companyCode, unitCode, procSerial, jobNumber} = req;
            if(!procSerial || !jobNumber) {
                throw new ErrorResponse(0, `Job number, process type and proc serial are required. But few are not provided`);
            }
            // get the job info from the SPS
            const jobInfo = await this.fgHelperService.getJobInfoByJobNumber(jobNumber, procSerial, companyCode, unitCode);
            const bundlesInfo = jobInfo.bundles;
            const procType = jobInfo.procType;
            const subProc = jobInfo.subProc;
            // first check if the proc serial created in PTS
            const procSerialRec = await this.procOrderRepo.findOne({select: ['id'], where: {companyCode, unitCode, procSerial: procSerial, procType: procType }});
            if(!procSerialRec) {
                throw new ErrorResponse(0, `No records exist in PTS for the process type : ${procType} and serial : ${procSerial}`);
            }
            await transManager.startTransaction();
            for(const bun of bundlesInfo) {
                // get the actual barcode record
                const abSubProcRec = await this.moActBundleSProcRepo.findOne({select: ['abBarcode'], where: { abBarcode: bun.bunBrcd, procType: procType, subProc: subProc,  }});
                if(!abSubProcRec) {
                    throw new ErrorResponse(0, `Bundle : ${bun.bunBrcd} is not found in PTS. MORE INFO - proc serial : ${procSerialRec} proc type: ${procType}`);
                }
                // map the sewing job for the specific process type, sub process and the bundle
                await transManager.getRepository(MoActualBundleSProcEntity).update({pslId: bun.pslId, procType: procType, subProc: subProc, abBarcode: bun.bunBrcd}, {jobNumber: jobNumber});
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Production job created in PTS');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }
   
}
