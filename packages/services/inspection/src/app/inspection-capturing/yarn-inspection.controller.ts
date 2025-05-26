import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonResponse } from "@xpparel/shared-models";
import path from "path";
import { YarnInspectionService } from "./yarn-inspection.service";
const fileDestination = path.join(__dirname, '../../../../packages/services/inspection/upload_files')

@ApiTags('Yarn Inspection Capture')
@Controller('yarn-inspection-capture')
export class YarnInspectionController {
	constructor(
		private service: YarnInspectionService,
	) {

	}

	// @Post('/captureInspectionResultsForYarn')
	// @UseInterceptors(FilesInterceptor('document', 200, {
	// 	storage: diskStorage({
	// 		destination: fileDestination,
	// 		filename: (req, file, callback) => {
	// 			const name = file.originalname.split('.')[0];
	// 			const fileExtName = extname(file.originalname);
	// 			const randomName = Array(4)
	// 				.fill(null)
	// 				.map(() => Math.round(Math.random() * 16).toString(16))
	// 				.join('');
	// 			callback(null, `${name}-${randomName}${fileExtName}`);
	// 		},
	// 	}),
	// 	fileFilter: (req, file, callback) => {
	// 		if (!file.originalname.match(/\.(pdf|doc|docx|odt|txt|xls|xlsx|ppt|pptx|key|pps|ppsx|png|jpg|jpeg|gif|webp|heic|heif|svg)$/)) {
	// 			return callback(new Error('Only .pdf,.doc, .docx,.xls, .xlsx,.key,.odt,.txt,.ppt, .pptx, .pps, .ppsx,.png,.jpg ,.jpeg,.gif,.webp,.heic,.heif,.svg*, jpeg files are allowed!'), false);
	// 		}
	// 		callback(null, true);
	// 	},
	// }))
	@Post('/captureInspectionResultsForYarn')
	@UseInterceptors(AnyFilesInterceptor())
	async captureInspectionResultsForYarn(@Body() req:any): Promise<CommonResponse> {
		try {
			console.log('Raw Request Body:', req);
			req = JSON.parse(req.formValues);
			console.log('reqqq',req);
			// console.log('Parsed Data:', formValues);

			return await this.service.captureInspectionResultsForYarn(req);
		} catch (error) {
			return returnException(CommonResponse, error);
		}
	}
}
