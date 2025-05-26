import { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from '../axios-instance';
import { configVariables } from '../config';

export class UserManagementCommonAxiosService {
     URL = configVariables.APP_IAM_SERVER_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        console.log(this.URL)
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