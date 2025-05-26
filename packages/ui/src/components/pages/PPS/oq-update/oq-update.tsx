import { OrderTypeEnum, PoOqUpdateModel, PoSerialRequest, PoSummaryModel } from '@xpparel/shared-models';
import { Button, Card, Col, Descriptions, InputNumber, Row, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { PoLinesTable } from './po-line-table';
import { PoqService } from '@xpparel/shared-services';
import { AlertMessages } from '../../../common';
import { useAppSelector } from 'packages/ui/src/common';
import OqViewGrid from './oq-view-grid';
import { RedoOutlined } from '@ant-design/icons';
interface IOQUpdateProps {
    selectedRecord: PoSummaryModel;
    onStepChange: (step: number, selectedRecord: PoSummaryModel) => void
}
export const OQUpdate = (props: IOQUpdateProps) => {
    const { selectedRecord, onStepChange } = props;
    console.log(selectedRecord,'selected record')
    const [extraShipment, setExtraShipment] = useState(0);
    const [sample, setSample] = useState(0);
    const [cuttingWastage, setCuttingWastage] = useState(0);
    const [isSavedRecord, setIsSavedRecord] = useState(false);
    const [remarks, setRemarks] = useState<string>(undefined);
    const [oqData, setOqData] = useState<PoOqUpdateModel>(undefined);
    const poqService = new PoqService();
    const user = useAppSelector((state) => state.user.user.user);

    useEffect(() => {
        if (props.selectedRecord) {
            getPoAdditionalQtyInfo(props.selectedRecord.poSerial);
        }
    }, []);
    const getPoAdditionalQtyInfo = (poSerial: number) => {
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, undefined, true, true);
        poqService.getPoAdditionalQtyInfo(req)
            .then((res) => {
                if (res.status) {
                    setOqData(res.data[0]);
                    setIsSavedRecord(isAlreadySaved(res.data[0]));
                } else {
                    setOqData(undefined);
                    setIsSavedRecord(false);
                    // AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }
    const onChangeExtraShipment = (value:number) => {
        setExtraShipment(Math.ceil(value));
    };

    const onChangeSample = (value:number) => {
        setSample(Math.ceil(value));
    };

    const onChangeCuttingWastage = (value:number) => {
        setCuttingWastage(Math.ceil(value));
    };

    const isAlreadySaved = (poOqData: PoOqUpdateModel) => {
        if (poOqData) {
            setExtraShipment(poOqData.oqLevelSelections.find(rec => rec.oqType === OrderTypeEnum.EXTRA_SHIPMENT).perc);
            setSample(poOqData.oqLevelSelections.find(rec => rec.oqType === OrderTypeEnum.SAMPLE).perc);
            setCuttingWastage(poOqData.oqLevelSelections.find(rec => rec.oqType === OrderTypeEnum.CUT_WASTAGE).perc);
            setRemarks(poOqData.remarks);
            return true;
        }
        return false
    }
    const deleteOq = (poSerial: number) => {
        const reqModel: PoSerialRequest = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, undefined, false, false);
        poqService.deleteAdditionalQtyUpdate(reqModel)
            .then((res) => {
                if (res.status) {
                    setOqData(undefined);
                    setIsSavedRecord(false);
                    setExtraShipment(0);
                    setSample(0);
                    setCuttingWastage(0);
                    setRemarks(undefined);
                    AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }
    return (
        <Card title='Order Quantity Update' size='small'extra={ <Tooltip title="Reload">
            <Button disabled={!props.selectedRecord.poSerial} type='primary' 
            icon={<RedoOutlined style={{ fontSize: '20px' }} />} 
            onClick={() =>  getPoAdditionalQtyInfo(props.selectedRecord.poSerial)} /></Tooltip>}>
            <Descriptions
                // title="Cut Order Details" 
                bordered>
                <Descriptions.Item label="Cut Order Desc">{selectedRecord.poDesc}</Descriptions.Item>
                <Descriptions.Item label="Cut Order Serial">{selectedRecord.poSerial}</Descriptions.Item>
                <Descriptions.Item label="Product Types">{selectedRecord.productType}</Descriptions.Item>
            </Descriptions>
            <br />
            <Row gutter={16} align='middle'>
                <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Extra Shipment %:</label>
                        <InputNumber min={0} max={100} value={extraShipment} onChange={onChangeExtraShipment} style={{ width: '50%' }} disabled={isSavedRecord} />
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Sample %:</label>
                        <InputNumber min={0} max={100} value={sample} onChange={onChangeSample} style={{ width: '50%' }} disabled={isSavedRecord} />
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Cutting Wastage %:</label>
                        <InputNumber min={0} max={100} value={cuttingWastage} onChange={onChangeCuttingWastage} style={{ width: '50%' }} disabled={isSavedRecord} />
                    </div>
                </Col>
            </Row>
            <br />
            {isSavedRecord ? <OqViewGrid deleteRecord={deleteOq} poInfo={selectedRecord} poOqData={oqData} /> :
                <PoLinesTable po={selectedRecord} remarks={remarks} cuttingWastage={cuttingWastage} sample={sample} extraShipment={extraShipment} isSavedRecord={isSavedRecord} onStepChange={onStepChange} />
            }
        </Card>
    )
}

export default OQUpdate