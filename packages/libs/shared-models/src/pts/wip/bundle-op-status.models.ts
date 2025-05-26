import { GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../../oms";


export class PTS_C_BundleStatusForBundleBarcodeAndProcTypeRequest {
  bundleBarcode: string[];
  processingSerial: number;
  processingType: ProcessTypeEnum;
  constructor(
    bundleBarcode: string[],
    processingSerial: number,
    processingType: ProcessTypeEnum
  ) {
    this.bundleBarcode = bundleBarcode;
    this.processingSerial = processingSerial;
    this.processingType = processingType;
  }
}


export class PTS_C_BundleStatusForBundleBarcodeAndProcTypeResponse extends GlobalResponseObject {
    data?: PTS_C_BundleStatusForBundleBarcodeModel[];
}

export class PTS_C_BundleStatusForBundleBarcodeModel {
    bunBarcode: string;
    pslId: string;
    orgQty: number;
    compQty: number;
    rejQty: number;
}
