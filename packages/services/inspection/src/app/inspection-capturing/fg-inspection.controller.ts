import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FgInspectionService } from "./fg-inspection.service";
import { returnException } from "@xpparel/backend-utils";
import { InsBasicInspectionRequest, GlobalResponseObject, PKMSInspectionHeaderDto, FgInspectionRequest, FileMetadataDTO } from "@xpparel/shared-models";
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from "path";
import * as fs from 'fs';
const fileDestination = path.join(__dirname, '../../../../packages/services/inspection/upload_files')

@ApiTags('FG Inspection Capture')
@Controller('fg-inspection-capture')
export class FgInspectionController {
	constructor(
		private service: FgInspectionService,
	) {

	}

	@Post('/captureInspectionResultsForFg')
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
	async captureInspectionResultsForFg(@UploadedFiles() filesData: FileMetadataDTO[], @Body() reqObj: any): Promise<GlobalResponseObject> {
		try {
			reqObj = JSON.parse(reqObj.formValues)
			return await this.service.captureInspectionResultsForFg(filesData, reqObj);
		} catch (error) {
			for (const file of filesData) {
				if (file?.filename) {
					const createdFilePath = path.join(fileDestination, file?.filename)
					if (fs.existsSync(createdFilePath)) fs.unlinkSync(createdFilePath)
				}
			}
			return returnException(GlobalResponseObject, error);
		}
	}
}
