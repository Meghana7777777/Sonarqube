
export class MarkerInfoModel  {
    id: number;
    poSerial: number;
    productName: string;
    fgColor: string;
    itemCode: string;
    markerName: string;
    markerVersion: string;
    mLength: string;
    mWidth: string;
    patVer: string;
    remarks1: string;
    remarks2: string;
    markerType: string; // the marker type unique code
    markerTypeId: string; // PK of the marker type entity
    clubMarker: boolean;
    defaultMarker: boolean;
    clubMarkerIds: number[];
    endAllowance: string;
    perimeter: string;

    constructor(
        id: number,
        poSerial: number,
        productName: string,
        fgColor: string,
        itemCode: string,
        markerName: string,
        markerVersion: string,
        mLength: string,
        mWidth: string,
        patVer: string,
        remarks1: string,
        remarks2: string,
        markerType: string, // the marker type unique code
        markerTypeId: string, // PK of the marker type entity
        clubMarker: boolean,
        defaultMarker: boolean,
        clubMarkerIds: number[],
        endAllowance: string,
        perimeter: string
    ) {
        this.id = id;
        this.poSerial = poSerial;
        this.productName = productName;
        this.fgColor = fgColor;
        this.itemCode = itemCode;
        this.markerName = markerName;
        this.markerVersion = markerVersion;
        this.mLength = mLength;
        this.mWidth = mWidth;
        this.patVer = patVer;
        this.remarks1 = remarks1;
        this.remarks2 = remarks2;
        this.markerType = markerType;
        this.markerTypeId = markerTypeId;
        this.clubMarker = clubMarker;
        this.defaultMarker = defaultMarker;
        this.clubMarkerIds = clubMarkerIds;
        this.endAllowance = endAllowance;
        this.perimeter = perimeter;
    }
}