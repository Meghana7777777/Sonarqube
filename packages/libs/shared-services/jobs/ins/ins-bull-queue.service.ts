import { InsJobsCommonAxiosService } from "./ins-common-axios-service";

export class InsJobsService extends InsJobsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/ins-bull-queue-jobs/' + childUrl;
    }

   
}