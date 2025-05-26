import { RawOrderHeaderInfoModel } from "@xpparel/shared-models";
import { Col, Collapse, Descriptions, Row, Space, Tag } from "antd";
import { useEffect } from "react";
import './order-summary.css';
interface IRawOrderHeaderProps {
    orderHeader: RawOrderHeaderInfoModel
}
const ManufacturingOrderHeaderView = (props: IRawOrderHeaderProps) => {

    useEffect(() => {

    }, []);
    const { moNo, style, buyer, coNo, profitCenter } = props.orderHeader;

    return (<>
        <Collapse
            size="small"
            className="header-collapse"
            items={[{
                key: '1', label: <Row><Col span={24}><Space wrap><span className="f-600"><Tag color="#f50">Manufacturing Order No : {moNo}</Tag></span>
                    <span className="f-600"><Tag color="#0d9ab1">Style : {style}</Tag></span>
                    <span className="f-600"><Tag color="#f50">Customer Name : {buyer}</Tag></span>
                    <span className="f-600"><Tag color="#0d9ab1">Profit Center Name : {profitCenter}</Tag></span>
                    <span className="f-600"><Tag color="#f50">CO No: {coNo}</Tag></span>
                </Space></Col></Row>, children:
                    <Descriptions style={{ fontWeight: 600 }}>
                        <Descriptions.Item label="Manufacturing Order No">{moNo}</Descriptions.Item>
                        <Descriptions.Item label="Style">{style}</Descriptions.Item>
                        <Descriptions.Item label="Customer Name">{buyer}</Descriptions.Item>
                        <Descriptions.Item label="Profit Center Name">{profitCenter}</Descriptions.Item>
                        <Descriptions.Item label="CO No">{coNo}</Descriptions.Item>

                    </Descriptions>
            }]}
        />
    </>)

}
export default ManufacturingOrderHeaderView;