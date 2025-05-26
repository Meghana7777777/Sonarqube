export class OpCodeFgsInfo {
    operationCode: string;
    openFgNumbers: number[];
    reportedFgNumbers: number[];

    /**
     * Constructor for OpCodeFgsInfo
     * @param operationCode - The operation code
     * @param openFgNumbers - Array of open FG (Finished Goods) numbers
     * @param reportedFgNumbers - Array of reported FG (Finished Goods) numbers
     */
    constructor(operationCode: string, openFgNumbers: number[], reportedFgNumbers: number[]) {
        this.operationCode = operationCode;
        this.openFgNumbers = openFgNumbers;
        this.reportedFgNumbers = reportedFgNumbers;
    }
}
