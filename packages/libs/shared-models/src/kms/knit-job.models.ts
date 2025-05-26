import { CommonRequestAttrs, GlobalResponseObject, OrderFeatures, PhItemCategoryEnum } from "../common";
import { ProcessTypeEnum } from "../oms";
import { KJ_MaterialStatusEnum } from "./knit-job-planning.models";


export class KC_ProductSku {
    combKey: string;
    productName: string;
    productType: string;
    productCode: string;

    /**
     * Constructor for KC_ProductSku
     * @param combKey - Combination key for the product SKU
     * @param productName - Name of the product
     * @param productType - Type/category of the product
     * @param productCode - Unique product code
     */
    constructor(combKey: string, productName: string, productType: string, productCode: string) {
        this.combKey = combKey;
        this.productName = productName;
        this.productType = productType;
        this.productCode = productCode;
    }
}



export class KC_KnitJobModel {
    knitGroup: string;
    jobNumber: string;
    jobQty: number;
    productSpecs: KC_ProductSku;
    processingSerial: number;
    colorSizeInfo: KC_KnitJobColorSizeModel[];
    barcodeInfo: KC_KnitJobBarcodeModel[];
    jobFeatures: KC_KnitJobFeatures;
    barcodePrinted: boolean;
    materialStatus: KJ_MaterialStatusEnum;
    jobRm: KC_KnitJobRmModel[];
    isPlanned: boolean;

    /**
     * Constructor for KC_KnitJobModel
     * @param knitGroup - Unique identifier for the knit group
     * @param jobNumber - Job number for the knit process
     * @param jobQty - Quantity asmociated with the job
     * @param productSpecs - Product specifications
     * @param processingSerial - Processing serial number
     * @param colorSizeInfo - Color and size-related information
     * @param barcodeInfo - List of barcode-related information
     * @param jobFeatures - Features of the knit job
     * @param barcodePrinted - Indicates if the barcode is printed
     * @param materialStatus - Status of the materials used in the job
     * @param jobRm - List of raw material models asmociated with the job
     */
    constructor(
        knitGroup: string,
        jobNumber: string,
        jobQty: number,
        productSpecs: KC_ProductSku,
        processingSerial: number,
        colorSizeInfo: KC_KnitJobColorSizeModel[],
        barcodeInfo: KC_KnitJobBarcodeModel[],
        jobFeatures: KC_KnitJobFeatures,
        barcodePrinted: boolean,
        materialStatus: KJ_MaterialStatusEnum,
        jobRm: KC_KnitJobRmModel[],
        isPlanned: boolean
    ) {
        this.knitGroup = knitGroup;
        this.jobNumber = jobNumber;
        this.jobQty = jobQty;
        this.productSpecs = productSpecs;
        this.processingSerial = processingSerial;
        this.colorSizeInfo = colorSizeInfo;
        this.barcodeInfo = barcodeInfo;
        this.jobFeatures = jobFeatures;
        this.barcodePrinted = barcodePrinted;
        this.materialStatus = materialStatus;
        this.jobRm = jobRm;
        this.isPlanned = isPlanned;
    }
}



export class KC_KnitJobRmModel {
    itemCode: string;
    itemName: string;
    itemDesc: string;
    itemType: PhItemCategoryEnum;
    componentNames: string[];


    /**
     * Constructor for KC_KnitJobRmModel
     * @param itemCode - Code of the raw material item
     * @param itemName - Name of the raw material item
     * @param itemDesc - Description of the raw material item
     * @param itemType - Type of the raw material item
     */
    constructor(itemCode: string, itemName: string, itemDesc: string, itemType: PhItemCategoryEnum, componentNames: string[]) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.itemType = itemType;
        this.componentNames = componentNames
    }
}


export class KC_KnitJobFeatures {
    moNumber: string[];
    moLineNumber: string[];
    moOrderSubLineNumber: string[];
    coNumber: string[];
    styleName: string;
    styleDescription: string;
    exFactoryDate: string[];
    schedule: string[];
    zFeature: string[];
    styleCode: string[];
    customerName: string[];

