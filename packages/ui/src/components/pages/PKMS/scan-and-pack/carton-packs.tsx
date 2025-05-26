import { CartonFillingModel } from '@xpparel/shared-models';
import { Badge, Card, Col, Descriptions, Row, Tag, Tooltip } from 'antd';

interface CartonPacksProps {
    activeCartonData: CartonFillingModel;
    activePoyBagTab: string
}
export const CartonPacks = (props: CartonPacksProps) => {
    const { activeCartonData,activePoyBagTab } = props;


    return (
        <>
            <Row justify='start'><Col span={24}>
                <Descriptions
                    bordered
                    size='small'
                    column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 1 }}
                >
                </Descriptions>
            </Col></Row>
            <Card
                title='Planned Carton'
                className='pkms'
            >
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }}>
                        <div>
                            <div className="side-heading-title">
                                TOTAL ITEMS
                            </div>
                            <div className="side-heading-value" style={{ color: "crimson" }}>
                                {activeCartonData.qty}
                            </div>
                        </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }}>
                        {/* <div className="cartoon-container">
                        </div> */}
                        <div className="cartoon-container-preview" style={{ marginTop: '5%' }}>
                            {activeCartonData?.plannedPolyBagDetails?.map((garment, index) => (
                                <Badge count={garment.count} offset={[5, 5]}><div key={index} className="folded-garment">
                                    <div>
                                        {garment?.sizeRatios?.map(rec => {
                                            return <Tooltip title={`Color: ${rec.fgColor}`}><Tag>{`${rec.size}-${rec.ratio}`}</Tag></Tooltip>
                                        })}
                                    </div>
                                </div></Badge>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Card>
            <Card title='Current Scanning Carton'
            className='pkms'
                extra={<></>}
            >
                <Row >
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }}>
                        <div>
                            <div className="side-heading-title">
                                TOTAL ITEMS
                            </div>
                            <div className="side-heading-value" style={{ color: "crimson" }}>
                                {activeCartonData.scannedQy}
                            </div>
                        </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }}>
                        {/* <div className="cartoon-container">
                            {4}
                        </div> */}
                        <div className="cartoon-container-preview" style={{ marginTop: '5%' }}>
                            {activeCartonData?.scannedPolyBagDetails?.map((garment, index) => (
                                <Badge count={garment.count} offset={[5, 5]}><div key={index} className="folded-garment" style={Number(activePoyBagTab) === garment.id ? { border: '2px solid yellow' } : { }}><div>
                                        {garment?.sizeRatios?.map(rec => {
                                            return <Tooltip title={`Color: ${rec.fgColor}`}><Tag className="scanned-garment">{`${rec.size}-${rec.ratio}`}</Tag></Tooltip>
                                        })}
                                    </div>
                                </div></Badge>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default CartonPacks