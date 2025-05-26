import { GlobalResponseObject } from "../../common";
import { EmbJobBundleModel } from "./bundle-info/emb-job-bundle.model";

// Used for tracking purpose / rpeort purpose
export class EmbJobModel {
   jobNumber: string;
   operations: string[];
   bundlesInfo: EmbJobBundleModel[];

}