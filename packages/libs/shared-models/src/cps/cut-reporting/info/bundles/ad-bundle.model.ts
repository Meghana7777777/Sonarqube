
export class AdBundleModel {
    adbId: number; // The adb shade id
    shade: string;
    underLayBundleNo: number;
    quantity: number;
    color: string;
    size: string;
    panelStart: number;
    panelEnd: number;
    barcode: string;
    component: string;
  
    constructor(
      adbId: number,
      shade: string,
      underLayBundleNo: number,
      quantity: number,
      color: string,
      size: string,
      panelStart: number,
      panelEnd: number,
      barcode: string,
      component: string
    ) {
      this.adbId = adbId;
      this.shade = shade;
      this.underLayBundleNo = underLayBundleNo;
      this.quantity = quantity;
      this.color = color;
      this.size = size;
      this.panelStart = panelStart;
      this.panelEnd = panelEnd;
      this.barcode = barcode;
      this.component = component;
    }
  }