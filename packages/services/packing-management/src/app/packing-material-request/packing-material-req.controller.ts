import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { handleResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, PackJobsByPackListIdsRequest, PackJobsResponseForPackList, PackMAterialRequest, PackMaterialResponse, PackMaterialSummaryResponse, PackMatReqID, PackMatReqModel, PK_MaterialRequirementDetailResp, PKMS_C_JobTrimReqIdRequest, PKMS_R_JobTrimResponse, WMS_C_IssuanceIdRequest } from "@xpparel/shared-models";
import { PackingMaterialReqService } from "./packing-material-req.service";
import { PAckingMaterialReqInfoService } from "./packing-material-info-service";



@ApiTags('PackingMaterial')
@Controller('pack-material-req')
export class PackingMaterialReqController {
	constructor(
		private readonly pmInfoService: PAckingMaterialReqInfoService,
		private readonly pmReqService: PackingMaterialReqService,
	) { }

	@Post('/getPackJobsForPackListIds')
	async getPackJobsForPackListIds(@Body() req: PackJobsByPackListIdsRequest): Promise<PackJobsResponseForPackList> {
		return handleResponse(
			async () => this.pmInfoService.getPackJobsForPackListIds(req),
			PackJobsResponseForPackList
		);
	}

	@Post('/getBOMInfoForPackJobs')
	async getBOMInfoForPackJobs(@Body() req: PackMatReqModel): Promise<PK_MaterialRequirementDetailResp> {
		return handleResponse(
			async () => this.pmInfoService.getBOMInfoForPackJobs(req),
			PK_MaterialRequirementDetailResp
		);
	}


	@Post('/createMaterialRequest')
	async createMaterialRequest(@Body() req: PackMatReqModel): Promise<GlobalResponseObject> {
		return handleResponse(
			async () => this.pmReqService.createMaterialRequest(req),
			GlobalResponseObject
		);
	}


	@Post('/getPAckMaterialsByPackListID')
	async getPAckMaterialsByPackListID(@Body() req: PackMAterialRequest): Promise<PackMaterialResponse> {
		return handleResponse(
			async () => this.pmReqService.getPAckMaterialsByPackListID(req),
			PackMaterialResponse
		);
	}


	@Post('/getPackMaterialSummaryDataById')
	async getPackMaterialSummaryDataById(@Body() req: PackMatReqID): Promise<PackMaterialSummaryResponse> {
		return handleResponse(
			async () => this.pmReqService.getPackMaterialSummaryDataById(req),
			PackMaterialSummaryResponse
		);
	}

	@Post('/approvePMRNo')
	async approvePMRNo(@Body() req: PackMatReqID): Promise<GlobalResponseObject> {
		return handleResponse(
			async () => this.pmReqService.approvePMRNo(req),
			GlobalResponseObject
		);
	}

	@Post('/getRequestedTrimMaterialForReqId')
	async getRequestedTrimMaterialForReqId(@Body() req: PKMS_C_JobTrimReqIdRequest): Promise<PKMS_R_JobTrimResponse> {
		return handleResponse(
			async () => this.pmInfoService.getRequestedTrimMaterialForReqId(req),
			PKMS_R_JobTrimResponse
		);
	}

	@Post('/updateIssuedPackMaterialFromWms')
	async updateIssuedPackMaterialFromWms(@Body() req: WMS_C_IssuanceIdRequest): Promise<GlobalResponseObject> {
		return handleResponse(
			async () => this.pmReqService.updateIssuedPackMaterialFromWms(req),
			GlobalResponseObject
		);
	}

}