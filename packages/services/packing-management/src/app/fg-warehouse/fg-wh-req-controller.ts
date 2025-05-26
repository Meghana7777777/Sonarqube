import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { handleResponse } from "@xpparel/backend-utils";
import { FgwhPackListIdsResponse, FgwhSecurityUpdateReq, CartonBarcodeRequest, CartonHeadInfoResponse, CommonResponse, FgWhHeaderIdReqDto, FgWhLinesResponseModel, FgWhSrIdPlIdsRequest, FgWhStageReq, FgWhStatusReq, PKMSFgWhereHouseCreateDto, WhFloorPackListResp, WhRequestHeadResponse, WhFloorRequest, WhRequestDashboardInfoResp, CartonBarcodeLocationRequest, GlobalResponseObject, PKMSWhCodeReqDto, FgWhReportResponseModel, PKMSFgWhReqIdDto, PKMSPackJobIdReqDto, PKMSFgWhReqNoResponseModel, CartonPalletMapRequest, PKMSReqItemTruckMapCreateDto, CartonBarCodesReqDto, UpdateFgWhOurReqDto } from "@xpparel/shared-models";
import { FgWhReqHeaderDetailsModel, FgWhReqHeaderDetailsResponse, FgWhReqHeaderFilterReq } from "@xpparel/shared-models";
import { FgWarehouseReqService } from "./fg-ware-house-req-service";
import { FgWarehouseInfoService } from "./fg-wh-info.service";
import { FgWarehouseBarcodeScanningService } from "./fg-wh-barcode-scanning.service";

@ApiTags('Fg Warehouse Requset')
@Controller('fg-warehouse-req')
export class FgWarehouseReqController {
    constructor(
        private fgWhService: FgWarehouseReqService,
        private fgInfoService: FgWarehouseInfoService,
        private barcodeScanService: FgWarehouseBarcodeScanningService,
    ) {

    }

