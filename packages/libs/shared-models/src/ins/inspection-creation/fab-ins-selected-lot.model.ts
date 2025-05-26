import { InsFabInsSelectedRollModel } from "@xpparel/shared-models";
import { InsFabInsSelectedLotModelAttrs } from "./fab-ins-selected-lot-attr.model";

export class InsFabInsSelectedLotModel {
	packListId: number;
	lotNo: string;
	rolls: InsFabInsSelectedRollModel[];
	attrs: InsFabInsSelectedLotModelAttrs;
	itemCode:string;
	constructor(
		packListId: number,
		lotNo: string,
		rolls: InsFabInsSelectedRollModel[],
		attrs: InsFabInsSelectedLotModelAttrs,
		itemCode:string,
	) {
		this.packListId = packListId;
		this.lotNo = lotNo;
		this.rolls = rolls;
		this.attrs = attrs;
		this.itemCode=itemCode;
	}
}