import { InsFgInsSelectedCartonModelAttrs } from "@xpparel/shared-models";
import { InsFabInsSelectedRollModelAttrs } from "./fab-ins-selected-rolls-attr.model";

export class InsFgInsSelectedCartonModel {
	packListId: number;
	cartonId: number;
	cartonBarocde: string;
	cartonQty: number;
	attrs: InsFgInsSelectedCartonModelAttrs;
	constructor(
		packListId: number,
		cartonId: number,
		cartonBarocde: string,
		cartonQty: number,
		attrs: InsFgInsSelectedCartonModelAttrs,
	) {
		this.packListId = packListId
		this.cartonId = cartonId
		this.cartonBarocde = cartonBarocde
		this.cartonQty = cartonQty
		this.attrs = attrs
	}
} 

