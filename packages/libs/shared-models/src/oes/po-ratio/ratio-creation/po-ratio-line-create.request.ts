import { PoRatioSizeModel } from "../po-ratio-size.model";

export class PoRatioLineCreateRequest {
   iCode: string;
   // productType: string;
   productName: string;
   fgColor: string;
   plies: number; // LOGICAL BUNDLE QTY FOR KNITTING
   maxlPies: number;
   sizeRatios: PoRatioSizeModel[];

   constructor(
      iCode: string,
      productName: string,
      fgColor: string,
      plies: number,
      maxlPies: number,
      sizeRatios: PoRatioSizeModel[]
   ) {
      this.iCode = iCode;
      this.productName = productName;
      this.fgColor = fgColor;
      this.plies = plies;
      this.maxlPies = maxlPies;
      this.sizeRatios = sizeRatios;
   }
}


// {
//    iCode: "",
//    productName: "Shirt",
//    plies: 80,
//    maxlPies: 70,
//    sizeRatios: [
//       {
//          size: "S",
//          ratio: 5
//       },
//       {
//          size: "L",
//          ratio: 5
//       }
//    ]
// }