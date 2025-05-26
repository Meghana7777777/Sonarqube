import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalResponseObject, PoRatioIdRequest, PoSerialRequest, DocBundlePanelsRequest, DocketsConfirmationListResponse, PoProdutNameRequest, PoDocketNumberRequest, DocketBasicInfoResponse, PoRatioIdMarkerIdRequest, MarkerSpecificDocketsResponse, DocketNumberResponse, DocketDetailedInfoResponse, PoDocketGroupRequest, DocketGroupDetailedInfoResponse, DocketGroupBasicInfoResponse, RemarksDocketGroupRequest, RemarkDocketGroupResponse, DocketGroupResponseModel, LayerMeterageRequest, CommonResponse, DocketsCardDetailsResponse, LayedCutsResponse, DocketHeaderResponse } from '@xpparel/shared-models';
import { returnException } from '@xpparel/backend-utils';
import { DocketGenerationInfoService } from './docket-generation-info.service';
import { DocketGenerationService } from './docket-generation.service';


@ApiTags('Dockets')
@Controller('docket-generation')
export class DocketGenerationController {
    constructor(
        private service: DocketGenerationService,
        private infoService: DocketGenerationInfoService
    ) {

    }

    @ApiBody({ type: PoRatioIdRequest })
    @Post('/generateDockets')
    async generateDockets(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // THIS ONLY SAVES THE DOCKET RECORDS
            // getRatioDetailedInfoForRatioId
            // check if any of the dockets in the PO has doc_confirmation != OPEN
            // lock the whole PO for docket generation / docket confirmation / docket deletion
            // get the raito info from the OES and generate the dockets an docket bundles only.
            // PO docket group => po docket
            // Once generated, then updte the doc gen status in the OES against to the ratio accordingly.
            return await this.service.generateDockets(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    // THIS ONLY SAVES THE DOCKET BUNDLES
    @ApiBody({ type: PoDocketNumberRequest })
    @Post('/generateDocketBundles')
    async generateDocketBundles(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // read the docket record and getr ratio id
            // getRatioDetailedInfoForRatioId by using the docket record
            return await this.service.generateDocketBundles(req)
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }



    @ApiBody({ type: PoRatioIdRequest })
    @Post('/deleteDockets')
    async deleteDockets(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // check if any of the dockets in the RATIO has doc_confirmation != OPEN
            // lock the whole PO for docket generation / docket confirmation / docket deletion
            // delete the dockets only if the panelGenStatus is OPEN for all bundles for the dockets in the ratio
            // Once deleted, then updte the doc gen status in the OES against to the ratio accordingly.
            return await this.service.deleteDockets(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: PoProdutNameRequest })
    @Post('/confirmDockets')
    async confirmDockets(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // Ensure no docket generation/ docket deletion is in progress
            // lock the whole PO for docket generation / docket confirmation / docket deletion
            // change the status of all dockets to confirmationStatus in porgress
            // claculate the panel numbers of the docket => docket bundle
            // updtae the po serial table
            // update the panel_gen_status for all docket bundles to IN_PROGRESS
            // trigger a seperate job for every bundle to create the panels
            return await this.service.confirmDockets(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }


     @ApiBody({ type: PoProdutNameRequest })
    @Post('/docketConfirmation')
    async docketConfirmation(@Body() req: PoProdutNameRequest): Promise<GlobalResponseObject> {
        try {
            // Ensure no docket generation/ docket deletion is in progress
            // lock the whole PO for docket generation / docket confirmation / docket deletion
            // change the status of all dockets to confirmationStatus in porgress
            // claculate the panel numbers of the docket => docket bundle
            // updtae the po serial table
            // update the panel_gen_status for all docket bundles to IN_PROGRESS
            // trigger a seperate job for every bundle to create the panels
            return await this.service.docketConfirmation(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }


    @ApiBody({ type: PoProdutNameRequest })
    @Post('/unConfirmDockets')
    async unConfirmDockets(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // delete all the panels of all dockets of the PO
            return await this.service.unConfirmDockets(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    // Will be called from BULL JOB
    @ApiBody({ type: DocBundlePanelsRequest })
    @Post('/generatePanelsForDocBundle')
    async generatePanelsForDocBundle(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // simply create the panels for the docket bundle based on the panel numbers provided in the request
            // after panels are created, update the panel_gen_status to COMPLETED
            // Once if all the docket bundles under a docket are panel_gen_status COMPLETED, then update the doc_confirmation = COMPLETED for the docket
            return await this.service.generatePanelsForDocBundle(req);
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * This service is used to enable/disable the cut confirmation button in the UI. This will be repeatedly called by the UI
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoProdutNameRequest })
    @Post('/getDocketsConfimrationListForPo')
    async getDocketsConfimrationListForPo(@Body() req: any): Promise<DocketsConfirmationListResponse> {
        try {
            return await this.infoService.getDocketsConfimrationListForPo(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketsConfirmationListResponse, err);
        }
    }


    /**
     * USED BY DOCKET summary screen
     * This service is used to enable/disable the cut confirmation button in the UI. This will be repeatedly called by the UI
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoProdutNameRequest })
    @Post('/getDocketsBasicInfoForPo')
    async getDocketsBasicInfoForPo(@Body() req: any): Promise<DocketBasicInfoResponse> {
        try {
            // if prod name, then filter only those dockets. else send back all dockets for the PO
            return await this.infoService.getDocketsBasicInfoForPo(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketBasicInfoResponse, err);
        }
    }

    /**
     * READER
     * Used by lay reporting / cut reporting / other interfacses where we need docket info 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoDocketNumberRequest })
    @Post('/getDocketsBasicInfoForDocketNumber')
    async getDocketsBasicInfoForDocketNumber(@Body() req: any): Promise<DocketBasicInfoResponse> {
        try {
            return await this.infoService.getDocketsBasicInfoForDocketNumber(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketBasicInfoResponse, err);
        }
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: PoRatioIdMarkerIdRequest })
    @Post('/getDocketsMappedForPoMarker')
    async getDocketsMappedForPoMarker(@Body() req: any): Promise<MarkerSpecificDocketsResponse> {
        try {
            return await this.infoService.getDocketsMappedForPoMarker(req);
        } catch (err) {
            console.log(err);
            return returnException(MarkerSpecificDocketsResponse, err);
        }
    }

    /**
     * gets the docket numbers for the PO
     * @returns 
     */
    @ApiBody({ type: PoSerialRequest })
    @Post('/getDocketNumbersForPo')
    async getDocketNumbersForPo(@Body() req: any): Promise<DocketNumberResponse> {
        try {
            return await this.infoService.getDocketNumbersForPo(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketNumberResponse, err);
        }
    }

    // Currently not used as of now
    @ApiBody({ type: PoDocketGroupRequest })
    @Post('/getDocketDetailedInfo')
    async getDocketDetailedInfo(@Body() req: any): Promise<DocketDetailedInfoResponse> {
        try {
            return await this.infoService.getDocketDetailedInfo(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketDetailedInfoResponse, err);
        }
    }

    // Currently not used as of now
    @ApiBody({ type: PoDocketGroupRequest })
    @Post('/getDocketGroupDetailedInfo')
    async getDocketGroupDetailedInfo(@Body() req: any): Promise<DocketGroupDetailedInfoResponse> {
        try {
            return await this.infoService.getDocketGroupDetailedInfo(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketGroupDetailedInfoResponse, err);
        }
    }

    // UNUSED
    // new API for docket print
    @ApiBody({ type: PoDocketGroupRequest })
    @Post('/getDocketGroupsBasicInfoForDocketGroup')
    async getDocketGroupsBasicInfoForDocketGroup(@Body() req: any): Promise<DocketGroupBasicInfoResponse> {
        try {
            return await this.infoService.getDocketGroupsBasicInfoForDocketGroup(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketGroupBasicInfoResponse, err);
        }
    }

    // UNUSED
    // new API for docket print
    @ApiBody({ type: PoProdutNameRequest })
    @Post('/getDocketGroupsBasicInfoForPo')
    async getDocketGroupsBasicInfoForPo(@Body() req: any): Promise<DocketGroupBasicInfoResponse> {
        try {
            return await this.infoService.getDocketGroupsBasicInfoForPo(req);
        } catch (err) {
            console.log(err);
            return returnException(DocketGroupBasicInfoResponse, err);
        }
    }
    @ApiBody({ type: RemarksDocketGroupRequest })
    @Post('createRemarksDocketGroup')
    async createRemarksDocketGroup(@Body() req: RemarksDocketGroupRequest): Promise<RemarkDocketGroupResponse> {
        try {
            return await this.service.createRemarksDocketGroup(req);
        } catch (error) {
            return returnException(RemarkDocketGroupResponse, error)
        }
    }

    @ApiBody({ type: DocketGroupResponseModel })
    @Post('getKPICardDetailsForCadAndPlanning')
    async getKPICardDetailsForCadAndPlanning(@Body() req: DocketGroupResponseModel): Promise<DocketsCardDetailsResponse> {
        try {
            return await this.infoService.getKPICardDetailsForCadAndPlanning(req);
        } catch (error) {
            return returnException(DocketsCardDetailsResponse, error)
        }
    }


    @Post('getTotalLayedCuts')
    async getTotalLayedCuts(@Body() req: LayerMeterageRequest): Promise<LayedCutsResponse> {
        try {
            return await this.infoService.getTotalLayedCuts(req);
        } catch (error) {
            return returnException(LayedCutsResponse, error)
        }
    }

    @Post('getDataForMainHeader')
    async getDataForMainHeader(@Body() req: DocketGroupResponseModel): Promise<DocketHeaderResponse> {
        try {
            return await this.infoService.getDataForMainHeader(req);
        } catch (error) {
            return returnException(DocketHeaderResponse, error)
        }
    }


    @Post('createPoDocketSerialDetails')
    async createPoDocketSerialDetails(@Body() req: PoSerialRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.createPoDocketSerialDetails(req);
        } catch (error) {
            return returnException(DocketHeaderResponse, error)
        }
    };


    @Post('assignBundlesToDocket')
    async assignBundlesToDocket(@Body() req: PoDocketNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.service.assignProductSubLineQtyToDocket(req.docketNumber, req.unitCode, req.companyCode, req.username);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error)
        }
    }

    
}
