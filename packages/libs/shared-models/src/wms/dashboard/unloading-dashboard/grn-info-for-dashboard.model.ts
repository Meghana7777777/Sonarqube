export class GrnInfoForDashboard {
  totalGRN: number;
  pendingGRN: number;
  packingListDetails: GrnPackListInfo[];

  constructor(totalGRN: number, pendingGRN: number, packingListDetails: GrnPackListInfo[]) {
    this.totalGRN = totalGRN;
    this.pendingGRN = pendingGRN;
    this.packingListDetails = packingListDetails;
  }
}

export class GrnPackListInfo {
  packingListID: string;
  packingListStyleType: string;
  packingListReceivedDate: string;
  rollsInPackingList: number;
  GrnCompletedRollsInPackingList: number;
  approvedOfficer: string;
  GRNStatus: string; // OPEN / INPROGRESS
  totalUnloadedRolls: number;
  unloadedDayTime: string;
  GRNStartDateTime: string;
  binAllocated: boolean;
  supplierName: string;

  constructor(
    packingListID: string,
    packingListStyleType: string,
    packingListReceivedDate: string,
    rollsInPackingList: number,
    GrnCompletedRollsInPackingList: number,
    approvedOfficer: string,
    GRNStatus: string,
    totalUnloadedRolls: number,
    unloadedDayTime: string,
    GRNStartDateTime: string,
    binAllocated: boolean,
    supplierName: string
  ) {
    this.packingListID = packingListID;
    this.packingListStyleType = packingListStyleType;
    this.packingListReceivedDate = packingListReceivedDate;
    this.rollsInPackingList = rollsInPackingList;
    this.GrnCompletedRollsInPackingList = GrnCompletedRollsInPackingList;
    this.approvedOfficer = approvedOfficer;
    this.GRNStatus = GRNStatus;
    this.totalUnloadedRolls = totalUnloadedRolls;
    this.unloadedDayTime = unloadedDayTime;
    this.GRNStartDateTime = GRNStartDateTime;
    this.binAllocated = binAllocated;
    this.supplierName = supplierName;
  }
}
