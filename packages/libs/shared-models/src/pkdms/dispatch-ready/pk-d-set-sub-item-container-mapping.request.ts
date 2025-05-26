import { CommonRequestAttrs } from "../../common";

export class PkDSetSubItemContainerMappingRequest extends CommonRequestAttrs {
    subItemBarcode: string[];
    containerId: number;
    isUnMap: boolean;
    shift: string;
    skipMissingHits: boolean;
    override?: boolean;
    constructor(
        subItemBarcode: string[],
        containerId: number,
        isUnMap: boolean,
        shift: string,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        skipMissingHits: boolean,
        override?: boolean,
    ) {
        super(username, unitCode, companyCode, userId)
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId
        this.subItemBarcode = subItemBarcode
        this.containerId = containerId
        this.isUnMap = isUnMap
        this.shift = shift
        this.skipMissingHits = skipMissingHits;
        this.override = override

    }
}