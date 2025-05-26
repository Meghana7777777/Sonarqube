import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { ActualMarkerCreateRequest, ActualMarkerResponse, CommonRequestAttrs, DocMaterialAllocationRequest, DocMaterialAllocationResponse, GlobalResponseObject, ItemCodeRequest, LayerMeterageRequest, LayIdRequest, LockedFabMaterialResponse, MaterialRequestNoRequest, OnFloorConfirmedRollBarcodeRequest, OnFloorConfirmedRollIdsRequest, OnFloorRollIdsRequest, PoDocketGroupRequest, RollAllocationStatusResponse, RollIdRequest, RollLocationRequest, StockCodesRequest, StockObjectInfoResponse, StockRollInfoResponse, TodayLayAndCutResponse, WhFabReqItemStatusRequest, WhFabReqStatusRequest, WhReqCreateHeaderResponse } from '@xpparel/shared-models';
import { DocketMaterialInfoService } from './docket-material-info.service';
import { DocketMaterialService } from './docket-material.service';

@ApiTags('Docket Material')
@Controller('docket-material')
export class DocketMaterialController {
    constructor(
        private service: DocketMaterialService,
        private infoService: DocketMaterialInfoService
    ) {

    }

    @ApiBody({ type: DocMaterialAllocationRequest })
    @Post('/createDocketMaterialRequest')
    async createDocketMaterialRequest(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.createDocketMaterialRequest(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    // To de allocate the entire material request for the provided request No for a docket
    @ApiBody({ type: MaterialRequestNoRequest })
    @Post('/deleteDocketMaterialRequest')
    async deleteDocketMaterialRequest(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.deleteDocketMaterialRequest(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    // To de allocate only a specific roll/rolls in the docket request
    @ApiBody({ type: MaterialRequestNoRequest })
    @Post('/deleteRollInDocketMaterialRequest')
    async deleteRollInDocketMaterialRequest(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            // after deleting the rolls from the request, if there are no more rolls left, then delete the entire request, docket-request also
            return await this.service.deleteRollInDocketMaterialRequest(req);
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }


    @ApiBody({ type: PoDocketGroupRequest })
    @Post('/getDocketMaterialRequests')
    async getDocketMaterialRequests(@Body() req: any): Promise<DocMaterialAllocationResponse> {
        try {
            return await this.infoService.getDocketMaterialRequests(req);
        } catch (err) {
            return returnException(DocMaterialAllocationResponse, err);
        }
    }


    @ApiBody({ type: StockCodesRequest })
    @Post('/getAvailableRollsForItemCode')
    async getAvailableRollsForItemCode(@Body() reqObj: any): Promise<StockObjectInfoResponse> {
        try {
            return await this.infoService.getAvailableRollsForItemCode(reqObj);
        } catch (err) {
            console.log(err);
            return returnException(StockObjectInfoResponse, err)
        }
    }

    @ApiBody({ type: MaterialRequestNoRequest })
    @Post('/getDocketMaterialsForWhReqCreation')
    async getDocketMaterialsForWhReqCreation(@Body() reqObj: any): Promise<WhReqCreateHeaderResponse> {
        try {
            return this.infoService.getDocketMaterialsForWhReqCreation(reqObj);
        } catch (err) {
            return returnException(WhReqCreateHeaderResponse, err)
        }
    }

    @ApiBody({ type: ItemCodeRequest })
    @Post('/unlockMaterial')
    async unlockMaterial(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.unlockMaterial(req.itemCode, req.unitCode, req.companyCode, req.username)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }


    /**
     * Called from WMS
     * Changes the 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: WhFabReqStatusRequest })
    @Post('/changeDocketMaterialReqStatus')
    async changeDocketMaterialReqStatus(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.changeDocketMaterialReqStatus(req)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * UNUSED. Currently no used
     * Called from WMS
     * Changes the 
     * @param req 
     * @returns 
     */
    @ApiBody({ type: WhFabReqItemStatusRequest })
    @Post('/changeDocketMaterialStatus')
    async changeDocketMaterialStatus(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.changeDocketMaterialStatus(req)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    /**
     * WRITER
     * This is called after cut reporting
     * @param req 
     * @returns 
     */
    @ApiBody({ type: LayIdRequest })
    @Post('/releaseLockedRollsOfDocketToOnFloor')
    async releaseLockedRollsOfDocketToOnFloor(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.releaseLockedRollsOfDocketToOnFloor(req)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: RollLocationRequest })
    @Post('/getOnFloorRolls')
    async getOnFloorRolls(@Body() req: any): Promise<LockedFabMaterialResponse> {
        try {
            return await this.infoService.getOnFloorRolls(req)
        } catch (err) {
            console.log(err);
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: OnFloorRollIdsRequest })
    @Post('/changeRollLocation')
    async changeRollLocation(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.changeRollLocation(req)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getPendingPresenceConfirmationRolls')
    async getPendingPresenceConfirmationRolls(@Body() req: any): Promise<LockedFabMaterialResponse> {
        try {
            return await this.infoService.getPendingPresenceConfirmationRolls(req)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: OnFloorConfirmedRollBarcodeRequest })
    @Post('/confirmRollPresenceByBarcode')
    async confirmRollPresenceByBarcode(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmRollPresenceByBarcode(req)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: OnFloorConfirmedRollIdsRequest })
    @Post('/confirmRollPresence')
    async confirmRollPresence(@Body() req: any): Promise<GlobalResponseObject> {
        try {
            return await this.service.confirmRollPresence(req)
        } catch (err) {
            return returnException(GlobalResponseObject, err);
        }
    }

    @ApiBody({ type: RollIdRequest })
    @Post('/getRollAllocationstatus')
    async getRollAllocationstatus(@Body() req: any): Promise<RollAllocationStatusResponse> {
        try {
            return await this.service.getRollAllocationstatus(req)
        } catch (err) {
            return returnException(RollAllocationStatusResponse, err);
        }
    }

    @ApiBody({ type: ActualMarkerCreateRequest })
    @Post('/createActualMarker')
    async createActualMarker(@Body() req: any): Promise<any> {
        try {
            return await this.service.createActualMarker(req, null);
        } catch (err) {
            return returnException(ActualMarkerResponse, err);
        }
    }

    @ApiBody({ type: PoDocketGroupRequest })
    @Post('/getActualMarkerByDocketGroup')
    async getActualMarkerByDocketGroup(@Body() reqModel: any): Promise<ActualMarkerResponse> {
        try {
            return await this.service.getActualMarkerByDocketGroup(reqModel);
        } catch (error) {
            return returnException(ActualMarkerResponse, error)
        }
    }

    // @ApiBody({ type: DocketGroupResponseModel })
    // @Post('/getTotalMaterialAllocatedDocketsToday')
    // async getTotalMaterialAllocatedDocketsToday(@Body() reqModel: DocketGroupResponseModel): Promise<MaterialAllocatedDocketsResponse> {
    //     try {
    //         return await this.infoService.getTotalMaterialAllocatedDocketsToday(reqModel);
    //     } catch (error) {
    //         return returnException(MaterialAllocatedDocketsResponse, error)
    //     }
    // }

    @Post('/getTotalLayedMeterage')
    async getTotalLayedMeterage(@Body() reqModel: LayerMeterageRequest): Promise<TodayLayAndCutResponse> {
        try {
            return await this.infoService.getTotalLayedMeterage(reqModel);
        } catch (error) {
            return returnException(TodayLayAndCutResponse, error)
        }
    }
}
