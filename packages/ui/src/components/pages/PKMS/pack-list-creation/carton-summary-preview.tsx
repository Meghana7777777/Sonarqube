import { CartonPrototypeModel } from "@xpparel/shared-models";
import { Button, Card, Col, Form, InputNumber, Row, Tag, Tooltip } from "antd";
interface ICartonSummaryPreview {
  cartonMap: Map<string, CartonPrototypeModel>;
  polyBagsPerCartonOnChange: (uniqueKey: string, polyBagCount: number) => void
  polyBagsCountOnChange: (uniqueKey: string, polyBagCount: number, boxMapId: number) => void;
  cartonCountOnChange: (uniqueKey: string, cartonCount: number) => void;
}
export const CartonSummaryPreview = (props: ICartonSummaryPreview) => {
  const { cartonMap, polyBagsPerCartonOnChange, polyBagsCountOnChange, cartonCountOnChange } = props;


  // console.log(cartonMap, "cartonMap")

  return <Card title='Cartons Fill Preview' className="pkms">
    <Row>
      {Array.from(cartonMap.values())?.map(rec => <Col style={{ textAlign: 'center', marginLeft: '5px' }}>
        <Row style={{ margin: 0 }}>
          <Col>
            <Tooltip title={`Poly Bags Per Carton`} placement="topLeft" key={rec.cartonUniqueKey + 'toolTip'}>
              <Form.Item
                name={"polyBagsPerCrtn" + rec.cartonUniqueKey}
                rules={[{ required: true, message: "Poly Bags Per Carton" }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber min={rec?.polyBags?.length ? rec?.polyBags?.length : 1} width={'50%'} placeholder="Poly Bags Per Carton" onChange={(val) => {
                  polyBagsPerCartonOnChange(rec.cartonUniqueKey, val)
                }} disabled={rec.polyBags.length > 1}/>
              </Form.Item>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title={`FG Qty Per One Carton Box: ${cartonMap.get(rec.cartonUniqueKey).qty}`} color={'cyan'} key={'cyan'}>
              <Button
                size='small'
                type="dashed"
                style={{ width: '100%' }}
              >{cartonMap.get(rec.cartonUniqueKey)?.qty ? cartonMap.get(rec.cartonUniqueKey).qty : 0}</Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title={`FG Qty Per ${rec.count} Carton Box: ${cartonMap.get(rec.cartonUniqueKey).qty * rec.count}`} color={'cyan'} key={'cyan'}>
              <Button
                size='small'
                type="dashed"
                style={{ width: '100%' }}
              >{cartonMap.get(rec.cartonUniqueKey)?.qty ? cartonMap.get(rec.cartonUniqueKey).qty * rec.count : 0}</Button>
            </Tooltip>
          </Col>
        </Row>
        <div className="cartoon-container-preview" style={{ marginTop: '5%' }}>
          {rec?.polyBags?.map((garment, index) => (
            <div key={index} className="folded-garment">
              <div>
                {garment?.sizeRatios?.map(rec => {
                  return <Tooltip title={`Color: ${rec.fgColor}`}><Tag>{`${rec.size}-${rec.ratio}`}</Tag></Tooltip>
                })}
              </div>
              {rec?.polyBags.length > 1 && <Form.Item
                name={"polyBagsPerCrtn" + rec.cartonUniqueKey + '#' + garment.boxMapId}
                rules={[{ required: true, message: "Poly Bags Per Carton" }]}
                style={{ marginBottom: 0 }}
              ><InputNumber min={1} width={'30%'} placeholder="Poly Bags Count" onChange={(val) => {
                polyBagsCountOnChange(rec.cartonUniqueKey, val, garment.boxMapId)
              }} disabled={!garment?.sizeRatios?.length || garment?.sizeRatios?.length === 0} /></Form.Item>}
            </div>
          ))}
        </div>
        <Form.Item
          name={"cartonsCount" + rec.cartonUniqueKey}
          rules={[{ required: true, message: "Please Enter Carton Count" }]}
          style={{ marginBottom: 0 }}
        ><InputNumber min={1} width={'30%'} placeholder="Carton Count" onChange={(val) => {
          cartonCountOnChange(rec.cartonUniqueKey, val)
        }} /></Form.Item>
        <b>{rec.itemCode}</b>
      </Col>)}
    </Row>

  </Card>;
};

export default CartonSummaryPreview;
