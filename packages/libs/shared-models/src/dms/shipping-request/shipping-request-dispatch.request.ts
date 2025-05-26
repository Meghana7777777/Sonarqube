export class ShippingDispatchRequest {
   unitCode: string;
   companyCode: string;
   date: string;

   constructor(unitCode: string, companyCode: string, date: string) {
      this.unitCode = unitCode;
      this.companyCode = companyCode;
      this.date = date;

   }
}


