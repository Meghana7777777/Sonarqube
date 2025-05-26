import { CommonRequestAttrs } from "../../../common";

export class DocBundlePanelsRequest extends CommonRequestAttrs {
    bundleId: number;
    poSerial: number;
    componentName: string;
    docketNumber: string;
    docketId: number;
    fgColor: string;
    productName: string;
    bundleNumber: string;
    panelNumbers: number[];
  
    constructor(
      username: string,
      unitCode: string,
      companyCode: string,
      userId: number,
      bundleId: number,
      poSerial: number,
      componentName: string,
      docketNumber: string,
      docketId: number,
      fgColor: string,
      productName: string,
      bundleNumber: string,
      panelNumbers: number[]
    ) {
      super(username, unitCode, companyCode, userId);
      this.bundleId = bundleId;
      this.poSerial = poSerial;
      this.componentName = componentName;
      this.docketNumber = docketNumber;
      this.docketId = docketId;
      this.fgColor = fgColor;
      this.productName = productName;
      this.bundleNumber = bundleNumber;
      this.panelNumbers = panelNumbers;
    }
  }