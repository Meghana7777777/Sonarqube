import { CommonRequestAttrs } from "../../../common";
import { SpoItemsModal, SupplierPoModal } from "../so-dump";
import { ManufacturingOrderItemModal } from "./manf-order-item.modal";
import { ManufacturingOrderModal } from "./manf-order.modal";
// import { SpoItemsModal } from "./spo-items.modal";
// import { SupplierPoModal } from "./spo-modal";

export class MoDumpModal extends CommonRequestAttrs {
    moModal: ManufacturingOrderModal[];
    moItemModal: ManufacturingOrderItemModal[];
    spoModal: SupplierPoModal[];
    spoItemModal: SpoItemsModal[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number,
        moModal: ManufacturingOrderModal[],
        moItemModal: ManufacturingOrderItemModal[],
        spoModal: SupplierPoModal[],
        spoItemModal: SpoItemsModal[],
    ) {
        super(username, unitCode, companyCode, userId)
        this.moModal = moModal;
        this.moItemModal = moItemModal;
        this.spoModal = spoModal;
        this.spoItemModal = spoItemModal;
    }
}