import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CommonResponse, handleResponse, returnException } from "@xpparel/backend-utils";
import { CommonRequestAttrs, GlobalResponseObject, MoNumberResDto, MoPslIdsRequest, MoPslQtyInfoResponse, PackOrderCreationRequest, PackSerialDropDownResponse, PackSerialRequest, PackSubLineIdsByOrderNoRequest, PackSubLineIdsByOrderNoResponse, PKMS_C_ReadyToPackFgsRequest, PoDataSummaryResponse, ProcessingOrderCreationInfoResponse, ProcessingOrderCreationRequest, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, SI_MoNumberRequest, StyleMoRequest } from "@xpparel/shared-models";
import { PreIntegrationService } from "./pre-integration.service";
import { PKMSFgCreationService } from "./fg-creation.service";

@ApiTags('Integrations')
@Controller('pre-integration')
export class PreIntegrationController {
    constructor(private readonly service: PreIntegrationService,
        private readonly fgCreationService: PKMSFgCreationService
    ) { }

    @ApiBody({ type: ProcessingOrderCreationRequest })
    @Post('/createPKMSProcessingOrder')
    async createPKMSProcessingOrder(@Body() req: ProcessingOrderCreationRequest): Promise<GlobalResponseObject> {
        return handleResponse(
            async () => this.service.createPKMSProcessingOrder(req),
            GlobalResponseObject
        );
    }


    @Post('/getOrderInfo')
    async getOrderInfo(@Body() req: PackSerialRequest): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getOrderInfo(req),
            CommonResponse
        );
    }

    @Post('/getMOInfoForPKMSPrcOrdCreation')
    async getMOInfoForPKMSPrcOrdCreation(@Body() req: StyleMoRequest): Promise<ProcessingOrderCreationInfoResponse> {
        return handleResponse(
            async () => this.service.getMOInfoForPKMSPrcOrdCreation(req),
            ProcessingOrderCreationInfoResponse
        );
    }

    @Post('/deletePackOrder')
    async deletePackOrder(@Body() req: PackSerialRequest): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.deletePackOrder(req),
            CommonResponse
        );
    }

    @Post('/getAllPackSerialDropdownData')
    async getAllPackSerialDropdownData(@Body() req: CommonRequestAttrs): Promise<PackSerialDropDownResponse> {
        return handleResponse(
            async () => this.service.getAllPackSerialDropdownData(req),
            CommonResponse
        );
    }

    @Post('/getPackSubLineIdsByOrderNumber')
    async getPackSubLineIdsByOrderNumber(@Body() req: PackSubLineIdsByOrderNoRequest): Promise<PackSubLineIdsByOrderNoResponse> {
        return handleResponse(
            async () => this.service.getPackSubLineIdsByOrderNumber(req),
            PackSubLineIdsByOrderNoResponse
        );
    }


    @Post('/getPackSerialNumbers')
    async getPackSerialNumbers(@Body() req: CommonRequestAttrs): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getPackSerialNumbers(req),
            CommonResponse
        );
    }

    @Post('/getPKMSPoInfoForStyleAndMo')
    async getPKMSPoInfoForStyleAndMo(@Body() req: StyleMoRequest): Promise<ProcessingOrderInfoResponse> {
        return handleResponse(
            async () => this.service.getPKMSPoInfoForStyleAndMo(req),
            ProcessingOrderInfoResponse
        );
    }

    @Post('/getProcessingOrderInfo')
    async getProcessingOrderInfo(@Body() req: ProcessingOrderInfoRequest): Promise<ProcessingOrderInfoResponse> {
        return handleResponse(
            async () => this.service.getProcessingOrderInfo(req),
            ProcessingOrderInfoResponse
        );
    }

    @Post('getPKMSMoNumbers')
    async getPKMSMoNumbers(@Body() req: CommonRequestAttrs): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getPKMSMoNumbers(req),
            CommonResponse
        );
    }

    @Post('getPKMSPackOrdersByMo')
    async getPKMSPackOrdersByMo(@Body() req: MoNumberResDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.service.getPKMSPackOrdersByMo(req),
            CommonResponse
        );
    }

    @Post('/getPoQtysInfoForMoPSLIds')
    async getPoQtysInfoForMoPSLIds(@Body() req: MoPslIdsRequest): Promise<MoPslQtyInfoResponse> {
        return handleResponse(
            async () => this.service.getPoQtysInfoForMoPSLIds(req),
            MoPslQtyInfoResponse
        );
    }

    @Post('/getPoSummary')
    async getPoSummary(@Body() req: ProcessingOrderSerialRequest): Promise<PoDataSummaryResponse> {
        return handleResponse(
            async () => this.service.getPoSummary(req),
            PoDataSummaryResponse
        );
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/createOslRefIdsForMo')
    async createOslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.createOslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/deleteOslRefIdsForMo')
    async deleteOslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.deleteOslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: PKMS_C_ReadyToPackFgsRequest })
    @Post('/logReadyToPackFgs')
    async logReadyToPackFgs(@Body() req: PKMS_C_ReadyToPackFgsRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.logReadyToPackFgs(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

}