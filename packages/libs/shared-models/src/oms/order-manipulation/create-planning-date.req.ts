import { CommonRequestAttrs } from "../../common";

export class CreatePlanningDateRequest extends CommonRequestAttrs {
    orderId: number;
    plantStyle: string;
    plannedCutDate: string;

    constructor(username: string, unitCode: string, companyCode: string, userId: number, orderId: number, plantStyle: string, plannedCutDate: string) {
        super(username, unitCode, companyCode, userId);
        this.orderId = orderId;
        this.plantStyle = plantStyle;
        this.plannedCutDate = plannedCutDate;
    }
}
