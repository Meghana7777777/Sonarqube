import { ActualStages } from "./actual-stages.model";

export class StagesForPackingList {
    packageId:string;//ph-vehicle foor GRN ph iem lines
    status:string;
    actualStatus:ActualStages[];
    
    constructor(
        packageId:string,
        status:string,
        actualStatus:ActualStages[])
        {
            this.packageId=packageId
            this.status=status;
            this.actualStatus=actualStatus;
    }
  }