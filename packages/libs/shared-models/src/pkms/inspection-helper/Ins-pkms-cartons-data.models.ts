// Response model for Carton Data
export class CartonDataDto {
    id: number;
    barcode: string;
    pkJobId: number;
    style: string;
    buyerAddress: string;
}

// Response model for Pack List Data
export class PackListDataDto {
    id: number;
    plConfigNo: string;
}

// Response model for Inspection Attributes
export class PKMSAttributesDto {
    insRequestId: number;
    attributeName: string;
    attributeValue: string;
}

// Response model for Config Least Child Data (Size, Ratio, Color)
export class ConfigLeastChildDto {
    ratio: number;
    size: string;
    color: string;
}

// Response model for File Upload Data
export class FileUploadDto {
    id: number;
    fileName: string;
    featuresRefNo: number;
    featuresRefName: string;
} 

export interface PoDetailsDto {
    poNumber: string;
    style: string;
    qty: number;
    exfactory: string;
  }
