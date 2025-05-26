import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { CutIdWithCutPrefRequest, DocketCutNumberResponse, GlobalResponseObject, LayerMeterageRequest, PoCutResponse, PoDocketNumbersRequest, PoProdutNameRequest, PoSerialWithCutPrefRequest, TotalLayedCutsResponse } from '@xpparel/shared-models';
import { CutGenerationInfoService } from './cut-generation-info.service';
import { CutGenerationService } from './cut-generation.service';

@ApiTags('Cut')
@Controller('cut-generation')
export class CutGenerationController {
    constructor(
        private service: CutGenerationService,
        private infoService: CutGenerationInfoService
    ) {

    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoProdutNameRequest })
    @Post('/generateCuts')
    async generateCuts(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.generateCuts(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoProdutNameRequest })
    @Post('/deleteCuts')
    async deleteCuts(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteCuts(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoSerialWithCutPrefRequest })
    @Post('/getCutInfoForPo')
    async getCutInfoForPo(@Body() req: any): Promise<PoCutResponse> {
        try {
            return await this.infoService.getCutInfoForPo(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * READER
     * @param req 
     * @returns 
     */
    @ApiBody({ type: CutIdWithCutPrefRequest })
    @Post('/getCutInfoForCutIds')
    async getCutInfoForCutIds(@Body() req: any): Promise<PoCutResponse> {
        try {
            return await this.infoService.getCutInfoForCutIds(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }


    @ApiBody({ type: PoDocketNumbersRequest })
    @Post('/getCutNumberForDocket')
    async getCutNumberForDocket(@Body() req: any): Promise<DocketCutNumberResponse> {
        try {
            return await this.infoService.getCutNumberForDocket(req);
        } catch (err) {
            return returnException(DocketCutNumberResponse, err);
        }
    }

    @Post('/getTotalLayedCutsToday')
    async getTotalLayedCutsToday(@Body() req: LayerMeterageRequest): Promise<TotalLayedCutsResponse> {
        try {
            return await this.infoService.getTotalLayedCutsToday(req);
        } catch (err) {
            return returnException(TotalLayedCutsResponse, err);
        }
    }



}
