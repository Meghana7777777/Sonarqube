import { PKMSCommonAxiosService } from "../pkms-common-axios-service";

export class InsPackingHelperServicew extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/InsPackingHelper/' + childUrl;
    }

    


}