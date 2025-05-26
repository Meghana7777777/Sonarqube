import { MOHeaderInfoModel, SOHeaderInfoModel } from "@xpparel/shared-models";
import { Col, Collapse, Descriptions, Row, Space, Tag } from "antd";
import './order-summary.css';
interface SOHeaderProps {
  soInfo: SOHeaderInfoModel
  soNum: string;
}
const ManufacturingOrderHeaderView = (props: SOHeaderProps) => {
  const {
    style,
    styleDesc,
    buyerPo,
    customerName,
    soLines,
    profitCentreName,
    productTypes,
    plantStyleRef,

  } = props.soInfo;
  const soNum = props.soNum
  return (
    <>
      <Collapse
        size="small"
        className="header-collapse"
        items={[
          {
            key: '1',
            label: (
              <Row>
                <Col span={24}>
                  <Space wrap>
                    <span className="f-600">
                      <Tag color="#13c2c2">SO Num: {soNum}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Style: {style}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#13c2c2">Style Desc: {styleDesc}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Buyer Po: {buyerPo?.join(', ') || 'N/A'}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#13c2c2">Customer Name: {customerName}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">
                        Product Types: {productTypes?.join(', ') || 'N/A'}
                      </Tag>
                    </span>
                  </Space>
                </Col>

              </Row>
            ),
            children: (
              <Descriptions bordered style={{ fontWeight: 600 }}>
                <Descriptions.Item label="Style">{style}</Descriptions.Item>
                <Descriptions.Item label="Style Desc">{styleDesc}</Descriptions.Item>
                <Descriptions.Item label="Buyer Po">{buyerPo}</Descriptions.Item>
                <Descriptions.Item label="Customer Name">{customerName}</Descriptions.Item>
                <Descriptions.Item label="Profit Centre">{profitCentreName}</Descriptions.Item>
                <Descriptions.Item label="Plant Style Ref">{plantStyleRef}</Descriptions.Item>
                <Descriptions.Item label="Mo Lines">
                  {soLines?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Product Types">
                  {productTypes?.join(', ') || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            ),
          },
        ]}
      />
    </>
  );


}
export default ManufacturingOrderHeaderView;