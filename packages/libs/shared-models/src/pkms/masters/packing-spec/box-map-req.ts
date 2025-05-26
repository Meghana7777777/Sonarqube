import { PolyBagSizeRatio } from "../../pack-list";

export class BoxMapReqDto {
	specId: number;
	itemId: number;
	levelNo: number;
	noOfItems: number;
	id: number;
	itemCode: string
	items: PolyBagSizeRatio[]
	constructor(specId: number,
		itemId: number,
		levelNo: number,
		noOfItems: number,
		id: number,
		itemCode?: string
	) {
		this.specId = specId
		this.itemId = itemId
		this.levelNo = levelNo
		this.noOfItems = noOfItems
		this.id = id
		this.itemCode = itemCode
	}
}
