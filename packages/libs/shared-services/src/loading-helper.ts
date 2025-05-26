

export function assignAndGetLoaingReqStatusForHeaders(dontNeedLoading: boolean, headers: any) {
    if(dontNeedLoading) {
        if(!headers) {
            headers = {};
        }
        headers['loadStatus'] = true
    }
    return headers;
}