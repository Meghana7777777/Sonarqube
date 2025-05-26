import { CommonRequestAttrs, GlobalResponseObject, PhItemCategoryEnum } from "../common";
import { ProcessTypeEnum } from "../oms";


export class KG_KnitJobMaterialAllocationModel_C {
    requestId: number; // Not required while creating, will be null
    requestCode: string; // Not required while creating, will be null
    knitGroup: string;
    jobNumbers: string[];
    itemWiseInfo: KG_ItemWiseAllocationModel_C[];

    /**
     * Constructor for KG_KnitJobMaterialAllocationModel
     * @param requestId - Unique request ID (optional, will be null when creating)
     * @param requestCode - Unique request code (optional, will be null when creating)
     * @param knitGroup - Knit group identifier
     * @param jobNumbers - List of job numbers
     * @param itemWiseInfo - List of item-wise allocation details
     */
    constructor(
        requestId: number | null,
        requestCode: string | null,
        knitGroup: string,
        jobNumbers: string[],
        itemWiseInfo: KG_ItemWiseAllocationModel_C[]
    ) {
        this.requestId = requestId ?? null;
        this.requestCode = requestCode ?? null;
        this.knitGroup = knitGroup;
        this.jobNumbers = jobNumbers;
        this.itemWiseInfo = itemWiseInfo;
    }
}
export class KG_KnitJobMaterialAllocationModel_R {
    requestId: number; // Not required while creating, will be null
    requestCode: string; // Not required while creating, will be null
    knitGroup: string;
    jobNumbers: string[];
    itemWiseInfo: KG_ItemWiseAllocationModel_R[];

    /**
     * Constructor for KG_KnitJobMaterialAllocationModel
     * @param requestId - Unique request ID (optional, will be null when creating)
     * @param requestCode - Unique request code (optional, will be null when creating)
     * @param knitGroup - Knit group identifier
     * @param jobNumbers - List of job numbers
     * @param itemWiseInfo - List of item-wise allocation details
     */
    constructor(
        requestId: number | null,
        requestCode: string | null,
        knitGroup: string,
        jobNumbers: string[],
        itemWiseInfo: KG_ItemWiseAllocationModel_R[]
    ) {
        this.requestId = requestId ?? null;
        this.requestCode = requestCode ?? null;
        this.knitGroup = knitGroup;
        this.jobNumbers = jobNumbers;
        this.itemWiseInfo = itemWiseInfo;
    }
}


export class KG_ItemWiseAllocationModel_C {
    itemCode: string;
    totalRequiredQty: number;
    objectWiseDetail: KG_ObjectWiseAllocationInfo_C[];

    /**
     * Constructor for KG_ItemWiseAllocationModel
     * @param itemCode - Code of the item
     * @param totalRequiredQty - Total required quantity of the item
     * @param objectWiseDetail - List of object-wise allocation details
     */
    constructor(
        itemCode: string,
        totalRequiredQty: number,
        objectWiseDetail: KG_ObjectWiseAllocationInfo_C[]
    ) {
        this.itemCode = itemCode;
        this.totalRequiredQty = totalRequiredQty;
        this.objectWiseDetail = objectWiseDetail;
    }
}



export class KG_ItemWiseAllocationModel_R {
    itemCode: string;
    totalRequiredQty: number;
    objectWiseDetail: KG_ObjectWiseAllocationInfo_R[];

    /**
     * Constructor for KG_ItemWiseAllocationModel
     * @param itemCode - Code of the item
     * @param totalRequiredQty - Total required quantity of the item
     * @param objectWiseDetail - List of object-wise allocation details
     */
    constructor(
        itemCode: string,
        totalRequiredQty: number,
        objectWiseDetail: KG_ObjectWiseAllocationInfo_R[]
    ) {
        this.itemCode = itemCode;
        this.totalRequiredQty = totalRequiredQty;
        this.objectWiseDetail = objectWiseDetail;
    }
}



export class KG_ObjectWiseAllocationInfo_C {
    objectCode: string; // could be roll number / cone number etc.
    allocatingQuantity: number; // allocation quantity from that particular object; required only when creating

    /**
     * Constructor for KG_ObjectWiseAllocationInfo_C
     * @param objectCode - Code of the object (e.g., roll number, cone number)
     * @param allocatingQuantity - Quantity allocated from this object
     */
    constructor(objectCode: string, allocatingQuantity: number) {
        this.objectCode = objectCode;
        this.allocatingQuantity = allocatingQuantity;
    }
}


