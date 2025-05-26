import { AxiosRequestConfig } from "axios";
import { AxiosInstance } from "../../../axios-instance";

export class ColorsService {
    URL = 'https://color-names.herokuapp.com/v1/';

    async getColorNames(): Promise<any> {
        return await this.axiosPostCall('', undefined, undefined);
    }


    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        console.log(this.URL + '' + urlEndPoint)
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