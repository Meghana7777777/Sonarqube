import { CommonRequestAttrs } from "../common-request-attr.model";

export class StyleProductCodeRequest extends CommonRequestAttrs {
  styleCode: string;
  productCode: string;

  constructor(
    username: string,
    unitCode: string,
    companyCode: string,
    userId: number,
    styleCode: string,
    productCode: string
  ) {
    super(username, unitCode, companyCode, userId); // Call the parent class constructor
    this.styleCode = styleCode;
    this.productCode = productCode;
  }
}
