export class PKMSPackListAttrsModel {
    prodNames: string[];
    moNos: string[];
    vpos: string[];
    destinations: string[];
    delDates: string[];
    styles: string[];
    buyers: string[];
    constructor(
        prodNames: string[],
        moNos: string[],
        vpos: string[],
        destinations: string[],
        delDates: string[],
        styles: string[],
        buyers: string[],
    ) {
        this.prodNames = prodNames;
        this.moNos = moNos;
        this.vpos = vpos;
        this.destinations = destinations;
        this.delDates = delDates;
        this.styles = styles;
        this.buyers = buyers;
    }
}