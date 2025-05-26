import { GlobalResponseObject } from "../../../common";
import { CutStatusEnum, LayingStatusEnum } from "../../enum";
import { LayDowntimeModel } from "./lay-down-time.model";
import { LayRollInfoModel } from "./lay-roll-info.model";

export class DocketLayModel {
    layId: number;
    docketNumber: string;
    matReqNo: string;
    layStartedOn: string;
    layCompletedOn: string;
    currentLayStatus: LayingStatusEnum;
    cutStatus: CutStatusEnum;
    totalLayedPlies: number;
    layInspector: string;
    layDownTimes: LayDowntimeModel[]; // this will not be returned in case of getLayAndCutStatusForDocket
    layRollsInfo: LayRollInfoModel[]; // this will not be returned in case of getLayAndCutStatusForDocket
  
    constructor(
      layId: number,
      docketNumber: string,
      matReqNo: string,
      layStartedOn: string,
      layCompletedOn: string,
      currentLayStatus: LayingStatusEnum,
      cutStatus: CutStatusEnum,
      totalLayedPlies: number,
      layInspector: string,
      layDownTimes: LayDowntimeModel[],
      layRollsInfo: LayRollInfoModel[]
    ) {
      this.layId = layId;
      this.docketNumber = docketNumber;
      this.matReqNo = matReqNo;
      this.layStartedOn = layStartedOn;
      this.layCompletedOn = layCompletedOn;
      this.currentLayStatus = currentLayStatus;
      this.totalLayedPlies = totalLayedPlies;
      this.layInspector = layInspector;
      this.layDownTimes = layDownTimes;
      this.layRollsInfo = layRollsInfo;
      this.cutStatus = cutStatus;
    }
  }




