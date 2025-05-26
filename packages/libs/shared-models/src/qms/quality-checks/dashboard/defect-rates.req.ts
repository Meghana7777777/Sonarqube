import { CommonRequestAttrs } from "../../../common";
import { Category } from "./defect-rates.model";

export class QMS_DefectRatesReqDto extends CommonRequestAttrs {
    category: Category;
    fromDate:string;
    toDate:string;
    /**
     * 
     * @param category 
     */
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        category: Category,
        fromDate:string,
        toDate:string,
        
    ) {
        super(username, unitCode, companyCode, userId);
        this.category = category;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

}