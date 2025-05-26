export class SewingOrderModel {
    sewingOrderId: number;
    orderRefNo: string;
    orderRefId: string;
    sewSerial: string;
    constructor(
        sewingOrderId: number,
        orderRefNo: string,
        orderRefId: string,
        sewSerial: string,
    ) {
        this.sewingOrderId = sewingOrderId;
        this.orderRefNo = orderRefNo;
        this.orderRefId = orderRefId;
        this.sewSerial = sewSerial;
    }
}

export class DownTimeDetailsModel {
    serviceName: string;
    module: string;
    workStation: string;
    assetCode: string;
    actualTime: string;
    constructor(
        serviceName: string,
        module: string,
        workStation: string,
        assetCode: string,
        actualTime: string
    ) {
        this.serviceName = serviceName;
        this.module = module;
        this.workStation = workStation;
        this.assetCode = assetCode;
        this.actualTime = actualTime
    }
}

