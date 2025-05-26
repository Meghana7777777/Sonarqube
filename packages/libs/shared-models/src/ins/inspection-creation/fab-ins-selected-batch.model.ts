import { InsFabInsSelectedBatchModelAttrs } from "./fab-ins-selected-batch-attr.model";
import { InsFabInsSelectedLotModel } from "./fab-ins-selected-lot.model";

export class InsFabInsSelectedBatchModel {
	packListId: number;
	batchNo: string;
	attrs: InsFabInsSelectedBatchModelAttrs;
	lotInfo: InsFabInsSelectedLotModel[];
	constructor(
		packListId: number,
		batchNo: string,
		attrs: InsFabInsSelectedBatchModelAttrs,
		lotInfo: InsFabInsSelectedLotModel[],
	) {
		this.packListId = packListId
		this.batchNo = batchNo
		this.attrs = attrs
		this.lotInfo = lotInfo
	}
}