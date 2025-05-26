import { GlobalResponseObject } from "../../../common";
import { UsersCreationModel } from "./users.model";


export class UsersResponse extends GlobalResponseObject {
    data?: UsersCreationModel[];
    constructor(status: boolean, 
        errorCode: number, 
        internalMessage: string, 
        data?: UsersCreationModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
       }
}