
export class PkShippingRequestModel {
    id: number; // PK of the d_set entity
    totalDSets: number[]; // PK of the d_set  //it gives the response of getdispatch sets
    quantity: number;
    totalItems: number; // The total items i.e shipping request items
    totalDSetItems: number; // SUM (The total items under each DSet) //total cuts
    totalDSetSubItems: number; // SUM (The total sub items under each DSet) //total bundles
    totalContainers: number; // SUM (The total containers under each DSet) //total bags
    status: any; // TODO
    aodPrintStatus: boolean;
    shippingInfo: PkShippingRequestShippingInfo;
    shippingReqAttrs: PkShippingReqesutAttrsModel;
}

export class PkShippingReqesutAttrsModel {
    moNumbers: string[];
}


export class PkShippingRequestShippingInfo {
    receiverId: number; // PK of the vendors in masters service
    remarks: string;
    expectedDispatchDate: string; // The date at which the truct leaves the mource
}