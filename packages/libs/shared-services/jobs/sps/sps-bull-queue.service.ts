import { SpsJobsCommonAxiosService } from "./sps-common-axios-service";

export class SpsJobsService extends SpsJobsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/sps-bull-queue-jobs/' + childUrl;
    }

   
}