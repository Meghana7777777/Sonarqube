import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CommonRequestAttrs, GlobalResponseObject, TrayBarcodesRequest, TrayCodesRequest, TrayCreateRequest, TrayIdsRequest, TrayResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { TraysService } from './trays.service';

@ApiTags('Trays Data Module')
@Controller('trays')
export class TraysController {
  constructor(private readonly traysDataService: TraysService) { }

  @ApiBody({ type: TrayCreateRequest})
  @Post('/createTray')
  async createTray(@Body() reqModel: any): Promise<TrayResponse> {
    try {
      return await this.traysDataService.createTray(reqModel);
    } catch (error) {
      return returnException(TrayResponse, error)
    }
  }

  @ApiBody({ type: TrayCreateRequest})
  @Post('/updateTray')
  async updateTray(@Body() reqModel: any): Promise<GlobalResponseObject> {
    try {
      return await this.traysDataService.updateTray(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @ApiBody({ type: TrayIdsRequest})
  @Post('/activateDeactivateTray')
  async activateDeactivateTray(@Body() reqModel: any): Promise<GlobalResponseObject> {
    try {
      return await this.traysDataService.activateDeactivateTray(reqModel);
    } catch (error) {
      return returnException(GlobalResponseObject, error)
    }
  }

  @ApiBody({ type: TrayIdsRequest})
  @Post('/getAllTrays')
  async getAllTrays(@Body() reqModel: any): Promise<TrayResponse> {
    try {
      return await this.traysDataService.getAllTrays(reqModel);
    } catch (error) {
      console.log(error);
      return returnException(TrayResponse, error)
    }
  }

  @ApiBody({ type: TrayIdsRequest})
  @Post('/getTraysByTrayIds')
  async getTraysByTrayIds(@Body() reqModel: any): Promise<TrayResponse> {
    try {
      return await this.traysDataService.getTraysByTrayIds(reqModel);
    } catch (error) {
      return returnException(TrayResponse, error)
    }
  }

  @ApiBody({ type: TrayBarcodesRequest})
  @Post('/getTraysByTrayBarcodes')
  async getTraysByTrayBarcodes(@Body() reqModel: any): Promise<TrayResponse> {
    try {
      return await this.traysDataService.getTraysByTrayBarcodes(reqModel);
    } catch (error) {
      return returnException(TrayResponse, error)
    }
  }

  @ApiBody({ type: TrayCodesRequest})
  @Post('/getTraysByTrayCodes')
  async getTraysByTrayCodes(@Body() reqModel: any): Promise<TrayResponse> {
    try {
      return await this.traysDataService.getTraysByTrayCodes(reqModel);
    } catch (error) {
      return returnException(TrayResponse, error)
    }
  }
}
