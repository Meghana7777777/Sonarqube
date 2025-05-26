import { FabIssuingEntityEnum } from "@xpparel/shared-models";

export class PhItemIssuanceQtyResp {
    issued_quantity: number;
    issuing_entity: FabIssuingEntityEnum;
}

export class PhItemIssuanceQtyResponse {
    issuedQty: number;
    issuedRolls: number;
}