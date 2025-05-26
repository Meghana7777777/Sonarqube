import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonResponse, returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, ItemCodeInfoResponse, ManufacturingOrderDumpRequest, ManufacturingOrderNumberRequest, MoDataForSoSummaryResponse, SoSummaryRequest, SupplierCodeReq } from '@xpparel/shared-models';
import { OrderManagementService } from './order-management-service';
import { PreIntegrationServiceOms } from '../../app-old/order-management/pre-integration.service';


@ApiTags('Order Management')
@Controller('order-management')
export class OrderManagementController {
    constructor(
        private OmsService: OrderManagementService
    ) {

    }


    @ApiBody({ type: SupplierCodeReq })
    @Post('/getOrderInformationFromDump')
    async getOrderInformationFromDump(@Body() reqObj: any): Promise<ItemCodeInfoResponse> {
        try {
            // return await this.service.getOrderInformationFromDump(reqObj);
        } catch (error) {
            return returnException(ItemCodeInfoResponse, error)
        }
    }


    /** Save Manufacturing Order into Order List */
    // @ApiBody({ type: ManufacturingOrderListRequest })
    // @Post('/saveManufacturingOrderListInformation')
    // async saveManufacturingOrderListInformation(@Body() reqObj: any): Promise<CommonResponse> {
    //     try {
    //         return await this.service.saveManufacturingOrderListInformation(reqObj);
    //     } catch (error) {
    //         return returnException(CommonResponse, error)
    //     }
    // }

    // /** Save Manufacturing Order into Order List */
    // @ApiBody({ type: CommonRequestAttrs })
    // @Post('/getOpenManufacturingOrderList')
    // async getOpenManufacturingOrderList(@Body() reqObj: any): Promise<CommonResponse> {
    //     try {
    //         return await this.service.getOpenManufacturingOrderList(reqObj);
    //     } catch (error) {
    //         return returnException(CommonResponse, error)
    //     }
    // }

    // /** Save Manufacturing Order into Order List */
    // @Cron('*/30 * * * *')
    // // @ApiBody({ type: CommonRequestAttrs })
    // @Post('/triggerManufacturingOrderintoOMS')
    // async triggerManufacturingOrderintoOMS(): Promise<CommonResponse> {
    //     try {
    //         console.log('calling this 5 min');
    //         const reqObj = new CommonRequestAttrs('integraiton', 'B3', '5000', 1);
    //         return await this.service.triggerManufacturingOrderintoOMS(reqObj);
    //     } catch (error) {
    //         return returnException(CommonResponse, error)
    //     }
    // }

    // @ApiBody({ type: OrderNoRequest })
    // @Post('/getAllOrdersWithSelectedFields')
    // async getAllOrdersWithSelectedFields(@Body() req: any): Promise<OrderWithSelectedFieldsResponse[]> {
    //     try {
    //         const orders = await this.service.getOrdersWithSelectedFields(req);
    //         return orders;
    //     } catch (error) {
    //         console.error('Error in getAllOrdersWithSelectedFields:', error);
    //         throw new Error('Error retrieving orders');
    //     }
    // }


    @ApiBody({ type: SoSummaryRequest })
    @Post('/getMoDataBySoForSoSummary')
    async getMoDataBySoForSoSummary(@Body() reqObj: any): Promise<MoDataForSoSummaryResponse> {
        console.log('getMoDataBySoForSoSummary', reqObj);
        try {
            return await this.OmsService.getMoDataBySoForSoSummary(reqObj);
        } catch (error) {
            return returnException(MoDataForSoSummaryResponse, error)
        }
    }


}


