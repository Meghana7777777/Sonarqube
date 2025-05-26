export class ActualRollInfoModel {
  aShade:string;  
  aWidth:number;
  aLength:number;
  aGsm:number;

  constructor(
    aShade:string,
    aWidth:number,
    aLength:number,
    aGsm:number
  ) {
    this.aShade = aShade;
    this.aWidth=aWidth;
    this.aLength = aLength;
    this.aGsm = aGsm;
  }
}
