
export class FabUtilizationModel {
    totalFabUtilized: number;
    utilizedOn: string;
    utilizedByJob: string;
    cutNumber: number;
    poSerial: number;
    poDesc: string;
    moNo: string;
    moLines: string[];
  
    constructor(
      totalFabUtilized: number,
      utilizedOn: string,
      utilizedByJob: string,
      cutNumber: number,
      poSerial: number,
      poDesc: string,
      moNo: string,
      moLines: string[]
    ) {
      this.totalFabUtilized = totalFabUtilized;
      this.utilizedOn = utilizedOn;
      this.utilizedByJob = utilizedByJob;
      this.cutNumber = cutNumber;
      this.poSerial = poSerial;
      this.poDesc = poDesc;
      this.moNo = moNo;
      this.moLines = moLines;
    }
  }