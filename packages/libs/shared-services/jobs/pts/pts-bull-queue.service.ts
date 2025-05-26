import { PtsJobsCommonAxiosService } from "./pts-common-axios-service";

export class PtsJobsService extends PtsJobsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pts-bull-queue-jobs/' + childUrl;
    }

   
}