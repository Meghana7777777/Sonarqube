import { AdBundleModel } from "./ad-bundle.model";

export class CutBundleSheetModel {
    cutNumber: number;
    poDesc: string;
    moNumber: string;
    moLines: string[];
    style: string;
    bundles: AdBundleModel[];
}
