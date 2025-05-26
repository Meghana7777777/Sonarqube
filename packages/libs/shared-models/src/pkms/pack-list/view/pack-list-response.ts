import { GlobalResponseObject } from "../../../common";
import { PackingListModel } from "./packing-list.model";

export class PackingListResponse extends GlobalResponseObject {
    data: PackingListModel[]
}