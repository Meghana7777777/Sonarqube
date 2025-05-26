
import { CommonRequestAttrs } from "../../common";

export class EmbBarcodePrintRequest extends CommonRequestAttrs {
    embJobNumber: string;
    lineIds: number[]; // only required while printing the bundles for the lay specific emb job
    supplierId: number; // only required while printing the bundles for the lay specific emb job

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        embJobNumber: string,
        lineIds: number[],
        supplierId: number
    ) {
        super(username, unitCode, companyCode, userId);

        this.embJobNumber = embJobNumber;
        this.lineIds = lineIds;
        this.supplierId = supplierId;
    }

}
