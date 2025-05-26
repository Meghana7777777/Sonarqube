import { MaterialTypeEnum } from "@xpparel/shared-models";

export class CartonItemsQueryRes {
    carton_proto_id: number;
    item_id: number;
    item_code: string;
    category: MaterialTypeEnum
}

export class PolyBagItemsQueryRes extends CartonItemsQueryRes {
    count: number;
}