export class DocketPanelDetailsDto {
  poSerial: string;  // Purchase Order serial number
  docketNumber: string;  // Docket number for the order
  bundleNumber: string;  // Bundle number associated with the docket
  component: string;  // Component related to the docket
  cutNumber: string;  // Cut number assigned to the batch
  quantity: number;  // Quantity associated with the docket

  constructor(
    poSerial: string,
    docketNumber: string,
    bundleNumber: string,
    component: string,
    cutNumber: string,
    quantity: number
  ) {
    this.poSerial = poSerial;
    this.docketNumber = docketNumber;
    this.bundleNumber = bundleNumber;
    this.component = component;
    this.cutNumber = cutNumber;
    this.quantity = quantity;
  }
}