export class KG_ObjectWiseAllocationInfo_R {
    objectType: string; // roll / bile / cone etc.
    objectCode: string; // could be roll number / cone number etc.
    locationCode: string;
    supplierCode: string;
    VPO: string;
    availableQty: number;
    issuedQuantity: number; // Not required during creation
    alreadyAllocatedQuantity: number; // Not required during creation
    allocatingQuantity: number; // Allocation quantity from that particular object; required only when creating

    /**
     * Constructor for KG_ObjectWiseAllocationInfo_R
     * @param objectType - Type of the object (e.g., roll, cone)
     * @param objectCode - Unique code for the object
     * @param locationCode - Location code where the object is stored
     * @param supplierCode - Supplier's identification code
     * @param VPO - Vendor Purchase Order code
     * @param issuedQuantity - Quantity that has already been issued (not required during creation)
     * @param alreadyAllocatedQuantity - Quantity already allocated (not required during creation)
     * @param allocatingQuantity - Quantity being allocated from this object
     */
    constructor(
        objectType: string,
        objectCode: string,
        locationCode: string,
        supplierCode: string,
        VPO: string,
        availableQty: number,
        issuedQuantity: number = 0,
        alreadyAllocatedQuantity: number = 0,
        allocatingQuantity: number
    ) {
        this.objectType = objectType;
        this.objectCode = objectCode;
        this.locationCode = locationCode;
        this.supplierCode = supplierCode;
        this.VPO = VPO;
        this.availableQty = availableQty;
        this.issuedQuantity = issuedQuantity;
        this.alreadyAllocatedQuantity = alreadyAllocatedQuantity;
        this.allocatingQuantity = allocatingQuantity;
    }
}



export class KG_KnitJobMaterialAllocationRequest extends CommonRequestAttrs {
    processingSerial: number;
    processType: ProcessTypeEnum;
    planCloseDate: Date;
    sla: number;
    knitGroupWiseAllocationInfo: KG_KnitJobMaterialAllocationModel_C[];

    /**
     * Constructor for KG_KnitJobMaterialAllocationRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code
     * @param companyCode - Company code
     * @param userId - User ID of the requester
     * @param moSerial - Manufacturing Order Serial
     * @param knitGroupWiseAllocationInfo - Array of allocation models
     * @param date - Optional date field
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        processingSerial: number,
        processType: ProcessTypeEnum,
        planCloseDate: Date,
        sla: number,
        knitGroupWiseAllocationInfo: KG_KnitJobMaterialAllocationModel_C[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.planCloseDate = planCloseDate;
        this.sla = sla;
        this.knitGroupWiseAllocationInfo = knitGroupWiseAllocationInfo;
    }
}



export class KG_KnitJobMaterialAllocationResponse extends GlobalResponseObject {
    data: KG_KnitJobMaterialAllocationModel_R[];

    /**
     * Constructor for KG_KnitJobMaterialAllocationResponse
     * @param status - Response status (true/false)
     * @param errorCode - Error code for the response
     * @param internalMessage - Internal message related to the response
     * @param data - Array of knit job material allocation models
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: KG_KnitJobMaterialAllocationModel_R[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}



export class KG_KnitGroupMaterialRequirementModel {
    knitGroup: string;
    itemWiseMaterialRequirement: KG_ItemWiseMaterialRequirementModel[];

    /**
     * Constructor for KnitGroupMaterialRequirementModel
     * @param knitGroup - Name of the knit group
     * @param itemWiseMaterialRequirement - List of item-wise material requirements
     */
    constructor(
        knitGroup: string,
        itemWiseMaterialRequirement: KG_ItemWiseMaterialRequirementModel[]
    ) {
        this.knitGroup = knitGroup;
        this.itemWiseMaterialRequirement = itemWiseMaterialRequirement;
    }
}


export class KG_ItemWiseMaterialRequirementModel {
    itemCode: string;
    itemName: string;
    itemDescription: string;
    itemColor: string;
    itemType: PhItemCategoryEnum;
    totalRequiredQty: number;
    totalAllocatedQty: number;
    totalIssuedQty: number;
    objectWiseDetail: KG_ObjectWiseAllocationInfo_R[];

    /**
     * Constructor for ItemWiseMaterialRequirementModel
     * @param itemCode - Code of the item
     * @param itemName - Name of the item
     * @param itemDescription - Description of the item
     * @param itemColor - Color of the item
     * @param totalRequiredQty - Total required quantity
     * @param objectWiseDetail - Array of object-wise allocation details
     */
    constructor(
        itemCode: string,
        itemName: string,
        itemDescription: string,
        itemColor: string,
        itemType: PhItemCategoryEnum,
        totalRequiredQty: number,
        totalAllocatedQty: number,
        totalIssuedQty: number,
        objectWiseDetail: KG_ObjectWiseAllocationInfo_R[]
    ) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemColor = itemColor;
        this.itemType = itemType;
        this.totalRequiredQty = totalRequiredQty;
        this.totalAllocatedQty = totalAllocatedQty;
        this.totalIssuedQty = totalIssuedQty;
        this.objectWiseDetail = objectWiseDetail;
    }
}


