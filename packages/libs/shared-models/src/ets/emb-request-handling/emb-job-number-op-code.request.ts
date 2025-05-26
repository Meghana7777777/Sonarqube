import { CommonRequestAttrs } from "../../common";

export class EmbJobNumberOpCodeRequest extends CommonRequestAttrs {
    // when calling this API EmbJobNumberRequest, the embJobNumber is optional
    embJobNumber: string;
    opCode: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        embJobNumber: string,
        opCode: string
    ) {
        super(username, unitCode, companyCode, userId);

        this.embJobNumber = embJobNumber;
        this.opCode = opCode;
    }
}