    /**
     * Constructor for KC_KnitJobFeatures
     * @param style - Style name or code
     * @param co - Customer orders
     * @param vpo - Vendor purchase orders
     * @param moLines - manufacturing order lines
     */
    constructor(moNumber: string[],
        moLineNumber: string[],
        moOrderSubLineNumber: string[],
        coNumber: string[],
        styleName: string,
        styleDescription: string,
        exFactoryDate: string[],
        schedule: string[],
        zFeature: string[],
        styleCode: string[],
        customerName: string[]) {
            this.moNumber = moNumber;
            this.moLineNumber = moLineNumber;
            this.moOrderSubLineNumber = moOrderSubLineNumber;
            this.coNumber = coNumber;
            this.styleName = styleName;
            this.styleDescription = styleDescription;
            this.exFactoryDate = exFactoryDate;
            this.schedule = schedule;
            this.zFeature = zFeature;
            this.styleCode = styleCode;
            this.customerName = customerName;
    }
}




export class KC_KnitOrderJobsModel {
    knitGroup: string;
    knitJobs: KC_KnitJobModel[];

    /**
     * Constructor for KC_KnitOrderJobsModel
     * @param knitGroup - Unique identifier for the knit group
     * @param knitJobs - List of knit jobs asmociated with the knit group
     */
    constructor(knitGroup: string, knitJobs: KC_KnitJobModel[]) {
        this.knitGroup = knitGroup;
        this.knitJobs = knitJobs;
    }
}



export class KC_KnitOrderJobsResponse extends GlobalResponseObject {
    data?: KC_KnitOrderJobsModel[];

    /**
     * Constructor for KC_KnitOrderJobsResponse
     * @param status - Status of the response
     * @param errorCode - Error code if applicable
     * @param internalMessage - Internal message for debugging
     * @param data - Optional list of Knit Order Jobs Models
     */
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data?: KC_KnitOrderJobsModel[]
    ) {
        super(status, errorCode, internalMessage); // Call parent constructor
        this.data = data;
    }
}



export class KC_KnitJobBarcodeFeatureModel {
    moNumber: string[];
    moLineNumber: string[];
    moOrderSubLineNumber: string[];
    coNumber: string[];
    styleName: string;
    styleDescription: string;
    exFactoryDate: string[];
    schedule: string[];
    zFeature: string[];
    styleCode: string[];
    customerName: string[];

    /**
     * Constructor for KC_KnitJobBarcodeFeatureModel
     * @param moNumber - manufacturing order numbers
     * @param moLineNumber - manufacturing order line numbers
     * @param moOrderSubLineNumber - manufacturing order sub-line numbers
     * @param coNumber - Customer order numbers
     * @param styleName - Style name
     * @param styleDescription - Description of the style
     * @param exFactoryDate - Expected factory dates
     * @param schedule - Schedules
     * @param zFeature - Special features
     * @param styleCode - Style codes
     * @param customerName - Customer names
     */
    constructor(
        moNumber: string[],
        moLineNumber: string[],
        moOrderSubLineNumber: string[],
        coNumber: string[],
        styleName: string,
        styleDescription: string,
        exFactoryDate: string[],
        schedule: string[],
        zFeature: string[],
        styleCode: string[],
        customerName: string[]
    ) {
        this.moNumber = moNumber;
        this.moLineNumber = moLineNumber;
        this.moOrderSubLineNumber = moOrderSubLineNumber;
        this.coNumber = coNumber;
        this.styleName = styleName;
        this.styleDescription = styleDescription;
        this.exFactoryDate = exFactoryDate;
        this.schedule = schedule;
        this.zFeature = zFeature;
        this.styleCode = styleCode;
        this.customerName = customerName;
    }
}



export class KC_KnitJobBarcodeModel {
    jobNumber: string;
    barcode: string;
    color: string;
    size: string;
    qty: number;
    bcdNumber: string;
    features: KC_KnitJobBarcodeFeatureModel;
    pslId?:string;

