import { ScanOutlined } from '@ant-design/icons';
import { GrnRollInfoModel, PackingListInfoModel, PhBatchLotRollRequest, RollIdRequest, RollIssueQtyRequest, WhMatReqLineItemStatusEnum } from '@xpparel/shared-models';
import { DocketMaterialServices, InspectionReportsService, LocationAllocationService, PackingListService } from '@xpparel/shared-services';
import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { useEffect, useRef, useState } from 'react';
import { AlertMessages } from '../../../common';
import { useAppSelector } from 'packages/ui/src/common';
import { ScxButton, ScxColumn, ScxRow } from 'packages/ui/src/schemax-component-lib';

const { Option } = Select;

export const RollQtyIssuance = () => {
    // State variables
    const user = useAppSelector((state) => state.user.user.user);
    const [scannedRollInfo, setScannedRollInfo] = useState<GrnRollInfoModel>();
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [barcodevalue, setBarcodeValSelect] = useState<string>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const rollInputRef = useRef(null);
    const packingService = new PackingListService();
    const locationService = new LocationAllocationService();
    const reportService = new InspectionReportsService();
    const docketmaterialService = new DocketMaterialServices();
    const [rollData, setRollInfoData] = useState<any>([]);
    const [packListData, setPackListData] = useState<any>([]);
    const [packListId, setPackListCode] = useState<any>();
    const [error, setError] = useState('');
    const [buttonStatus, setButtonStatus] = useState<boolean>(true);
    const [showWarningText, setShowWarningText] = useState<boolean>(false);
    // Fetching pack list data on component mount
    useEffect(() => {
        getPacklistData();
    }, []);

    // Function to fetch pack list data
    const getPacklistData = () => {
        reportService.packListNumbersDropDown().then((res) => {
            if (res.status) {
                setPackListData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    };



    // Function to fetch roll data based on selected pack list
    const getRollData = (phid: number) => {
        const phIdReq = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phid, undefined, undefined, undefined, undefined,undefined);
        packingService.getPackListInfo(phIdReq).then((res) => {
            if (res.status) {
                const rollInfo = [];
                res.data.forEach(batch => {
                    batch.batchInfo.forEach(batchItem => {
                        batchItem.lotInfo.forEach(lot => {
                            lot.rollInfo.forEach(roll => {
                                rollInfo.push({
                                    rollNumber: roll.externalRollNumber,
                                    barcode: roll.barcode,
                                    lotNumber: roll.lotNumber
                                });
                            });
                        });
                    });
                });
                setRollInfoData(rollInfo);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    };

    const getRollAllocationStatus = (rollNumber: number, rollBarcode: string) => {
        const req = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollNumber, rollBarcode);
        docketmaterialService.getRollAllocationstatus(req)
            .then(r => {
                if (r.status) {
                    const rollAllocInfo = r.data[0];
                    if (rollAllocInfo) {
                        if (rollAllocInfo.rollCurrentStatus.includes(WhMatReqLineItemStatusEnum.OPEN) || rollAllocInfo.rollCurrentStatus.includes(WhMatReqLineItemStatusEnum.PREPARING_MATERIAL)) {
                            setButtonStatus(true);
                            setShowWarningText(true);
                        } else {
                            setButtonStatus(false);
                        }
                    } else {
                        setButtonStatus(false);
                    }
                    return;
                } else {
                    AlertMessages.getErrorMessage('Unable to validate roll for alloction check');
                    setButtonStatus(true);
                }
            }).catch(err => {
                AlertMessages.getErrorMessage('Unable to validate roll for alloction check.' + err.message);
                setButtonStatus(true);
            });
    }

    // Function to handle barcode scanning
    const scanBarcode = (fullBarcode: string) => {
        formRef.setFieldValue('selectPackList', '');
        formRef.setFieldValue('selectRoll', '');
        setButtonStatus(true);
        setBarcodeValSelect('');
        setPackListCode('');
        setRollInfoData(null);
        setShowWarningText(false);
        const prefix = fullBarcode.charAt(0);
        const barcode = Number(fullBarcode.substring(1));
        setBarcodeVal(fullBarcode);
        if (prefix === 'R') {
            const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, barcode, fullBarcode);
            packingService.getGrnRollInfoForRollIdAtIssuance(rollIdReq).then((res => {
                if (res.status) {
                    form.resetFields();
                    formRef.setFieldValue('remarks', '')
                    formRef.setFieldValue('issuingQty', '')
                    setScannedRollInfo(res.data);
                    if (rollInputRef.current) {
                        rollInputRef.current.focus();
                    }
                    getRollAllocationStatus(res.data?.rollInfo?.rollNumber, res.data?.rollInfo?.barcode);
                } else {
                    form.resetFields();
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })).catch(error => {
                form.resetFields();
                AlertMessages.getErrorMessage(error.message)
            })
        } else {
            AlertMessages.getErrorMessage('Please Enter Valid Barcode');
            form.resetFields();
        }
    };

    // Function to handle manual barcode input
    const manualBarcode = (val: string) => {
        formRef.setFieldValue('selectPackList', '');
        formRef.setFieldValue('selectRoll', '');
        setBarcodeValSelect('');
        setPackListCode('');
        setManualBarcodeVal(val.trim());
        scanBarcode(val.trim());
    };

    // Function to handle submission
    const onFinish = () => {
        setScannedRollInfo(undefined);
        scanBarcode(barcodevalue.trim());
    };

    // Event handler for pack list selection
    const handleSelectChange = (value) => {
        formRef.setFieldValue('selectRoll', '');
        setBarcodeValSelect('');
        setPackListCode(value);
        getRollData(value); // Fetch roll data when pack list is selected
    };

    const restForms = () => {
        if (rollInputRef.current) {
            rollInputRef.current.focus();
        }
        form.resetFields();
        formRef.resetFields();
        setScannedRollInfo(undefined);
        setBarcodeVal('');
        setManualBarcodeVal('');
    }

    // Event handler for roll selection
    const handleSelectChangeBarcode = (value) => {
        setBarcodeValSelect(value);
    };

    const issueRollQuantity = async () => {
        try {
            const issueQty = Number(formRef.getFieldValue('issuingQty'));
            if (Number(formRef.getFieldValue('issuingQty')) > 0) {
                const toIssueBal = Number(scannedRollInfo.rollInfo.inputQuantity) - Number(scannedRollInfo.rollInfo.issuedQuantity);
                if (issueQty > Number(toIssueBal.toFixed(2))) {
                    AlertMessages.getErrorMessage('You are trying to issue more than available qty');
                    return;
                }

                const phIdReq: RollIssueQtyRequest = new RollIssueQtyRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, scannedRollInfo.rollInfo.id, Number(formRef.getFieldValue('issuingQty')), formRef.getFieldValue('remarks'), true);
                setScannedRollInfo(undefined);
                locationService.issueRollQuantity(phIdReq).then((res => {
                    if (res.status) {
                        formRef.setFieldValue('issuingQty', '');
                        formRef.setFieldValue('remarks', '');
                        AlertMessages.getSuccessMessage(res.internalMessage);
                        // scanBarcode(barcodeVal);
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage);
                        // scanBarcode(barcodeVal);
                    }
                })).catch(error => {
                    AlertMessages.getErrorMessage(error.message)
                    // scanBarcode(barcodeVal);
                })
            } else {
                AlertMessages.getErrorMessage('Issued Quantity should be more than 0.');
            }

        } catch (error) {
            AlertMessages.getErrorMessage(error.errorFields[0].errors[0]);
            console.log(error)
        }

    }



    return (
        <Card title='Quantity Issuance' size='small'>
            <Row justify="center">
                <Form form={form}>
                    <Form.Item name="rollBarcode" label="Scan Object Barcode " rules={[{ required: false }]}>
                        <Space>
                            <Col>
                                <Input placeholder="Scan Object Barcode" ref={rollInputRef} autoFocus onChange={(e) => scanBarcode(e.target.value)} prefix={<ScanOutlined />} />
                            </Col>
                            <Col>
                                <Search placeholder="Type Object Barcode" onSearch={manualBarcode} enterButton />
                            </Col>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
            <Row justify="center"><Divider>Or</Divider></Row>
            <Row justify="center">
                <Form form={formRef}>
                    <ScxRow justify='center'>
                        <Space>
                            <ScxColumn>
                                <Form.Item label='Select PackList' name='selectPackList'>
                                    <Select
                                        showSearch
                                        allowClear
                                        onChange={handleSelectChange}
                                        value={packListId}
                                        placeholder="Select PackList No"
                                        style={{ width: '200px' }}
                                        optionFilterProp="label"
                                    >
                                        {packListData?.map((data) => (
                                            <Option key={data.Id} value={data.Id} label={data.packListNo}>
                                                {data.packListNo}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ScxColumn>
                            <ScxColumn>
                                <Form.Item label='Select Roll' name='selectRoll'>
                                    <Select
                                        showSearch
                                        allowClear
                                        onChange={handleSelectChangeBarcode}
                                        placeholder="Select RollNumber"
                                        style={{ width: '100px' }}
                                        optionFilterProp="label"
                                    >
                                        {rollData?.map((roll) => (
                                            <Option key={roll.barcode} value={roll.barcode} label={roll.rollNumber}>
                                                {roll.rollNumber}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ScxColumn>
                            <ScxColumn>
                                <Form.Item>
                                    <ScxButton type="primary" disabled={barcodevalue ? false : true} onClick={onFinish}>Submit</ScxButton>
                                </Form.Item>
                            </ScxColumn>
                        </Space>
                    </ScxRow>
                    {showWarningText ? <div style={{ color: "red" }}><b>Note</b>: The current roll is allocated for a docket and it is not yet issued. Please issue it and then try again</div> : ''}
                    {scannedRollInfo && <Card title=''>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Lot Number</th>
                                    <th>Roll Barcode</th>
                                    <th>Roll Number</th>
                                    <th>Roll Length</th>
                                    <th>Roll Width({scannedRollInfo.rollInfo.inputWidthUom})</th>
                                    <th>Roll Width(cm)</th>
                                    <th>Shade</th>
                                    <th>Qty</th>
                                    <th>Allocated Qty</th>
                                    <th>Issued Qty</th>
                                    <th>Available Qty</th>
                                    <th>remarks</th>
                                    <th><span>Issuing Qty<span className='required-field'></span></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{scannedRollInfo.rollInfo.lotNumber}</td>
                                    <td>{scannedRollInfo.rollInfo.barcode}</td>
                                    <td>{scannedRollInfo.rollInfo.externalRollNumber}</td>
                                    <td>{scannedRollInfo.rollInfo.supplierLength}</td>
                                    <td>{scannedRollInfo.rollInfo.inputWidth}</td>
                                    <td>{scannedRollInfo.rollInfo.supplierWidth}</td>
                                    <td>{scannedRollInfo.rollInfo.shade}</td>
                                    <td>{scannedRollInfo.rollInfo.inputQuantity}</td>
                                    <td>{scannedRollInfo.rollInfo.allocatedQuantity}</td>
                                    <td>{scannedRollInfo.rollInfo.issuedQuantity}</td>
                                    <td>{(Number(scannedRollInfo.rollInfo?.inputQuantity) - Number(scannedRollInfo.rollInfo?.issuedQuantity)).toFixed(2)}</td>
                                    <td>
                                        <Form.Item name="remarks" key={Date.now()}>
                                            <Input style={{ width: "100%" }} key={Date.now()} />
                                        </Form.Item>
                                    </td>
                                    <td>
                                        <Form.Item name="issuingQty" key={Date.now()}>
                                            <Input type="number" min={0} style={{ width: "80px" }} key={Date.now()} />
                                        </Form.Item>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ marginTop: "10px", textAlign: "right" }}>
                            <Button
                                type='primary'
                                disabled={buttonStatus || (Number(scannedRollInfo.rollInfo.inputQuantity) - Number(scannedRollInfo.rollInfo.issuedQuantity) <= 0)}
                                onClick={issueRollQuantity}
                            >
                                Submit
                            </Button>
                        </div>
                    </Card>}
                </Form>
            </Row>
        </Card>
    );
};

export default RollQtyIssuance;
