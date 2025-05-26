import { Body, Controller, Post } from '@nestjs/common';
import { returnException } from '@xpparel/backend-utils';
import { GlobalResponseObject, KC_KnitGroupPoSerialRequest, KG_JobWiseMaterialAllocationDetailRequest, KG_JobWiseMaterialAllocationDetailResponse, KG_KnitJobMaterialAllocationRequest, KG_KnitJobMaterialAllocationResponse, KG_MaterialRequirementDetailResp, KG_MaterialRequirementForKitGroupRequest, KJ_C_KnitJobNumberRequest, KMS_C_JobMainMaterialReqIdRequest, KMS_R_KnitJobRequestedItemsResponse, WMS_C_IssuanceIdRequest } from '@xpparel/shared-models';
import { KnittingJobsMaterialAllocationService } from './knitting-jobs-material-allocation.service';

@Controller('knitting-jobs-material-allocation')
export class KnittingJobsMaterialAllocationController {
  constructor(
    private service: KnittingJobsMaterialAllocationService
  ) { }




  /**
   * Service to get material requirement details for knit group and job numbers
   * Usually calls from UI to show all object info to select the cones
   * @param reqObj 
   * @param config 
   * @returns 
  */
  @Post('/getMaterialRequirementForGivenKnitGroup')
  async getMaterialRequirementForGivenKnitGroup(@Body() reqObj: KG_MaterialRequirementForKitGroupRequest): Promise<KG_MaterialRequirementDetailResp> {
    try {
      return await this.service.getMaterialRequirementForGivenKnitGroup(reqObj);
    } catch (error) {
      console.log(error);
      return returnException(KG_MaterialRequirementDetailResp, error);
    }
  }

  /**
   * Service to Allocate Material for Knit Group
   * Usually calls from UI to after clicking on allocation button 
   * @param reqObj 
   * @param config 
   * @returns 
  */
  @Post('/allocateMaterialForKnitGroup')
  async allocateMaterialForKnitGroup(@Body() reqObj: KG_KnitJobMaterialAllocationRequest): Promise<GlobalResponseObject> {
    try {
      return await this.service.allocateMaterialForKnitGroup(reqObj);
    } catch (error) {
      console.log(error);
      return returnException(GlobalResponseObject, error);
    }
  }
  /**
   * Service to get material allocation details for the knit group 
   * It gives item code wise already allocated qty etc..
   * @param reqObj 
   * @param config 
   * @returns 
  */
  @Post('/getMaterialAllocationDetailsForKnitGroup')
  async getMaterialAllocationDetailsForKnitGroup(@Body() reqObj: KC_KnitGroupPoSerialRequest): Promise<KG_KnitJobMaterialAllocationResponse> {
    try {
      return await this.service.getMaterialAllocationDetailsForKnitGroup(reqObj);
    } catch (error) {
      return returnException(KG_KnitJobMaterialAllocationResponse, error);
    }
  }

  /**
   * Service to get knitting job wise material allocation details for given knit group
   * Usually calls from UI to show already allocated quantity for particular job
   * @param reqObj 
   * @param config 
   * @returns 
  */
  @Post('/getJobWiseMaterialAllocationDetailsForKnitGroup')
  async getJobWiseMaterialAllocationDetailsForKnitGroup(@Body() reqObj: KG_JobWiseMaterialAllocationDetailRequest): Promise<KG_JobWiseMaterialAllocationDetailResponse> {
    try {
      return await this.service.getJobWiseMaterialAllocationDetailsForKnitGroup(reqObj);
    } catch (error) {
      return returnException(KG_JobWiseMaterialAllocationDetailResponse, error);
    }
  }

  /**
   * Service to get the KNit job wise material allocation details for the given knit job including objects 
   * @param reqObj 
   * @param config 
   * @returns 
  */
  @Post('/getJobWiseMaterialAllocationDetailsForKnitJob')
  async getJobWiseMaterialAllocationDetailsForKnitJob(@Body() reqObj: KJ_C_KnitJobNumberRequest): Promise<KG_JobWiseMaterialAllocationDetailResponse> {
    try {
      return await this.service.getJobWiseMaterialAllocationDetailsForKnitJob(reqObj);
    } catch (error) {
      return returnException(KG_JobWiseMaterialAllocationDetailResponse, error);
    }
  }
  /**
   * Service to get the requested Knit materials for the Material request id
   * Usually calls from WMS, Once the request is raised from the KMS
   * @param reqObjgetRequestedKnitMaterialForReqId
   * @param config 
   * @returns 
  */
  @Post('/getRequestedKnitMaterialForReqId')
  async getRequestedKnitMaterialForReqId(@Body() reqObj: KMS_C_JobMainMaterialReqIdRequest): Promise<KMS_R_KnitJobRequestedItemsResponse> {
    try {
      return await this.service.getRequestedKnitMaterialForReqId(reqObj);
    } catch (error) {
      return returnException(KMS_R_KnitJobRequestedItemsResponse, error);
    }
  }
  /**
   * Service to update issued quantity for knit materials from after getting the info from WMS against to each item code and job
   * make an API to WMS and get the items issued under a issuance id getIssuedItemsUnderAIssuanceId
   * fill the items from top to bottom based on the item code and the extRefId
   * after doing all the activity make an API call to WMS to update the handled status in the WMS
   * @param req 
   * @returns 
   */
  @Post('/updateIssuedKnitMaterialFromWms')
  async updateIssuedKnitMaterialFromWms(@Body() reqObj: WMS_C_IssuanceIdRequest): Promise<GlobalResponseObject> {
    try {
      return await this.service.updateIssuedKnitMaterialFromWms(reqObj);
    } catch (error) {
      console.log(error);
      return returnException(GlobalResponseObject, error);
    }
  }

}
