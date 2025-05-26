import { GlobalResponseObject } from "../../../global-response-object";
import { SewingModulesModel } from "./sewing-modules.model";


export class SectionsModulesResponse extends GlobalResponseObject {
  data?: SewingModulesModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: SewingModulesModel[],
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}
