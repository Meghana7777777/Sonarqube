import { ItemCodeInfoResponse } from '@xpparel/shared-models';
import { AxiosRequestConfig } from 'axios';
import { OESCommonAxiosService } from '../oes-common-axios-service';

export class PreIntegrationServices extends OESCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/pre-integration/' + childUrl;
    }
    
}