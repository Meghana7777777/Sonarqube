
export class DocketCutNumberModel {
    docket: string;
    mainCutNumber: number; // The cut number under a po serial
    subCutNumber: number; // The cut number under a product name
    involvedCuts: number[];

    constructor (
        docket: string, mainCutNumber: number, subCutNumber: number, involvedCuts: number[]) {
            this.docket = docket;
            this.mainCutNumber = mainCutNumber;
            this.subCutNumber = subCutNumber;
            this.involvedCuts = involvedCuts;
    }
}