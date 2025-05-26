import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, ItemCodeInfoResponse, ManufacturingOrderDumpRequest, MoNumberDropdownResponse, SaleOrderDumpRequest, SI_ManufacturingOrderInfoAbstractResponse, SI_ManufacturingOrderInfoResponse, SI_MoNumberRequest, SI_MoProductIdRequest, SI_MoProductSubLineIdsRequest, SI_SaleOrderInfoAbstractResponse, SI_SaleOrderInfoResponse, SI_SoNumberRequest, SOHeaderInfoModelResponse, SOPreviewResponse, StyleCodeRequest, StyleProductFgColorResp, SupplierCodeReq } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { SaleOrderCreationService } from './sale-order-creation.service';
import { SaleOrderCreationInfoService } from './sale-order-creation-info.service';

@ApiTags('Sale Order Creation Module')
@Controller('sale-order-creation')
// export class OrderCreationController {
//     constructor(
//         private service: OrderCreationService,
//         private infoService: OrderCreationInfoService
//     ) {

//     }

//     @ApiBody({ type: SupplierCodeReq })
//     @Post('/saveMo')
//     async getOrderInformationFromDump(@Body() reqObj: any): Promise<ItemCodeInfoResponse> {
//         try {
//             // return await this.service.getOrderInformationFromDump(reqObj);
//         } catch (error) {
//             return returnException(ItemCodeInfoResponse, error)
//         }
//     }


//     @ApiBody({ type: CommonRequestAttrs })
//     @Post('/getManufacturingOrdersList')
//     async getManufacturingOrdersList(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoAbstractResponse> {
//         try {
//             return await this.infoService.getManufacturingOrdersList(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoAbstractResponse, error)
//         }
//     }

//     @ApiBody({ type: CommonRequestAttrs })
//     @Post('/getUnConfirmedManufacturingOrdersInfo')
//     async getUnConfirmedManufacturingOrdersInfo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getUnConfirmedManufacturingOrdersInfo(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }

//     @ApiBody({ type: CommonRequestAttrs })
//     @Post('/getConfirmedManufacturingOrdersInfo')
//     async getConfirmedManufacturingOrdersInfo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getConfirmedManufacturingOrdersInfo(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }


//     @ApiBody({ type: SI_MoNumberRequest })
//     @Post('/getOrderInfoByManufacturingOrderNo')
//     async getOrderInfoByManufacturingOrderNo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getOrderInfoByManufacturingOrderNo(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }


//     

//     @ApiBody({ type: SI_MoNumberRequest })
//     @Post('/getDistinctProductFgColorInfoForMO')
//     async getDistinctProductFgColorInfoForMO(@Body() reqObj: any): Promise<StyleProductFgColorResp> {
//         try {
//             return await this.infoService.getDistinctProductFgColorInfoForMO(reqObj);
//         } catch (error) {
//             return returnException(StyleProductFgColorResp, error)
//         }
//     }


//     @ApiBody({ type: SI_MoNumberRequest })
//     @Post('/getOrderInfoByManufacturingOrderProductCodeFgColor')
//     async getOrderInfoByManufacturingOrderProductCodeFgColor(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getOrderInfoByManufacturingOrderProductCodeFgColor(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }


//     @ApiBody({ type: SI_MoProductSubLineIdsRequest })
//     @Post('/getMoInfoByPslId')
//     async getMoInfoByPslId(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getMoInfoByPslId(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }

//     @ApiBody({ type: StyleCodeRequest })
//     @Post('/getMoNumbersForStyleCode')
//     async getMoNumbersForStyleCode(@Body() reqObj: any): Promise<MoNumberDropdownResponse> {
//         try {
//             return await this.infoService.getMoNumbersForStyleCode(reqObj);
//         } catch (error) {
//             return returnException(MoNumberDropdownResponse, error)
//         }
//     }


//     @ApiBody({ type: CommonRequestAttrs })
//     @Post('/getOpenMo')
//     async getOpenMo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getOpenMo(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }

//     @ApiBody({ type: CommonRequestAttrs })
//     @Post('/getInProgressMo')
//     async getInProgressMo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getInProgressMo(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }


//     @ApiBody({ type: CommonRequestAttrs })
//     @Post('/getClosedMo')
//     async getClosedMo(@Body() reqObj: any): Promise<SI_ManufacturingOrderInfoResponse> {
//         try {
//             return await this.infoService.getClosedMo(reqObj);
//         } catch (error) {
//             return returnException(SI_ManufacturingOrderInfoResponse, error)
//         }
//     }

// }
export class SaleOrderCreationController {
    constructor(
        private service: SaleOrderCreationService,
        private infoService: SaleOrderCreationInfoService
    ) {

    }

    @ApiBody({ type: SaleOrderDumpRequest })
    @Post('/upLoadSaleOrders')
    async upLoadSaleOrders(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.upLoadSaleOrders(reqObj);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error)
        }
    }


    @ApiBody({ type: SI_SoNumberRequest })
    @Post('/deleteSaleOrders')
    async deleteSaleOrders(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteSaleOrders(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getSaleOrdersList')
    async getSaleOrdersList(@Body() reqObj: any): Promise<SI_SaleOrderInfoAbstractResponse> {
        try {
            return await this.infoService.getSaleOrdersList(reqObj);
        } catch (error) {
            return returnException(SI_SaleOrderInfoAbstractResponse, error)
        }
    }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getUnConfirmedSaleOrdersInfo')
    async getUnConfirmedSaleOrdersInfo(@Body() reqObj: any): Promise<SI_SaleOrderInfoResponse> {
        try {
            return await this.infoService.getUnConfirmedSaleOrdersInfo(reqObj);
        } catch (error) {
            console.log(error);
            return returnException(SI_SaleOrderInfoResponse, error)
        }
    }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getConfirmedSaleOrdersInfo')
    async getConfirmedSaleOrdersInfo(@Body() reqObj: any): Promise<SI_SaleOrderInfoResponse> {
        try {
            return await this.infoService.getConfirmedSaleOrdersInfo(reqObj);
        } catch (error) {
            return returnException(SI_SaleOrderInfoResponse, error)
        }
    }

    @ApiBody({ type: SI_SoNumberRequest })
    @Post('/getOrderInfoBySaleOrderNo')
    async getOrderInfoBySaleOrderNo(@Body() reqObj: any): Promise<SI_SaleOrderInfoResponse> {
        try {
            return await this.infoService.getOrderInfoBySaleOrderNo(reqObj);
        } catch (error) {
            return returnException(SI_SaleOrderInfoResponse, error)
        }
    }

    @ApiBody({ type: SI_SoNumberRequest })
    @Post('/confirmSaleOrder')
    async confirmSaleOrder(@Body() reqObj: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmSaleOrder(reqObj);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }


    @ApiBody({ type: SI_MoProductIdRequest })
    @Post('/getSoInfoHeader')
    async getSoInfoHeader(@Body() reqObj: any): Promise<SOHeaderInfoModelResponse> {
        try {
            return await this.infoService.getSoInfoHeader(reqObj); // do not forget to edit 
        } catch (error) {
            return returnException(SOHeaderInfoModelResponse, error)
        }
    }

    @ApiBody({ type: SI_SoNumberRequest })
    @Post('/getSoPreviewData')
    async getSoPreviewData(@Body() reqObj: any): Promise<SOPreviewResponse> {
        try {
            return await this.infoService.getSoPreviewData(reqObj); // do not forget to edit 
        } catch (error) {
            return returnException(SOPreviewResponse, error)
        }
    }
}
