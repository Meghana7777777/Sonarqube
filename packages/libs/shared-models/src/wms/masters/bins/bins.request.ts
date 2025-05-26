import { CommonRequestAttrs } from "../../../common";
import { PreferredStorageMaterialEnum } from "../../enum";


export class BinsCreateRequest extends CommonRequestAttrs {
    id: number;
    name: string;
    code: string;
    spcount: number;
    level: number;
    rackId: number;
    column: number;
    // preferredstoraageMateial: PreferredStorageMaterialEnum;
    isActive: boolean;
    barcodeId: string;
    rackCode?: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, names: string, code: string, spcount: number, level: number, rackId: number, column: number, isActive: boolean, barcodeId: string, rackCode?: string) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.name = names;
        this.code = code;
        this.spcount = spcount;
        this.level = level;
        this.rackId = rackId;
        this.column = column;
        // this.preferredstoraageMateial = preferredstoraageMateial;
        this.isActive = isActive;
        this.barcodeId = barcodeId;
        this.rackCode = rackCode

    }
}
