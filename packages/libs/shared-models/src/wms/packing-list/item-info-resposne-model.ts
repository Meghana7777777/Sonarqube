import { GlobalResponseObject } from "@xpparel/shared-models";
import { ItemInfoQryResp } from "../../../../../services/warehouse-management/src/app/packing-list/repository/query-response/item-info.qry.resp";

export class ItemInfoQryRespModel extends GlobalResponseObject {
  data: ItemInfoQryResp[];
  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: ItemInfoQryResp[]
  ) {
    super(status, errorCode, internalMessage);
    this.data = data
  }
}
