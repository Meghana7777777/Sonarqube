import { CommonRequestAttrs } from "../../../common";

export class PackingListConfirmRequest extends CommonRequestAttrs{
    packingListId: number;
    confirmUser: string;
    confirmationDateTime: Date
}