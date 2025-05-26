import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ItemService } from "./bom-item-service";
import { ItemCodesRequest, ItemCreateRequest, ItemIdRequest, ItemResponse } from "@xpparel/shared-models";
import { returnException } from "@xpparel/backend-utils";
import { ItemDto } from "./dto/bom-item-dto";

@ApiTags('item')
@Controller('item')
export class ItemController {
    constructor(
        private service: ItemService,
    ) { }

    @Post('createItem')
    @ApiBody({ type: ItemCreateRequest })
    async createItem(@Body() req: ItemCreateRequest): Promise<ItemResponse> {
        try {
            return await this.service.createItem(req);
        } catch (error) {
            return returnException(ItemResponse, error);
        }
    }

    @Post('deleteItem')
    @ApiBody({ type: ItemIdRequest })
    async deleteItem(@Body() req: ItemIdRequest): Promise<ItemResponse> {
        try {
            return await this.service.deleteItem(req);
        } catch (error) {
            return returnException(ItemResponse, error);
        }
    }

    @Post('getAllItem')
    @ApiBody({ type: ItemDto })
    async getAllItems(@Body() req: ItemIdRequest): Promise<ItemResponse> {
        try {
            return await this.service.getAllItem(req);
        } catch (error) {
            return returnException(ItemResponse, error);
        }
    }

    @Post('activateDeactivateItem')
    @ApiBody({ type: ItemDto })
    async activateDeactivateItem(@Body() req: ItemIdRequest): Promise<ItemResponse> {
        try {
            return await this.service.activateDeactivateItem(req);
        } catch (error) {
            return returnException(ItemResponse, error);
        }
    }

    @Post('getBomItemByItemCode')
    @ApiBody({ type: ItemIdRequest })
    async getBomItemByItemCode(@Body() req: ItemIdRequest): Promise<ItemResponse> {
        try {
            return await this.service.getBomItemByItemCode(req);
        } catch (error) {
            return returnException(ItemResponse, error);
        }
    }


    @Post('checkAndSaveItems')
    @ApiBody({ type: ItemCreateRequest })
    async checkAndSaveItems(@Body() req: ItemCreateRequest): Promise<ItemResponse> {
        try {
            return await this.service.checkAndSaveItems(req);
        } catch (error) {
            return returnException(ItemResponse, error);
        }
    }

    @Post('getItemNamesOfItemCodes')
    @ApiBody({ type: ItemCodesRequest })
    async getItemNamesOfItemCodes(@Body() req: ItemCodesRequest): Promise<ItemResponse> {
        try {
            return await this.service.getItemNamesOfItemCodes(req);
        } catch (error) {
            return returnException(ItemResponse, error);
        }
    }

}