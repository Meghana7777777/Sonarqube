import { PkDSetItemModel } from "./pk-d-set-item.model";
import axios from "axios";

export class PkDSetModel {
    id: number; // PK of the d_set entity
    moNumber: string;
    dSetCode: string;
    shippingReqCreated: boolean;
    dSetItems: PkDSetItemModel[];
    constructor(
        id: number,
        moNumber: string,
        dSetCode: string,
        shippingReqCreated: boolean,
        dSetItems: PkDSetItemModel[]
    ) {
        this.id = id
        this.moNumber = moNumber
        this.dSetCode = dSetCode
        this.shippingReqCreated = shippingReqCreated;
        this.dSetItems = dSetItems
    }

    
}

const setDatatoGatepass = async (item: PkDSetModel) => {
    try {
      const payload = {
        dispatchChallanNo: item.dSetCode, // Set to Rajesh Anna
        fromUnitId: 10,
        warehouseId: 2,
        departmentId: 3,
        toAddresser: "buyer",
        addresserNameId: 84,
        weight: "50kg",
        purpose: "Delivery",
        value: 10000,
        status: "ASSIGN TO APPROVAL",
        requestedBy: 8212,
        remarks: "Sample Remarks",
        createdUser: "admin",
        dcItemDetails: item.dSetItems.map((dSetItem) => ({
          description: dSetItem.packListDesc, // check to Rajesh Anna
          uom: "Count",
          qty: dSetItem.totalSubItems, // check to Rajesh Anna
          itemCode: dSetItem.packListDesc, // check to Rajesh Anna
          itemName: dSetItem.itemAttributes.lm2, // check to Rajesh Anna
          itemType: "garment",
          poNumber: item.moNumber, // check to Rajesh Anna
          color: dSetItem.itemAttributes.lm1, // check to Rajesh Anna
          style: dSetItem.itemAttributes.lm1, // check to Rajesh Anna
          pieces: dSetItem.totalFgQty, // check to Rajesh Anna
        })),
        updatedUser: "admin",
        isAssignable: "NO",
        assignBy: 3,
        buyerTeam: "SQ",
        dcType: "nonReturnable",
      };

      const response = await axios.post(
        "https://gatex-be.schemaxtech.in/api/dc/createDc",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Gatepass created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating gatepass:", error);
      throw new Error("Failed to create gatepass");
    }
  }


