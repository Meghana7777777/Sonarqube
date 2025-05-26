import { GlobalResponseObject } from "../../../global-response-object";
import { ModuleModel } from "./module-model";

export class SectionModulesResponse extends GlobalResponseObject {
  data?: ModuleModel[];

  constructor(
    status: boolean,
    errorCode: number,
    internalMessage: string,
    data: ModuleModel[] = [],
  ) {
    super(status, errorCode, internalMessage);
    this.data = data;
  }
}
