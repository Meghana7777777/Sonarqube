import { InsUomEnum } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";
import { SewVersionModel } from "./sew-version.model";

export class OpVRawMaterial {
    product: string;
    productType: string;
    consumption: string;
    uom: InsUomEnum;
    opCode: string;
    constructor(
        product: string,
        productType: string,
        consumption: string,
        uom: InsUomEnum,
        opCode: string,
    ) {
        this.product = product;
        this.productType = productType;
        this.consumption = consumption;
        this.uom = uom;
        this.opCode = opCode;
    }
}


export class  RawMaterialIdRequest extends CommonRequestAttrs {
    opCode: string;
    opVersionId:number;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        opCode: string,opVersionId:number
    ){
        super(username, unitCode, companyCode, userId);
        this.opCode = opCode;
        this.opVersionId=opVersionId;
    }
}

export class SewVersionRequest extends CommonRequestAttrs {
    productName: string;
    poSerial: number;
    opSeqModel: SewVersionModel;
    rawMaterials: OpVRawMaterial[];
    manufacturingOrder?:string;
    sewSerial?: number;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        productName: string,
        poSerial: number,
        opSeqModel: SewVersionModel,
        rawMaterials: OpVRawMaterial[],
        manufacturingOrder?:string,
        sewSerial?: number
    ) {
        super(username, unitCode, companyCode, userId);
        this.productName = productName;
        this.poSerial = poSerial;
        this.opSeqModel = opSeqModel;
        this.rawMaterials = rawMaterials;
        this.manufacturingOrder =manufacturingOrder;
        this.sewSerial = sewSerial;
    }
}