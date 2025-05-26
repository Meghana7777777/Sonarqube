
import { PoSizeQtysModel } from "../../oq-update";
import { PoRatioModel } from "../po-ratio.model";

export class PoFabricRatioModel {
    iCode: string;
    iColor: string;
    prodcutTypes: string;
    productNames: string;
    fgColor: string;
    component: string;
    poQtys: PoSizeQtysModel[]; // The Po level order qtys and the ratio created qtys per fabric wise
    fabricRatios: PoRatioModel[]; // These items will not come for getFabricRatioQtysForPo

    constructor(
        iCode: string,
        iColor: string,
        prodcutTypes: string,
        productNames: string,
        component: string,
        fgColor: string,
        poQtys: PoSizeQtysModel[],
        fabricRatios: PoRatioModel[]
    ) {
        this.iCode = iCode;
        this.iColor = iColor;
        this.prodcutTypes = prodcutTypes;
        this.productNames = productNames;
        this.component = component;
        this.fgColor = fgColor;
        this.poQtys = poQtys;
        this.fabricRatios = fabricRatios;
    }
}

// export class PoFabricRatioModel {
//     iCode: string;
//     iColor: string;
//     prodcutTypes: string[];
//     productNames: string[];
//     poQtys: PoSizeQtysModel[]; // The Po level order qtys and the ratio created qtys per fabric wise
//     fabricRatios: PoRatioModel[]; // These items will not come for getFabricRatioQtysForPo

//     constructor(
//         iCode: string,
//         iColor: string,
//         prodcutTypes: string[],
//         productNames: string[],
//         poQtys: PoSizeQtysModel[],
//         fabricRatios: PoRatioModel[]
//     ) {
//         this.iCode = iCode;
//         this.iColor = iColor;
//         this.prodcutTypes = prodcutTypes;
//         this.productNames = productNames;
//         this.poQtys = poQtys;
//         this.fabricRatios = fabricRatios;
//     }
// }