import { SoLineModel } from "./so-line-model";

export class SaleOrderDumpModel {
      soNumber: string;
      style: string;
      plantStyleRef: string;
      coNumber: string;
      customerName: string;
      soRefNumber: string;
      customerLocation: string;
      quantity: number;
      packMethod: string;
      isConfirmed: number;
      customerCode: string;
      profitCenterCode: string;
      profitCenterName: string;
      styleName: string;
      styleCode: string;
      styleDescription: string;
      soProgressStatus: number;
      businessHead: string;
      soItem: string;
      customerStylesDesignNo: string;
      soCreationDate: string;
      soClosedDate: string;
      exFactoryDate: string;
      soLines: SoLineModel[];

      constructor(
            soNumber: string,
            style: string,
            plantStyleRef: string,
            coNumber: string,
            customerName: string,
            soRefNumber: string,
            customerLocation: string,
            quantity: number,
            packMethod: string,
            isConfirmed: number,
            customerCode: string,
            profitCenterCode: string,
            profitCenterName: string,
            styleName: string,
            styleCode: string,
            styleDescription: string,
            soProgressStatus: number,
            businessHead: string,
            soItem: string,
            customerStylesDesignNo: string,
            soCreationDate: string,
            soClosedDate: string,
            exFactoryDate: string,
            soLines: SoLineModel[],

      ) {
            this.soNumber = soNumber;
            this.style = style;
            this.plantStyleRef = plantStyleRef;
            this.coNumber = coNumber;
            this.customerName = customerName;
            this.soRefNumber = soRefNumber;
            this.customerLocation = customerLocation;
            this.quantity = quantity;
            this.packMethod = packMethod;
            this.isConfirmed = isConfirmed;
            this.customerCode = customerCode;
            this.profitCenterCode = profitCenterCode;
            this.profitCenterName = profitCenterName;
            this.styleName = styleName;
            this.styleCode = styleCode;
            this.styleDescription = styleDescription;
            this.soProgressStatus = soProgressStatus;
            this.businessHead = businessHead;
            this.soItem = soItem;
            this.customerStylesDesignNo = customerStylesDesignNo;
            this.soCreationDate = soCreationDate;
            this.soClosedDate = soClosedDate;
            this.exFactoryDate = exFactoryDate;
            this.soLines = soLines;
      }
}
