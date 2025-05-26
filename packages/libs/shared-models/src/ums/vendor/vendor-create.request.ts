import { CommonRequestAttrs } from "../../common";
import { VendorCategoryEnum } from "../enum";

export class VendorCreateRequest extends CommonRequestAttrs {
    id?: number;
    vName: string;
    vCode: string;
    vDesc: string;
    vCountry: string;
    vPlace: string; // the state/city/province
    vAddress: string;
    vCategory: VendorCategoryEnum;
    vContact: string;

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,

        id: number,
        vName: string,
        vCode: string,
        vDesc: string,
        vCountry: string,
        vPlace: string, // the state/city/province
        vAddress: string,
        vCategory: VendorCategoryEnum,
        vContact: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.vName = vName;
        this.vCode = vCode;
        this.vDesc = vDesc;
        this.vCategory = vCategory;
        this.vCountry = vCountry;
        this.vPlace = vPlace;
        this.vAddress = vAddress;
        this.vContact = vContact

    }

}