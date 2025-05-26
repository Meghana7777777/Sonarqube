import { CommonRequestAttrs } from "../../../common";
import { PreferredFGStorageMaterialEnum } from "../../enum";

export class FgLocationCreateReq extends CommonRequestAttrs {
    id: number;
    name: string;
    code: string;
    spcount: number;
    level: number;
    rackId: number;
    whId: number;
    column: number;
    preferredStorageMaterial: PreferredFGStorageMaterialEnum;
    isActive: boolean;
    barcodeId: string;
    length: number;
    width: number;
    height: number;
    latitude: string;
    longitude: string;
    rackCode?: string;


    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, names: string, code: string, spcount: number, level: number,whId:number, rackId: number, column: number, isActive: boolean, barcodeId: string, length: number, width: number, height: number, latitude: string, longitude: string, preferredStorageMaterial: PreferredFGStorageMaterialEnum, rackCode?: string) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.name = names;
        this.code = code;
        this.spcount = spcount;
        this.level = level;
        this.rackId = rackId;
        this.whId = whId;
        this.column = column;
        this.preferredStorageMaterial = preferredStorageMaterial;
        this.isActive = isActive;
        this.barcodeId = barcodeId;
        this.length = length;
        this.width = width;
        this.height = height;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rackCode = rackCode;

    }
}