import { CommonRequestAttrs } from "../../common";

export class InsBatchNosRequest extends CommonRequestAttrs {
	batches: string[];
}