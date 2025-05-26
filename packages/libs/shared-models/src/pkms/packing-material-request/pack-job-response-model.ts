import { MaterialTypeEnum, PackMatReqStatusEnum } from "../enum"

export class PackJobResponseModel {
    poId: number
    packListId: number
    packJobItems: PackJobItems[]
    // addItems: PackItemsModel[]
    constructor(
        poId: number,
        packListId: number,
        packJobItems: PackJobItems[],
        // addItems: PackItemsModel[]
    ) {
        this.poId = poId
        this.packListId = packListId
        this.packJobItems = packJobItems
        // this.addItems = addItems
    }

}




export class PackItemsModel {
    itemsId: number;
    itemCode: string;
    qty: number;
    itemType: MaterialTypeEnum
    isEligibleQty: boolean
    constructor(
        itemsId: number,
        ItemCode: string,
        qty: number,
        itemType: MaterialTypeEnum,
        isEligibleQty: boolean
    ) {
        this.itemsId = itemsId;
        this.itemCode = ItemCode;
        this.qty = qty;
        this.itemType = itemType;
        this.isEligibleQty = isEligibleQty;
    }

}


export class PackJobItems {
    packJobId: number;
    packJobNo: string;
    cartonsCount: number;
    itemsData: PackItemsModel[];
    isMaterialCreated: boolean;
    materialNo: string;
    materialStatus?: PackMatReqStatusEnum;
    constructor(packJobId: number, packJobNo: string, cartonsCount: number,
        itemsData: PackItemsModel[], isMaterialCreated: boolean, materialNo: string, materialStatus?: PackMatReqStatusEnum) {
        this.packJobId = packJobId;
        this.cartonsCount = cartonsCount;
        this.packJobNo = packJobNo;
        this.itemsData = itemsData;
        this.isMaterialCreated = isMaterialCreated;
        this.materialNo = materialNo;
        this.materialStatus = materialStatus;
    }
}

