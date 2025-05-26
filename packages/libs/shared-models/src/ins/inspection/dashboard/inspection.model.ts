import { InsFabricInspectionRequestCategoryEnum } from "../../enum";

export class InsInspectionInfoModel {

    request_category: InsFabricInspectionRequestCategoryEnum;
    ins_request_id: number;
    inspection_result: string;
    rolls: string;
}