import { GlobalResponseObject } from "../../common";
import { BarcodeQualityResultsModel, InputPlanningDashboardModel, IPlannningJobModel, IPlannningModuleModel, IpsBarcodeQualityResultsModel, IpsDowntimeDetailsModel, jobStatusTypeModel, ModuleDowntimeDataModel, SequencedIJobOperationModel, TrimDetailsModel } from "./input-planning-dashboard.model";

export class IPlannningJobModelResponse extends GlobalResponseObject {
    data: IPlannningJobModel;

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: IPlannningJobModel,
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class IPlannningModuleModelResponse extends GlobalResponseObject {
    data: IPlannningModuleModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: IPlannningModuleModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class IPlannningSectionModelResponse extends GlobalResponseObject {
    data: InputPlanningDashboardModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: InputPlanningDashboardModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class IPlannningDowntimeResponse extends GlobalResponseObject {
    data: ModuleDowntimeDataModel;

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: ModuleDowntimeDataModel,
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class IPlannningTrimsResponse extends GlobalResponseObject {
    data: TrimDetailsModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: TrimDetailsModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class IPlannningJobStatusResponse extends GlobalResponseObject {
    data: jobStatusTypeModel;

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: jobStatusTypeModel,
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class SequencedIJobOperationResponse extends GlobalResponseObject {
    data: SequencedIJobOperationModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: SequencedIJobOperationModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class BarcodeDetailsForQualityResultsResponse extends GlobalResponseObject {
    data: BarcodeQualityResultsModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: BarcodeQualityResultsModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class IpsBarcodeDetailsForQualityResultsResponse extends GlobalResponseObject {
    data: IpsBarcodeQualityResultsModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: IpsBarcodeQualityResultsModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class IpsDowntimeDetailsResponse extends GlobalResponseObject {
    data: IpsDowntimeDetailsModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: IpsDowntimeDetailsModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

