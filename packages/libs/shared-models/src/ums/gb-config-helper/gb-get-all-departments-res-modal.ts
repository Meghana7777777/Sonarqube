import { GlobalResponseObject } from "../../common";
import { GetAllDepartmentsResDto } from "./gb-get-all-departments-res-dto";

export class GbGetAllDepartmentsResponseModal extends GlobalResponseObject {
    data: GetAllDepartmentsResDto[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: GetAllDepartmentsResDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}