    /**
     * Constructor for KC_KnitJobBarcodeModel
     * @param jobNumber - Job number
     * @param barcode - Barcode value
     * @param color - Color of the item
     * @param size - Size of the item
     * @param qty - Quantity
     * @param bcdNumber - Barcode number
     * @param features - Barcode features
     */
    constructor(
        jobNumber: string,
        barcode: string,
        color: string,
        size: string,
        qty: number,
        bcdNumber: string,
        features: KC_KnitJobBarcodeFeatureModel,
        pslId?:string,
    ) {
        this.jobNumber = jobNumber;
        this.barcode = barcode;
        this.color = color;
        this.size = size;
        this.qty = qty;
        this.bcdNumber = bcdNumber;
        this.features = features;
        this.pslId=pslId;
    }
}



export class KC_KnitJobColorSizeModel {
    fgColor: string;
    sizeQtys: { size: string; qty: number }[];

    /**
     * Constructor for KC_KnitJobColorSizeModel
     * @param fgColor - Finished good color
     * @param sizeQtys - Array of objects containing size and quantity details
     */
    constructor(fgColor: string, sizeQtys: { size: string; qty: number }[]) {
        this.fgColor = fgColor;
        this.sizeQtys = sizeQtys;
    }
}


export class KC_KnitJobIdRequest extends CommonRequestAttrs {
    jobId: number;
    knitJobNumber: string;

    processingSerial: number;
    processType: ProcessTypeEnum;
    iNeedSizesInfo: boolean;
    iNeedRmDetails : boolean;
    iNeedBarcodeDetails: boolean;
    iNeedJobFeatures: boolean;
  


    /**
     * Constructor for KC_KnitJobIdRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param jobId - Job ID
     * @param iNeedFeatures - Whether job features are needed
     * @param iNeedColSizes - Whether color sizes are needed
     * @param iNeedBarcode - Whether barcode is needed
     * @param iNeedBarcodeFeatures - Whether barcode features are needed
     * @param iNeedMaterialStatus - Whether material status is needed
     * @param iNeedJobRm - Whether job raw material is needed
     * @param date - Optional date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobId: number,
        knitJobNumber: string,
        iNeedSizesInfo: boolean,
        iNeedRmDetails : boolean,
        iNeedBarcodeDetails: boolean,
        iNeedJobFeatures: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.jobId = jobId;
        this.knitJobNumber = knitJobNumber;
        this.iNeedSizesInfo = iNeedSizesInfo;
        this.iNeedRmDetails = iNeedRmDetails;
        this.iNeedBarcodeDetails = iNeedBarcodeDetails;
        this.iNeedJobFeatures = iNeedJobFeatures;
    }
}


export class KC_KnitJobNumberRequest extends CommonRequestAttrs {
    jobNumber: string;
    iNeedJobFeatures: boolean;
    iNeedColSizes: boolean;
    iNeedBarcode: boolean;
    iNeedBarcodeFeatures: boolean;
    iNeedMaterialStatus: boolean;
    iNeedJobRm: boolean;

    /**
     * Constructor for KC_KnitJobNumberRequest
     * @param username - User's name
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID
     * @param jobNumber - Job number
     * @param iNeedJobFeatures - Whether job features are needed
     * @param iNeedColSizes - Whether color sizes are needed
     * @param iNeedBarcode - Whether barcode is needed
     * @param iNeedBarcodeFeatures - Whether barcode features are needed
     * @param iNeedMaterialStatus - Whether material status is needed
     * @param iNeedJobRm - Whether job raw material is needed
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        jobNumber: string,
        iNeedJobFeatures: boolean,
        iNeedColSizes: boolean,
        iNeedBarcode: boolean,
        iNeedBarcodeFeatures: boolean,
        iNeedMaterialStatus: boolean,
        iNeedJobRm: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.jobNumber = jobNumber;
        this.iNeedJobFeatures = iNeedJobFeatures;
        this.iNeedColSizes = iNeedColSizes;
        this.iNeedBarcode = iNeedBarcode;
        this.iNeedBarcodeFeatures = iNeedBarcodeFeatures;
        this.iNeedMaterialStatus = iNeedMaterialStatus;
        this.iNeedJobRm = iNeedJobRm;
    }
}




