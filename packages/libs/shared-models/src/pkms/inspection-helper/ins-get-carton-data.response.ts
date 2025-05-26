import { CartonDataDto, ConfigLeastChildDto, FileUploadDto, GlobalResponseObject, PackListDataDto, PKMSAttributesDto, PoDetailsDto } from "@xpparel/shared-models";

export class InsGetCartonsDataResponse extends GlobalResponseObject {
    cartonData?: CartonDataDto;
    packListData?: PackListDataDto;
    poDetails?: PoDetailsDto;
    attributes?: PKMSAttributesDto[];
    leastChildData?: ConfigLeastChildDto[];
    fileUpload?: FileUploadDto;
    constructor(status: boolean, errorCode: number, internalMessage: string, cartonData?: CartonDataDto,
        packListData?: PackListDataDto,
        poDetails?: PoDetailsDto,
        attributes?: PKMSAttributesDto[],
        leastChildData?: ConfigLeastChildDto[],
        fileUpload?: FileUploadDto,) {
        super(status, errorCode, internalMessage);

        this.cartonData = cartonData
        this.packListData = packListData
        this.poDetails = poDetails
        this.attributes = attributes
        this.leastChildData = leastChildData
        this.fileUpload = fileUpload
    }

}