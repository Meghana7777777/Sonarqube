import { AxiosRequestConfig } from 'axios';
import { PTSCommonAxiosService } from '../pts-common-axios.service';
import { CPS_C_BundlingConfirmationIdRequest, GlobalResponseObject, JobNumberRequest, KMS_C_KnitOrderBundlingConfirmationIdRequest, MC_ProductSubLineProcessTypeRequest, OslRefIdRequest, ProcessingOrderInfoRequest, PTS_C_ProductionJobNumberRequest, SewSerialRequest, SewVersionRequest, SI_MoNumberRequest } from '@xpparel/shared-models';
import { Post, Body } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';


export class FgCreationService extends PTSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/fg-creation/' + childUrl;
    }

    async createBundlesForJob(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createBundlesForJob'), reqModel, config);
    }

    async createFgsForOslRefId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createFgsForOslRefId'), reqModel, config);
    }

    async deleteJobsByJobNumbers(reqModel: JobNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteJobsByJobNumbers'), reqModel, config);
    }

    async deleteFgsForOslRefId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteFgsForOslRefId'), reqModel, config);
    }

    async createFgCompsForJob(reqModel: JobNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createFgCompsForJob'), reqModel, config);
    }

    async createSewVersionForProductWithManager(reqModel: SewVersionRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSewVersionForProductWithManager'), reqModel, config);
    }

    async deleteFgsForSewSerial(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteFgsForSewSerial'), reqModel, config);
    }

    async createSewVersionForSewSerial(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSewVersionForSewSerial'), reqModel, config);
    }

    async deletSewVersionForSewSerial(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deletSewVersionForSewSerial'), reqModel, config);
    }

    async deleteEverythingForSewSerial(reqModel: SewSerialRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteEverythingForSewSerial'), reqModel, config);
    }

    async triggerCreateBundlesForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('triggerCreateBundlesForMo'), reqModel, config);
    }

    async createBundlesForOslIdAndMapFgsForBundle(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createBundlesForOslIdAndMapFgsForBundle'), reqModel, config);
    }

    async deleteBundlesForOslId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteBundlesForOslId'), reqModel, config);
    }

    async deleteBundlesForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteBundlesForMo'), reqModel, config);
    }

    async createOslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOslRefIdsForMo'), reqModel, config);
    }

    async deleteOslRefIdsForMo(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOslRefIdsForMo'), reqModel, config);
    }

    async triggerCreateFgsForOslRefId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('triggerCreateFgsForOslRefId'), reqModel, config);
    }

    async triggerCreateFgsOpsOslRefId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('triggerCreateFgsOpsOslRefId'), reqModel, config);
    }

    async triggerCreateFgOpDepForOslRefId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('triggerCreateFgOpDepForOslRefId'), reqModel, config);
    }

    async createFgOpsForOslRefId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createFgOpsForOslRefId'), reqModel, config);
    }

    async createFgOpDepForOslRefId(reqModel: OslRefIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createFgOpDepForOslRefId'), reqModel, config);
    }


    async triggerMapJobsForProcSerial(reqModel: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('triggerMapJobsForProcSerial'), reqModel, config);
    }

    async mapJobNumbersForProcSerialAndOslId(reqModel: MC_ProductSubLineProcessTypeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapJobNumbersForProcSerialAndOslId'), reqModel, config);
    }

    async deleteJobNumbersForProcSerial(reqModel: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteJobNumbersForProcSerial'), reqModel, config);
    }

    async createOpSequence(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOpSequence'), reqModel, config);
    }

    async deleteOpSequence(reqModel: SI_MoNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteOpSequence'), reqModel, config);
    }

    async createProcOrderRef(reqModel: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createProcOrderRef'), reqModel, config);
    }

    async deleteProcOrderRef(reqModel: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteProcOrderRef'), reqModel, config);
    }

    async triggerMapProcSerialForOslBundles(reqModel: ProcessingOrderInfoRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('triggerMapProcSerialForOslBundles'), reqModel, config);
    }

    async mapProcSerialForOslBundlesAndFgOpDep(reqModel: MC_ProductSubLineProcessTypeRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapProcSerialForOslBundlesAndFgOpDep'), reqModel, config);
    }

    async createActualBundlesForConfirmationIdCut(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createActualBundlesForConfirmationIdCut'), reqModel, config);
    }

    async mapActualBundlesToFgForAConfirmationIdCut(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapActualBundlesToFgForAConfirmationIdCut'), reqModel, config);
    }

    async deleteActualBundlesForConfirmationIdCut(reqModel: CPS_C_BundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteActualBundlesForConfirmationIdCut'), reqModel, config);
    }

    async createActualBundlesForConfirmationIdKnit(reqModel: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createActualBundlesForConfirmationIdKnit'), reqModel, config);
    }

    async mapActualBundlesToFgForAConfirmationIdKnit(reqModel: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapActualBundlesToFgForAConfirmationIdKnit'), reqModel, config);
    }

    async deleteActualBundlesForConfirmationIdKnit(reqModel: KMS_C_KnitOrderBundlingConfirmationIdRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteActualBundlesForConfirmationIdKnit'), reqModel, config);
    }

    async mapActualBundlesForJob(reqModel: PTS_C_ProductionJobNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapActualBundlesForJob'), reqModel, config);
    }

    async unMapActualBundlesForJob(reqModel: PTS_C_ProductionJobNumberRequest, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('unMapActualBundlesForJob'), reqModel, config);
    }
    
}