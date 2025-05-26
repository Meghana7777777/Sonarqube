

export class ItemDocSizeWiseQtysQueryResponse {
    size: string;
    total_qty: number;
    docket_number: string;
    item_code: string;
}


export class DOC_ElgPanelsForBundlingQueryResponse {
    psl_id: number;
    size: string;
    bundle_number: number;
    adb_roll_id: number;
    adb_number: number;
    under_doc_lay_number: number;
    panels: string; // csv of panel numbers
}

export class DOC_SizeWiseCutRepQytsQueryResponse {
    docket_number: string;
    size: string;
    cut_qty: number;
}


export class DOC_SizeWiseBundledQtysQueryResponse {
    docket_number: string;
    size: string;
    bundled_qty: number;
}