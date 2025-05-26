import { GlobalResponseObject } from "@xpparel/shared-models";

export class ThreadInsSelectedBatchResponse extends GlobalResponseObject {
	data: ThreadInsSelectedBatchModel[];
	constructor(status: boolean, errorCode: number, internalMessage: string, data: ThreadInsSelectedBatchModel[]) {
		super(status, errorCode, internalMessage);
		this.data = data;
	}
}

export class ThreadInsSelectedBatchModel {
	packListId: number;
	batchNo: string;
	attrs: ThreadInsSelectedBatchModelAttrs;
	lotInfo: ThreadInsSelectedLotModel[];
	constructor(
		packListId: number,
		batchNo: string,
		attrs: ThreadInsSelectedBatchModelAttrs,
		lotInfo: ThreadInsSelectedLotModel[],
	) {
		this.packListId = packListId;
		this.batchNo = batchNo;
		this.attrs = attrs;
		this.lotInfo = lotInfo;
	}
}

export class ThreadInsSelectedBatchModelAttrs {
	moNo: string[];
	delDate: string[];
	destination: string[];
	moLines: string[];
}

export class ThreadInsSelectedLotModel {
	packListId: number;
	lotNo: string;
	spools: ThreadInsSelectedSpoolModel[];  // Renamed from rolls to spools
	attrs: ThreadInsSelectedLotModelAttrs;
	constructor(
		packListId: number,
		lotNo: string,
		spools: ThreadInsSelectedSpoolModel[],  // Updated here
		attrs: ThreadInsSelectedLotModelAttrs,
	) {
		this.packListId = packListId;
		this.lotNo = lotNo;
		this.spools = spools;  // Updated here
		this.attrs = attrs;
	}
}

export class ThreadInsSelectedSpoolModel {  // Renamed from ThreadInsSelectedRollModel
	packListId: number;
	spoolId: number;  // Renamed from rollId
	spoolBarcode: string;  // Renamed from rollBarcode
	spoolLength: number;  // Renamed from rollQty (Measured in meters/yards)
	attrs: ThreadInsSelectedSpoolModelAttrs;  // Updated attributes
	constructor(
		packListId: number,
		spoolId: number,
		spoolBarcode: string,
		spoolLength: number,
		attrs: ThreadInsSelectedSpoolModelAttrs,
	) {
		this.packListId = packListId;
		this.spoolId = spoolId;
		this.spoolBarcode = spoolBarcode;
		this.spoolLength = spoolLength;
		this.attrs = attrs;
	}
}

export class ThreadInsSelectedSpoolModelAttrs {  // Updated attributes specific to thread inspection
	twistPerInch: number;  // Number of twists per inch
	tensileStrength: number;  // Measured in cN/tex
	elongation: number;  // Stretchability in %
	hairiness: number;  // Fiber looseness level
	lubrication: number;  // Oil percentage
	constructor(
		twistPerInch: number,
		tensileStrength: number,
		elongation: number,
		hairiness: number,
		lubrication: number,
	) {
		this.twistPerInch = twistPerInch;
		this.tensileStrength = tensileStrength;
		this.elongation = elongation;
		this.hairiness = hairiness;
		this.lubrication = lubrication;
	}
}

export class ThreadInsSelectedLotModelAttrs {
	spoolCount: number;  // Changed from rollCount to spoolCount
	constructor(spoolCount: number) {
		this.spoolCount = spoolCount;
	}
}
