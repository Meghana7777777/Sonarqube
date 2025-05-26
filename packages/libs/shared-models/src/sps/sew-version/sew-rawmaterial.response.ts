import { GlobalResponseObject } from "../../common";
import { SewRawMaterialResponseModel } from "./sew-rawmaterial.model";

export class SewRawMaterialResponse extends GlobalResponseObject {
     data ?: SewRawMaterialResponseModel[];
     constructor(status: boolean,errorcode: number,internalMessage: string,data: SewRawMaterialResponseModel[])
     {
        super(status,errorcode,internalMessage);
        this.data = data;
     }
}
