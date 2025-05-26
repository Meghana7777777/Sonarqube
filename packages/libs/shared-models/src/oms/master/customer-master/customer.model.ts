
export class CustomerModel {
    id?: number;
    customerName: string;
    customerCode: string;
    customerDescription: string;
    customerLocation?: string
    imageName?: string;
    imagePath?: string;
    isActive?: boolean;


    constructor(

        id: number,
        customerName: string,
        customerCode: string,
        customerDescription: string,
        customerLocation?: string,
        imageName?: string,
        imagePath?: string,
        isActive?: boolean

    ) {
        this.id = id;
        this.customerName = customerName;
        this.customerCode = customerCode;
        this.customerDescription = customerDescription;
        this.customerLocation = customerLocation;
        this.imageName = imageName;
        this.imagePath = imagePath;
        this.isActive = isActive;

    }
}



export class CustomerDropDownModel {
    id?: number;
    customerName: string;
    customerCode: string;
    constructor(
        customerName: string,
        customerCode: string,
        id?: number,
    ) {
        this.id = id;
        this.customerName = customerName;
        this.customerCode = customerCode;
    }
}