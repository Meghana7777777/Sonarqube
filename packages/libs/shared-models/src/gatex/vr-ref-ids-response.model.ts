import { GlobalResponseObject } from "../common";

export class VRRefIdsResponseModel extends GlobalResponseObject {
  data?: number[];

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
    data?: number[]
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}