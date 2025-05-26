import { GlobalResponseObject } from "../../common";
import { SewingOrderLineModel, MorderSewSerialModel } from "./sewing-order-line.model";

export class SewingOrderLineResponse extends GlobalResponseObject {
  data: SewingOrderLineModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: SewingOrderLineModel[],
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}

export class SewingOrdersewSerialResponse extends GlobalResponseObject {
  data: MorderSewSerialModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: MorderSewSerialModel[],
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}
