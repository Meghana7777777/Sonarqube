import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { returnException } from '@xpparel/backend-utils';
import { CPS_C_BundlingConfirmationIdRequest, GlobalResponseObject, JobNumberRequest, KMS_C_KnitOrderBundlingConfirmationIdRequest, MC_ProductSubLineProcessTypeRequest, OslRefIdRequest, ProcessingOrderInfoRequest, PTS_C_ProductionJobNumberRequest, SewSerialRequest, SewVersionRequest, SI_MoNumberRequest } from '@xpparel/shared-models';
import { FgCreationService } from './fg-creation.service';
import { BundleCreationService } from './bundle-creation.service';
import { JobCreationService } from './job-creation.service';
import { OpSequenceService } from './op-sequence.service';
import { ProcOrderCreationService } from './proc-order-creation.service';
import { ActualBundleCreationService } from './actual-bundle-creation.service';



@ApiTags('Fg Creation')
@Controller('fg-creation')
export class FgCreationController {
    constructor(
        private readonly fgCreationService: FgCreationService,
        private bundleCreationService: BundleCreationService,
        private jobCreationService: JobCreationService,
        private opSequenceService: OpSequenceService,
        private procOrderCreationService: ProcOrderCreationService,
        private actualBunService: ActualBundleCreationService,
        private jobMapService: JobCreationService
    ) {

    }

