export class SewingOrderLineModel {
    mOrderLineId: number;
    mOrderId: number;
    orderLineRefNo: string;
    orderRefNo: string;
  
    constructor(
      mOrderLineId: number,
      mOrderId: number,
      orderLineRefNo: string,
      orderRefNo: string,
    ) {
      this.mOrderLineId = mOrderLineId;
      this.mOrderId = mOrderId;
      this.orderLineRefNo = orderLineRefNo;
      this.orderRefNo = orderRefNo;
    }
  }

  export class MorderSewSerialModel {
    desc: string;
    sewSerial: string;
    mo_desc: string;

    constructor(
      desc: string,
      sewSerial: string,
    ) {
      this.desc = desc;
      this.sewSerial = sewSerial;
    }
  }
  