export class KG_MaterialRequirementDetailResp extends GlobalResponseObject {
    data: KG_KnitGroupMaterialRequirementModel[];

    /**
     * Constructor for KG_MaterialRequirementDetailResp
     * @param status - Response status (true/false)
     * @param errorCode - Error code for the response
     * @param internalMessage - Internal message related to the response
     * @param data - Knit group material requirement model
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: KG_KnitGroupMaterialRequirementModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class KG_MaterialRequirementForKitGroupRequest extends CommonRequestAttrs {
    processingSerial: number;
    processType: ProcessTypeEnum;
    knitGroup: string; // DON'T SEND THIS WHILE CREATION SINCE WE CAN CREATE A REQUEST FOR MULTIPLE KNIT GROUPS
    jobNumbers: string[];
    iNeedObjectWise: boolean;

    /**
     * Constructor for MaterialRequirementForKitGroupRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code of the requester
     * @param companyCode - Company code of the requester
     * @param userId - User ID of the requester
     * @param poSerial - Purchase order serial number
     * @param knitGroup - Knit group identifier
     * @param jobNumbers - Array of job numbers
     * @param iNeedObjectWise - Whether the request is object-wise
     * @param date - Optional request date
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        processType: ProcessTypeEnum,
        knitGroup: string,
        jobNumbers: string[],
        iNeedObjectWise: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.processingSerial = poSerial;
        this.processType = processType;
        this.knitGroup = knitGroup;
        this.jobNumbers = jobNumbers;
        this.iNeedObjectWise = iNeedObjectWise;
    }
}



export class KG_JobWiseMaterialAllocationDetail {
    jobNumber: string;
    itemWiseAllocatedDetails: KG_ItemWiseAllocationModel_R[];

    /**
     * Constructor for KG_JobWiseMaterialAllocationDetail
     * @param jobNumber - Job number associated with the allocation
     * @param itemWiseAllocatedDetails - Array of item-wise allocation details
     */
    constructor(jobNumber: string, itemWiseAllocatedDetails: KG_ItemWiseAllocationModel_R[]) {
        this.jobNumber = jobNumber;
        this.itemWiseAllocatedDetails = itemWiseAllocatedDetails;
    }
}



export class KG_MaterialAllocatedQtyModel {
    itemCode: string;
    allocatedQty: number;

    objectWiseInfo: KG_ObjectWiseAllocationInfo_R

    /**
     * Constructor for KG_MaterialAllocatedQtyModel
     * @param itemCode - Code of the material item
     * @param allocatedQty - Allocated quantity of the material
     */
    constructor(itemCode: string, allocatedQty: number, objectWiseInfo: KG_ObjectWiseAllocationInfo_R) {
        this.itemCode = itemCode;
        this.allocatedQty = allocatedQty;
        this.objectWiseInfo = objectWiseInfo;
    }
}


export class KG_JobWiseMaterialAllocationDetailResponse extends GlobalResponseObject {
    data: KG_JobWiseMaterialAllocationDetail[];

    /**
     * Constructor for KG_JobWiseMaterialAllocationDetailResponse
     * @param status - Response status (true/false)
     * @param errorCode - Error code for the response
     * @param internalMessage - Internal message related to the response
     * @param data - Array of job-wise material allocation details
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data: KG_JobWiseMaterialAllocationDetail[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class KG_JobWiseMaterialAllocationDetailRequest extends CommonRequestAttrs {
    knitGroup: string;
    processingSerial: number;
    processType: ProcessTypeEnum;
    iNeedObjectWiseInfo: boolean;

    /**
     * Constructor for KG_JobWiseMaterialAllocationDetailRequest
     * @param username - Username of the requester
     * @param unitCode - Unit code of the request
     * @param companyCode - Company code of the request
     * @param userId - User ID of the requester
     * @param knitGroup - Knit group identifier
     * @param poSerial - Purchase order serial number
     * @param iNeedObjectWiseInfo - Flag to indicate if object-wise info is needed
     * @param date - Optional date for the request
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        knitGroup: string,
        processingSerial: number,
        processType: ProcessTypeEnum,
        iNeedObjectWiseInfo: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.knitGroup = knitGroup;
        this.processingSerial = processingSerial;
        this.processType = processType;
        this.iNeedObjectWiseInfo = iNeedObjectWiseInfo;
    }
}

