import { PackFeatureGrouping } from "./feature-grouping";

export class PackMoLineInfo {
    moLine: string;
    cutSerial: number;
    productType: string;
    productName: string;
    quantity: string;
    orderLineRefId: number;
    pkLineId: number;
    featureGrouping: PackFeatureGrouping[];

    constructor(
        moLine: string,
        cutSerial: number,
        productType: string,
        productName: string,
        quantity: string,
        orderLineRefId: number,
        pkLineId: number,
        featureGrouping: PackFeatureGrouping[]
    ) {
        this.moLine = moLine;
        this.cutSerial = cutSerial;
        this.productType = productType;
        this.productName = productName;
        this.quantity = quantity;
        this.orderLineRefId = orderLineRefId;
        this.pkLineId = pkLineId;
        this.featureGrouping = featureGrouping;
    }
}

/*
{
    colorSizeWiseQty: [{
        color: "",
        sizes: [
            {
                size : "X",
                qty: 0,
            }
        ]
    }]
}


[{
    orderid: 1,
    orderNumber:5,
    deliveryDate: "",
    destination: "",
    PlannedCutDate: "",
    coLine: "",
    buyerPo: "",
    productType: "",
    productName: "",
    productCategory: "",
    garmentVendorPo: "",
    moLineInfo: [
        {
            productType: "",
            productName: "",
            quantity: 0,
            featureGrouping: [
                {
                    deliveryDate: "",
                    destination: "",
                    PlannedCutDate: "",
                    coLine: "",
                    buyerPo: "",
                    productType: "",
                    productName: "",
                    productCategory: "",
                    garmentVendorPo: "",
                    subLineInfo: [
                        {
                            subLineId: 1,
                            color: "",
                            size: "",
                            quantity: 0,
                            deliveryDate: "",
                            destination: "",
                            PlannedCutDate: "",
                            coLine: "",
                            buyerPo: "",
                            productType: "",
                            productName: "",
                            productCategory: "",
                            garmentVendorPo: "",
                        }
                    ]
                }
            ]
            
        }
    ]

}];


DESTINATION = "destination",
DELIVERYDATE = "planned_delivery_date",
CUTDATE = "planned_cut_date",
PRODUCTIONDATE = "planned_production_date",
COLINE = "co_line",
BUYERPO = "buyer_po",
PRODUCTTYPE = "product_type",
PRODUCTNAME = "product_name",
PRODUCTCATEGORY = "product_category",
GARMENTVENDORPO = "garment_vendor_po"
*/