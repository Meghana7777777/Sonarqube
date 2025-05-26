export class SaleOrderItemModal {
    id: number;
    saleOrderItemCode: string;
    unitCode:string;
    uniqueIdentifier: string;
    saleOrderItemDesc: string;
    saleOrderItemQty: string;
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
    saleOrderId: any;
    plannedCutDate:string;
    plannedProductionDate:string;
    plannedDeliveryDate:string;
    userUnitCode:string;
    /**
     * 
     * @param saleOrderItemCode 
     * @param uniqueIdentifier company+unit+sale_order_code+sale_order_item_code
     * @param saleOrderItemDesc 
     * @param saleOrderItemQty 
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
     * @param saleOrderId 
     * @param plannedCutDate
     * @param plannedProductionDate
     * @param plannedDeliveryDate
     * @param userUnitCode
     */
    constructor(
        saleOrderItemCode: string,
        uniqueIdentifier: string,
        saleOrderItemDesc: string,
        saleOrderItemQty: string,
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
        saleOrderId: any,
        unitCode?:string,
        plannedCutDate?: string,
        plannedProductionDate? : string,
        plannedDeliveryDate? : string,
        userUnitCode?:string,   
    ) {
        this.saleOrderItemCode = saleOrderItemCode;
        this.uniqueIdentifier = uniqueIdentifier;
        this.saleOrderItemDesc = saleOrderItemDesc;
        this.saleOrderItemQty = saleOrderItemQty;
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
        this.saleOrderId = saleOrderId;
        this.unitCode = unitCode;
        this.plannedCutDate = plannedCutDate;
        this.plannedProductionDate = plannedProductionDate;
        this.plannedDeliveryDate = plannedDeliveryDate;
        this.userUnitCode = userUnitCode;       
    }
}
