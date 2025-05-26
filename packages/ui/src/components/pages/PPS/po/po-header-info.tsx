import { RawOrderInfoModel } from '@xpparel/shared-models';
import { Descriptions } from 'antd';
import React from 'react';

interface IPOHeaderInfoProps {
    rawOrderInfoModel: RawOrderInfoModel
}
export const POHeaderInfo = (props: IPOHeaderInfoProps) => {
    const { rawOrderInfoModel } = props;

    const prodTypes = new Set<string>();
    rawOrderInfoModel?.orderLines?.forEach(r => r.isOriginal == false ? prodTypes.add(r.prodType) : undefined);
    return (
        <>
            <br />
            <Descriptions size='small' title="" bordered>
                <Descriptions.Item label="Order No">{rawOrderInfoModel?.orderNo}</Descriptions.Item>
                <Descriptions.Item label="Sale Order No">{rawOrderInfoModel?.orderNo}</Descriptions.Item>
                <Descriptions.Item label="Buyer Po No">{rawOrderInfoModel?.buyerPo}</Descriptions.Item>
                {/* <Descriptions.Item label="Product Types">{rawOrderInfoModel?.prodType}</Descriptions.Item> */}
                <Descriptions.Item label="Product Types">{Array.from(prodTypes)?.toString()}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{rawOrderInfoModel?.quantity}</Descriptions.Item>
                <Descriptions.Item label="Style">{rawOrderInfoModel?.style}</Descriptions.Item>
                <Descriptions.Item label="External System Ref No">{rawOrderInfoModel?.extSysRefNo}</Descriptions.Item>
                <Descriptions.Item label="Customer Style">{rawOrderInfoModel?.customerStyle}</Descriptions.Item>
                <Descriptions.Item label="Customer Style Ref">{rawOrderInfoModel?.customerStyleRef}</Descriptions.Item>
                <Descriptions.Item label="Customer No">{rawOrderInfoModel?.customerOrderNo}</Descriptions.Item>
                <Descriptions.Item label="Customer Name">{rawOrderInfoModel?.buyerName}</Descriptions.Item>
                <Descriptions.Item label="Pack Method">{rawOrderInfoModel?.packMethod}</Descriptions.Item>
            </Descriptions>
            <br />
        </>
    )
}

export default POHeaderInfo;