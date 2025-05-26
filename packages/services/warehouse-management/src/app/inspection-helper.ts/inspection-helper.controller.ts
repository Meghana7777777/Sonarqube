import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { BasicRollInfoRespone, CodesRequest, CodesResponse, CommonRequestAttrs, GlobalResponseObject, GrnRollInfoForRollResp, HeaderDetails, HeaderDetailsResponse, InsBasicRollInfoRequest, InsFabInsCreateExtRefRequest, InsFabInsSelectedBatchResponse, InsPhIdRequest, InsRollBasicInfoResponse, PackListRecordForPackListIdResponse, PhItemIdResponse, PhItemLInesActualResponse, PlBatchLotRequest, RollCountResponse, RollNumberRequest } from "@xpparel/shared-models";
import { InspectionHelperService } from "./inspection-helper.service";
@ApiTags('Inspection')
@Controller('inspection-helper')
export class InspectionHelperController {
    constructor(
        private readonly inspectionHelperService: InspectionHelperService,
    ) { }


    @Post('getRollCountByPackListIdOrBatchNoOrLotNo')
    async getRollCountByPackListIdOrBatchNoOrLotNo(@Body() req: PlBatchLotRequest): Promise<RollCountResponse> {
        try {
            return this.inspectionHelperService.getRollCountByPackListIdOrBatchNoOrLotNo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('getItemLineActualRecord')
    async getItemLineActualRecord(@Body() req: RollNumberRequest): Promise<PhItemLInesActualResponse> {
        try {
            return this.inspectionHelperService.getItemLineActualRecord(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('getBasicRollInfoForRollId')
    async getBasicRollInfoForRollId(@Body() req: RollNumberRequest): Promise<BasicRollInfoRespone> {
        try {
            return this.inspectionHelperService.getBasicRollInfoForRollId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @Post('/getGrnRollInfoForRollId')
    async getGrnRollInfoForRollId(@Body() req: RollNumberRequest): Promise<GrnRollInfoForRollResp> {
        try {
            return await this.inspectionHelperService.getGrnRollInfoForRollId(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err)
        }
    }



    @Post('/getPhItemIdByPhItemLineId')
    async getPhItemIdByPhItemLineId(@Body() req: RollNumberRequest): Promise<PhItemIdResponse> {
        try {
            return await this.inspectionHelperService.getPhItemIdByPhItemLineId(req);
        } catch (err) {
            return returnException(PhItemIdResponse, err)
        }
    }

    @Post('/getFabricInspectionSelectedItems')
    async getFabricInspectionSelectedItems(@Body() req: InsFabInsCreateExtRefRequest): Promise<InsFabInsSelectedBatchResponse> {
        try {
            return await this.inspectionHelperService.getFabricInspectionSelectedItems(req);
        } catch (err) {
            return returnException(InsFabInsSelectedBatchResponse, err)
        }
    }

    @Post('getPackListRecordDataForPackListId')
    async getPackListRecordDataForPackListId(@Body() req: InsPhIdRequest): Promise<PackListRecordForPackListIdResponse> {
        try {
            return await this.inspectionHelperService.getPackListRecordDataForPackListId(req);
        } catch (err) {
            return returnException(PackListRecordForPackListIdResponse, err)
        }
    }

    @Post('getBasicRollInfoForInspection')
    async getBasicRollInfoForInspection(@Body() req: InsBasicRollInfoRequest): Promise<InsRollBasicInfoResponse> {
        try {
            return await this.inspectionHelperService.getBasicRollInfoForInspection(req);
        } catch (err) {
            return returnException(InsRollBasicInfoResponse, err)
        }
    }

    @Post('updateShowInInventory')
    async updateShowInInventory(@Body() req: InsPhIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.inspectionHelperService.updateShowInInventory(req);
        } catch (err) {
            return returnException(InsRollBasicInfoResponse, err)
        }
    }

    @Post('getHeaderDetailsForInspection')
    async getHeaderDetailsForInspection(@Body() req: InsPhIdRequest): Promise<HeaderDetailsResponse> {
        try {
            return await this.inspectionHelperService.getHeaderDetailsForInspection(req);
        } catch (err) {
            return returnException(HeaderDetailsResponse, err)
        }
    }

    @Post('getAllStyles')
    async getAllStyles(@Body() req: CommonRequestAttrs): Promise<CodesResponse> {
        try {
            return await this.inspectionHelperService.getAllStyles(req);
        } catch (err) {
            return returnException(CodesResponse, err)
        }
    }

    @Post('getLotsForStyle')
    async getLotsForStyle(@Body() req: CodesRequest): Promise<CodesResponse> {
        try {
            return await this.inspectionHelperService.getLotForStyle(req);
        } catch (err) {
            return returnException(CodesResponse, err);
        }
    }

    @Post('getItemCodesForLot')
    async getItemCodesForLot(@Body() req: CodesRequest): Promise<CodesResponse> {
        try {
            return await this.inspectionHelperService.getItemCodesForLot(req);
        } catch (err) {
            return returnException(CodesResponse, err);
        }
    }

    @Post('getRollIdsForItemCode')
    async getRollIdsForItemCode(@Body() req: CodesRequest): Promise<CodesResponse> {
        try {
            return await this.inspectionHelperService.getRollIdsForItemCode(req);
        } catch (err) {
            return returnException(CodesResponse, err);
        }
    }










}