    @Post('saveFgWhereHouseReq')
    async saveFgWhereHouseReq(@Body() dto: PKMSFgWhereHouseCreateDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgWhService.saveFgWhereHouseReq(dto),
            CommonResponse
        );
    }


    @Post('getFgWhInfoForGivenPackListIds')
    async getFgWhInfoForGivenPackListIds(@Body() dto: FgWhSrIdPlIdsRequest): Promise<WhRequestHeadResponse> {
        return handleResponse(async () => this.fgInfoService.getFgWhInfoForGivenPackListIds(dto), WhRequestHeadResponse);
    }

    @Post('getWhFloorInfoForPackListIds')
    async getWhFloorInfoForPackListIds(@Body() dto: FgWhSrIdPlIdsRequest): Promise<WhFloorPackListResp> {
        return handleResponse(async () => this.fgInfoService.getWhFloorInfoForPackListIds(dto), WhFloorPackListResp);
    }

    @Post('getFgWhHeaderReqDetails')
    async getFgWhHeaderReqDetails(@Body() req: FgWhReqHeaderFilterReq): Promise<FgWhReqHeaderDetailsResponse> {
        return handleResponse(
            async () => this.fgWhService.getFgWhHeaderReqDetails(req),
            FgWhReqHeaderDetailsResponse
        );
    }

    @Post('updateFgWhReqStage')
    async updateFgWhReqStage(@Body() req: FgWhStageReq): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgWhService.updateFgWhReqStage(req),
            CommonResponse
        );
    }

    @Post('updateFgWhReqApprovalStatus')
    async updateFgWhReqApprovalStatus(@Body() req: FgWhStatusReq): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgWhService.updateFgWhReqApprovalStatus(req),
            CommonResponse
        );
    }

    @Post('updateFgWhReqRejectedStatus')
    async updateFgWhReqRejectedStatus(@Body() req: FgWhStatusReq): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgWhService.updateFgWhReqRejectedStatus(req),
            CommonResponse
        );
    }



    @Post('getFgWhReqLines')
    async getFgWhReqLines(@Body() req: FgWhHeaderIdReqDto): Promise<FgWhLinesResponseModel> {
        return handleResponse(
            async () => this.fgWhService.getFgWhReqLines(req),
            FgWhLinesResponseModel
        );
    }

    @Post('updateSecurityDetails')
    async updateSecurityDetails(@Body() req: FgwhSecurityUpdateReq): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgWhService.updateSecurityDetails(req),
            CommonResponse
        );
    }

    @Post('getPackListIdsForHeaderReqId')
    async getPackListIdsForHeaderReqId(@Body() req: FgWhHeaderIdReqDto): Promise<FgwhPackListIdsResponse> {
        return handleResponse(
            async () => this.fgWhService.getPackListIdsForHeaderReqId(req),
            FgwhPackListIdsResponse
        );
    }


    @Post('FgWarehouseInBarcodeFgIn')
    async FgWarehouseInBarcodeFgIn(@Body() req: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
        return handleResponse(
            async () => this.barcodeScanService.FgWarehouseInBarcodeFgIn(req),
            CartonHeadInfoResponse
        );
    }

    @Post('fgInPalletisation')
    async fgInPalletisation(@Body() req: CartonPalletMapRequest): Promise<CartonHeadInfoResponse> {
        return handleResponse(
            async () => this.barcodeScanService.fgInPalletisation(req),
            CartonHeadInfoResponse
        );
    }


    @Post('FgWarehouseInBarcodeFgOut')
    async FgWarehouseInBarcodeFgOut(@Body() req: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
        return handleResponse(
            async () => this.barcodeScanService.FgWarehouseInBarcodeFgOut(req),
            CartonHeadInfoResponse
        );
    }

    @Post('FgWarehouseInBarcodeLocationOut')
    async FgWarehouseInBarcodeLocationOut(@Body() req: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
        return handleResponse(
            async () => this.barcodeScanService.FgWarehouseInBarcodeLocationOut(req),
            CartonHeadInfoResponse
        );
    }


    @Post('getWhRequestDetailsForDashboard')
    async getWhRequestDetailsForDashboard(@Body() req: WhFloorRequest): Promise<WhRequestDashboardInfoResp> {
        return handleResponse(
            async () => this.fgInfoService.getWarehouseArrivalsAndDispatchInfo(req),
            WhRequestDashboardInfoResp
        );
    }

    @Post('FgWarehouseInBarcodeLocationMapping')
    async FgWarehouseInBarcodeLocationMapping(@Body() req: CartonBarcodeLocationRequest): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.barcodeScanService.FgWarehouseInBarcodeLocationMapping(req),
            GlobalResponseObject
        );
    }

    @Post('getWhReqReport')
    async getWhReqReport(@Body() req: PKMSWhCodeReqDto): Promise<FgWhReportResponseModel> {
        return handleResponse(
            async () => this.barcodeScanService.getWhReqReport(req),
            FgWhReportResponseModel
        );
    }

    @Post('getCountAgainstCurrentStage')
    async getCountAgainstCurrentStage(@Body() req: FgWhReqHeaderFilterReq): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgWhService.getCountAgainstCurrentStage(req),
            CommonResponse
        );
    }


    @Post('startFgInReqSession')
    async startFgInReqSession(@Body() req: PKMSFgWhReqIdDto): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.barcodeScanService.startFgInReqSession(req),
            GlobalResponseObject
        );
    }


    @Post('getFgReqNoAgainstToPackJobNo')
    async getFgReqNoAgainstToPackJobNo(@Body() req: PKMSPackJobIdReqDto): Promise<PKMSFgWhReqNoResponseModel> {
        return handleResponse(
            async () => this.fgWhService.getFgReqNoAgainstToPackJobNo(req),
            PKMSFgWhReqNoResponseModel
        );
    }

    @Post('savePkmsItemRequestTruckMap')
    async savePkmsItemRequestTruckMap(@Body() dto: PKMSReqItemTruckMapCreateDto): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.fgInfoService.savePkmsItemRequestTruckMap(dto),
            GlobalResponseObject
        );
    }


    @Post('getFgWareHouseIdsByCartons')
    async getFgWareHouseIdsByCartons(@Body() dto: CartonBarCodesReqDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgInfoService.getFgWareHouseIdsByCartons(dto),
            CommonResponse
        );
    }



    @Post('updateFgWareHouseRejected')
    async updateFgWareHouseRejected(@Body() dto: UpdateFgWhOurReqDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.fgWhService.updateFgWareHouseRejected(dto),
            CommonResponse
        );
    }


}