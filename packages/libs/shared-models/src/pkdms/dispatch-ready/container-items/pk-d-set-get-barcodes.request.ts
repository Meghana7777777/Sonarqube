import { CommonRequestAttrs } from "../../../common";

export class PkDSetGetBarcodesRequest extends CommonRequestAttrs {
    dSetIds: number[]; // PK of the dset
    dSetItemIds: number[];

    iNeedPutInBagBarcodeList: boolean; // will get only the barcode numbers in the bag
    iNeedAllBarcodesList: boolean; // will get all the barcode numbers in the d set

    iNeedPutInBagBarcodeDetailedList: boolean; // will get all the barcode numbers in the bag with all detailed info
    iNeedAllBarcodesDetailedList: boolean; // will get all the barcode numbers with all detailed info

    iNeedBagWiseAbstract: boolean;
    iNeedBagWiseAbstractWithDetailedBarcodes: boolean;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        dSetIds: number[],
        dSetItemIds: number[],
        iNeedPutInBagBarcodeList: boolean,
        iNeedAllBarcodesList: boolean,
        iNeedPutInBagBarcodeDetailedList: boolean,
        iNeedAllBarcodesDetailedList: boolean,
        iNeedBagWiseAbstract: boolean,
        iNeedBagWiseAbstractWithDetailedBarcodes: boolean
    ) {
        super(username, unitCode, companyCode, userId);
        this.username = username
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.userId = userId;
        this.dSetIds = dSetIds;
        this.dSetItemIds = dSetItemIds;
        this.iNeedPutInBagBarcodeList = iNeedPutInBagBarcodeList;
        this.iNeedAllBarcodesList = iNeedAllBarcodesList;
        this.iNeedPutInBagBarcodeDetailedList = iNeedPutInBagBarcodeDetailedList;
        this.iNeedAllBarcodesDetailedList = iNeedAllBarcodesDetailedList;
        this.iNeedBagWiseAbstract = iNeedBagWiseAbstract;
        this.iNeedBagWiseAbstractWithDetailedBarcodes = iNeedBagWiseAbstractWithDetailedBarcodes;
    }
}



// {
//     "dSetIds": [6],
//     "dSetItemIds":[],
//     "iNeedPutInBagBarcodeList": true,
//     "iNeedAllBarcodesList": true,
//     "iNeedPutInBagBarcodeDetailedList": true,
//     "iNeedAllBarcodesDetailedList": true,
//     "iNeedBagWiseAbstract": true,
//     "iNeedBagWiseAbstractWithDetailedBarcodes": true
// }