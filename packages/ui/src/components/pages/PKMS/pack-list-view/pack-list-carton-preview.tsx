import { ClockCircleOutlined } from "@ant-design/icons";
import { PackListCreateModel } from "@xpparel/shared-models";
import { Badge, Button, Card, Col, Row, Tag, Tooltip } from "antd";
interface IPackListCartonPreview {
    activePkListData: PackListCreateModel
}
export const PackListCartonPreview = (props: IPackListCartonPreview) => {
    const { activePkListData } = props;
{/* <FolderViewOutlined /> */}
    return <div className="pkms">
        <Row>
            {activePkListData?.cartons?.map(rec => <Col style={{ textAlign: 'center', marginLeft: '5px' }}>
                <Row style={{ margin: 0 }}>
                    <Col>
                        <Tooltip title={`Poly Bags Per Carton`} placement="topLeft">

                        </Tooltip>
                    </Col>
                    <Col>
                        <Tooltip title={`FG Qty : ${rec?.qty}`} color={'cyan'} key={'cyan'}>
                            <Button
                                size='small'
                                type="primary"
                                style={{ width: '100%' }}
                            >{rec?.qty ? rec.qty : 0}</Button>
                        </Tooltip>
                    </Col>
                </Row>
                <div className="cartoon-container-preview" style={{ marginTop: '5%' }}>
                    {rec?.polyBags?.map((garment, index) => (

                        <Badge count={garment.count} offset={[5, 5]}><div key={index} className="folded-garment">

                            <div>
                                {garment?.sizeRatios?.map(rec => {
                                    return <Tooltip title={`Color: ${rec.fgColor}`}><Tag>{`${rec.size}-${rec.ratio}`}</Tag></Tooltip>
                                })}
                            </div>
                        </div></Badge>
                    ))}
                </div>
                <b>{rec.itemCode}</b><Tag color="#f50">{`#${rec.count}`}</Tag>
            </Col>)}
        </Row>

    </div>;
};

export default PackListCartonPreview;
