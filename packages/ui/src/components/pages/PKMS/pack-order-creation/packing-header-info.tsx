import { PackOrderCreationModel } from '@xpparel/shared-models';
import { Descriptions } from 'antd';

interface sewingOrderHeaderInfoProps {
    rawPackingOrderInfoModel: PackOrderCreationModel
}
export const PackOrderHeaderInfo = (props: sewingOrderHeaderInfoProps) => {
    const { rawPackingOrderInfoModel } = props;

    return (
        <>
            <br />
            <Descriptions size='small' title="" bordered>
                <Descriptions.Item label="Order No">{rawPackingOrderInfoModel?.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="Manufacturing Order No">{rawPackingOrderInfoModel?.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="Buyer Po No">{rawPackingOrderInfoModel?.buyerPo}</Descriptions.Item>
                <Descriptions.Item label="Product Types">{rawPackingOrderInfoModel?.productType}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{rawPackingOrderInfoModel?.quantity}</Descriptions.Item>
                <Descriptions.Item label="Style">{rawPackingOrderInfoModel?.style}</Descriptions.Item>
                <Descriptions.Item label="External System Ref No">{rawPackingOrderInfoModel?.externalSystemRefNo}</Descriptions.Item>
                <Descriptions.Item label="Customer Style">{rawPackingOrderInfoModel?.customerStyle}</Descriptions.Item>
                <Descriptions.Item label="Customer Style Ref">{rawPackingOrderInfoModel?.customerStyleRef}</Descriptions.Item>
                <Descriptions.Item label="Customer No">{rawPackingOrderInfoModel?.customerNo}</Descriptions.Item>
                <Descriptions.Item label="Customer Name">{rawPackingOrderInfoModel?.customerName}</Descriptions.Item>
                <Descriptions.Item label="Pack Method">{rawPackingOrderInfoModel?.packMethod}</Descriptions.Item>
            </Descriptions>
            <br />
        </>
    )
}

export default PackOrderHeaderInfo;