import { AxiosRequestConfig } from "axios";
import { PKMSCommonAxiosService } from "../pkms-common-axios-service";
import { CommonResponse } from "@xpparel/shared-models";

export class FileUploadService extends PKMSCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/file-upload/' + childUrl;
    }

    async fileUpload(req: FormData, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('fileUpload'), req, config);
    }
}