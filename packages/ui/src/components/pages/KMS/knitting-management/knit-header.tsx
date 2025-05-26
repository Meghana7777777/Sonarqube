import {
  KC_KnitRatioCreationRequest,
  KnitHeaderInfoModel,
} from "@xpparel/shared-models";
import { KnitOrderService } from "@xpparel/shared-services";
import { Col, Collapse, Descriptions, Row, Space, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface KnitHeaderProps {
  processSer: number;
}

const KnittingHeaderInfo = ({ processSer }: KnitHeaderProps) => {
  const [headerInfo, setHeaderInfo] = useState<KnitHeaderInfoModel | null>(null);
  const user = useAppSelector((state) => state.user.user.user);

  const knitOrderService = new KnitOrderService();

  const getKnitHeaderInfo = async (procesSerNum: number) => {
    try {
      const req = new KC_KnitRatioCreationRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId, procesSerNum, undefined, undefined, undefined, undefined, undefined
      );
      const res = await knitOrderService.getKnitHeaderInfoData(req);
      if (res.status) {
        setHeaderInfo(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch header info:", err);
    }
  };

  useEffect(() => {
    if (processSer) {
      getKnitHeaderInfo(processSer);
    }
  }, [processSer]);

  const comma = (val?: string[] | null) => (val?.length ? val.join(", ") : "N/A");

  const style = headerInfo?.style;
  const styleDesc = headerInfo?.styleDesc;
  const buyerPo = headerInfo?.buyerPo;
  const customerName = headerInfo?.customerName;
  const moLines = headerInfo?.moLines;
  const profitCentreName = headerInfo?.profitCentreName;
  const productTypes = headerInfo?.productTypes;
  const plantStyleRef = headerInfo?.plantStyleRef;
  const productCodes = headerInfo?.productCodes;
  const delDates = headerInfo?.delDates;
  const destinations = headerInfo?.destinations;
  const fgColors = headerInfo?.fgColors;
  const sizes = headerInfo?.sizes;
  const moNumbers =headerInfo?.moNumbers ;
  const procOrdDesc =headerInfo?.processingOrderDesc ;


  return (
    <>
      <Collapse
        size="small"
        className="header-collapse"
        items={[
          {
            key: "1",
            label: (
              <Row>
                <Col span={24}>
                  <Space wrap>
                  <span className="f-600">
                      <Tag color="#13c2c2">Processing Serial: {processSer}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Processing order Desc : {procOrdDesc}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#13c2c2">Mo Numbers: {moNumbers ? comma(moNumbers) : ''}</Tag>
                    </span>
                    <span className="f-600">
                      <Tag color="#fa8c16">Style: {comma(style)}</Tag>
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
                      <Tag color="#13c2c2">Product Types: {comma(productTypes)}</Tag>
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

export default KnittingHeaderInfo;
