import { DepartmentTypeEnumForMasters, } from "packages/libs/shared-models/src/sps";
import { ProcessTypeEnum } from "@xpparel/shared-models";

export class SectionsModel  {
    id: number;
    secCode:string;
    secName:string;
    secDesc:string;
    depType:DepartmentTypeEnumForMasters;
    secColor:string;
    secHeadName:string;
    secOrder:string;
    isActive:boolean;
    processType:ProcessTypeEnum;
    deptCode:string;
    


    constructor(
       
        id: number, 
        secCode:string,
        secName:string,
        secDesc:string,
        depType:DepartmentTypeEnumForMasters,
        secColor:string,
        secHeadName:string,
        secOrder:string,
        isActive:boolean,
        processType:ProcessTypeEnum,
        deptCode:string


    ) {

        this.id = id;
        this.secCode = secCode;
        this.secName = secName;
        this.secDesc = secDesc;
        this.depType = depType;
        this.secColor = secColor;
        this.secHeadName = secHeadName;
        this.secOrder = secOrder;
        this.isActive=isActive;
        this.processType= processType;
        this.deptCode=deptCode;

    }
}