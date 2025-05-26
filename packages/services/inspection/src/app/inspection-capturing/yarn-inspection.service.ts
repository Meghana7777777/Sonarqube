import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsPhIdRequest, YarnInsBasicInspectionRequest, YarnInsBasicInspectionRollDetails } from "@xpparel/shared-models";
import { BullQueueJobService, InspectionHelperService } from "@xpparel/shared-services";
import path from "path";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsRequestItemEntity } from "../entities/ins-request-items.entity";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsYarnDefects } from "../entities/ins-yarn-defects.entity";
import { InsYarnEntity } from "../entities/ins-yarn.entity";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
const fileDestination = path.join(__dirname, '../../../../packages/services/inspection/upload_files')

@Injectable()
export class YarnInspectionService {
    constructor(
        public dataSource: DataSource,
        // private fileUploadRepo:FileUploadRepo,
        private inspReqRepo: InsRequestEntityRepo,
        private inspectionHelperService: InspectionHelperService,
        private bullQueueJobService:BullQueueJobService,
    ) { }


    async captureInspectionResultsForYarn(req: YarnInsBasicInspectionRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            await manager.startTransaction();
            console.log("reqdd", req);
            const { userName, unitCode, companyCode, } = req;
            const insReqId = req?.inspectionHeader?.inspectionReqId;
            if (!insReqId) {
                throw new ErrorResponse(6052, 'Please provide inspection Request Id')
            }

            const headerDetail: InsRequestEntity = await this.inspReqRepo.findOne({ where: { id: insReqId } });

            if (headerDetail.finalInspectionStatus != InsInspectionFinalInSpectionStatusEnum.OPEN) {
                throw new ErrorResponse(6054, 'Inspection header already been inspected. Please verify.');
            }

            await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insStartedAt: req.inspectionHeader.inspectionStart, insCompletedAt: req.inspectionHeader.inspectionCompleteAt, inspector: req.inspectionHeader.inspector, finalInspectionStatus: req.inspectionHeader.inspectionStatus, lab: req.inspectionHeader.lab, expInsCompletedAt: req.inspectionHeader.expInspectionCompleteAt });

            for (const eachRoll of req.inspectionRollDetails) {
                await manager.getRepository(InsRequestItemEntity).update({ id: eachRoll.rollId, insRequestId: req.inspectionHeader.inspectionReqId, unitCode, companyCode }, {
                    remarks: eachRoll.remarks, inspectionResult: eachRoll.rollFinalInsResult,
                    finalInspectionStatus: eachRoll.rollFinalInsResult,
                });



                await this.saveYarnInspectionDetailsForRoll(eachRoll.rollId, [eachRoll], unitCode, companyCode, req.userName, manager,req.inspectionHeader.inspectionReqId)
            }

            const finalInsStaus = req.inspectionHeader.inspectionStatus;
            const insCatefory=req?.inspectionHeader?.inspRequestCategory || null;
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS || finalInsStaus == InsInspectionFinalInSpectionStatusEnum.FAIL) {
                await manager.getRepository(InsRequestEntity).update({ id: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED });
                await manager.getRepository(InsRequestItemEntity).update({ insRequestId: headerDetail.id }, { insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED });
            }
            if (finalInsStaus == InsInspectionFinalInSpectionStatusEnum.PASS) {
                const phidReq = new InsPhIdRequest(req.userName, unitCode, companyCode, 0, [headerDetail.refIdL1],[insCatefory]);
                this.bullQueueJobService.addShownInInventoryQueue(phidReq)
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 6055, 'Inspection Results Updated Successfully');
        } catch (err) {
            manager ? await manager.releaseTransaction() : null;
            throw err;
        }
    }



    /**
       * Service to save found point inspection details for a roll
       * @param rollId 
       * @param inspDetails 
       * @param unitCode 
       * @param companyCode 
       * @param userName 
       * @param manager 
       * @returns 
      */
    async saveYarnInspectionDetailsForRoll(rollId: number, inspDetails: YarnInsBasicInspectionRollDetails[], unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager,insReqId:number): Promise<boolean> {
        const pointInspectDetails: InsYarnDefects[] = [];
        console.log('inspDetails9876', inspDetails);

        // delete the old items and recreate new ones
        const existingIsnRecs = await manager.getRepository(InsYarnDefects).find({ select: ['id'], where: { ItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });
        const oldIds = [];
        existingIsnRecs.forEach(record => {
            oldIds.push(Number(record.id));
        });
        if (oldIds.length > 0) {
            await manager.getRepository(InsYarnDefects).delete({ id: In(oldIds) })
        }
        // update the four point shade to the roll actual table
        const details: any = inspDetails[0];
        console.log('details23', details);
        const repo = manager.getRepository(InsYarnEntity);

        const existing = await repo.findOne({where: {insReqItemsId: rollId,unitCode: unitCode,companyCode: companyCode}});
        
        if (existing) {
          await repo.update({ insReqItemsId: rollId, unitCode: unitCode, companyCode: companyCode },{count: details.yarnCount,qunatity: 0,netWeight: details.netWeight,grossWeight: details.grossWeight,tpi: details?.twistPerInch,moisture: details?.moistureContent,tensileStrength: details?.tensileStrength,insReqId:insReqId,elongation:details?.elongation,createdUser:userName});
        } else {
          await repo.save({insReqItemsId: rollId,unitCode: unitCode,companyCode: companyCode,count: details.yarnCount,qunatity: 0,netWeight: details.netWeight,grossWeight: details.grossWeight,tpi: details?.twistPerInch,moisture: details?.moistureContent,tensileStrength: details?.tensileStrength,insReqId:insReqId,elongation:details?.elongation,createdUser:userName});
        }
        
        // for (const eachInsp of inspDetails) {
        console.log('eachInsp', details);
        const defectObj = new InsYarnDefects();
        defectObj.companyCode = companyCode;
        defectObj.createdUser = userName;
        defectObj.ItemsId = rollId;
        defectObj.slubs = details?.slubs
        defectObj.neps = details?.neps;
        defectObj.yarnBreaks = details?.yarnBreaks;
        defectObj.contamination = details?.contamination;
        defectObj.remarks = details.remarks;
        defectObj.unitCode = unitCode;
        pointInspectDetails.push(defectObj);
        // }
        console.log('deferts12', pointInspectDetails);
        await manager.getRepository(InsYarnDefects).save(pointInspectDetails)
        return true;
    }




}