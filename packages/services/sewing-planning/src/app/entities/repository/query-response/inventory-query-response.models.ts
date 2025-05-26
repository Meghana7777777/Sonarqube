

export class JobBundlesNotMovedToInvQueryResponse {
    psl_id: number;
    bundle_number: string;
    qty: number;
    moved_to_inv: boolean;
}


export class JobBundlesPslQtysQueryResponse {
    psl_id: number;
    total_bundles: number;
    total_qty: number;
}