import { GlobalResponseObject } from "@xpparel/shared-models";

export class RollsCheckListResponse extends GlobalResponseObject {
    data: RollReqHeaderModel[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: RollReqHeaderModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class RollReqHeaderModel {
    packListId:string;
    createAt: string;
    whReqItems: RollsReqItemsModel[];
    constructor(
        packListId:string,
        whReqItems: RollsReqItemsModel[],
        createAt: string,
    ) {
        this.packListId = packListId;
        this.whReqItems = whReqItems;
        this.createAt = createAt;
    }
}


export class RollsReqItemsModel {
    packListId: string;
    rollsAbstract: RollsReqItemAbstract;
    whReqItemAttrs: RollsReqItemAttrs;
    rollsInfo: RollsReqSubItemModel[];
    whAbstract: RollsBasicInfoModel[];

    constructor(
        packListId: string,
        rollsAbstract: RollsReqItemAbstract,
        whReqItemAttrs: RollsReqItemAttrs,
        rollsInfo: RollsReqSubItemModel[],
        whAbstract: RollsBasicInfoModel[]
    ) {
        this.packListId = packListId;
        this.rollsAbstract = rollsAbstract;
        this.whReqItemAttrs = whReqItemAttrs;
        this.rollsInfo = rollsInfo;
        this.whAbstract = whAbstract;
    }
}

export class RollsReqItemAbstract {
    totalRolls: number;
    locMapRolls: number;
    locUnMapRolls: number;
    fgInRolls: number;
    fgOutRolls: number;

    constructor(
        totalRolls: number,
        locMapRolls: number,
        locUnMapRolls: number,
        fgInRolls: number,
        fgOutRolls: number
    ) {
        this.totalRolls = totalRolls;
        this.locMapRolls = locMapRolls;
        this.locUnMapRolls = locUnMapRolls;
        this.fgInRolls = fgInRolls;
        this.fgOutRolls = fgOutRolls;
    }
}

export class RollsReqItemAttrs {
    moNo: string;
    prodNames: string[];
    poNo: string[];
    styles: string[];
    buyers: string[];
    destinations: string[];
    delDates: string[];

    constructor(
        moNo: string,
        prodNames: string[],
        poNo: string[],
        styles: string[],
        buyers: string[],
        destinations: string[],
        delDates: string[]
    ) {
        this.moNo = moNo;
        this.prodNames = prodNames;
        this.poNo = poNo;
        this.styles = styles;
        this.buyers = buyers;
        this.destinations = destinations;
        this.delDates = delDates;
    }
}

export class RollsReqSubItemModel {
    barcode: string;
    rollQty: number;
    location?: string;
    loadedInfo?: boolean;
    rollId?: number;

    constructor(barcode: string, rollQty: number, location?: string, loadedInfo?: boolean, rollId?: number) {
        this.barcode = barcode;
        this.rollQty = rollQty;
        this.location = location;
        this.loadedInfo = loadedInfo;
        this.rollId = rollId;
    }
}

export class RollsBasicInfoModel {
    whCode: string;
    whId: number;
    floor: string;
    noOfRolls: number;
    address: string;

    constructor(whCode: string, whId: number, floor: string, noOfRolls: number, address: string) {
        this.whCode = whCode;
        this.whId = whId;
        this.floor = floor;
        this.noOfRolls = noOfRolls;
        this.address = address;
    }
}
