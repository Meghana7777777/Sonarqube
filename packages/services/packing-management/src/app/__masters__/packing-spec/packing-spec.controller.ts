import { Body, Controller, Post } from "@nestjs/common";
import { CommonResponse, handleResponse } from "@xpparel/backend-utils";
import { PackingSpecService } from "./packing-spec.service";
import { CartonSpecResponse, CommonIdReqModal, CommonRequestAttrs, PackingSpecReqModelDto, PackingSpecResponse, PackSerialNumberReqDto, PackSpecDropDownResponse } from "@xpparel/shared-models";
import { PackingSpecCreateDto } from "./dto/packing-spec-create.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Packing Spec')
@Controller('packing-spec')
export class PackingSpecController {
    constructor(private readonly psService: PackingSpecService) { }

    @Post('/createPackingSpec')
    async createPackingSpec(@Body() dto: PackingSpecCreateDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.psService.createPackingSpec(dto),
            CommonResponse
        );
    }

    @Post('/getAllPackingSpecs')
    async getAllPackingSpecs(@Body() dto: PackSerialNumberReqDto): Promise<PackingSpecResponse> {
        return handleResponse(
            async () => this.psService.getAllPackingSpecs(dto),
            PackingSpecResponse
        );
    }


    @Post('/togglePackingSpec')
    async togglePackingSpec(@Body() dto: PackingSpecCreateDto): Promise<CommonResponse> {
        return handleResponse(
            async () => this.psService.togglePackingSpec(dto),
            CommonResponse
        );
    }

    @Post('/getAllSpecDropdownData')
    async getAllSpecDropdownData(@Body() dto: PackSerialNumberReqDto): Promise<PackSpecDropDownResponse> {
        return handleResponse(
            async () => this.psService.getAllSpecDropdownData(dto),
            CommonResponse
        );
    }

    @Post('/getCartonSpecData')
    async getCartonSpecData(@Body() dto: CommonIdReqModal): Promise<CartonSpecResponse> {
        return handleResponse(
            async () => this.psService.getCartonSpecData(dto),
            CartonSpecResponse
        );
    }
}