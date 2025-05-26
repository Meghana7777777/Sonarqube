import { InsFabInsSelectedRollModelAttrs } from "./fab-ins-selected-rolls-attr.model";

export class InsFabInsSelectedRollModel {
	packListId: number;
	rollId: number;
	rollBarocde: string;
	rollQty: number;
	gsm:number;
	attrs: InsFabInsSelectedRollModelAttrs;
	
	constructor(
		packListId: number,
		rollId: number,
		rollBarocde: string,
		rollQty: number,
		attrs: InsFabInsSelectedRollModelAttrs,
		gsm:number,
		
	) {
		this.packListId = packListId
		this.rollId = rollId
		this.rollBarocde = rollBarocde
		this.rollQty = rollQty
		this.attrs = attrs
		this.gsm = gsm
		
	}
}