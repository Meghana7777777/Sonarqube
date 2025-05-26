
export class PoRatioFabricModel {
    id: number;
    iCode: string;
    iColor: string;
    iDesc: string;
    maxPlies: number;
    mainFabric: boolean;
    isBinding: boolean;
    bindingCons: number;
    wastage:number;

    constructor(
        id: number,
        iCode: string,
        iColor: string,
        iDesc: string,
        maxPlies: number,
        mainFabric: boolean,
        isBinding: boolean,
        bindingCons: number,
        wastage:number
    ) {
        this.id = id;
        this.iCode = iCode;
        this.iColor = iColor;
        this.iDesc = iDesc;
        this.maxPlies = maxPlies;
        this.mainFabric = mainFabric;
        this.isBinding = isBinding;
        this.bindingCons = bindingCons;
        this.wastage = wastage;
    }
}