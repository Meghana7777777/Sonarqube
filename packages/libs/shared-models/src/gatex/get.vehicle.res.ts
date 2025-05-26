import { GlobalResponseObject } from "../common";
import { ADDVehicleReqModal } from "./add-vehicle.req";


export class GetVehicleResModel extends GlobalResponseObject {
  data?: ADDVehicleReqModal;

  /**
   *
   * @param status
   * @param errorCode
   * @param internalMessage
   * @param data
   */

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data?: ADDVehicleReqModal
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}