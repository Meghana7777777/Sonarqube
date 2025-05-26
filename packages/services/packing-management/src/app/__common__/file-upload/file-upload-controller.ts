import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FileUploadService } from "./file-upload-service";
import { FileUploadIdReq } from "./dto/file-upload-id-req";
import { FeatureFilesReqModel, GlobalResponseObject, ReferenceFeaturesEnum } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";
import { FilesInterceptor } from "@nestjs/platform-express";
import path, { extname, join } from "path";
import { diskStorage } from 'multer';
import * as fs from 'fs'
import { FileMetadataDTO } from "../dto/file-meta-data-dto";


const fileDestination = path.join(__dirname, '../../../../packages/services/packing-management/upload_files')

if (!fs.existsSync(fileDestination)) {
    fs.mkdirSync(fileDestination);
}
@ApiTags('file-upload')
@Controller('file-upload')

export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    @Post('deleteSingleFile')
    async deleteSingleFile(@Body() req: FileUploadIdReq): Promise<GlobalResponseObject> {
        try {
            return await this.fileUploadService.deleteSingleFile(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('getSavedFilesData')
    async getSavedFilesData(@Body() req: FeatureFilesReqModel): Promise<GlobalResponseObject> {
        try {
            const req = new FeatureFilesReqModel(0, ReferenceFeaturesEnum.INS_CARTONS);
            return await this.fileUploadService.getSavedFilesData(
                req
            );
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/fileUpload')
    @UseInterceptors(FilesInterceptor('file', 10, {
        storage: diskStorage({
            destination: fileDestination,
            filename: (req, file, callback) => {
                const name = file.originalname.split('.')[0];
                const fileExtName = extname(file.originalname);
                const randomName = Array(4)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                callback(null, `${name}-${randomName}${fileExtName}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(png|jpg|jpeg|gif|webp|heic|heif|svg)$/i)) {
                return callback(new Error('Only image files (.png, .jpg, .jpeg, .gif, .webp, .heic, .heif, .svg) are allowed!'), false);
            }
            callback(null, true);
        }
    }))
    async fileUpload(@UploadedFiles() reqFiles: FileMetadataDTO[], @Body() uploadData: any): Promise<any> {
        try {
            return await this.fileUploadService.fileUpload(reqFiles, uploadData)
        } catch (error) {
            for (const file of reqFiles) {
                if (file?.filename) {
                    const createdFilePath = path.join(fileDestination, file?.filename)
                    if (fs.existsSync(createdFilePath))
                        fs.unlinkSync(createdFilePath)
                }
            }
            return returnException(GlobalResponseObject, error);
        }
    }

}

