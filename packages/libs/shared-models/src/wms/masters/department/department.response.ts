import { DepartmentTypeEnumForMasters } from "../../../sps";

export class DepartmentResponseModel {
    id: number;
    unit: string;
    name: string;
    code: string;
    type: DepartmentTypeEnumForMasters;
    isActive:boolean;
    constructor(
        id: number,
        unit: string,
        name: string,
        code: string,
        type: DepartmentTypeEnumForMasters,
        isActive: boolean

        ) {
            this.id = id;
            this.unit = unit;
            this.name = name;
            this.code = code;
            this.type = type;
            this.isActive = isActive;


        }
    }