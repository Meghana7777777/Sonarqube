import { MOHeaderInfoModel } from "@xpparel/shared-models";
import { Col, Collapse, Descriptions, Row, Space, Tag } from "antd";
import './order-summary.css';
interface MOHeaderProps {
  moInfo: MOHeaderInfoModel;
  moNum: string;
}
const ManufacturingOrderHeaderView = (props: MOHeaderProps) => {
  const {
    style,
    styleDesc,
    buyerPo,
    customerName,
    moLines,
    profitCentreName,
    productTypes,
    plantStyleRef,
    productCodes,
    destinations,
    delDates,
    fgColors,
    sizes,
    soNumbers  
  } = props.moInfo;
  const moNum = props.moNum;
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
                      <Tag color="#13c2c2">MO Num: {moNum}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Style: {style}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#13c2c2">Style Desc: {styleDesc}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Buyer Po: {buyerPo}</Tag>
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
                {/* <Descriptions.Item label="Style">{style}</Descriptions.Item>
                <Descriptions.Item label="Style Desc">{styleDesc}</Descriptions.Item> */}
                {/* <Descriptions.Item label="Buyer Po">{buyerPo}</Descriptions.Item> */}
                {/* <Descriptions.Item label="Customer Name">{customerName}</Descriptions.Item> */}
                {/* <Descriptions.Item label="Profit Centre">{profitCentreName}</Descriptions.Item> */}
                <Descriptions.Item label="Plant Style Ref">{plantStyleRef}</Descriptions.Item>
                <Descriptions.Item label="Mo Lines">
                  {moLines?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Product Types">
                  {productTypes?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Products">
                  {productCodes?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Destinations">
                  {destinations?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Dates">
                  {delDates?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="FG Colors">
                  {fgColors?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Sizes">
                  {sizes?.join(', ') || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="SO Numbers">
                  {soNumbers?.join(', ') || 'N/A'}
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