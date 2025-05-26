import { InvsJobsCommonAxiosService } from "./invs-common-axios-service";

export class InvsJobsService extends InvsJobsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/invs-bull-queue-jobs/' + childUrl;
    }

   
}