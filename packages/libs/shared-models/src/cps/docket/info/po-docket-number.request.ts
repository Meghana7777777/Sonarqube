import { CommonRequestAttrs } from "../../../common";
import { SizeCompPanelInfo } from "./size-comp-panel-info.model";

export class PoDocketNumberRequest extends CommonRequestAttrs {
    docketNumber: string;
    // docketGroup: string;
    poSerial?: number; // not required when getting 1.docket allocated materials 2.getDocketsBasicInfoForDocketNumber 3.getLayInfoForDocket.
    //poSerial is required when making emb calls

    iNeedAllocatedRollsAlso: boolean;
    iNeedSizes: boolean;
    // NOTE: THE BELOW KEY MUST BE REMOVED. UTILIZE PoDocketSizePanelsRequest FOR THIS PURPOSE
    sizeCompPanelInfo: SizeCompPanelInfo[];

    doNoThrowErrorIfSomethingIsMissing?: boolean; // this param is useful in certain cases where you do not want to throw an error if something is not present. Instead you want a success response with no proper keys/arrays/objects
    iNeedFabricInfoAlso?: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        docketNumber: string,
        // docketGroup: string,
        iNeedAllocatedRollsAlso: boolean,
        iNeedSizes: boolean,
        sizeCompPanelInfo: SizeCompPanelInfo[],
        doNoThrowErrorIfSomethingIsMissing?: boolean,
        iNeedFabricInfoAlso?: boolean
    
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.docketNumber = docketNumber;
        // this.docketGroup = docketGroup;
        this.iNeedAllocatedRollsAlso = iNeedAllocatedRollsAlso;
        this.iNeedSizes = iNeedSizes;
        this.sizeCompPanelInfo = sizeCompPanelInfo;
        this.doNoThrowErrorIfSomethingIsMissing = doNoThrowErrorIfSomethingIsMissing;
        this.iNeedFabricInfoAlso = iNeedFabricInfoAlso;
    }
}

// {
//     "username": "admin",
//     "unitCode": "B3",
//     "companyCode": "5000",
//     "userId": 0,
//     "poSerial": "1",
//     "docketNumber": "20",
//     "iNeedAllocatedRollsAlso": false,
//     "iNeedSizes": false,
//     "sizeCompPanelInfo": null
// }