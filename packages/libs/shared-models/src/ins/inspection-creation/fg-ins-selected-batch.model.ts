import { FgInsFabInsSelectedLotModelAttrs, InsFgInsSelectedBatchModelAttrs, InsFgInsSelectedLotModel } from "@xpparel/shared-models";
import { InsFabInsSelectedBatchModelAttrs } from "./fab-ins-selected-batch-attr.model";
import { InsFabInsSelectedLotModel } from "./fab-ins-selected-lot.model";

export class InsFgSelectedBatchModel {
	packListId: number;
	batchNo: string;
	attrs: InsFgInsSelectedBatchModelAttrs;
	lotInfo: InsFgInsSelectedLotModel[];
	constructor(
		packListId: number,
		batchNo: string,
		attrs: InsFgInsSelectedBatchModelAttrs,
		lotInfo: InsFgInsSelectedLotModel[],
	) {
		this.packListId = packListId
		this.batchNo = batchNo
		this.attrs = attrs
		this.lotInfo = lotInfo
	}
} 

