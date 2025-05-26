import { GlobalResponseObject, JobGroupVersionInfoForSewSerial, SewSerialDataModel } from "@xpparel/shared-models";

export class SewSerialResponse extends GlobalResponseObject {
     data ?: SewSerialDataModel[];
     constructor(status: boolean,errorcode: number,internalMessage: string,data: SewSerialDataModel[])
     {
        super(status,errorcode,internalMessage);
        this.data = data;
     }
}
