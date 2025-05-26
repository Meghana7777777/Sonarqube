

export class PKMSPackListViewResponseDto {
    sizeRatio: string;
    ratio: number;
    colorCode: string;
    color: string;
    block: string;
    pkOrderSubLineId: number;
    orderQty: number;
    noOfCartons: number;
    cartonProtoId:number;
    netWeight: number;
    grossWeight: number;
    length: number;
    width: number;
    height: number;
    qty: number;
    packcs: number;
    plId: number;
    size: string;
    country: string;
    productName: string;
    constructor(
        sizeRatio: string,
        ratio: number,
        colorCode: string,
        color: string,
        block: string,
        pkOrderSubLineId: number,
        orderQty: number,
        noOfCartons: number,
        cartonProtoId:number,
        netWeight: number,
        grossWeight: number,
        length: number,
        width: number,
        height: number,
        qty: number,
        packcs: number,
        plId: number,
        size: string,
        country: string,
        productName: string
    ) {
        this.sizeRatio = sizeRatio;
        this.ratio = ratio;
        this.colorCode = colorCode;
        this.color = color;
        this.block = block;
        this.orderQty = orderQty;
        this.pkOrderSubLineId = pkOrderSubLineId;
        this.noOfCartons = noOfCartons;
        this.cartonProtoId = cartonProtoId;
        this.netWeight = netWeight;
        this.grossWeight = grossWeight;
        this.length = length;
        this.width = width;
        this.height = height;
        this.qty = qty;
        this.packcs = packcs;
        this.plId = plId;
        this.size = size;
        this.country = country;
        this.productName = productName;
    }
}