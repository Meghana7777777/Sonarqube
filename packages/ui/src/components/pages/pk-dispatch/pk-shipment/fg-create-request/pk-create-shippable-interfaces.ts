import { CutStatusEnum } from "@xpparel/shared-models";

export interface PkDocket {
    docket: string;
    mainDocket: boolean;
    item: string;
    itemDesc: string;
    plies: number;
}

export interface PkActualDocket {
    laynumber: number;
    layedPlies: number;
    cutStatus: CutStatusEnum;
    docketNumber: string;
}

export interface PkCutOrderDataIn {
    selectedPo: number,
    cutId: number;
    cutSubNumber: string;
    manufacturingOrder: string;
    cutOrder: string;
    cut: string;
    productName: string;
    totalQuantity: number;
    totalPlannedBundles: number;
    totalShadeBundles: number;
    isCutComplete: boolean;
    dockets: PkDocket[];
    actualDockets: PkActualDocket[];
}

export interface PkCombinedDocketData {
    docket: string;          // From Docket
    mainDocket: boolean;      // From Docket
    item: string;             // From Docket
    itemDesc: string;         // From Docket
    plies: number;            // From Docket
    layNumber: number;        // From ActualDocket
    layedPlies: number;       // From ActualDocket
    cutStatus: CutStatusEnum; // From ActualDocket
}

export interface PkCombinedDocketData {
    docket: string;          // From Docket
    mainDocket: boolean;     // From Docket
    item: string;            // From Docket
    itemDesc: string;        // From Docket
    plies: number;           // From Docket
    layNumber: number;       // From ActualDocket
    layedPlies: number;      // From ActualDocket
    cutStatus: CutStatusEnum; // From ActualDocket

}
