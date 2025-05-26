import { SewingCreationOptionsEnum } from "@xpparel/shared-models";


export const sewingCreationDisplayName:{[key in SewingCreationOptionsEnum]:string} = {
    [SewingCreationOptionsEnum.DELIVERYDATE]: 'Delivery Date',
    [SewingCreationOptionsEnum.DESTINATION]: 'Destination',
    // [SewingCreationOptionsEnum.CUTDATE]: 'Plan Cut Date',
    [SewingCreationOptionsEnum.PRODUCTIONDATE]: 'Plan Production Date',
    [SewingCreationOptionsEnum.PRODUCTCODE]: 'Product Code',
    // [SewingCreationOptionsEnum.PRODUCTNAME]: 'Product Name',
    // [SewingCreationOptionsEnum.GARMENTVENDORPO]: 'Garment Vendor PO',
    // [SewingCreationOptionsEnum.COLINE]: 'CO Line',
    // [SewingCreationOptionsEnum.BUYERPO]: 'Buyer PO',
    // [SewingCreationOptionsEnum.PRODUCTTYPE]: 'Product Type',
    // [SewingCreationOptionsEnum.PRODUCTCATEGORY]: 'Product Category'
}
