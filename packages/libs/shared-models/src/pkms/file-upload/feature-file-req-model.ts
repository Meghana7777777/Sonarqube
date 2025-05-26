import { ReferenceFeaturesEnum } from "../enum";


export class FeatureFilesReqModel {
    featuresRefName: ReferenceFeaturesEnum;
    featuresRefNo: any;
    constructor(featuresRefNo: number, featuresRefName: ReferenceFeaturesEnum) {
        this.featuresRefNo = featuresRefNo;
        this.featuresRefName = featuresRefName;
    }

}