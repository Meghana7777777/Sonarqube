
import { GlobalResponseObject } from "../common/global-response-object";
import { UsersDropdownDto } from "./get-users-dto";



export class  UsersDropdownResponse extends GlobalResponseObject{
    data : UsersDropdownDto[];

    constructor(status: boolean, errorCode: number, internalMessage: string, data: UsersDropdownDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}