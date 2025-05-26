
export class PKMSPackingDispatchCartonInfoModel { 
    qty: number; // total qty of the carton
    cartonId: number; // PK of the carton
    barcode: string; // barcode of the carton
    constructor( 
        qty: number,
        cartonId: number,
        barcode: string, 
    ) { 
        this.qty = qty;
        this.cartonId = cartonId;
        this.barcode = barcode;
    }
}

