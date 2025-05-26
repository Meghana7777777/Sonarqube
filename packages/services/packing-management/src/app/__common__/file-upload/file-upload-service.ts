import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { TransactionalBaseService } from "../../../base-services";
import { FeatureFilesReqModel, GlobalResponseObject } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { GenericTransactionManager, ITransactionManager } from "../../../database/typeorm-transactions";
import { FileUploadIdReq } from "./dto/file-upload-id-req";
import { FileUploadRepo } from "./repo/file-upload-repo";
import path from "path";
import { ErrorResponse } from "@xpparel/backend-utils";
import { FileUploadEntity } from "./entity/file-upload.entity";
import { FileMetadataDTO } from "../dto/file-meta-data-dto";
import { PkmsRequestItemTruckMapEntity } from "../../fg-warehouse/entity/pkms-req-item-truck-map.entity";


@Injectable()
export class FileUploadService extends TransactionalBaseService {
    constructor(
        private readonly filesRepo: FileUploadRepo,
        @Inject('TransactionManager')

        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
        private dataSource: DataSource
    ) {
        super(transactionManager, logger)
    }

    async fileUpload(reqFiles: FileMetadataDTO[], reqBody: any): Promise<GlobalResponseObject> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionManager.startTransaction()
            const filesArray: FileUploadEntity[] = [];
            for (const file of reqFiles) {
                const filesEntity = new FileUploadEntity();
                filesEntity.companyCode = reqBody.companyCode;
                filesEntity.createdUser = reqBody.username;
                filesEntity.featuresRefNo = reqBody.featuresRefNo;
                filesEntity.fileName = file.filename;
                filesEntity.fileDescription = file.filename;
                filesEntity.filePath = file.path;
                filesEntity.originalName = file.originalname;
                filesEntity.size = String(file.size);
                filesEntity.unitCode = reqBody.unitCode;
                filesEntity.featuresRefName = reqBody.featuresRefName;
                filesArray.push(filesEntity);
            }
            if (reqBody?.loadedCartonsAlso === 'yes') {
                const featuresRefNo = reqBody.featuresRefNo.split('$@$')
                // for at least one cartons also 
                const findTruckCartons = await this.dataSource.getRepository(PkmsRequestItemTruckMapEntity).exist({
                    where: { companyCode: reqBody.companyCode, unitCode: reqBody.unitCode, whHeaderId: featuresRefNo[0], truckNo: featuresRefNo[1] }
                });
                if (!findTruckCartons) {
                    throw new ErrorResponse(65461,"Please load at least one carton")
                }
                //for loaded cartons validation 
                const findPreviousLoadedTruckCartons = await this.dataSource.getRepository(PkmsRequestItemTruckMapEntity).find({
                    where: { companyCode: reqBody.companyCode, unitCode: reqBody.unitCode, whHeaderId: featuresRefNo[0], truckNo: featuresRefNo[1], isDocumentUploaded: false }
                });
                if (findPreviousLoadedTruckCartons?.length) {
                    await transactionManager.getRepository(PkmsRequestItemTruckMapEntity).update({ companyCode: reqBody.companyCode, unitCode: reqBody.unitCode, whHeaderId: featuresRefNo[0], truckNo: featuresRefNo[1], isDocumentUploaded: false }, { isDocumentUploaded: true })
                }
            }
            await transactionManager.getRepository(FileUploadEntity).save(filesArray);
            await transactionManager.completeTransaction();
            return new GlobalResponseObject(true, 123, 'Uploaded Successfully');
        } catch (error) {
            await transactionManager.releaseTransaction();
            throw new ErrorResponse(65231, error.message)
        }



    }




    async deleteSingleFile(req: FileUploadIdReq): Promise<GlobalResponseObject> {
        return new GlobalResponseObject(true, 123, '');
    }
    async getSavedFilesData(req: FeatureFilesReqModel): Promise<GlobalResponseObject> {
        return new GlobalResponseObject(true, 123, '');
    }


}


