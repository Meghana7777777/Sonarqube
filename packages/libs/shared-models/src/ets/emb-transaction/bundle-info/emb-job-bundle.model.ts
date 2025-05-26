import { GlobalResponseObject } from "../../../common";
import { AdBundleModel } from "../../../cps";
import { EmbOpRepQtyModel } from "../emb-op-rep-qty.model";

// Used for tracking purpose / rpeort purpose
export class EmbJobBundleModel {
   
   opQtys: EmbOpRepQtyModel[];
   bundleInfo: AdBundleModel;
   cutNumber: number;
   cutSubNumber: number;
   jobNumber: string;
   refDocket: string;
   layNumber: string;
   docketGroup: string;

   constructor(
      opQtys: EmbOpRepQtyModel[],
      bundleInfo: AdBundleModel,
      cutNumber: number,
      cutSubNumber: number,
      refDocket: string,
      layNumber: string,
      docketGroup: string,
      jobNumber: string
   ) {
      this.opQtys = opQtys;
      this.bundleInfo = bundleInfo;
      this.cutNumber = cutNumber;
      this.cutSubNumber = cutSubNumber;
      this.refDocket = refDocket;
      this.layNumber = layNumber;
      this.docketGroup = docketGroup;
      this.jobNumber = jobNumber;
   }
}


