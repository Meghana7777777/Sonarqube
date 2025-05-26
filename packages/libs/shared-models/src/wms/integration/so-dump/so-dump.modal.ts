import { CommonRequestAttrs } from "../../../common";
import { SaleOrderItemModal } from "./sale-order-item.modal";
import { SaleOrderModal } from "./sale-order.modal";
import { SpoItemsModal } from "./spo-items.modal";
import { SupplierPoModal } from "./spo-modal";

export class SoDumpModal extends CommonRequestAttrs {
    soModal: SaleOrderModal[];
    soItemModal: SaleOrderItemModal[];
    spoModal: SupplierPoModal[];
    spoItemModal: SpoItemsModal[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number,
        soModal: SaleOrderModal[],
        soItemModal: SaleOrderItemModal[],
        spoModal: SupplierPoModal[],
        spoItemModal: SpoItemsModal[],
    ) {
        super(username, unitCode, companyCode, userId)
        this.soModal = soModal;
        this.soItemModal = soItemModal;
        this.spoModal = spoModal;
        this.spoItemModal = spoItemModal;
    }
}