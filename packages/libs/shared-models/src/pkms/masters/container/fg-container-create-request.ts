import { CommonRequestAttrs } from "../../../common";
import { FabricUOM } from "../../../wms";
import { FgContainerTypeEnum, FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum } from "../../enum";
import { FgContainerBehaviorEnum } from "./fg-container-behavior.enum";



export class FgContainerCreateRequest extends CommonRequestAttrs {
    id: number;
    name: string;
    code: string;
    weightCapacity: number;
    weightUom: string;
    currentLocationId: number;
    currentContainerState: FgCurrentContainerStateEnum;
    currentContainerLocation: FgCurrentContainerLocationEnum;
    containerBehavior: FgContainerBehaviorEnum;
    freezeStatus: string;
    isActive: boolean;
    maxItems: number;
    barcodeId: string;
    type: FgContainerTypeEnum;
    length: number;
    lengthUom: FabricUOM;
    width: number;
    widthUom: FabricUOM;
    height: number;
    heightUom: FabricUOM;
    whId: number;
    rackId?: number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, names: string, code: string, weightCapacity: number, weightUom: string, currentLocationId: number, currentContainerState: FgCurrentContainerStateEnum, currentContainerLocation: FgCurrentContainerLocationEnum, containerBehavior: FgContainerBehaviorEnum, freezeStatus: string, isActive: boolean, maxItems: number, barcodeId: string, type: FgContainerTypeEnum, length: number,
        lengthUom: FabricUOM, width: number, widthUom: FabricUOM,
        height: number, heightUom: FabricUOM, whId: number, rackId?: number) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.name = names;
        this.code = code;
        this.weightCapacity = weightCapacity;
        this.weightUom = weightUom;
        this.currentLocationId = currentLocationId;
        this.currentContainerState = currentContainerState;
        this.currentContainerLocation = currentContainerLocation;
        this.containerBehavior = containerBehavior;
        this.freezeStatus = freezeStatus;
        this.isActive = isActive;
        this.maxItems = maxItems;
        this.barcodeId = barcodeId;
        this.type = type;
        this. rackId=rackId
        this.length = length;
        this.lengthUom = lengthUom;
        this.widthUom = widthUom;
        this.heightUom = heightUom
        this.width = width;
        this.height = height;
        this.whId = whId;
    }
}
