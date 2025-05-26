import { InsTypesEnumType } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common";

export class YarnInsCreateExtRefRequest extends CommonRequestAttrs {
packListIds: number[];
	batches: string[];
	lotNos: string[];
	insType:InsTypesEnumType;
	rollIds: number[]
	iNeedInsItemAttrs: boolean;
	iNeedInsAttrs: boolean;
	constructor(username: string, unitCode: string, companyCode: string, userId: number, packListIds: number[], batches: string[], lotNos: string[], rollIds: number[], iNeedInsItemAttrs: boolean, iNeedInsAttrs: boolean,insType:InsTypesEnumType) {
		super(username, unitCode, companyCode, userId);
		this.packListIds = packListIds;
		this.batches = batches;
		this.lotNos = lotNos;
		this.rollIds = rollIds;
		this.iNeedInsItemAttrs = iNeedInsItemAttrs;
		this.iNeedInsAttrs = iNeedInsAttrs;
		this.insType = insType;
	}
}