import { EmbOpRepQtyModel } from "../emb-op-rep-qty.model";

export class JobScanQtyBasicModel {
    jobNumber: string;
    opQtys: EmbOpRepQtyModel[];
    refDocket: string;
    jobQty: number;

    constructor(
        jobNumber: string,
        opQtys: EmbOpRepQtyModel[],
        refDocket: string,
        jobQty: number
    ) {
        this.jobNumber = jobNumber;
        this.opQtys = opQtys;
        this.refDocket = refDocket;
        this.jobQty = jobQty;
    }
}