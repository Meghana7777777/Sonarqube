import { SewingCreationOptionsModel } from '@xpparel/shared-models';
import { Descriptions } from 'antd';

interface sewingOrderHeaderInfoProps {
    rawSewingOrderInfoModel: SewingCreationOptionsModel
}
export const SewingOrderHeaderInfo = (props: sewingOrderHeaderInfoProps) => {
    const { rawSewingOrderInfoModel } = props;

    return (
        <>
            <br />
            <Descriptions size='small' title="" bordered>
                <Descriptions.Item label="Order No">{rawSewingOrderInfoModel?.orderNumber}</Descriptions.Item>
                {/* <Descriptions.Item label="Sale Order No">{rawSewingOrderInfoModel?.orderid}</Descriptions.Item> */}
                <Descriptions.Item label="Buyer Po No">{rawSewingOrderInfoModel?.buyerPo}</Descriptions.Item>
                <Descriptions.Item label="Product Types">{rawSewingOrderInfoModel?.productType}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{rawSewingOrderInfoModel?.quantity}</Descriptions.Item>
                <Descriptions.Item label="Style">{rawSewingOrderInfoModel?.style}</Descriptions.Item>
                <Descriptions.Item label="External System Ref No">{rawSewingOrderInfoModel?.externalSystemRefNo}</Descriptions.Item>
                <Descriptions.Item label="Customer Style">{rawSewingOrderInfoModel?.customerStyle}</Descriptions.Item>
                <Descriptions.Item label="Customer Style Ref">{rawSewingOrderInfoModel?.customerStyleRef}</Descriptions.Item>
                <Descriptions.Item label="Customer No">{rawSewingOrderInfoModel?.customerNo}</Descriptions.Item>
                <Descriptions.Item label="Customer Name">{rawSewingOrderInfoModel?.customerName}</Descriptions.Item>
                <Descriptions.Item label="Pack Method">{rawSewingOrderInfoModel?.packMethod}</Descriptions.Item>
            </Descriptions>
            <br />
        </>
    )
}

export default SewingOrderHeaderInfo;