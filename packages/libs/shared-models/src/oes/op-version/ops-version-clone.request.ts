import { CommonRequestAttrs } from "../../common";

export class OpsVersionCloneRequest extends CommonRequestAttrs{
    parentOpsVersionId: number;
    productNames: StyleProdFgColorModel[];
    poSerial: number;

    constructor(
      username: string,
      unitCode: string,
      companyCode: string,
      userId: number,
      parentOpsVersionId: number,
      productNames: StyleProdFgColorModel[],
      poSerial: number,
    ) {
      super(username, unitCode, companyCode, userId);
      this.parentOpsVersionId = parentOpsVersionId;
      this.productNames = productNames;
      this.poSerial = poSerial;
    }
  }
  

  export class StyleProdFgColorModel {
    style: string;
    productCode: string;
    productName: string;
    fgColor: string;

    constructor(style: string, productCode: string, productName: string, fgColor: string) {
        this.style = style;
        this.productCode = productCode;
        this.productName = productName;
        this.fgColor = fgColor;
    }
}
