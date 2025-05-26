import { SewingCreationOptionsEnum } from "../sps";
import { CommonRequestAttrs } from "./common-request-attr.model";

export class FgFindingOptions extends CommonRequestAttrs {
    serial: number; // Serial number for tracking purposes
    optionsObj: { [key in typeof SewingCreationOptionsEnum[keyof typeof SewingCreationOptionsEnum]]?: string }; // Array of option objects with optional values
    isOnlyCutReportedBundles: boolean

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        serial: number,
        optionsObj: { [key in typeof SewingCreationOptionsEnum[keyof typeof SewingCreationOptionsEnum]]?: string },
        isOnlyCutReportedBundles: boolean
    ) {
        super(username, unitCode, companyCode, userId); // Call the constructor of the parent class
        this.serial = serial; // Initialize the serial property
        this.optionsObj = optionsObj; // Initialize the optionsObj property
        this.isOnlyCutReportedBundles = isOnlyCutReportedBundles
    }
}
