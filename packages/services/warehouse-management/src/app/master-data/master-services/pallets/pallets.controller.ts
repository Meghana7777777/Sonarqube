import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, PalletsActivateRequest, PalletsCreateRequest, PalletsResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { PalletsDataService } from './pallets.service';



@ApiTags('Pallets Data Module')
@Controller('pallets')
export class PalletsDataController {
  constructor(private readonly palletsDataService: PalletsDataService) { }
  @Post('/createPallets')
  async createPallets(@Body() reqModel: PalletsCreateRequest): Promise<PalletsResponse> {
    try {
      return await this.palletsDataService.createPallets(reqModel);
    } catch (error) {
      return returnException(PalletsResponse, error)
    }
  }
  @Post('/ActivateDeactivatePallets')
  async ActivateDeactivatePallets(@Body() reqModel: PalletsActivateRequest): Promise<PalletsResponse> {
    try {
      return await this.palletsDataService.ActivateDeactivatePallets(reqModel);
    } catch (error) {
      return returnException(PalletsResponse, error)
    }
  }

  @Post('/getAllPalletsData')
  async getAllPalletsData(@Body() reqModel: CommonRequestAttrs): Promise<PalletsResponse> {
    try {
      return await this.palletsDataService.getAllPalletsData(reqModel);
    } catch (error) {
      return returnException(PalletsResponse, error)
    }
  }

  // @Post('/updatePalletLocationStatus')
  // async updatePalletLocationStatus(@Body() reqModel: PalletstatusChangeRequest): Promise<CommonResponse> {
  //   try {
  //     return await this.palletsDataService.updatePalletLocationStatus(reqModel);
  //   } catch (error) {
  //     return returnException(CommonResponse, error)
  //   }
  // }
  // @Post('/getEmptyPalletDetails')
  // async getEmptyPalletDetails(): Promise<EmptyPalletLocationResponse> {
  //   try {
  //     return await this.palletsDataService.getEmptyPalletDetails();
  //   } catch (err) {
  //     return returnException(EmptyPalletLocationResponse, err)
  //   }
  // }



}
