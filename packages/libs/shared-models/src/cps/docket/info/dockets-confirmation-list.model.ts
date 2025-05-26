export class DocketsConfirmationListModel {
    productName: string;
    totalDockets: number;
    confirmedDockets: string[];
    confirmationInProgDockets: string[];
    yetToBeConfirmedDockets: string[];
  
    constructor(
      productName: string,
      totalDockets: number,
      confirmedDockets: string[],
      confirmationInProgDockets: string[],
      yetToBeConfirmedDockets: string[]
    ) {
      this.productName = productName;
      this.totalDockets = totalDockets;
      this.confirmedDockets = confirmedDockets;
      this.confirmationInProgDockets = confirmationInProgDockets;
      this.yetToBeConfirmedDockets = yetToBeConfirmedDockets;
    }
  }
  