import { DeleteFilled, ScanOutlined } from '@ant-design/icons';
import { CommonRequestAttrs, BinIdRequest,  BinsCreationModel, RollIdRequest, RollInfoUIModel, PalletRollsUIModel, BinPalletsUIModel, PalletIdRequest } from '@xpparel/shared-models';
import { LocationAllocationService, BinsServices } from '@xpparel/shared-services';
import { Button, Card, Col, Descriptions, Empty, Form, Input, Popover, Row, Select, Space } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../common';
import './pallet-roll-un-mapping.css';

const { Option } = Select;
export const PalletBinUnMapping = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [binsHead, setBinHead] = useState<any[]>([]);
    const [binInfo, setBinInfo] = useState<any[]>();
    const [binBarcodeData, setBinBarcode] = useState<any>();
    // const [binBarcodeDataId, setBinBarcodeId] = useState<any>();
    const [form] = Form.useForm();
    const [debounceTimer, setDebounceTimer] = useState<any>();
    const palletInputRef = useRef(null);

    const locationService = new LocationAllocationService();
    const binsService = new BinsServices();
    useEffect(() => {
        getOccupiedBins();
    }, []);


    const getOccupiedBins = () => {
        const phIdReq: any = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        binsService.getAllBinData(phIdReq).then((res => {
            if (res.status) {
                setBinHead(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setBinHead([]);
            }
        })).catch(error => {
            setBinHead([]);
            AlertMessages.getErrorMessage(error.message)
        })
    }

    const beforeScanBinBarcode = (value: any) => {   
       
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            const foundRecord = findRecordByBarcode(String(value));
            if (foundRecord) {
                getBinMappingInfoWithPallets(String(value));
            } else {
                AlertMessages.getErrorMessage('Bin Not Found');
                constructWarehouseRolls([]);
            }
           
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const getBinMappingInfoWithPallets = (binBarcode: string) => {  
        form.setFieldValue('existingBin','');
        form.setFieldValue('palletBarcode','');
        const foundRecord = findRecordByBarcode(binBarcode);
        const binId = foundRecord.id;
        setBinBarcode(binBarcode);
        const phIdReq: any = new BinIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, Number(binId), binBarcode);
        locationService.getBinPalletsWithoutRolls(phIdReq).then((res => {           
            const palletInfo = []; 
            if (res.status) {
                res.data.forEach(bindata => {
                    bindata.binInfo.forEach(palletsData => {
                        palletsData.palletsInfo.forEach(eachPallet => {
                            palletInfo.push(eachPallet);
                        });
                    });
                });
               constructWarehouseRolls(palletInfo);
            //    AlertMessages.getErrorMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                constructWarehouseRolls([]);
            }
        })).catch(error => {
            constructWarehouseRolls([]);
            AlertMessages.getErrorMessage(error.message)
        })
    }

    const constructWarehouseRolls = (binInfo: BinPalletsUIModel[]) => {
        const pallets: BinPalletsUIModel[] = [];
        binInfo.forEach((eachBin, index) => {
            const binObj = new BinPalletsUIModel();
            binObj.palletCode = eachBin.palletCode;
            binObj.palletId = eachBin.palletId;
            pallets.push(binObj);
        });
        setBinInfo(pallets);

    }

    const deAllocateRollsToBin = (phIdReq: PalletIdRequest) => {
        locationService.unmapPalletFromABin(phIdReq).then((res => {            
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getBinMappingInfoWithPallets(String(binBarcodeData));
                
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                getBinMappingInfoWithPallets(String(binBarcodeData));
            }
        })).catch(error => {
            getBinMappingInfoWithPallets(String(binBarcodeData));
            AlertMessages.getErrorMessage(error.message)
        })
    }

    function findRecordByBarcode(barcode: string) {
        const record = binsHead.find((item) => item.barcodeId === barcode);
        return record ? record : null; // Return the found record or null if not found
    }

    function findRecordById(id: any) {
        const record = binsHead.find((item) => item.id === id);
        return record ? record : null; // Return the found record or null if not found
    }

    return (
        <Card>
            <Row justify="center">
                <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 24, order: 1 }} lg={{ span: 14, order: 2 }} xl={{ span: 12, order: 2 }}>
                    <Form
                        form={form}
                        labelAlign="left"
                    >
                        <Row>
                            <Col span={10}>
                                <Form.Item name="existingBin" label="Select Bin">
                                    <Select
                                        placeholder="Select Bins"                                       
                                        showSearch
                                        allowClear
                                        onChange={getBinMappingInfoWithPallets}
                                        optionFilterProp="label"                                    >
                                        {binsHead?.map(binObj => <Option value={binObj.barcodeId} label={binObj.code}>{binObj.code}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col offset={1}>Or</Col>
                            <Col offset={1}></Col>
                            <Col span={10}>
                                <Form.Item name="palletBarcode" label="Scan Bin Barcode" rules={[{ required: false }]}>
                                    <Input placeholder="Scan Bin Barcode" ref={palletInputRef} autoFocus onChange={(e) => beforeScanBinBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            {
                binInfo && <Card className='pallet-un-mapping' title={'Pallet De-allocation of '+ binBarcodeData} headStyle={{textAlign:'center'}}>


                    {binInfo ? <Row justify='start'>{binInfo.map(binObj => {
                        return <Col offset={1}>
                            <Row><Popover key={'p' + binObj.palletId}
                                title={<Space><>Pallet Barode: {binObj.palletCode} </></Space>}
                            >
                                <Col span={24}>
                                    <div className='pallet-rollDiv' key={binObj.palletId} id={binObj.palletId} roll-barcode={binObj.palletCode} >
                                        <br />
                                        <b>{binObj.palletCode}</b>
                                    </div>
                                </Col>
                                <Col span={21} offset={3}>
                                    <Button type='primary' danger icon={<DeleteFilled />} onClick={() => deAllocateRollsToBin(new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, Number(binObj.palletId), binObj.palletCode))}>Delete</Button>
                                </Col>
                            </Popover>
                            </Row>
                        </Col>

                    })}</Row> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                </Card>
            }
        </Card>
    )
}

export default PalletBinUnMapping