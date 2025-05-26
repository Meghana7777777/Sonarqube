import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PalletRollMappingRequest, GlobalResponseObject, RollPalletMappingValidationResponse, TrayRollMappingRequest, RollIdsRequest, TrayResponse, TrayTrolleyMappingRequest, TrayIdsRequest, TrollyResponse, TrolleyBinMappingRequest, TrollyIdsRequest, BinDetailsResponse, TrayAndTrolleyResponse} from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { TrayRollMappingService } from './tray-roll-mapping.service';
import { TrayTrolleyMappingService } from './tray-trolley-mapping.service';
import { TrayRollInfoService } from './tray-roll-info.service';
import { TrayTrolleyInfoService } from './tray-trolley-info.service';
import { TrolleyBinInfoService } from './trolley-bin-info.service';
import { TrolleyBinMappingService } from './trolley-bin-mapping.service';

@ApiTags('Tray Trolley Module')
@Controller('tray-trolley')
export class TrayTrolleyController {
  constructor(
        private readonly trayRollMapService: TrayRollMappingService,
        private readonly trayRollInfoService: TrayRollInfoService,
        private trayTrolleyMapService: TrayTrolleyMappingService,
        private trayTrolleyInfoService: TrayTrolleyInfoService,
        private trolleyBinMapService: TrolleyBinMappingService,
        private trolleyBinInfoService: TrolleyBinInfoService,
  ) {}

  // ------------------------ TRAY ROLL -------------------------
  @ApiBody({ type: TrayRollMappingRequest})
  @Post('/mapRollToTray')
  async mapRollToTray(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      console.log(req);
      return await this.trayRollMapService.mapRollToTray(req);
    } catch (error) {
      console.log(error);
      return returnException(GlobalResponseObject,error);
    }
  }

  @ApiBody({ type: TrayRollMappingRequest})
  @Post('/unmapRollFromTray')
  async unmapRollFromTray(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.trayRollMapService.unmapRollFromTray(req);
    } catch (error) {
      return returnException(GlobalResponseObject,error);
    }
  }

  @ApiBody({ type: RollIdsRequest})
  @Post('/getTrayInfoForRollIds')
  async getTrayInfoForRollIds(@Body() req: any): Promise<TrayResponse> {
    try {
      return await this.trayRollInfoService.getTrayInfoForRollIds(req);
    } catch (error) {
      return returnException(TrayResponse,error);
    }
  }

  @ApiBody({ type: RollIdsRequest})
  @Post('/getTrayAndTrolleyInfoForRollIdData')
  async getTrayAndTrolleyInfoForRollIdData(@Body() req: any): Promise<TrayAndTrolleyResponse> {
    try {
      return await this.trayRollInfoService.getTrayAndTrolleyInfoForRollIdData(req);
    } catch (error) {
      return returnException(TrayAndTrolleyResponse,error);
    }
  }



  // ----------------------------- TRAY TROLLEY --------------------------
  @ApiBody({ type: TrayTrolleyMappingRequest})
  @Post('/mapTrayToTrolley')
  async mapTrayToTrolley(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.trayTrolleyMapService.mapTrayToTrolley(req);
    } catch (error) {
      console.log(error);
      return returnException(TrayResponse,error);
    }
  }

  @ApiBody({ type: TrayTrolleyMappingRequest})
  @Post('/unmapTrayFromTrolley')
  async unmapTrayFromTrolley(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.trayTrolleyMapService.unmapTrayFromTrolley(req);
    } catch (error) {
      return returnException(TrayResponse,error);
    }
  }

  @ApiBody({ type: TrayIdsRequest})
  @Post('/getTrolleyInfoForTrayIds')
  async getTrolleyInfoForTrayIds(@Body() req: any): Promise<TrollyResponse> {
    try {
      return await this.trayTrolleyInfoService.getTrolleyInfoForTrayIds(req);
    } catch (error) {
      return returnException(TrollyResponse, error);
    }
  }




  // ------------------------------- TROLLEY BIN ---------------------------

  @ApiBody({ type: TrolleyBinMappingRequest})
  @Post('/mapTrolleyToBin')
  async mapTrolleyToBin(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.trolleyBinMapService.mapTrolleyToBin(req);
    } catch (error) {
      console.log(error);
      return returnException(GlobalResponseObject, error);
    }
  }

  @ApiBody({ type: TrolleyBinMappingRequest})
  @Post('/unmapTrolleyFromBin')
  async unmapTrolleyFromBin(@Body() req: any): Promise<GlobalResponseObject> {
    try {
      return await this.trolleyBinMapService.unmapTrolleyFromBin(req);
    } catch (error) {
      console.log(error);
      return returnException(GlobalResponseObject, error);
    }
  }

  @ApiBody({ type: TrollyIdsRequest})
  @Post('/getBinInfoForTrolleyIds')
  async getBinInfoForTrolleyIds(@Body() req: any): Promise<BinDetailsResponse> {
    try {
      return await this.trolleyBinInfoService.getBinInfoForTrolleyIds(req);
    } catch (error) {
      return returnException(BinDetailsResponse, error);
    }
  }

  
}
