import { CommonRequestAttrs } from "../../common";
import { MarkerProdNameItemCodeModel } from "./marker-prod-name-item.model";

export class ProductNameItemsRequest extends CommonRequestAttrs {
    poSerial: number;
    prodNameItems: MarkerProdNameItemCodeModel[];

    constructor(
        username: string, unitCode: string, companyCode: string, userId: number,
        poSerial: number,
        prodNameItems: MarkerProdNameItemCodeModel[]
    ) {
        super(username,unitCode,companyCode,userId);
        this.poSerial = poSerial;
        this.prodNameItems = prodNameItems;
    }
}