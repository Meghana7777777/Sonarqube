export class ProductsModel {
    
    id?: number;
    productName: string;
    productCode: string;
    description: string;
    imageName?: string;
    imagePath?: string;
    isActive?: boolean;


    constructor(
        id: number,
        productName: string,
        productCode: string,
        description: string,
        imageName?: string,
        imagePath?: string,
        isActive?: boolean,

    ) {
        this.id = id;
        this.productName = productName;
        this.productCode = productCode;
        this.description = description;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.isActive = isActive;
    }
}