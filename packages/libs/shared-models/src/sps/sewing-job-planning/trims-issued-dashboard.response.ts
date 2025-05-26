import { GlobalResponseObject } from "../../common";
import { TrimGroupWiseDetailsModel, TrimsIssuedDashboardModel, TrimsIssuedJobModel, TrimsissuedModuleModel, TrimsGroupsModel, TrimsItemsModel } from "./trims-issued-dashboard.model";

export class TrimsIssueddashboardResponse extends GlobalResponseObject {
    data: TrimsIssuedDashboardModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: TrimsIssuedDashboardModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class TrimsIssueddashboardModelResponse extends GlobalResponseObject {
    data: TrimsissuedModuleModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: TrimsissuedModuleModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class TrimsIssueddashboardJobResponse extends GlobalResponseObject {
    data: TrimsIssuedJobModel;

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: TrimsIssuedJobModel,
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class TrimGroupsDetailsResponse extends GlobalResponseObject {
    data: TrimGroupWiseDetailsModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: TrimGroupWiseDetailsModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class TrimsItemsJobResponse extends GlobalResponseObject {
    data: TrimsItemsModel[];

    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: TrimsItemsModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}

export class TrimsGroupsJobResponse extends GlobalResponseObject {
    data: TrimsGroupsModel[];
    constructor(
        status: boolean,
        errorCode: number,
        internalMessage: string,
        data: TrimsGroupsModel[],
    ) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
