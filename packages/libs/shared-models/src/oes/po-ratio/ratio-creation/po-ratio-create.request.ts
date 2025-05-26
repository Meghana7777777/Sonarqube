
import { CommonRequestAttrs } from "../../../common";
import { PoRatioLineCreateRequest } from "./po-ratio-line-create.request";

export class PoRatioCreateRequest extends CommonRequestAttrs {
    poSerial: number;
    rName: string; // not an user input
    rCode: string; // not an user input
    ratioLines: PoRatioLineCreateRequest[];
    remarks: string; // not an user input
    ratioDesc: string;
    maxPlies: number;
    components: string[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        poSerial: number,
        rName: string,
        rCode: string,
        ratioLines: PoRatioLineCreateRequest[],
        remarks: string,
        ratioDesc: string,
        maxPlies: number,
        components: string[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.poSerial = poSerial;
        this.rName = rName;
        this.rCode = rCode;
        this.ratioLines = ratioLines;
        this.remarks = remarks;
        this.ratioDesc = ratioDesc;
        this.maxPlies = maxPlies;
        this.components = components;
    }
}


// {
//     poSerial: 4,
//     rName: "Ratio 1";
//     rCode: 0,
//     ratioLines: [
//         {
//             iCode: "F00099-403",
//             productName: "Shirt",
//             plies: 80,
//             maxlPies: 70,
//             sizeRatios: [
//                {
//                   size: "S",
//                   ratio: 5
//                },
//                {
//                   size: "L",
//                   ratio: 5
//                }
//             ]
//         }
//     ],
//     remarks: "",
//     ratioDesc: ""
// }