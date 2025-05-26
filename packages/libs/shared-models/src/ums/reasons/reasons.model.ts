import { ReasonCategoryEnum } from "../enum";


export class ReasonModel  {
    id: number; // not required durin create
    reasonCode: string;
    reasonName: string;
    reasonDesc: string;
    reasonCategory: ReasonCategoryEnum;

    // TODO
    constructor(id: number,reasonCode: string,reasonName: string,reasonDesc: string,reasonCategory: ReasonCategoryEnum) {
        this.id=id;
        this.reasonCode=reasonCode;
        this.reasonName=reasonName;
        this.reasonDesc=reasonDesc;
        this.reasonCategory=reasonCategory;
    }
}

