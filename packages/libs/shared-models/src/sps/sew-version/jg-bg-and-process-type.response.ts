import { GlobalResponseObject } from "../../common";
import { ProcessTypeEnum } from "../../oms";
import { JobGroupBundleGroupProcessTypeModel } from "./jg-bg-and-process-type.model";

export class JobGroupBundleGroupProcessTypeResponse extends GlobalResponseObject {
     data ?: JobGroupBundleGroupProcessTypeModel[];
     constructor(status: boolean,errorcode: number,internalMessage: string,data: JobGroupBundleGroupProcessTypeModel[])
     {
        super(status,errorcode,internalMessage);
        this.data = data;
     }
}