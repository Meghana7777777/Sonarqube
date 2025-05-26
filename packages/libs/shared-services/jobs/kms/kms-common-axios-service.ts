import { AxiosInstance, configVariables } from '@xpparel/shared-services';
import { AxiosRequestConfig } from 'axios';


export class KmsJobsCommonAxiosService {
    URL = configVariables.APP_KMS_JOBS_SERVICE_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        return await AxiosInstance.post(this.URL + '' + urlEndPoint, data, config)
            .then(response => {
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                throw new Error(err.message);
            })
    }
}