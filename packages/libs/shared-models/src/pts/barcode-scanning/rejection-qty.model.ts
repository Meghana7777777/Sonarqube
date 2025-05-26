

export class RejectionQtyModel {
    barcode: string; // required for input
    quantity: number; // qtys being rejected // required for input
    reasonId: number; // PK of the reason // required for input
    reasonCode: string; // unique reason code
    size: string; // optional 
}


// {
//     "reasonId": 5,
//     "quantity": 15
// },{
//     "reasonId": 6,
//     "quantity": 10
// }