import { CommonRequestAttrs } from "../../common";

export class CreateDispatchSetRequest extends CommonRequestAttrs {
    packLists: PackListCartoonIDs[];
    iNeedPackListAttrs: boolean;
    iNeedPackJobs: boolean;
    iNeedPackJobAttrs: boolean;
    iNeedCartons: boolean;
    iNeedCartonAttrs: boolean;
    constructor(
      packLists: PackListCartoonIDs[],
      iNeedPackListAttrs?: boolean,
      iNeedPackJobs?: boolean,
      iNeedPackJobAttrs?: boolean,
      iNeedCartons?: boolean,
      iNeedCartonAttrs?: boolean,
      username?: string,
      unitCode?: string,
      companyCode?: string,
      userId?: number,
    ) {
      super(username, unitCode, companyCode, userId);
      this.packLists = packLists;
      this.iNeedPackListAttrs = iNeedPackListAttrs;
      this.iNeedPackJobs = iNeedPackJobs;
      this.iNeedPackJobAttrs = iNeedPackJobAttrs;
      this.iNeedCartons = iNeedCartons;
      this.iNeedCartonAttrs = iNeedCartonAttrs;
    }
  }
  
  export class PackListCartoonIDs {
    packListId: number;
    cartonIds: number[];
  
    constructor(packListId: number, cartonIds: number[]) {
      this.packListId = packListId;
      this.cartonIds = cartonIds;
    }
  }
  