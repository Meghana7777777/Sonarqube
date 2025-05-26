
export class ProcessTypeModel  {
    id?: number;
    processTypeName?: string;
    processTypeCode?: string;
    processTypeDescription?: string;
    remarks?: string
    imageName?: string;
    imagePath?: string;
    isActive?: boolean;
    

    constructor(

        id?: number,
        processTypeName?: string,
        processTypeCode?: string,
        processTypeDescription?: string,
        remarks?: string,
        imageName?: string,
        imagePath?: string,
        isActive?: boolean
       
    ) {
        this.id = id;
        this.processTypeName = processTypeName;
        this.processTypeCode = processTypeCode;
        this.processTypeDescription = processTypeDescription;
        this.remarks = remarks;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.isActive = isActive;
        
    }
}