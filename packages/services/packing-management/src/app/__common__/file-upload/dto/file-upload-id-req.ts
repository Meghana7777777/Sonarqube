import { ApiProperty } from "@nestjs/swagger";
import { ReferenceFeaturesEnum } from "@xpparel/shared-models";

export class FileUploadIdReq{
    @ApiProperty()
    fileDescription: string;
    @ApiProperty()
    featuresRefNo: any;
    @ApiProperty()
    fileName: string;
    @ApiProperty()
    size: string;
    @ApiProperty()
    originalName: string;
    @ApiProperty()
    type: string;
    @ApiProperty()
    lastModified: string;
    @ApiProperty()
    lastModifiedDate: string;
    @ApiProperty()
    percent: string;
    @ApiProperty()
    filePath: string;
    @ApiProperty()
    featuresRefName: ReferenceFeaturesEnum;

}
