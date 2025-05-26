import { DeleteFilled, ScanOutlined } from '@ant-design/icons';
import { CommonRequestAttrs, PalletBinStatusEnum, PalletIdRequest, PalletRollMappingRequest, PalletRollsModel, PalletRollsUIModel, PalletsCreationModel, RollIdRequest, RollInfoUIModel } from '@xpparel/shared-models';
import { LocationAllocationService, PalletsServices } from '@xpparel/shared-services';
import { Button, Card, Col, Descriptions, Empty, Form, Input, Popover, Row, Select, Space } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../common';
import './pallet-roll-un-mapping.css';

const { Option } = Select;
export const PalletRollUnMapping = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [palletsHead, setPalletHead] = useState<any[]>([]);
    const [palletInfo, setPalletInfo] = useState<PalletRollsUIModel>();
    const [form] = Form.useForm();
    const [debounceTimer, setDebounceTimer] = useState<any>();
    const palletInputRef = useRef(null);

    const locationService = new LocationAllocationService();
    const palletsService = new PalletsServices();
    useEffect(() => {
        getOccupiedPallets();
    }, []);


    const getOccupiedPallets = () => {
        const phIdReq: any = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        palletsService.getAllPalletsData(phIdReq).then((res => {
            if (res.status) {
                setPalletHead(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setPalletHead([]);
            }
        })).catch(error => {
            setPalletHead([]);
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const beforeScanPalletBarcode = (value: any) => {
        console.log(value)
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            const foundRecord = findRecordByBarcode(value);
            if (foundRecord) {
                getPalletMappingInfoWithRolls(foundRecord.id);
            } else {
                AlertMessages.getErrorMessage('Pallet Not Found');
                constructWarehouseRolls([]);
            }           
            // getPalletMappingInfoWithRolls(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const getPalletMappingInfoWithRolls = (palletId: string) => {
            // form.setFieldValue('existingPallet','');
            // form.setFieldValue('palletBarcode','');
            const phIdReq: any = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, Number(palletId), undefined);
        locationService.getPalletMappingInfoWithRolls(phIdReq).then((res => {
            if (res.status) {
                constructWarehouseRolls(res.data);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                constructWarehouseRolls([]);
            }
        })).catch(error => {
            constructWarehouseRolls([]);
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const constructWarehouseRolls = (palletInfo: PalletRollsModel[]) => {
        const pallets: PalletRollsUIModel[] = [];

        palletInfo.forEach((eachPallet, index) => {
            const palletObj = new PalletRollsUIModel();
            palletObj.palletCode = eachPallet.palletCode;
            palletObj.palletId = eachPallet.palletId;
            let noOfRolls = 0;
            const rollsInfo: RollInfoUIModel[] = [];

            eachPallet.rollsInfo.forEach(rollInfo => {
                noOfRolls++;
                const rollObj = new RollInfoUIModel();
                rollObj.barcode = rollInfo.barcode;
                rollObj.rollNumber = rollInfo.rollId;
                rollObj.phId = rollInfo.packListId;
                rollObj.id = rollInfo.rollId;
                rollObj.inputQuantity = rollInfo.originalQty;
                rollsInfo.push(rollObj);
            });

            palletObj.noOfRolls = noOfRolls;
            palletObj.rollsInfo = rollsInfo;
            pallets.push(palletObj);
        });
        setPalletInfo(pallets[0]);

    }

    const deAllocateRollsToPallet = (phIdReq: PalletRollMappingRequest) => {
        locationService.deAllocateRollsToPallet(phIdReq).then((res => {
            if (res.status) {
                getPalletMappingInfoWithRolls(String(phIdReq.palletId));
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                getPalletMappingInfoWithRolls(String(phIdReq.palletId));
            }
        })).catch(error => {
            getPalletMappingInfoWithRolls(String(phIdReq.palletId));
            AlertMessages.getErrorMessage(error.message)
        })
    }

    function findRecordByBarcode(barcode: string) {
        const record =palletsHead.find((item) => item.barcodeId === barcode);
        return record ? record : null; // Return the found record or null if not found
    }

    return (
        <Card title='Pallet Roll DeAllocation' size='small'>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 24, order: 1 }} lg={{ span: 14, order: 2 }} xl={{ span: 12, order: 2 }}>
                    <Form
                        form={form}
                        labelAlign="left"
                    >
                        <Row>
                            <Col xs={24} sm={24} md={11}>
                                <Form.Item name="existingPallet" label="Select Pallet">
                                    <Select
                                        placeholder="Select Pallets"
                                        showSearch
                                        allowClear
                                        onChange={getPalletMappingInfoWithRolls}
                                        optionFilterProp="label"           
                                    >
                                        {palletsHead?.map(palletObj => <Option value={palletObj.id} label={palletObj.code}>{palletObj.code}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={2} style={{ textAlign: 'center', marginBottom: '15px' }}>Or</Col>
                            {/* <Col xs={24} sm={24} md={2} style={{ textAlign: 'center' }}></Col> */}
                            <Col xs={24} sm={24} md={11}>
                                <Form.Item name="palletBarcode" label="Scan Pallet Barcode" rules={[{ required: false }]}>
                                    <Input placeholder="Scan Pallet Barcode" ref={palletInputRef} onChange={(e) => beforeScanPalletBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            {
                palletInfo && <Card className='un-mapping' title='Roll De-allocation'>


                    {palletInfo ? <Row justify='start'>{palletInfo.rollsInfo.map(rollObj => {
                        return <Col offset={1}>
                            <Row><Popover key={'p' + rollObj.rollNumber}
                                title={<Space><>Roll Barode: {rollObj.barcode} </><>Quantity: {rollObj.inputQuantity}</></Space>}
                            >
                                <Col span={24}>
                                    <div className='rollDiv' key={rollObj.rollNumber} id={rollObj.barcode} roll-barcode={rollObj.barcode} batch-no={rollObj.batchNumber} pack-no={rollObj.packListCode} >
                                        <br />
                                        <b>{rollObj.barcode}-{rollObj.inputQuantity}</b>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <Button type='primary' danger icon={<DeleteFilled />} onClick={() => deAllocateRollsToPallet(new PalletRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, Number(palletInfo.palletId), undefined, undefined, undefined, [new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollObj.id, rollObj.barcode)], undefined))}>Delete</Button>
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

export default PalletRollUnMapping