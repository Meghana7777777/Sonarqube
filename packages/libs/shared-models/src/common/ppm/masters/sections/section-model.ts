import { DepartmentTypeEnumForMasters, } from "packages/libs/shared-models/src/sps";
import { CommonRequestAttrs } from "../../../common-request-attr.model";
import { ProcessTypeEnum } from "@xpparel/shared-models";

export class SectionModel  {
    id: number;
    secCode:string;
    secName:string;
    secDesc:string;
    depType:DepartmentTypeEnumForMasters;
    secColor:string;
    secHeadName:string;
    secOrder:string;
    isActive:boolean;
    secType:ProcessTypeEnum;
    


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
        secType:ProcessTypeEnum,


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
        this.secType= secType;

    }
}