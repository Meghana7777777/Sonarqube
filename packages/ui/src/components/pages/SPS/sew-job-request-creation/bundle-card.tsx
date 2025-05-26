import React from 'react';
import { Card, Col, Divider, Flex, Row, Space, Tag } from 'antd';
import { PanelReqForJobModel } from '@xpparel/shared-models';

interface IProps {
    sewJobBundleInfo: PanelReqForJobModel
}



const BundleCard: React.FC<IProps> = (props: IProps) => {
    let iColor= true;
    return (
        <Row gutter={[16, 16]}>
            {props.sewJobBundleInfo.productColorSizeCompWiseInfo.map((product, index) => (
                <Col span={12} key={index}>
                    <Card title={ <Flex  justify={'space-between'} align={'flex-start'}>
                        <div>Product Name: <Tag color="#f50">{product.productName}</Tag></div>
                        <div>Color: <Tag color="#2db7f5">{product.fgColor}</Tag></div>
                        <div>Size: <Tag color="#87d068">{product.size}</Tag></div>
                    </Flex>} bordered={true}>
                       {
                        
                        product.componentWiseBundleInfo.map(c=> {
                            iColor= !iColor;
                            return <>
                                <Divider orientation="left"  style={{margin:'2px 0', borderColor: '#7cb305'}}> Component: {c.component}</Divider>
                                {c.bundleInfo.map(b=> {
                                    return <Tag color={`${iColor ? "#108ee9" : "#cb0dce"}`}>{b.brcd} | {b.rQty}</Tag>
                                })}
                            </>
                        })
                       }
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default BundleCard;
