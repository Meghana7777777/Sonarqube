import { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from '../axios-instance';
import { configVariables } from '../config';
import { assignAndGetLoaingReqStatusForHeaders } from '../loading-helper';

export class QMSCommonAxiosService {
    URL = configVariables.APP_QMS_SERVICE_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        const modifiedConfig = assignAndGetLoaingReqStatusForHeaders(true, config);
        return await AxiosInstance.post(this.URL + urlEndPoint,data, modifiedConfig)
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