import { Body, Controller, Post } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { CommonResponse, handleResponse } from "@xpparel/backend-utils";
import { CommonIdReqModal, CommonRequestAttrs, MaterialReqModel, PackSerialNumberReqDto } from "@xpparel/shared-models";
import { ItemsCreateDTO } from "./dto/items-create.dto";
import { ItemCodeInfoResponse, ItemsResponse } from "@xpparel/shared-models";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Items')
@Controller('items')
export class ItemsController {
    constructor(private readonly itemService: ItemsService) { }


    @Post('/createItems')
    async createItems(@Body() dto: ItemsCreateDTO[]): Promise<CommonResponse> {
        return handleResponse(
            async () => this.itemService.createItems(dto),
            CommonResponse
        );
    }


    @Post('/getAllItems')
    async getAllItems(@Body() dto: MaterialReqModel): Promise<ItemsResponse> {
        return handleResponse(
            async () => this.itemService.getAllItems(dto),
            ItemsResponse
        );
    }


    @Post('/toggleItems')
    async toggleItems(@Body() dto: CommonIdReqModal): Promise<CommonResponse> {
        return handleResponse(
            async () => this.itemService.toggleItems(dto),
            CommonResponse
        );
    }


    @Post('/getItemsToPackingSpec')
    async getItemsToPackingSpec(@Body() dto: MaterialReqModel): Promise<ItemsResponse> {
        return handleResponse(
            async () => this.itemService.getItemsToPackingSpec(dto),
            ItemsResponse
        )
    }

    @Post('/getUnMappedItemsToSpecByPo')
    async getUnMappedItemsToSpecByPo(@Body() req: PackSerialNumberReqDto): Promise<ItemsResponse> {
        return handleResponse(
            async () => this.itemService.getUnMappedItemsToSpecByPo(req),
            ItemsResponse
        )
    }


}