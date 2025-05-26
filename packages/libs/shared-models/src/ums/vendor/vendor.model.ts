import { CommonRequestAttrs } from "../../common";
import { VendorCategoryEnum } from "../enum";

export class VendorModel {
    id: number; // PK of the vendor entity
    vName: string;
    vCode: string;
    vDesc: string;
    vCountry: string;
    vPlace: string; // the state/city/province
    vAddress: string;
    vCategory: VendorCategoryEnum;
    vContact: string

    constructor(id: number, vName: string, vCode: string, vDesc: string, vCountry: string, vPlace: string, vAddress: string, vCategory: VendorCategoryEnum, vContact: string
    ) {

        this.id = id;
        this.vName = vName;
        this.vCode = vCode;
        this.vDesc = vDesc;
        this.vCountry = vCountry;
        this.vPlace = vPlace;
        this.vAddress = vAddress;
        this.vCategory = vCategory;
        this.vContact = vContact
    }

}