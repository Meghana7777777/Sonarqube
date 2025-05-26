import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FgInspectionRequest, FileMetadataDTO, GlobalResponseObject, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, ReferenceFeaturesEnum } from "@xpparel/shared-models";
import dayjs from "dayjs";
import * as fs from 'fs';
import path from "path";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { FileUploadEntity } from "../entities/file-upload.entity";
import { InsRequestHistoryEntity } from "../entities/ins-request-history.entity";
import { InsRequestItemEntity } from "../entities/ins-request-items.entity";
import { InsRequestEntity } from "../entities/ins-request.entity";
import { InsCartonActualInfoEntity } from "../entities/ins_cartons_actual_info.entity";
import { InsCartonActualInfoRepo } from "../inspection/repositories/ins-carton-actual-info.repository";
import { FileUploadRepo } from "../inspection/repositories/ins-file-upload.repository";
const fileDestination = path.join(__dirname, '../../../../packages/services/inspection/upload_files')

@Injectable()
export class FgInspectionService {
    constructor(
        public dataSource: DataSource,
        private insCartonActualInfoRepo: InsCartonActualInfoRepo,
        private fileUploadRepo: FileUploadRepo,
    ) { }

    async captureInspectionResultsForFg(filesData: FileMetadataDTO[], req: FgInspectionRequest): Promise<GlobalResponseObject> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
        const insReqItems = [];
        const files = [];
        const manager = new GenericTransactionManager(this.dataSource);

        try {
            await manager.startTransaction();
            const insReqId = req?.insCartons[0]?.insReqId;

            if (!insReqId) {
                throw new ErrorResponse(6052, 'Please provide inspection Request Id');
            }
            const actualInfo = new InsCartonActualInfoEntity();
            // Loop through each carton in the request
            for (const [index, rec] of req.insCartons.entries()) { 
                actualInfo.companyCode = req.companyCode;
                actualInfo.unitCode = req.unitCode;
                actualInfo.CartonId = rec?.cartonId;
                actualInfo.grossWeight = rec.grossWeight;
                actualInfo.netWeight = rec.netWeight;
                actualInfo.insReqId = rec.insReqId; // Better to get from rec
                actualInfo.insReqItemsId = rec.insItemId;
                actualInfo.createdUser = req.username;
                actualInfo.updatedUser = req.username; 

                insReqItems.push(actualInfo); // Save for later batch insert

                // File handling if files are provided for each carton
                if (filesData[index]) {
                    const findExistFile = await this.dataSource.getRepository(FileUploadEntity)
                        .findOne({ where: { featuresRefNo: rec.insItemId } });

                    const filesEntity = new FileUploadEntity();

                    if (findExistFile) {
                        const filePath = path.join(fileDestination, findExistFile.fileName);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath); // Safely remove old file
                        }

                        filesEntity.id = findExistFile.id; // For update
                        filesEntity.updatedUser = req.username;
                    }

                    filesEntity.companyCode = req.companyCode;
                    filesEntity.unitCode = req.unitCode;
                    filesEntity.createdUser = req.username;
                    filesEntity.featuresRefNo = rec.insItemId;
                    filesEntity.featuresRefName = ReferenceFeaturesEnum.INS_CARTONS;
                    filesEntity.fileName = filesData[index].filename;
                    filesEntity.originalName = filesData[index].originalname;
                    filesEntity.fileDescription = filesData[index].filename;
                    filesEntity.filePath = filesData[index].path;
                    filesEntity.size = String(filesData[index].size);

                    files.push(filesEntity); // Save later
                }

                // Check if inspection items exist for the given request ID
                const existingItem = await manager.getRepository(InsRequestItemEntity).find({
                    where: { insRequestId: insReqId, ...userReq }
                });

                if(!existingItem || existingItem.length === 0) {
                    throw new ErrorResponse(235, 'Inspection items not found for request ID: ' + insReqId);
                }

                console.log('existingItem4565432',existingItem);

                if (existingItem && req.finalInspectionStatus !== InsInspectionFinalInSpectionStatusEnum.OPEN) {
                    // Update inspection status only if not OPEN
                    await manager.getRepository(InsRequestItemEntity).update(
                        { insRequestId: insReqId, ...userReq },
                        {
                            finalInspectionStatus: req.finalInspectionStatus,
                            inspectionResult: rec.inspectionResult,
                            updatedUser: req.username,
                            rejectedReasonId: rec.rejectedReason || 0,
                            insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED,
                            inspectionAreaI1: req?.area,
                        }
                    );
                } else {
                    throw new ErrorResponse(237, 'Inspection status should not be OPEN');
                }
            }

            // Save files if any
            if (files.length) {
                await this.fileUploadRepo.save(files);
            }

            // Final step only if inspection is marked complete
            if (req.finalInspectionStatus !== InsInspectionFinalInSpectionStatusEnum.OPEN) {
                const pkInsReqStatus = await manager.getRepository(InsRequestItemEntity).count({
                    where: { insRequestId: insReqId, inspectionResult: InsInspectionFinalInSpectionStatusEnum.OPEN }
                });

                if (pkInsReqStatus > 0) {
                    throw new ErrorResponse(2345, 'Please complete all carton inspections before finalizing.');
                }

                // Update main request status
                await manager.getRepository(InsRequestEntity).update(
                    { id: insReqId, ...userReq },
                    {
                        updatedUser: req.username,
                        insCompletedAt: new Date(dayjs().format('YYYY-MM-DD H:mm:ss')),
                        finalInspectionStatus: req.finalInspectionStatus,
                        insActivityStatus: InsInspectionActivityStatusEnum.COMPLETED,
                    }
                );

                // Save actual info for all cartons
                for (const item of insReqItems) { 
                    actualInfo.insReqId = insReqId;
                    actualInfo.insReqItemsId = item.insReqItemsId;
                    actualInfo.grossWeight = item.grossWeight;
                    actualInfo.netWeight = item.netWeight;
                    actualInfo.companyCode = req.companyCode;
                    actualInfo.unitCode = req.unitCode;
                    actualInfo.updatedUser = item.updatedUser; 
                    await manager.getRepository(InsCartonActualInfoEntity).save(actualInfo);
                }
            }
            const insreq=await manager.getRepository(InsRequestEntity).findOne({where:{id:req.insReqId}});
            // Add inspection history
            const history = new InsRequestHistoryEntity();
            history.companyCode = req.companyCode;
            history.createdUser = req.username;
            history.unitCode = req.unitCode;
            history.createdAt = new Date();
            history.InsRedId = req.insReqId;
            history.oldStatus = InsInspectionActivityStatusEnum.INPROGRESS;
            history.newStatus = InsInspectionActivityStatusEnum.COMPLETED;
            history.inspectionPerson = req.username;
            history.inspectionAreaI1 = req.area;
            history.inspectionAreaI2 = '';
            history.remarks = '';
            history.insRequestItemId = 0;
            history.insType=insreq.insType;
            history.InsRedId=insReqId 

            // console.log('87655678',insReqId,history)

            await manager.getRepository(InsRequestHistoryEntity).save(history);

            await manager.completeTransaction();
            return new GlobalResponseObject(true, 51542, "Inspection Updated Successfully");

        } catch (error) {
            await manager.releaseTransaction(); // Make sure this also does rollback internally
            console.error("Error during inspection update:", error);
            throw error;
        }
    }

}