
import { AxiosRequestConfig } from 'axios';
import { PackingDataFeedCommonAxiosService } from '../packing-data-feed-common-axios-service';
import { CommonRequestAttrs, CommonResponse } from '@xpparel/shared-models';


export class PackingDataFeedExternalService extends PackingDataFeedCommonAxiosService {

    private getURLwithMainEndPoint(childUrl: string) {
        return '/centric-orders/' + childUrl;
    }

    async getPoNumber(config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getPoNumber'), undefined, config);
    }

    async getPackingDataFeed(req: CommonRequestAttrs, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getCentricorderDataForScanAndPack'), req, config);
    }

}






export class GetPackingDataFeedReponseDto {
    id: number
    po_number: string
    po_date: string
    shipment: string
    season: string
    port_of_export: string
    port_of_entry: string
    refrence: string
    payment_term_description: string
    special_instructions: string
    division: string
    incoterm: string
    ship_to_add: string
    manufacture: string
    buyer_address: string
    Phon: string
    Fa: string
    po_type: string
    po_line: string
    material: string
    style: string
    ppk_upc: string
    compt_material: string
    ratio: string
    color: string
    gender: string
    short_description: string
    pack_method: string
    vendor_booking_flag: string
    total_quantity: string
    size: string
    upc: string
    label: string
    quantity: string
    unit_price: string
    exfactory: string
    export: string
    delivery_date: string
    retial_price: string
    created_at: string
    created_user: string
    updated_at: string
    updated_user: string
    version_flag: number
    is_active: boolean
    status: string
    currency: string
    each_per_carton: string
}