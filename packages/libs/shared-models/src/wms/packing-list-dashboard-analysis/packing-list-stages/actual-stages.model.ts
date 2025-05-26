
export class ActualStages {
    status:string;//ph-vehicle foor GRN ph iem lines
    stage:string;//GRN SECUIRTY_CHECKIN , VEHICLE UNLOADING , GRN , SECUIRTY_CHECKOUT, INSPECTION 
    remarks:string;
    
    constructor(
        status:string,
        stage:string,
        remarks:string)
        {
            this.remarks=remarks
            this.stage=stage;
            this.status=status;
    }
  }