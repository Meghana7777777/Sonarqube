import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";
import { DepartmentTypeEnumForMasters } from "../../sps";

export class GBSectionRequest extends CommonRequestAttrs {
    departments?: number[];
    processType?: ProcessTypeEnum[];
    deptCode?: DepartmentTypeEnumForMasters;
    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        departments?: number[],
        processType?: ProcessTypeEnum[],
        deptCode?: DepartmentTypeEnumForMasters,
    ) {
        super(username, unitCode, companyCode, userId);
        this.departments = departments;
        this.processType = processType;
        this.deptCode = deptCode;
    }
}



