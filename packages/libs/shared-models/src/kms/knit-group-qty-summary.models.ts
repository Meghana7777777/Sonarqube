import { GlobalResponseObject } from "../common";

export class KC_KnitGroupQtySummaryModel {
    knitGroup: string;
    itemCodes: string[];
    components: string[];
    sizeWiseKnitGroupInfo: kc_SizeWiseKnitGroupQtyInfo[];

    /**
     * Constructor for KnitGroupQtySummaryModel
     * @param knitGroup - Name of the knit group
     * @param itemCodes - List of item codes
     * @param components - List of components
     * @param sizeWiseKnitGroupInfo - Size-wise knit group information
     */
    constructor(
        knitGroup: string,
        itemCodes: string[],
        components: string[],
        sizeWiseKnitGroupInfo: kc_SizeWiseKnitGroupQtyInfo[]
    ) {
        this.knitGroup = knitGroup;
        this.itemCodes = itemCodes;
        this.components = components;
        this.sizeWiseKnitGroupInfo = sizeWiseKnitGroupInfo;
    }
}


export class kc_SizeWiseKnitGroupQtyInfo {
    size: string;
    knitRatioQty: number;

    /**
     * Constructor for SizeWiseKnitGroupQtyInfo
     * @param size - Size of the knit group
     * @param knitRatioQty - Knit ratio quantity for the given size
     */
    constructor(size: string, knitRatioQty: number) {
        this.size = size;
        this.knitRatioQty = knitRatioQty;
    }
}

export class KC_KnitGroupQtySummaryResp extends GlobalResponseObject {
    data: KC_KnitGroupQtySummaryModel[];

    /**
     * Constructor for KnitGroupQtySummaryResp
     * @param status - Response status
     * @param errorCode - Error code if any
     * @param internalMessage - Internal message regarding the response
     * @param data - List of Knit Group Quantity Summary Models
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: KC_KnitGroupQtySummaryModel[]) {
        super(status, errorCode, internalMessage); // Call parent constructor with required parameters
        this.data = data;
    }   
}


