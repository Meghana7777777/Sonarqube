import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsPhIdRequest, ThreadInsBasicInspectionRequest, ThreadInsBasicInspectionRollDetails } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { InsRequestItemEntity } from "../entities/ins-request-items.entity";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsRequestEntityRepo } from "../inspection/repositories/ins-request.repository";
import { InsThreadDefects } from "../entities/ins-thread-defects.entity";
import { InsThreadEntity } from "../entities/ins-thread.entity";
import { BullQueueJobService, InspectionHelperService } from "@xpparel/shared-services";


@Injectable()
export class ThreadInspectionCaptureService {
    constructor(
        private dataSource: DataSource,
        private inspReqRepo: InsRequestEntityRepo,
        private inspectionHelperService: InspectionHelperService,
        private bullQueueJobService:BullQueueJobService,
    ) { }



    // async captureInspectionResultsForThread(req: ThreadInspectionCaptureRequest): Promise<GlobalResponseObject> {
    //     const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
    //     console.log("reqdd", req);
    //     const insReqItems = [];
    //     const files = [];
    //     const manager = new GenericTransactionManager(this.dataSource);
    //     try {
    //         await manager.startTransaction();
    //         console.log('999', req.insSpolls[0].insReqId);
    //         const insReqId = req?.insSpolls[0]?.insReqId;
    //         if (!insReqId) {
    //             throw new ErrorResponse(6052, 'Please provide inspection Request Id')
    //         }
    //         const actualInfo = new InsThreadActualInfoEntity();

    //         for (const [index, rec] of req.insSpolls.entries()) {
    //             const item = new InsRequestItemEntity();
    //             actualInfo.companyCode = req.companyCode;
    //             // actualInfo.createdAt=req.insCar 
    //             actualInfo.spoolId = rec?.spoolId;
    //             actualInfo.createdUser = req.username;
    //             actualInfo.grossWeight = rec.insGrossWeight;
    //             actualInfo.insReqId = req.insReqId;
    //             actualInfo.insReqItemsId = rec.insItemId;
    //             actualInfo.netWeight = rec.netWeight;
    //             actualInfo.insReqItemsId = rec.insItemId;
    //             actualInfo.updatedUser = req.username;
    //             actualInfo.insReqId = rec.insReqId;
    //             actualInfo.tpi=rec.tpi;
    //             actualInfo.count=rec.count;
    //             actualInfo.qunatity=rec.quantity;

    //             const reason = new IReasonEntity();
    //             reason.id = 0;
    //             item.rejectedReasonId = reason.id;
    //             insReqItems.push(actualInfo);
    //             //fille carton wise
    //             // if (filesData[index]) {
    //             //     console.log("inside iff124");
    //             //     const findExistFile = await this.dataSource.getRepository(FileUploadEntity).findOne({ where: { featuresRefNo: rec.insItemId } });
    //             //     const filesEntity = new FileUploadEntity();
    //             //     if (findExistFile) {
    //             //         fs.unlinkSync(path.join(fileDestination, findExistFile.fileName));
    //             //         filesEntity.id = findExistFile.id;
    //             //         filesEntity.updatedUser = req.username;
    //             //     }
    //             //     filesEntity.companyCode = req.companyCode;
    //             //     filesEntity.createdUser = req.username;
    //             //     filesEntity.featuresRefNo = rec.insItemId;
    //             //     filesEntity.fileName = filesData[index].filename;
    //             //     filesEntity.fileDescription = filesData[index].filename;
    //             //     filesEntity.filePath = filesData[index].path;
    //             //     filesEntity.originalName = filesData[index].originalname;
    //             //     filesEntity.size = String(filesData[index].size);
    //             //     filesEntity.unitCode = req.unitCode;
    //             //     filesEntity.featuresRefName = ReferenceFeaturesEnum.INS_CARTONS;
    //             //     files.push(filesEntity)
    //             // }
    //             //each carton
    //             const existingItem = await manager.getRepository(InsRequestItemEntity).find({
    //                 where: { insRequestId: insReqId, ...userReq }
    //             });  //id: rec.insItemId
    //             // console.log("rec.insReqIdrec.insReqId", rec.insReqId)
    //             if (existingItem && req.finalInspectionStatus !== InsInspectionFinalInSpectionStatusEnum.OPEN) {
    //                 // Update existing record
    //                 console.log("inside iff123")
    //                 // if(rec.finalInspectionResult === InsInspectionFinalInSpectionStatusEnum.PASS || rec.finalInspectionResult === InsInspectionFinalInSpectionStatusEnum.FAIL)
    //                 // {
    //                 console.log('786rec.insActicityStaus', rec.insActivityStatus)
    //                 console.log('993rec.insActicityStaus', rec.finalInspectionResult);
    //                 await manager.getRepository(InsRequestItemEntity).update(
    //                     { insRequestId: insReqId, ...userReq },
    //                     {
    //                         finalInspectionStatus: req.finalInspectionStatus,
    //                         inspectionResult: rec.inspectionResult,
    //                         updatedUser: req.username,
    //                         rejectedReasonId: rec.rejectedReason || 0,
    //                         insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED,
    //                         inspectionAreaI1: req?.area,
    //                     }
    //                 );
    //                 // }

    //             } else {
    //                 throw new ErrorResponse(235, 'insReqItems not found!!');
    //             }

