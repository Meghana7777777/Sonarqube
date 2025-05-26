export class PkShippingReqesutItemAttrsModel {
    destinations: string[];
    delDates: string[];
    styles: string[];
    poNos: string[];
    coNos: string[];
    moNo: string;
    buyers: string[];
    totalCartons: number;
    totalFgs: number;
    readyToPutInContainerCatons: number;

    constructor(
        destinations: string[],
        delDates: string[],
        styles: string[],
        poNos: string[],
        coNos: string[],
        moNo: string,
        buyers: string[],
        totalCartons: number,
        totalFgs: number,
        readyToPutInContainerCatons: number
    ) {
        this.destinations = destinations;
        this.delDates = delDates;
        this.styles = styles;
        this.poNos = poNos;
        this.coNos = coNos;
        this.moNo = moNo;
        this.buyers = buyers;
        this.totalCartons = totalCartons;
        this.totalFgs = totalFgs;
        this.readyToPutInContainerCatons = readyToPutInContainerCatons;
    }
}