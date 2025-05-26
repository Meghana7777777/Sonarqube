export class PolyBagSizeRatio {
	id: number;
	poId: number;
	lineId: number;
	productRef: string;
	productCode: string;
	productName: string;
	productType: string;
	fgColor: string;
	poSubLId: number;
	size: string;
	ratio: number;
	upcBarCode: string;

	constructor(
		id: number,
		lineId: number,
		productRef: string,
		fgColor: string,
		productCode: string,
		productName: string,
		productType: string,
		poSubLId: number,
		size: string,
		ratio: number,
		poId: number
	) {
		this.id = id;
		this.lineId = lineId;
		this.fgColor = fgColor;
		this.productCode = productCode;
		this.productName = productName;
		this.productType = productType;
		this.productRef = productRef;
		this.poSubLId = poSubLId;
		this.size = size;
		this.ratio = ratio;
		this.poId = poId;
	}
}



export class FgsInfoDto {
	fgNumber: number;
	fgId: number;
	oslId: number;
	constructor(
		fgNumber: number,
		fgId: number,
		oslId: number
	) {
		this.fgId = fgId;
		this.fgNumber = fgNumber;
		this.oslId = oslId
	}
}