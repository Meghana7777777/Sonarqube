import { PalletBinStatusEnum } from "@xpparel/shared-models";


export class PalletPackListRollsQueryResponse {
    pack_list_id: number;
    item_lines_id: number;
    status: PalletBinStatusEnum;
}