    //         }


    //         // console.log('filesssssss', files);

    //         // if (files.length) {
    //         //     await this.fileUploadRepo.save(files);
    //         // }

    //         // await manager.getRepository(InsRequestItemEntity).save(insReqItems);
    //         //final
    //         if (req.finalInspectionStatus !== InsInspectionFinalInSpectionStatusEnum.OPEN) {
    //             const pkInsReqStatus = await manager.getRepository(InsRequestItemEntity).count({
    //                 where: { insRequestId: insReqId, inspectionResult: InsInspectionFinalInSpectionStatusEnum.OPEN }
    //             });
    //             console.log("isnide the ifffffffffffff", pkInsReqStatus);
    //             if (pkInsReqStatus) {
    //                 throw new ErrorResponse(2345, 'Please Select All Cartons');
    //             }

    //             await manager.getRepository(InsRequestEntity).update(
    //                 { id: insReqId, ...userReq },
    //                 {
    //                     updatedUser: req.username,
    //                     insCompletedAt: new Date(dayjs().format('YYYY-MM-DD H:mm:ss')),
    //                     finalInspectionStatus: req.finalInspectionStatus,
    //                     insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED,
    //                 }
    //             );


    //             for (const item of insReqItems) {
    //                 // const actualInfo = new InsCartonActualInfoEntity();
    //                 console.log("itemd", item);
    //                 actualInfo.insReqId = insReqId;
    //                 actualInfo.insReqItemsId = item.insReqItemsId;
    //                 actualInfo.grossWeight = item.grossWeight;
    //                 actualInfo.netWeight = item.netWeight;
    //                 actualInfo.companyCode = req.companyCode;
    //                 actualInfo.unitCode = req.unitCode;
    //                 actualInfo.updatedUser = item.updatedUser;
    //                 console.log("actualInfo............", actualInfo);
    //                 await this.insThreadActualInfoRepo.save(actualInfo);
    //             }
    //         }
    //         await manager.completeTransaction();
    //         return new GlobalResponseObject(true, 51542, "Inspection Updated Successfully");
    //     } catch (error) {
    //         await manager.releaseTransaction();
    //         throw error;
    //     }
    // } 



    async captureInspectionResultsForThread(req: ThreadInsBasicInspectionRequest): Promise<GlobalResponseObject> {
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



                await this.saveThreadInspectionDetailsForRoll(eachRoll.rollId, [eachRoll], unitCode, companyCode, req.userName, manager, req.inspectionHeader.inspectionReqId)
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


    async checkAndUpdateInventory(manager: GenericTransactionManager, phId: string, userName: string, unitCode: string, companyCode: string
    ) {
        const completed = await manager.getRepository(InsRequestEntity).find({ where: { refIdL1: phId } });
        const allPass = completed.every(item => item.finalInspectionStatus == InsInspectionFinalInSpectionStatusEnum.PASS && item.insActivityStatus == InsInspectionActivityStatusEnum.COMPLETED);
        if (allPass) {
            const phidReq = new InsPhIdRequest(userName, unitCode, companyCode, 0, [phId]);
            await this.inspectionHelperService.updateShowInInventory(phidReq);
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
    async saveThreadInspectionDetailsForRoll(rollId: number, inspDetails: ThreadInsBasicInspectionRollDetails[], unitCode: string, companyCode: string, userName: string, manager: GenericTransactionManager, insReqId: number): Promise<boolean> {
        const pointInspectDetails: InsThreadDefects[] = [];
        console.log('inspDetails9876', inspDetails);

        // delete the old items and recreate new ones
        const existingIsnRecs = await manager.getRepository(InsThreadDefects).find({ select: ['id'], where: { ItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });
        const oldIds = [];
        existingIsnRecs.forEach(record => {
            oldIds.push(Number(record.id));
        });
        if (oldIds.length > 0) {
            await manager.getRepository(InsThreadDefects).delete({ id: In(oldIds) })
        }
        // update the four point shade to the roll actual table
        const details: any = inspDetails[0];
        console.log('details23', details);
        const repo = manager.getRepository(InsThreadEntity);

        const existing = await repo.findOne({ where: { insReqItemsId: rollId, unitCode: unitCode, companyCode: companyCode } });

        if (existing) {
            await repo.update({ insReqItemsId: rollId, unitCode: unitCode, companyCode: companyCode }, { count: details.yarnCount, qunatity: 0, netWeight: details.netWeight, grossWeight: details.grossWeight, tpi: details?.twistPerInch, moisture: details?.moistureContent, tensileStrength: details?.tensileStrength, insReqId: insReqId, elongation: details?.elongation, createdUser: userName });
        } else {
            await repo.save({ insReqItemsId: rollId, unitCode: unitCode, companyCode: companyCode, count: details.yarnCount, qunatity: 0, netWeight: details.netWeight, grossWeight: details.grossWeight, tpi: details?.twistPerInch, moisture: details?.moistureContent, tensileStrength: details?.tensileStrength, insReqId: insReqId, elongation: details?.elongation, createdUser: userName });
        }

        // for (const eachInsp of inspDetails) {
        console.log('eachInsp', details);
        const defectObj = new InsThreadDefects();
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
        await manager.getRepository(InsThreadDefects).save(pointInspectDetails)
        return true;
    }
}