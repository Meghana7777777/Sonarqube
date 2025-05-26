import { CommonRequestAttrs } from "../../common";
import { MarkerProdNameItemCodeModel } from "./marker-prod-name-item.model";

export class MarkerCreateRequest extends CommonRequestAttrs {
    globalMarker: boolean;
    poSerial: number;
    // this object holds multiple product name and its associated fabric
    // OR multiple product fabrics and its associated product name
    // to overcome the club ratio with   N x N  product name and faric combindations. In such cases we create the same duplicate markers accross the product_name and fabrics
    productNameItemCodeCombinations: MarkerProdNameItemCodeModel[];
    markerName: string;
    markerVersion: string;
    mLength: string;
    mWidth: string;
    patVer: string;
    remarks1: string;
    remarks2: string;
    markerType: string; // the marker type unique code
    markerTypeId: number; // PK of the marker type entity    
    endAllowance: string;
    perimeter: string;

    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        globalMarker: boolean,
        poSerial: number,
        productNameItemCodeCombinations: MarkerProdNameItemCodeModel[],
        markerName: string,
        markerVersion: string,
        mLength: string,
        mWidth: string,
        patVer: string,
        remarks1: string,
        remarks2: string,
        markerType: string,
        markerTypeId: number,
        endAllowance: string,
        perimeter: string
    ) {
        super(username,unitCode,companyCode,userId);
        this.globalMarker = globalMarker;
        this.poSerial = poSerial;
        this.productNameItemCodeCombinations = productNameItemCodeCombinations;
        this.markerName = markerName;
        this.mLength = mLength;
        this.mWidth = mWidth;
        this.patVer = patVer;
        this.remarks1 = remarks1;
        this.remarks2 = remarks2;
        this.markerType = markerType;
        this.markerTypeId = markerTypeId;
        this.markerVersion = markerVersion;
        this.endAllowance = endAllowance;
        this.perimeter = perimeter;
    }
}