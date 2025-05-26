import { SupplierPoSummaryModel } from '@xpparel/shared-models';
import { Descriptions } from 'antd';
import React from 'react'
interface IPOSummery {
    poSummeryData: SupplierPoSummaryModel | undefined
}
export const POSummery = (props: IPOSummery) => {
    const { poSummeryData } = props;
    return (
        <div><Descriptions bordered>
            <Descriptions.Item label={<b>Supplier Code</b>}>{poSummeryData?.supplierCode}</Descriptions.Item>
            <Descriptions.Item label={<b>Supplier Name</b>}>{poSummeryData?.supplierName}</Descriptions.Item>
            {/* <Descriptions.Item label={<b>Total Qty</b>}>{poSummeryData?.supplierPoQty}</Descriptions.Item>
            <Descriptions.Item label={<b>Pack Lists Total Qty</b>}>{poSummeryData?.packingListCreatedQty}</Descriptions.Item>
            <Descriptions.Item label={<b>Remaining Qty</b>}>{poSummeryData?.remainingQty}</Descriptions.Item> */}
            <Descriptions.Item label={<b>No of Pack Lists</b>}>{poSummeryData?.noOfPackLists}</Descriptions.Item>
            <Descriptions.Item label={<b>GRN completed Pack Lists</b>}>{poSummeryData?.grnCompletedPackLists}</Descriptions.Item>
            {/* <Descriptions.Item label={<b>GRN Qty</b>}>{poSummeryData?.grnQty}</Descriptions.Item> */}
        </Descriptions></div>
    )
}

export default POSummery;