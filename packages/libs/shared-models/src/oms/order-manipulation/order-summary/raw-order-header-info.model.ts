
export class RawOrderHeaderInfoModel {
    style: string;
    styleDesc: string;
    buyer: string;
    moNo: string;
    coNo: string;
    profitCenter: string;

    sizesConfirmed: boolean;
    packMethodConfirmed: boolean;
    sizeBreadDownConfirmed: boolean;
    moConfirmed: number;
    productConfirmed: boolean;

    constructor(style: string,
        styleDesc: string,
        buyer: string,
        moNo: string,
        coNo: string,
        profitCenter: string,
        sizesConfirmed: boolean,
        packMethodConfirmed: boolean,
        sizeBreadDownConfirmed: boolean,
        moConfirmed: number,
        productConfirmed: boolean
    ) {
        this.style = style;
        this.styleDesc = styleDesc;
        this.buyer = buyer;
        this.coNo = coNo;
        this.moNo = moNo;
        this.profitCenter = profitCenter;
        this.sizesConfirmed = sizesConfirmed;
        this.packMethodConfirmed = packMethodConfirmed;
        this.sizeBreadDownConfirmed = sizeBreadDownConfirmed;
        this.moConfirmed = moConfirmed;
        this.productConfirmed = productConfirmed;
    }
}