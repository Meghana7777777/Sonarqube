import { PackJobStatusEnum } from "../enum";


export class PackJobDataModel {
    itemCode: number;
    itemsId: number;
    quantity: number;
    status: PackJobStatusEnum;
    plannedDateTime: string;
    packJobNumber: string;
    constructor(itemCode: number,
        itemsId: number,
        quantity: number,
        status: PackJobStatusEnum,
        plannedDateTime: string,
        packJobNumber: string) {
        this.itemCode = itemCode;
        this.itemsId = itemsId;
        this.quantity = quantity;
        this.status = status;
        this.plannedDateTime = plannedDateTime;
        this.packJobNumber = packJobNumber;
    }
}








//itemcode,itemid,qty,packjobstatus:jobneaderentity sttus,packplanDate,Packjobnumber
//    packjobdatarespons