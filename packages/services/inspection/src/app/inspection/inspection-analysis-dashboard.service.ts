import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InsPackListWiseInspectionReqDetails, InsPackListWiseInspInfoHeaderResponse, InsPacKListLevelInspectionAnalysis, InsDateGroupUnitRequest, InsInsActPlanModelResp } from '@xpparel/shared-models';
import { InsRequestEntityRepo } from './repositories/ins-request.repository';
// import { PackingListInfoService } from '../packing-list/packing-list-info.service';
import { InsPackListInfoResponse } from './repositories/query-response/ins-pack-list-info-resp';
import { InsRequestHistoryRepo } from './repositories/ins-request-history.repository';

@Injectable()
export class InspectionAnalysisDashboardService {
  constructor(
    // @Inject(forwardRef(() => PackingListInfoService)) private packingListInfoService: PackingListInfoService,
    private inspReqRepo: InsRequestEntityRepo,
    private inspReqHistoryRepo: InsRequestHistoryRepo
  ) {

  }

  async getPackListWiseInspRequestInfo(fromDate: string, toDate: string, unitCode: string, companyCode: string): Promise<InsPackListWiseInspInfoHeaderResponse> {
    const inspReqInfo: InsPackListInfoResponse[] = await this.inspReqRepo.getPackListWiseInspectionDetails(fromDate, toDate, unitCode, companyCode);
    const packingListAndRollCountMap = new Map<string, number[]>();
    const allInspReqDetails: InsPackListWiseInspectionReqDetails[] = [];
    for (const eachInspReq of inspReqInfo) {
      if (!packingListAndRollCountMap.get(eachInspReq.pack_list_code)) {
        // const rollInfoByPackList = await this.packingListInfoService.getRollIdsByPhId(eachInspReq.pack_list_id, eachInspReq.lot_number, unitCode, companyCode);
        // packingListAndRollCountMap.set(eachInspReq.pack_list_code, rollInfoByPackList);
      }
      const packListInsInfo = new InsPackListWiseInspectionReqDetails();
      packListInsInfo.CreationDate = eachInspReq.ins_creation_time;
      packListInsInfo.RequestRolls = eachInspReq.open_rolls ? eachInspReq.open_rolls.split(',').map((eachRoll) => {
        return {
          rollId : eachRoll
        }
      }) : [];
      packListInsInfo.startedRolls = eachInspReq.started_rolls ? eachInspReq.started_rolls.split(',').map((eachRoll) => {
        return {
          rollId : eachRoll
        }
      }): [];
      packListInsInfo.completedRolls = eachInspReq.completed_rolls ? eachInspReq.completed_rolls.split(',').map((eachRoll) => {
        return {
          rollId : eachRoll
        }
      }): [];
      packListInsInfo.inspectionProcessType = eachInspReq.request_category;
      packListInsInfo.isDelayed = false;
      packListInsInfo.material = eachInspReq.item_code;
      packListInsInfo.packingListId = eachInspReq.pack_list_code;
      packListInsInfo.requestId = eachInspReq.id.toString();
      packListInsInfo.requestResult = eachInspReq.final_inspection_status;
      packListInsInfo.totalPackingListRolls = [];
      // todo:requestStatus
      // packListInsInfo.requestStatus = eachInspReq.ins_activity_status;
      packingListAndRollCountMap.get(eachInspReq.pack_list_code).map((eachRoll) => {
        packListInsInfo.totalPackingListRolls.push ({
            rollId : eachRoll.toString()
        })
      });
      allInspReqDetails.push(packListInsInfo);

    }
    const resObj = new InsPacKListLevelInspectionAnalysis();
    resObj.inspectionLevelDetail = allInspReqDetails;
    return new InsPackListWiseInspInfoHeaderResponse(true, 0 , '', resObj)
  } 
  
  async getInspectionActualAndPlanData(payload: InsDateGroupUnitRequest): Promise<InsInsActPlanModelResp> {
    const actPlanInfo = await this.inspReqRepo.getInspectionActualAndPlanData(payload);
    return new InsInsActPlanModelResp(true, 0, '', actPlanInfo)
  }

}