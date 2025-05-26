import { GlobalResponseObject } from "../../../common";
import { PkmsReportingConfigurationResponseDto } from "./pkms-reporting-configuration-response-dto";

export class PkmsReportingConfigurationResponse extends GlobalResponseObject {
    data?: PkmsReportingConfigurationResponseDto;

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: PkmsReportingConfigurationResponseDto) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}