import { OrderTypeEnum } from "../oes";

export class OrderFeatures {
    moNumber: string[];
    moLineNumber: string[];
    moOrderSubLineNumber: string[];
    planDeliveryDate: string[];
    planProductionDate: string[];
    planCutDate: string[];
    coNumber: string[];
    styleName: string;
    styleDescription: string;
    businessHead: string[];
    moCreationDate: string[];
    moClosedDate: string[];
    exFactoryDate: string[];
    schedule: string[];
    zFeature: string[];
    styleCode: string[];
    customerName: string[];
    oqType?:OrderTypeEnum

    /**
     * Constructor for OrderFeatures
     * @param moNumber - Manufacturing Order Numbers
     * @param moLineNumber - Manufacturing Order Line Numbers
     * @param moOrderSubLineNumber - Manufacturing Order Sub-Line Numbers
     * @param planDeliveryDate - Planned Delivery Dates
     * @param planProductionDate - Planned Production Dates
     * @param planCutDate - Planned Cut Dates
     * @param coNumber - Customer Order Numbers
     * @param styleName - Style Name
     * @param styleDescription - Style Description
     * @param business_head - Business Heads
     * @param moCreationDate - Manufacturing Order Creation Dates
     * @param moClosedDate - Manufacturing Order Closed Dates
     * @param exFactoryDate - Ex-Factory Dates
     * @param schedule - Schedule Information
     * @param zFeature - Z Features
     * @param styleCode - Style Codes
     */
    constructor(
        moNumber: string[],
        moLineNumber: string[],
        moOrderSubLineNumber: string[],
        planDeliveryDate: string[],
        planProductionDate: string[],
        planCutDate: string[],
        coNumber: string[],
        styleName: string,
        styleDescription: string,
        businessHead: string[],
        moCreationDate: string[],
        moClosedDate: string[],
        exFactoryDate: string[],
        schedule: string[],
        zFeature: string[],
        styleCode: string[],
        customerName: string[],
        oqType?:OrderTypeEnum
    ) {
        this.moNumber = moNumber;
        this.moLineNumber = moLineNumber;
        this.moOrderSubLineNumber = moOrderSubLineNumber;
        this.planDeliveryDate = planDeliveryDate;
        this.planProductionDate = planProductionDate;
        this.planCutDate = planCutDate;
        this.coNumber = coNumber;
        this.styleName = styleName;
        this.styleDescription = styleDescription;
        this.businessHead = businessHead;
        this.moCreationDate = moCreationDate;
        this.moClosedDate = moClosedDate;
        this.exFactoryDate = exFactoryDate;
        this.schedule = schedule;
        this.zFeature = zFeature;
        this.styleCode = styleCode;
        this.customerName = customerName;
        this.oqType = oqType
    }
}
