import { CommonRequestAttrs } from "../../../common";
import { SizeCompPanelInfo } from "./size-comp-panel-info.model";


export class PoDocketSizePanelsRequest extends CommonRequestAttrs {
    docketNumber: string;
    sizeCompPanelInfo: SizeCompPanelInfo[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        docketNumber: string,
    ) {
        super(username, unitCode, companyCode, userId);
        this.docketNumber = docketNumber;
        this.sizeCompPanelInfo = this.sizeCompPanelInfo;
    }
}