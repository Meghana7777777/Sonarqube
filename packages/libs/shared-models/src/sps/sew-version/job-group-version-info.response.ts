import { GlobalResponseObject, JobGroupVersionInfoForSewSerial } from "@xpparel/shared-models";

export class JobGroupVersionInfoResp extends GlobalResponseObject {
     data ?: JobGroupVersionInfoForSewSerial[];
     constructor(status: boolean,errorcode: number,internalMessage: string,data: JobGroupVersionInfoForSewSerial[])
     {
        super(status,errorcode,internalMessage);
        this.data = data;
     }
}