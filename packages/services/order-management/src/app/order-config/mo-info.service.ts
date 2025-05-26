import { Injectable } from "@nestjs/common";
import { RawOrderHeaderInfoResponse, RawOrderInfoResponse, RawOrderNoRequest } from "@xpparel/shared-models";
import { MoInfoRepository } from "../repository/mo-info.repository";
import { MoLineRepository } from "../repository/mo-line.repository";
import { MoLineProductRepository } from "../repository/mo-line-product.repository";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { OrderCreationInfoService } from "../order-creation/order-creation-info.service";


@Injectable()
export class MoInfoService {
    constructor(

        private orderCreationInfoService: OrderCreationInfoService
    ) {

    }


    async getRawOrderInfo(reqModel: RawOrderNoRequest): Promise<RawOrderInfoResponse> {
        return this.orderCreationInfoService.getRawOrderInfo(reqModel);
    }

    async getRawOrderHeaderInfo(reqModel: RawOrderNoRequest): Promise<RawOrderHeaderInfoResponse> {
        return this.orderCreationInfoService.getRawOrderHeaderInfo(reqModel)
    }
}