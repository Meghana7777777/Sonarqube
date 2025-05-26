import { SizeInventoryModel } from "./size-inventory.model";


export class DocketInventoryModel {
   docNumber: string;
   components: string[];
   fgColor: string;
   sizeQtys:  SizeInventoryModel[];

   constructor() {
      
   }
}

