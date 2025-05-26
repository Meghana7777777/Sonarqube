import { MoLineModel } from "./mo-line-model";
import { RawMaterialInfoModel } from "./raw-material-info-model";

export class ManufacturingOrderDumpModel {
      moNumber: string;
      style: string;
      plantStyleRef: string;
      coNumber: string;
      customerName: string;
      moRefNumber: string;
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
      moProgressStatus: number;
      businessHead: string;
      moItem: string;
      customerStylesDesignNo: string;
      moCreationDate: string;
      moClosedDate: string;
      exFactoryDate: string;
      moLines: MoLineModel[];
      rawMaterials: RawMaterialInfoModel[];

      constructor(
            moNumber: string,
            style: string,
            plantStyleRef: string,
            coNumber: string,
            customerName: string,
            moRefNumber: string,
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
            moProgressStatus: number,
            businessHead: string,
            moItem: string,
            customerStylesDesignNo: string,
            moCreationDate: string,
            moClosedDate: string,
            exFactoryDate: string,
            moLines: MoLineModel[],
            rawMaterials: RawMaterialInfoModel[]
      ) {
            this.moNumber = moNumber;
            this.style = style;
            this.plantStyleRef = plantStyleRef;
            this.coNumber = coNumber;
            this.customerName = customerName;
            this.moRefNumber = moRefNumber;
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
            this.moProgressStatus = moProgressStatus;
            this.businessHead = businessHead;
            this.moItem = moItem;
            this.customerStylesDesignNo = customerStylesDesignNo;
            this.moCreationDate = moCreationDate;
            this.moClosedDate = moClosedDate;
            this.exFactoryDate = exFactoryDate;
            this.moLines = moLines;
            this.rawMaterials = rawMaterials;
      }
}
