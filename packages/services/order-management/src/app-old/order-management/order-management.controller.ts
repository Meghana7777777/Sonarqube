import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreIntegrationServiceOms } from './pre-integration.service';
import { OrderManagementService } from './order-management-service';


@ApiTags('Order Management')
@Controller('order-management')
export class OrderManagementController {
    constructor(
        private service: PreIntegrationServiceOms,
        private OmsService:OrderManagementService
    ) {

    }


    // @ApiBody({ type: SupplierCodeReq })
    // @Post('/getOrderInformationFromDump')
    // async getOrderInformationFromDump(@Body() reqObj: any): Promise<ItemCodeInfoResponse> {
    //     try {
    //         // return await this.service.getOrderInformationFromDump(reqObj);
    //     } catch (error) {
    //         return returnException(ItemCodeInfoResponse, error)
    //     }
    // }

    /** Save Sale Order Information */
    // @ApiBody({ type: ManufacturingOrderNumberRequest })
    // @Post('/saveSaleOrderInformation')
    // async saveSaleOrderInformation(@Body() reqObj: any): Promise<CommonResponse> {
    //     try {
    //         return await this.service.saveSaleOrderInformation(reqObj);
    //     } catch (error) {
    //         return returnException(CommonResponse, error)
    //     }
    // }
    /** Save Sale Order into Order List */
    // @ApiBody({ type: ManufacturingOrderListRequest })
    // @Post('/saveSaleOrderListInformation')
    // async saveSaleOrderListInformation(@Body() reqObj: any): Promise<CommonResponse> {
    //     try {
    //         return await this.service.saveSaleOrderListInformation(reqObj);
    //     } catch (error) {
    //         return returnException(CommonResponse, error)
    //     }
    // }

    // /** Save Sale Order into Order List */
    // @ApiBody({ type: CommonRequestAttrs })
    // @Post('/getOpenSaleOrderList')
    // async getOpenSaleOrderList(@Body() reqObj: any): Promise<CommonResponse> {
    //     try {
    //         return await this.service.getOpenSaleOrderList(reqObj);
    //     } catch (error) {
    //         return returnException(CommonResponse, error)
    //     }
    // }

    // /** Save Sale Order into Order List */
    // @Cron('*/30 * * * *')
    // // @ApiBody({ type: CommonRequestAttrs })
    // @Post('/triggerSaleOrderintoOMS')
    // async triggerSaleOrderintoOMS(): Promise<CommonResponse> {
    //     try {
    //         console.log('calling this 5 min');
    //         const reqObj = new CommonRequestAttrs('integraiton', 'B3', '5000', 1);
    //         return await this.service.triggerSaleOrderintoOMS(reqObj);
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

    // @ApiBody({ type: ManufacturingOrderNumberRequest })
    // @Post('/saveSaleOrderDumpData')
    // async saveSaleOrderDumpData(@Body() reqObj: ManufacturingOrderDumpRequest): Promise<GlobalResponseObject> {
    //     try {
    //         return await this.OmsService.saveSaleOrderDumpData(reqObj);
    //     } catch (error) {
    //         return returnException(GlobalResponseObject, error)
    //     }
    // }

}


