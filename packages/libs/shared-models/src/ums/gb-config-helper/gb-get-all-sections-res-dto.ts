import { ProcessTypeEnum } from "../../oms";
export class GetAllSectionsResDto {
	secCode: string;
	isActive: number;
	secName: string;
	deptCode: string; 
	id: number;
	secDesc: string;
	depType: string;
	secHeadName: string;
	secOrder: number;
	secType: ProcessTypeEnum;
	processType: string;
	secColor: string;
	constructor(
		secCode: string,
		isActive: number,
		secName: string,
		deptCode: string, 
		id: number,
		secDesc: string,
		depType: string,
		secHeadName: string,
		secOrder: number,
		secType: ProcessTypeEnum,
		processType: string,
		secColor: string,
	) {
		this. secCode = secCode;
		this. isActive = isActive;
		this. secName = secName;
		this. deptCode = deptCode;
		this. id = id;
		this. secDesc = secDesc;
		this. depType = depType;
		this. secHeadName = secHeadName;
		this. secOrder = secOrder;
		this. secType = secType;
		this. processType = processType;
		this. secColor = secColor;
	}
}
