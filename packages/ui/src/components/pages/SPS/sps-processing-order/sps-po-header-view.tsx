import { KnitHeaderInfoModel } from "@xpparel/shared-models";
import { Col, Collapse, Descriptions, Row, Space, Tag } from "antd";

interface SPSHeaderProps {
  procSerial: number;
  moInfo: KnitHeaderInfoModel;
}

const SPSHeaderInfo = (props: SPSHeaderProps) => {
  const style = props?.moInfo ? props.moInfo.style : null;
  const styleDesc = props?.moInfo ? props.moInfo.styleDesc : null;
  const buyerPo = props?.moInfo ? props.moInfo.buyerPo : null;
  const customerName = props?.moInfo ? props.moInfo.customerName : null;
  const moLines = props?.moInfo ? props.moInfo.moLines : null;
  const profitCentreName = props?.moInfo ? props.moInfo.profitCentreName : null;
  const productTypes = props?.moInfo ? props.moInfo.productTypes : null;
  const plantStyleRef = props?.moInfo ? props.moInfo.plantStyleRef : null;
  const productCodes = props?.moInfo ? props.moInfo.productCodes : null
  const delDates = props?.moInfo ? props.moInfo.delDates : null;
  const destinations = props?.moInfo ? props.moInfo.destinations : null;
  const fgColors = props?.moInfo ? props.moInfo.fgColors : null;
  const sizes = props?.moInfo ? props.moInfo.sizes : null;
  const moNumbers = props?.moInfo ? props.moInfo.moNumbers : null;
  const procOrdDesc = props?.moInfo ? props.moInfo.processingOrderDesc : null;


  const comma = (val?: string[] | null) => (val?.length ? val.join(', ') : 'N/A');

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
                      <Tag color="#13c2c2">Processing Serial: {props?.procSerial}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Processing order Desc : {procOrdDesc}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#13c2c2">Mo Numbers: {moNumbers ? comma(moNumbers) : ''}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Style: {style ? comma(style) : ''}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#13c2c2">Style Desc: {comma(styleDesc)}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Buyer Po: {comma(buyerPo)}</Tag>
                    </span>
                    {/* <span className="f-600">
                      <Tag color="#13c2c2">Customer Name: {comma(customerName)}</Tag>
                    </span> */}
                    <span className="f-600">
                      <Tag color="#13c2c2">
                        Product Types: {comma(productTypes)}
                      </Tag>
                    </span>
                  </Space>
                </Col>
              </Row> 
            ),
            children: (
              <Descriptions bordered style={{ fontWeight: 600 }}>
                <Descriptions.Item label="Customer Name">{comma(customerName)}</Descriptions.Item>
                {/* <Descriptions.Item label="Style">{comma(style)}</Descriptions.Item>
                <Descriptions.Item label="Style Desc">{comma(styleDesc)}</Descriptions.Item>
                <Descriptions.Item label="Buyer Po">{comma(buyerPo)}</Descriptions.Item>
                <Descriptions.Item label="Customer Name">{comma(customerName)}</Descriptions.Item>
                <Descriptions.Item label="Profit Centre">{comma(profitCentreName)}</Descriptions.Item> */}
                <Descriptions.Item label="Plant Style Ref">{comma(plantStyleRef)}</Descriptions.Item>
                <Descriptions.Item label="Mo Lines">{comma(moLines)}</Descriptions.Item>
                <Descriptions.Item label="Product Types">{comma(productTypes)}</Descriptions.Item>
                <Descriptions.Item label="Product Codes">{comma(productCodes)}</Descriptions.Item>
                <Descriptions.Item label="Delivery Dates">{comma(delDates)}</Descriptions.Item>
                <Descriptions.Item label="Destinations">{comma(destinations)}</Descriptions.Item>
                <Descriptions.Item label="FG Colors">{comma(fgColors)}</Descriptions.Item>
                <Descriptions.Item label="Sizes">{comma(sizes)}</Descriptions.Item>
              </Descriptions>
            ),
          },
        ]}
      />
    </>
  );
};

export default SPSHeaderInfo;
