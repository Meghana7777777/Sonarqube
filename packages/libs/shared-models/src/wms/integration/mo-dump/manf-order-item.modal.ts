export class ManufacturingOrderItemModal {
    id: number;
    manufacturingOrderItemCode: string;
    unitCode:string;
    uniqueIdentifier: string;
    manufacturingOrderItemDesc: string;
    manufacturingOrderItemQty: string;
    profitCenterCode: string;
    profitCenterName: string;
    buyerPo: string;
    companyCode: string;
    gmtPo: string;
    gmtPoItem: string;
    gmtVenderCode: string;
    gmtVenderCompany: string;
    gmtVenderUnit: string;
    remarks: string;
    manufacturingOrderId: any;
    plannedCutDate:string;
    plannedProductionDate:string;
    plannedDeliveryDate:string;
    /**
     * 
     * @param manufacturingOrderItemCode 
     * @param uniqueIdentifier company+unit+manufacturing_order_code+manufacturing_order_item_code
     * @param manufacturingOrderItemDesc 
     * @param manufacturingOrderItemQty 
     * @param profitCenterCode 
     * @param profitCenterName 
     * @param buyerPo 
     * @param companyCode 
     * @param gmtPo 
     * @param gmtPoItem 
     * @param gmtVenderCode 
     * @param gmtVenderCompany 
     * @param gmtVenderUnit 
     * @param remarks 
     * @param manufacturingOrderId 
     * @param plannedCutDate
     * @param plannedProductionDate
     * @param plannedDeliveryDate
     */
    constructor(
        manufacturingOrderItemCode: string,
        uniqueIdentifier: string,
        manufacturingOrderItemDesc: string,
        manufacturingOrderItemQty: string,
        profitCenterCode: string,
        profitCenterName: string,
        buyerPo: string,
        companyCode: string,
        gmtPo: string,
        gmtPoItem: string,
        gmtVenderCode: string,
        gmtVenderCompany: string,
        gmtVenderUnit: string,
        remarks: string,
        manufacturingOrderId: any,
        unitCode?:string,
        plannedCutDate?: string,
        plannedProductionDate? : string,
        plannedDeliveryDate? : string   
    ) {
        this.manufacturingOrderItemCode = manufacturingOrderItemCode;
        this.uniqueIdentifier = uniqueIdentifier;
        this.manufacturingOrderItemDesc = manufacturingOrderItemDesc;
        this.manufacturingOrderItemQty = manufacturingOrderItemQty;
        this.profitCenterCode = profitCenterCode;
        this.profitCenterName = profitCenterName;
        this.buyerPo = buyerPo;
        this.companyCode = companyCode;
        this.gmtPo = gmtPo;
        this.gmtPoItem = gmtPoItem;
        this.gmtVenderCode = gmtVenderCode;
        this.gmtVenderCompany = gmtVenderCompany;
        this.gmtVenderUnit = gmtVenderUnit;
        this.remarks = remarks;
        this.manufacturingOrderId = manufacturingOrderId;
        this.unitCode = unitCode;
        this.plannedCutDate = plannedCutDate;
        this.plannedProductionDate = plannedProductionDate;
        this.plannedDeliveryDate = plannedDeliveryDate;       
    }
}
