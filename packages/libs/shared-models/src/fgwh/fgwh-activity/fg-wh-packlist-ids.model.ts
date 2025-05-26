import { CommonRequestAttrs } from "../../common";
import { PackListCartoonIDs } from "../../pkdms";

export class FgwhPackListIdsModel extends CommonRequestAttrs {
    packListIds: number[];
    fgwhHeadReqId: number;
    packListCartoonIDs?: PackListCartoonIDs[]

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        packListIds: number[],
        fgwhHeadReqId: number,
        packListCartoonIDs?: PackListCartoonIDs[]
    ){
        super(username, unitCode, companyCode, userId);
        this.packListIds = packListIds;
        this.fgwhHeadReqId = fgwhHeadReqId;
        this.packListCartoonIDs = packListCartoonIDs

    }
}