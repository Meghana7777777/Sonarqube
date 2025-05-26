import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, ProcessTypeEnum, OpFormEnum, OpenPoDetailsResponse, OperationCategoryFormRequest, OperationCodeRequest, OperationCreateRequest, OperationDataResponse, OperationResponse, OrderPtypeMapRequest, PoNumberRequest, ProductIdRequest, ProductItemResponse, RawOrderIdRequest, RawOrderNoRequest, ManufacturingOrderResp, MoDumpModal, SubProductItemMapRequest, SupplierCodeReq, SupplierInfoResponse, MachineNameRequest } from '@xpparel/shared-models';
import { OperationService } from './operation.service';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { OperationInfoService } from './operation-info.service';


@ApiTags('Operation')
@Controller('operation')
export class OperationController {
    constructor(
        private service: OperationService,
        private infoService: OperationInfoService,
    ) {

    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: OperationCreateRequest })
    @Post('/createOperation')
    async createOperation(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createOperation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: OperationCodeRequest })
    @Post('/deleteOperation')
    async deleteOperation(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteOperation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: OperationCodeRequest })
    @Post('/deActivateOperation')
    async deActivateOperation(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deActivateOperation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * WRITER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: OperationCodeRequest })
    @Post('/activateOperation')
    async activateOperation(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.activateOperation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getAllOperations')
    async getAllOperations(@Body() req: any): Promise<OperationResponse> {
        try {
            return await this.service.getAllOperations(req);
        } catch (error) {
            return returnException(OperationResponse, error);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getAllOperationbyId')
    async getAllOperationbyId(@Body() req: any): Promise<OperationResponse> {
        try {
            return await this.service.getAllOperations(req);
        } catch (error) {
            return returnException(OperationResponse, error);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: OperationCategoryFormRequest })
    @Post('/getOperationsByCategory')
    async getOperationsByCategory(@Body() req: any): Promise<OperationResponse> {
        try {
            return await this.service.getOperationsByCategory(req);
        } catch (error) {
            return returnException(OperationResponse, error);
        }
    }

    @Post('/OperationsTypeDropDown')
    async OperationsTypeDropDown(@Body() req: any): Promise<OperationDataResponse> {
        try {
            return this.service.OperationsTypeDropDown(req);
        } catch (error) {
            return returnException(OperationDataResponse, error)
        }
    }



    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: OperationCategoryFormRequest })
    @Post('/getOperationsByOperationForm')
    async getOperationsByOperationForm(@Body() req: any): Promise<OperationResponse> {
        try {
            return await this.service.getOperationsByOperationForm(req);
        } catch (error) {
            return returnException(OperationResponse, error);
        }
    }

    @Post('/getAllActiveOperations')
    async getAllActiveOperations(@Body() req: any): Promise<CommonResponse> {
        try {
            return await this.service.getAllActiveOperations();
        } catch (error) {
            return returnException(CommonResponse, error);
        }
    }

    @ApiBody({ type: MachineNameRequest })
    @Post('/getOperationsByMachineName')
    async getOperationsByMachineName(@Body() req: any): Promise<OperationResponse> {
        try {
            return await this.service.getOperationsByMachineName(req);
        } catch (error) {
            return returnException(OperationResponse, error);
        }
    }


    @ApiBody({ type: OperationCodeRequest })
    @Post('/getOperationbyOpCode')
    async getOperationbyOpCode(@Body() req: any): Promise<OperationResponse> {
        try {
            return await this.service.getOperationbyOpCode(req);
        } catch (error) {
            return returnException(OperationResponse, error);
        }
    }

}