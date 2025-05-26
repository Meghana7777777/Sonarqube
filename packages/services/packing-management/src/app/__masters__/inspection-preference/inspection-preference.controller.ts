import { Body, Controller, Post, UploadedFiles, UseInterceptors, } from "@nestjs/common";
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from "@nestjs/swagger";
import { handleResponse, returnException } from "@xpparel/backend-utils";
import { CommonResponse, GlobalResponseObject, PackInspectionCreateRequest, PackListAndPoIdsReqDto, PKMSInsReqIdDto, PKMSInsStatusReqDto, PKMSIrActivityChangeRequest, PoReqModel, SystematicPreferenceReqModel, SystematicPreferenceResponse } from "@xpparel/shared-models";
import * as fs from 'fs';
import { diskStorage } from 'multer';
import path, { extname } from "path";
import { FileMetadataDTO } from "../../__common__/dto/file-meta-data-dto";
import { InspectionPreferenceService } from "./inspection-preference-service";

const fileDestination = path.join(__dirname, '../../../../packages/services/packing-management/upload_files')


@ApiTags('Ip-Interface')
@Controller('Ip-Interface')
export class InspectionPreferenceController {
    constructor(private readonly inspectionPreferenceService: InspectionPreferenceService) { }

    @Post('saveSystematicPreference')
    async saveSystematicPreference(@Body() req: SystematicPreferenceReqModel): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.inspectionPreferenceService.saveSystematicPreference(req),
            SystematicPreferenceResponse
        );
    }


    @Post('getSystemPreferences')
    async getSystemPreferences(@Body() req: PoReqModel): Promise<SystematicPreferenceResponse> {
        return handleResponse(
            async () => this.inspectionPreferenceService.getSystemPreferences(req),
            SystematicPreferenceResponse
        );
    }

    @Post('/inspectionConfirm')
    async inspectionConfirm(@Body() reqModel: PackInspectionCreateRequest[]): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.inspectionPreferenceService.createDefaultInspReqForInspCategories(reqModel),
            SystematicPreferenceResponse
        );
    }

    @Post('/getInspectionMaterialPendingData')
    async getInspectionMaterialPendingData(@Body() reqModel: PackListAndPoIdsReqDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.inspectionPreferenceService.getInspectionMaterialPendingData(reqModel),
            CommonResponse
        );
    }

    @Post('/updatePMSInspectionActivityStatus')
    async updatePMSInspectionActivityStatus(@Body() reqModel: PKMSIrActivityChangeRequest): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.inspectionPreferenceService.updatePMSInspectionActivityStatus(reqModel),
            GlobalResponseObject
        );
    }

    @Post('/getPKMSInsCartonsData')
    async getPKMSInsCartonsData(@Body() reqModel: PKMSInsReqIdDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.inspectionPreferenceService.getPKMSInsCartonsData(reqModel),
            CommonResponse
        );
    }

    @Post('/getInsCartonsSummary')
    async getInsCartonsSummary(@Body() reqModel: PKMSInsReqIdDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.inspectionPreferenceService.getInsCartonsSummary(reqModel),
            CommonResponse
        );
    }


    @Post('/saveInspectionDetails')
    @UseInterceptors(FilesInterceptor('document', 200, {
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
            if (!file.originalname.match(/\.(pdf|doc|docx|odt|txt|xls|xlsx|ppt|pptx|key|pps|ppsx|png|jpg|jpeg|gif|webp|heic|heif|svg)$/)) {
                return callback(new Error('Only .pdf,.doc, .docx,.xls, .xlsx,.key,.odt,.txt,.ppt, .pptx, .pps, .ppsx,.png,.jpg ,.jpeg,.gif,.webp,.heic,.heif,.svg*, jpeg files are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    async saveInspectionDetails(@UploadedFiles() filesData: FileMetadataDTO[], @Body() reqModel: any): Promise<CommonResponse> {
        try {
            reqModel = JSON.parse(reqModel.formValues)
            return await this.inspectionPreferenceService.saveInspectionDetails(filesData, reqModel);
        } catch (error) {
            for (const file of filesData) {
                if (file?.filename) {
                    const createdFilePath = path.join(fileDestination, file?.filename)
                    if (fs.existsSync(createdFilePath)) fs.unlinkSync(createdFilePath)
                }
            }

            return returnException(CommonResponse, error)
        }
    }


    @Post('/getInspectionStatus')
    async getInspectionStatus(@Body() reqModel: PKMSInsStatusReqDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.inspectionPreferenceService.getInspectionStatus(reqModel),
            CommonResponse
        );
    }



}


