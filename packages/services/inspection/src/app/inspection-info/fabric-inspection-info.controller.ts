import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonResponse, GlobalResponseObject, InsGetInspectionHeaderRollInfoResp, InsInspectionBasicInfoResponse, InsInspectionRequestsFilterRequest, InsInspectionTypeRequest, InsIrIdRequest, InsIrRollsResponse, InsPhIdRequest, InsRollBarcodeInspCategoryReq, RollsCheckListResponse } from "@xpparel/shared-models";
import { FabricInspectionInfoService } from "./fabric-inspection-info.service";

@ApiTags('Fabric Inspection Info')
@Controller('fabric-inspection-info')
export class FabricInspectionInfoController {
	constructor(
		private service: FabricInspectionInfoService,
		private fabricInspectionInfoService: FabricInspectionInfoService,
	) { }

	@Post('/getInspectionDetailsForRequestId')
	async getInspectionDetailsForRequestId(@Body() reqObj: InsIrIdRequest): Promise<InsGetInspectionHeaderRollInfoResp> {
		try {
			return await this.fabricInspectionInfoService.getInspectionDetailsForRequestId(reqObj.irId, reqObj.unitCode, reqObj.companyCode,reqObj.username,0,0,reqObj.isReport);
		} catch (error) {
			return returnException(InsGetInspectionHeaderRollInfoResp, error);
		}
	}

	@ApiBody({ type: InsInspectionTypeRequest })
	@Post('/getInspectionRequestBasicInfo') //getInspectionMaterialPendingData
	async getInspectionRequestBasicInfo(@Body() req: InsInspectionTypeRequest): Promise<InsInspectionBasicInfoResponse> {
		try {
			return await this.fabricInspectionInfoService.getInspectionRequestBasicInfo(req);
		} catch (error) {
			return returnException(InsInspectionBasicInfoResponse, error);
		}
	}

	@ApiBody({ type: InsIrIdRequest })
	@Post('/getInspectionRequestRollsInfo')
	async getInspectionRequestRollsInfo(@Body() req: InsIrIdRequest): Promise<InsIrRollsResponse> {
		try {
			return await this.fabricInspectionInfoService.getInspectionRequestRollsInfo(req);
		} catch (error) {
			return returnException(InsIrRollsResponse, error);
		}
	}

	@ApiBody({ type: InsInspectionRequestsFilterRequest })
	@Post('/getInspectionRequestBasicInfoByBatchCode')
	async getInspectionRequestBasicInfoByBatchCode(@Body() req: InsInspectionRequestsFilterRequest): Promise<InsInspectionBasicInfoResponse> {
		try {
			return await this.fabricInspectionInfoService.getInspectionRequestBasicInfoByBatchCode(req);
		} catch (error) {
			return returnException(InsInspectionBasicInfoResponse, error);
		}
	}

	@Post('/getInspectionDetailForRollIdAndInspCategory')
	async getInspectionDetailForRollIdAndInspCategory(@Body() reqObj: InsRollBarcodeInspCategoryReq): Promise<InsGetInspectionHeaderRollInfoResp> {
		try {
			return await this.fabricInspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj.barcode, reqObj.inspectionCategory, reqObj.unitCode, reqObj.companyCode);
		} catch (error) {
			return returnException(InsGetInspectionHeaderRollInfoResp, error);
		}
	} 

	@Post('/getCheckListPrintData')
	async getCheckListPrintData(@Body() reqObj: InsPhIdRequest): Promise<RollsCheckListResponse> {
		try {
			return await this.fabricInspectionInfoService.getCheckListPrintData(reqObj);
		} catch (error) {
			return returnException(RollsCheckListResponse, error);
		}
	} 

	@Post('checkForShowInInventoryUpdate')
	async checkForShowInInventoryUpdate(@Body() req: InsPhIdRequest): Promise<CommonResponse> {
		try {
			return await this.fabricInspectionInfoService.checkForShowInInventoryUpdate(req);
		} catch (error) {
			return returnException(GlobalResponseObject, error);
		}
	}

}
