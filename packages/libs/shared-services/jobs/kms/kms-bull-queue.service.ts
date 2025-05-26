import { KmsJobsCommonAxiosService } from "./kms-common-axios-service";

export class KmsJobsService extends KmsJobsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/kms-bull-queue-jobs/' + childUrl;
    }

   
}