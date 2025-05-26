import { ProcessTypeEnum } from "../../enum";

export class StyleModel {
    id?: number;
    styleName: string;
    styleCode: string;
    description: string;
    processType: ProcessTypeEnum;
    imageName?: string;
    imagePath?: string;
    isActive?: boolean;


    constructor(
        id: number,
        styleName: string,
        styleCode: string,
        description: string,
        processType: ProcessTypeEnum,
        imageName?: string,
        imagePath?: string,
        isActive?: boolean,

    ) {
        this.id = id;
        this.styleName = styleName;
        this.styleCode = styleCode;
        this.description = description;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.isActive = isActive;
        this.processType = processType
    }
}