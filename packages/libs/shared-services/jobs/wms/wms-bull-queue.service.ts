import { WmsJobsCommonAxiosService } from "./wms-common-axios-service";

export class WmsJobsService extends WmsJobsCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/wms-bull-queue-jobs/' + childUrl;
    }

   
}