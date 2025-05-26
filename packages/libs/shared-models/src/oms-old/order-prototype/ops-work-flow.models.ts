    import { InsUomEnum } from "../../ins";
import { OpFormEnum, ProcessTypeEnum } from "../../oms/enum";

    export class GlobalOpsVersion {
        version: string;
        description: string;
        productName: string;
        sewSerial: number;
        manufacturingOrder: string;
        sewSequences: GlobalOpsSequence[]; // One-to-Many relationship
    }

    export class GlobalOpsSequence {
        iOpCode: string;
        eOpCode: string;
        opName: string;
        opCategory: ProcessTypeEnum;
        opForm: OpFormEnum;
        opSequence: number;
        group: number;
        depGroup: string;
        smv: number;
        componentNames: string;
        opVersionId: number;
        productName: string;
        sewSerial: number;
        jobType: ProcessTypeEnum | null;
        warehouse: string | null;
        extProcessing: string | null;
        bundleGroup: number;
        itemCode: string | null;
        sewRawMaterials: GlobalOpsRawMaterial[]; // One-to-Many relationship
    }

    export class GlobalOpsRawMaterial {
        iOpCode: string;
        product: string;
        productType: string;
        consumption: string;
        uom: InsUomEnum;
        opVersionId: number;
        sewSerial: number
    }
