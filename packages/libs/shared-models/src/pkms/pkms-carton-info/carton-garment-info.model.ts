export class GarmentItem {
    size: string; // Size of the garment
    qty: number; // Quantity of garments
    cartons: number; // Number of cartons

    constructor(size: string, qty: number, cartons: number) {
        this.size = size;
        this.qty = qty;
        this.cartons = cartons;
    }
}

export class CartonGarmentInfo {
    floor: string; // Warehouse floor
    date: string; // Date
    buyer: string; // Buyer name
    poCountry: string; // Purchase Order country
    style: string; // Style of the garment
    color: string; // Color of the garment
    data: GarmentItem[]; // Array of garment items

    constructor(
        floor: string,
        date: string,
        buyer: string,
        poCountry: string,
        style: string,
        color: string,
        data: GarmentItem[]
    ) {
        this.floor = floor;
        this.date = date;
        this.buyer = buyer;
        this.poCountry = poCountry;
        this.style = style;
        this.color = color;
        this.data = data;
    }
}
