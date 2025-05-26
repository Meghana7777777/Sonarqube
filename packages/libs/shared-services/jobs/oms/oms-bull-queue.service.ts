import { OMSJobsCommonAxiosService } from "./oms-common-axios-service";

export class OmsJobsService extends OMSJobsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/oms-bull-queue-jobs/' + childUrl;
    }

   
}