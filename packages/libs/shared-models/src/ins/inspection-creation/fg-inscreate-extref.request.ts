import { InsTypesEnumType } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";



export class FgInsCreateExtRefRequest extends CommonRequestAttrs {
	packOrder: number[];
	packListIds: number[];
	packJob: number[];
	iNeedCartonAttrs: boolean;
	insType: InsTypesEnumType;
	cartonBarCodes: string[];
	constructor(username: string, unitCode: string, companyCode: string, userId: number, packOrder: number[], packListIds: number[], packJob: number[], iNeedCartonAttrs: boolean, insType: InsTypesEnumType, cartonBarCodes: string[]) {
		super(username, unitCode, companyCode, userId);
		this.packOrder = packOrder
		this.packListIds = packListIds
		this.packJob = packJob
		this.iNeedCartonAttrs = iNeedCartonAttrs
		this.insType = insType
		this.cartonBarCodes = cartonBarCodes

	}
}

