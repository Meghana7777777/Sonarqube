import { CommonRequestAttrs } from "../../common";

export class EmbJobNumberRequest extends CommonRequestAttrs {
    // when calling this API EmbJobNumberRequest, the embJobNumber is optional
    embJobNumber: string;
    headerId: number; // not rquired ATM
    lineIds: number[]; // only required in some cases while trying to print barcodes / bundle sheets for a specific emb line item

    iNeedEmbProps: boolean;
    iNeedEmbLines: boolean;
    iNeedEmbBundles: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        embJobNumber: string,
        headerId: number,
        lineIds: number[],
        iNeedEmbProps: boolean,
        iNeedEmbLines: boolean,
        iNeedEmbBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId);

        this.embJobNumber = embJobNumber;
        this.lineIds = lineIds;
        this.headerId = headerId;
        this.iNeedEmbProps = iNeedEmbProps;
        this.iNeedEmbLines = iNeedEmbLines;
        this.iNeedEmbBundles = iNeedEmbBundles;
    }
}
