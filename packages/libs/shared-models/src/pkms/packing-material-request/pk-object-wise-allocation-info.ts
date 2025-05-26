export class PK_ObjectWiseAllocationInfo_R {
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