export class ItemInfoQryResp {
  item_code: string;
  item_description: string;

  constructor(item_code: string, item_description: string) {
    this.item_code = item_code;
    this.item_description = item_description;
  }
}
