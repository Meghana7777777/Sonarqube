import { CommonResponse } from '@xpparel/backend-utils';
import { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from '../axios-instance';

export class GenericCommonAxiosService {
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        return await AxiosInstance.post(urlEndPoint, data, config)
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

    async gettingOptions(url: string, req: any): Promise<CommonResponse> {
        return this.axiosPostCall(url, req)
    }

}
 