export class ItemCategoryReqModel {
  unitCode: string;
  companyCode: string;
  itemCategory: string;

  constructor(unitCode: string, companyCode: string, itemCategory: string) {
    this.unitCode = unitCode;
    this.companyCode = companyCode;
    this.itemCategory = itemCategory;
  }
}
