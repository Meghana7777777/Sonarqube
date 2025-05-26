import { RollLockEnum } from "../../wms";
import { MrnStatusEnum } from "../enum";

export class DocRollsModel {
    rollId: number;
    rollBarcode: string;
    rollQty: number;
    allocatedQuantity: number;
    actualUtilizedQty: number;
    rollLocked: RollLockEnum;
    shade: string; // this is the actual shade of the roll during the inspection
    shrinkageGroup: string;
    lotNo: string;
    itemDesc: string;
    batch: string;
    iWidth: number; // the input width i.e the supplier width
    mWidth: number; // measured width that we update during the pallet roll mapping
    aWidth: string; // Currently it is relax width (change this to actual width and verify other places)
    relaxWidth: number;// 
    plWidth: string;
    mrnId : number;
    mrnReqStatus : MrnStatusEnum;
    mrnReqNumber: string;
    allocatedDate: string; //This will be only valid for material request screen to check when did we actually allocated the fabric to the docket
    externalRollNumber: string;
    trayCode: string;
    trolleyCode: string;
    palletCode: string;
    binCode: string;
    rollLocation: string;
    markerLength: number; // the actual or the planne marker length
    
}
