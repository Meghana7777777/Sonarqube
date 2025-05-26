import { FgInsFabInsSelectedLotModelAttrs, InsFgInsSelectedCartonModel, InsFgInsSelectedCartonModelAttrs } from "@xpparel/shared-models";

export class InsFgInsSelectedLotModel {
	packListId: number;
	packJob: string;
	packJobId:number;
	packOrderID:number;
	packOrderNo: string;
	cortons: InsFgInsSelectedCartonModel[];
	attrs: FgInsFabInsSelectedLotModelAttrs;
	constructor(
		packListId: number,
		packJob: string,
		cortons: InsFgInsSelectedCartonModel[],
		attrs: FgInsFabInsSelectedLotModelAttrs,
		packOrderID:number,
		packJobId:number,
		packOrderNo: string,
	) {
		this.packListId = packListId;
		this.packJob = packJob;
		this.cortons = cortons;
		this.attrs = attrs;
		this.packOrderID=packOrderID;
		this.packJobId=packJobId;
		this.packOrderNo=packOrderNo;
	}
} 

