// barcode id - PK
export class PkDSetSubItemBarcodeDetailedModel {
    putInBag: boolean; // should be true or false based on the mapping the DB
    size: string;
    shade: string;

    // color: string; // not sent now
    // mo: string; // not sent now
    // prodName: string; // not sent now
    // delDate: string; // not sent now
    // dispatchDate: string; // dispatch date // not sent now

    constructor(
        putInBag: boolean,
        size: string,
        shade: string,
        // color: string,
        // mo: string,
        // prodName: string,
        // delDate: string,
        // dispatchDate: string,
    ) {
        this.putInBag = putInBag;
        this.size = size;
        this.shade = shade;

        // this.mo = mo;
        // this.prodName = prodName;
        // this.dispatchDate = dispatchDate;
        // this.delDate = delDate;
        // this.color = color;
    }
}