    @ApiBody({ type: OslRefIdRequest })
    @Post('/createFgsForOslRefId')
    async createFgsForOslRefId(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.createFgsForOslRefId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/triggerCreateBundlesForMo')
    async triggerCreateBundlesForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.bundleCreationService.triggerCreateBundlesForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: OslRefIdRequest })
    @Post('/createBundlesForOslIdAndMapFgsForBundle')
    async createBundlesForOslIdAndMapFgsForBundle(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.bundleCreationService.createBundlesForOslIdAndMapFgsForBundle(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: OslRefIdRequest })
    @Post('/deleteBundlesForOslId')
    async deleteBundlesForOslId(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.bundleCreationService.deleteBundlesForOslId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/deleteBundlesForMo')
    async deleteBundlesForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.bundleCreationService.deleteBundlesForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    // Tested
    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/createOslRefIdsForMo')
    async createOslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.createOslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    // Tested
    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/deleteOslRefIdsForMo')
    async deleteOslRefIdsForMo(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.deleteOslRefIdsForMo(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/triggerCreateFgsForMoNumber')
    async triggerCreateFgsForMoNumber(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.triggerCreateFgsForMoNumber(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/triggerDeleteFgsForMoNumber')
    async triggerDeleteFgsForMoNumber(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.triggerCreateFgsForMoNumber(req, true);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/triggerCreateFgOpDepForForMoNumber')
    async triggerCreateFgOpDepForForMoNumber(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.triggerCreateFgOpDepForForMoNumber(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/triggerCreateFgsOpsForMoNumber')
    async triggerCreateFgsOpsForMoNumber(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            // return await this.fgCreationService.triggerCreateFgsOpsForMoNumber(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: OslRefIdRequest })
    @Post('/createFgOpsForOslRefId')
    async createFgOpsForOslRefId(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
        try {
            // return await this.fgCreationService.createFgOpsForOslRefId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: OslRefIdRequest })
    @Post('/createFgOpDepForOslRefId')
    async createFgOpDepForOslRefId(@Body() req: OslRefIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.fgCreationService.createFgOpDepForOslRefId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: ProcessingOrderInfoRequest })
    @Post('/triggerMapJobsForProcSerial')
    async triggerMapJobsForProcSerial(@Body() req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        try {
            // return await this.jobCreationService.triggerMapJobsForProcSerial(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: MC_ProductSubLineProcessTypeRequest })
    @Post('/mapJobNumbersForProcSerialAndOslId')
    async mapJobNumbersForProcSerialAndOslId(@Body() req: MC_ProductSubLineProcessTypeRequest): Promise<GlobalResponseObject> {
        try {
            // return await this.jobCreationService.mapJobNumbersForProcSerialAndOslId(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: ProcessingOrderInfoRequest })
    @Post('/deleteJobNumbersForProcSerial')
    async deleteJobNumbersForProcSerial(@Body() req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        try {
            // return await this.jobCreationService.deleteJobNumbersForProcSerial(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/createOpSequence')
    async createOpSequence(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.opSequenceService.createOpSequence(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: SI_MoNumberRequest })
    @Post('/deleteOpSequence')
    async deleteOpSequence(@Body() req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.opSequenceService.deleteOpSequence(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }



    @ApiBody({ type: ProcessingOrderInfoRequest })
    @Post('/createProcOrderRef')
    async createProcOrderRef(@Body() req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        try {
            return await this.procOrderCreationService.createProcOrderRef(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: ProcessingOrderInfoRequest })
    @Post('/deleteProcOrderRef')
    async deleteProcOrderRef(@Body() req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        try {
            return await this.procOrderCreationService.deleteProcOrderRef(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: ProcessingOrderInfoRequest })
    @Post('/triggerMapProcSerialForOslBundles')
    async triggerMapProcSerialForOslBundles(@Body() req: ProcessingOrderInfoRequest): Promise<GlobalResponseObject> {
        try {
            return await this.procOrderCreationService.triggerMapProcSerialForOslBundles(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: MC_ProductSubLineProcessTypeRequest })
    @Post('/mapProcSerialForOslBundlesAndFgOpDep')
    async mapProcSerialForOslBundlesAndFgOpDep(@Body() req: MC_ProductSubLineProcessTypeRequest): Promise<GlobalResponseObject> {
        try {
            return await this.procOrderCreationService.mapProcSerialForOslBundlesAndFgOpDep(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: CPS_C_BundlingConfirmationIdRequest })
    @Post('/createActualBundlesForConfirmationIdCut')
    async createActualBundlesForConfirmationIdCut(@Body() req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.actualBunService.createActualBundlesForConfirmationIdCut(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: CPS_C_BundlingConfirmationIdRequest })
    @Post('/mapActualBundlesToFgForAConfirmationIdCut')
    async mapActualBundlesToFgForAConfirmationIdCut(@Body() req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.actualBunService.mapActualBundlesToFgForAConfirmationIdCut(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: CPS_C_BundlingConfirmationIdRequest })
    @Post('/deleteActualBundlesForConfirmationIdCut')
    async deleteActualBundlesForConfirmationIdCut(@Body() req: CPS_C_BundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.actualBunService.deleteActualBundlesForConfirmationIdCut(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }


    @ApiBody({ type: KMS_C_KnitOrderBundlingConfirmationIdRequest })
    @Post('/createActualBundlesForConfirmationIdKnit')
    async createActualBundlesForConfirmationIdKnit(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.actualBunService.createActualBundlesForConfirmationIdKnit(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: KMS_C_KnitOrderBundlingConfirmationIdRequest })
    @Post('/mapActualBundlesToFgForAConfirmationIdKnit')
    async mapActualBundlesToFgForAConfirmationIdKnit(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.actualBunService.mapActualBundlesToFgForAConfirmationIdKnit(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: KMS_C_KnitOrderBundlingConfirmationIdRequest })
    @Post('/deleteActualBundlesForConfirmationIdKnit')
    async deleteActualBundlesForConfirmationIdKnit(@Body() req: KMS_C_KnitOrderBundlingConfirmationIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.actualBunService.deleteActualBundlesForConfirmationIdKnit(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: PTS_C_ProductionJobNumberRequest })
    @Post('/mapActualBundlesForJob')
    async mapActualBundlesForJob(@Body() req: PTS_C_ProductionJobNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.jobMapService.mapActualBundlesForJob(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }

    @ApiBody({ type: PTS_C_ProductionJobNumberRequest })
    @Post('/unMapActualBundlesForJob')
    async unMapActualBundlesForJob(@Body() req: PTS_C_ProductionJobNumberRequest): Promise<GlobalResponseObject> {
        try {
            return await this.jobMapService.unMapActualBundlesForJob(req);
        } catch (error) {
            console.log(error);
            return returnException(GlobalResponseObject, error);
        }
    }
}