import { CheckCircleOutlined, ExclamationCircleFilled, GroupOutlined, PartitionOutlined, QuestionOutlined, ScanOutlined, UngroupOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, CurrentPalletLocationEnum, GrnRollInfoModel, PalletDetailsModel, PalletRollMappingRequest, RollIdRequest } from "@xpparel/shared-models";
import { LocationAllocationService, PackingListService } from "@xpparel/shared-services";
import { Alert, Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, SelectProps, Space, Statistic } from "antd";
import Search from "antd/es/input/Search";
import layout from "antd/es/layout";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";


interface DisplayMsg {
    isSuccess: boolean;
    msg: string;
}

interface LabelVal {
    label: number;
    value: string;
}
export const PalletInsRollAllocation = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [debounceTimer, setDebounceTimer] = useState<any>();
    const [scannedRollInfo, setScannedRollInfo] = useState<GrnRollInfoModel>();
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    const [palletsHead, setPalletHead] = useState<PalletDetailsModel[]>([])
    const [selectedOtherPallet, setSelectedOtherPallet] = useState<string>();
    const [searchedOtherPallets, setSearchedOtherPallets] = useState<SelectProps['options']>([]);
    const [allPallets, setAllPallets] = useState<LabelVal[]>([]);
    const locationService = new LocationAllocationService();
    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);

    const { confirm } = Modal;

    const packingService = new PackingListService();

    const [form] = Form.useForm();
    const rollInputRef = useRef(null);
    const palletInputRef = useRef(null);
    const { Option } = Select;
    useEffect(()=>{
        getAllSpaceFreePalletsInWarehouse();
    },[])
    const getAllSpaceFreePalletsInWarehouse = () => {
        const phIdReq = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        locationService.getAllSpaceFreePalletsInWarehouse(phIdReq).then((res => {
            if (res.status) {
                const allPallets = res.data.map(palletObj => {
                    return { label: palletObj.palletId, value: palletObj.palletCode }
                });
                setAllPallets(allPallets);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllPallets([]);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const scanRollBarcode = (value: string) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const scanBarcode = (fullBarcode: string) => {
        removeDIsplayMsg();
        const prefix = fullBarcode.charAt(0);
        const barcode = Number(fullBarcode.substring(1));
        if (prefix == 'R') {
            form.setFieldValue('existingPallet', '')
            form.setFieldValue('otherPallet', '')
            const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, barcode, fullBarcode);
            packingService.getGrnRollInfoForRollId(rollIdReq).then((res => {
                if (res.status) {
                    form.setFieldValue('measuredWidth', res.data.rollInfo.measuredWidth);
                    form.setFieldValue('measuredWeight', res.data.rollInfo.measuredWeight);
                    setScannedRollInfo(res.data);
                    setBtnDisabled(false);
                    setTimeout(() => {
                        if (palletInputRef.current) {
                            palletInputRef.current.focus();
                        }
                    }, 1)

                    // AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    // AlertMessages.getErrorMessage(res.internalMessage);
                    addDisplayMsg(res.internalMessage);
                }
                setManualBarcodeVal('');
                form.setFieldValue('rollBarcode', '');
                form.setFieldValue('manBarcode', '');
            })).catch(error => {
                addDisplayMsg(error.message)
            })
        } else {
            addDisplayMsg('Please Enter A Valid Roll Barcode');
            restForms();
        }

    }


    const getPalletIdForPalletCode = (palletCode: string) => {
        const matchedPllaetObj = allPallets.find(palletObj => palletObj.value == palletCode);
        return matchedPllaetObj?.label;
    }

    const onFinish = () => {
        form.validateFields().then((values: any) => {
            setBtnDisabled(true);
            const { measuredWeight, measuredWidth, existingPallet, otherPallet, palletBarcode } = values;
            let palletNo =  getPalletIdForPalletCode(otherPallet)
            grnForRollId(measuredWeight, measuredWidth, palletNo);
        }).catch(err => console.log(err.message));
    };

    const searchOtherPallet = (newValue: string) => {
        const matchedObjects = allPallets.filter((item) => {
            // Convert both the label and value to lowercase for case-insensitive matching         
            const valueLowerCase = item.value.toLowerCase();
            const inputLowerCase = newValue.toLowerCase();
            // Check if the label or value contains the input string
            return valueLowerCase.includes(inputLowerCase);
        });
        setSearchedOtherPallets(newValue ? matchedObjects : []);
    };

    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        scanBarcode(val.trim());
    }

    const rollInputFocus = () => {
        if (rollInputRef.current) {
            rollInputRef.current.focus();
        }
    }

    const changeOtherPallet = (newValue: string) => {
        setSelectedOtherPallet(newValue);
        setSearchedOtherPallets([])
    };

    const restForms = () => {
        form.resetFields();
        setScannedRollInfo(undefined);
        setBtnDisabled(false);
        // setBarcodeVal('');
        setManualBarcodeVal('');
        // setPrintableRolls(undefined);
        setTimeout(() => rollInputFocus(), 1)
        rollInputFocus();
    }

    const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
        const displayObj: DisplayMsg = { isSuccess, msg }
        setDisplayMsg(displayObj);
    }




    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    const closeMsg = () => {
        rollInputFocus();
        removeDIsplayMsg();
    }
    const removeDIsplayMsg = () => {
        setDisplayMsg(undefined);
    }

    const scanPalletBarcode = (e: any) => {
        removeDIsplayMsg();
        const fullBarcode = e.target.value;
        const barcodeParts = fullBarcode.split('-');
        const prefix = barcodeParts[0];
        const palletId = Number(barcodeParts[1]);
        const measuredWidth: number = form.getFieldValue('measuredWidth');
        const measuredWeight: number = form.getFieldValue('measuredWeight');
        if (prefix == 'PL' && palletId) {
            setBtnDisabled(true);
            grnForRollId(measuredWeight, measuredWidth, palletId);
        } else {
            addDisplayMsg("Please Scan A Valid Pallet");
            form.setFieldValue('palletBarcode', '');
            setBtnDisabled(false);

        }
    }
    const showConfirm = (msg = 'Do you Want to continue without Measured width') => {
        confirm({
            title: msg,
            icon: <ExclamationCircleFilled />,
            // content: 'Measured Width Not defined',
            onOk() {
                confirmedPallet();
            },
            onCancel() {
                form.setFieldValue('palletBarcode', '')
                setBtnDisabled(false);
            },
        });
    };
    const showConfirmForMultipleMsgs = (msgs: string[], rollIdL: number, rollBarcodeL: string, palletIdL: number) => {
        const msgString = <div>{
            msgs.map((msg, index) => {
                return <><span>{index + 1}.{msg}</span><br></br></>
            })
        }</div>
        confirm({
            width: 'fit-content',
            title: msgString,
            icon: <ExclamationCircleFilled />,
            okText: 'Confirm',
            // okType: 'danger',
            // content: 'Measured Width Not defined',
            onOk() {
                rollPalletMapping(rollIdL, rollBarcodeL, palletIdL);
            },
            onCancel() {
                form.setFieldValue('palletBarcode', '')
                setBtnDisabled(false);
            },
        });
    };
    const confirmedPallet = () => {
        setBtnDisabled(true);
        const { measuredWidth, measuredWeight, existingPallet, otherPallet, palletBarcode } = form.getFieldsValue();
        let palletNo =  getPalletIdForPalletCode(otherPallet) ;
        const barcodeParts = palletBarcode && palletBarcode.split('-');
        if (barcodeParts) {
            palletNo = Number(barcodeParts[1]);
        }
        grnForRollId(measuredWeight, measuredWidth, palletNo, false);
    }
    const grnForRollId = (measuredWeight: number, measuredWidth: number, palletCodeL: number, isValidate: boolean = true): boolean | void => {
        const { barcode, rollNumber } = scannedRollInfo.rollInfo;
        let palletRollMappingFlag = true;
        if (scannedRollInfo.currentPalletId && scannedRollInfo.currentPalletId == palletCodeL) {            
            palletRollMappingFlag = false;
        } else if ((!palletCodeL) && scannedRollInfo.currentPalletId) {          
            palletRollMappingFlag = false;
        }
        let confirmFlag = false;
        if (isValidate && palletRollMappingFlag) {            
            if (palletCodeL) {
                if (scannedRollInfo.currentPalletId && scannedRollInfo.currentPalletId != palletCodeL) {
                    confirmFlag = true;
                } else {
                    if (scannedRollInfo.defaultPalletId && scannedRollInfo.defaultPalletId != palletCodeL) {
                        confirmFlag = true;
                    }
                }
                // if (confirmFlag) {
                //     showConfirm("System Suggested Pallet and Scanned Pallet are different. Do you want proceed Manual Pallet?")
                //     return false;
                // }
            } else {
                addDisplayMsg('Please Select Pallet');
                if (palletInputRef.current) {
                    palletInputRef.current.focus();
                }
                setBtnDisabled(false);
                return false;
            }
        }
        // const rollReq = new RollGrnAndInsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollNumber, barcode, undefined, undefined, undefined, phId, measuredWidth, measuredWeight);
        // if there is not measured width entered, then only update the pallet mapping to the roll
        // if (!measuredWidth) {
            if (palletRollMappingFlag) {
                validateRollPalletMapping(rollNumber, barcode, palletCodeL, confirmFlag);
            } else {
                if (palletCodeL) {
                    addDisplayMsg('The current roll you are scanning is already in the current pallet you selected');
                } else {
                    addDisplayMsg('Please Select Pallet');
                }
                setBtnDisabled(false);
                form.setFieldValue('palletBarcode', '');
                return false;
            }

        // } else {
            // const grnReq = new RollsGrnRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, [rollReq], undefined);
            // grnServices.saveRollLevelGRN(grnReq).then((res => {
            //     if (res.status) {
            //         if (palletRollMappingFlag) {
            //             rollPalletMapping(rollNumber, barcode, palletCodeL);
            //         } else {
            //             addDisplayMsg(res.internalMessage, true);
            //             restForms();
            //         }
            //     } else {
            //         addDisplayMsg(res.internalMessage);
            //     }
            //     setScanUpdateKey(preState => preState + 1);
            //     setBarcodeVal('');
            //     form.setFieldValue('rollBarcode', '')
            //     setManualBarcodeVal('');
            //     setBtnDisabled(false);
            // })).catch(error => {
            //     setBtnDisabled(false);
            //     addDisplayMsg(error.message)
            // })
        // }isOverRideSysAllocation
    }
    const validateRollPalletMapping = (rollIdL: number, rollBarcodeL: string, palletIdL: number, isPalletDiff = false) => {
        const overrideAlloc = scannedRollInfo.defaultPalletId > 0;
        const phId = scannedRollInfo.rollInfo?.packListId;
        const reqFor = false ? CurrentPalletLocationEnum.INSPECTION : CurrentPalletLocationEnum.WAREHOUSE
        const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollIdL, rollBarcodeL);
        const phIdReq = new PalletRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, palletIdL, overrideAlloc, reqFor, false, [rollIdReq]);
        locationService.validateConfirmRollsToPallet(phIdReq).then((res => {
            const validationMsgs: string[] = [];
            if (isPalletDiff) {
                validationMsgs.push('System Suggested Pallet and Scanned Pallet are different. Do you want proceed Manual Pallet?')
            }
            if (res.status) {
                const data = res.data[0];
                // Validate inspection roll or not
                if (!scannedRollInfo.rollInfo.pickForInspection) {
                    // Validate empty pallet
                    if (data.batchesInPallet.length) {
                        if (!data.batchesInPallet.includes(scannedRollInfo.rollInfo.batchNumber)) {
                            validationMsgs.push('Batches are different ' + data.batchesInPallet.toString());
                            // addDisplayMsg('Batches are different' + data.batchesInPallet.toString());
                            if (!user?.roles?.includes('WarehouseManger')) { 
                                throw new Error(`Batches are different,you can't do this operation,Please contact WarehouseManger`);
                            }
                        }
                    }
                }
                if (data.currentConfirmedRollsInPallet > data.totalPalletCapacity) {
                    validationMsgs.push('Capacity Override - ' + data.totalPalletCapacity);
                    // addDisplayMsg('Capacity override - ' + data.totalPalletCapacity);
                }
                validationMsgs.length > 0 ? showConfirmForMultipleMsgs(validationMsgs, rollIdL, rollBarcodeL, palletIdL) : rollPalletMapping(rollIdL, rollBarcodeL, palletIdL);
            } else {
                addDisplayMsg(res.internalMessage);
            }
        })).catch(error => {
            addDisplayMsg(error.message);
            setBtnDisabled(false);
        });

    }
    const rollPalletMapping = (rollIdL: number, rollBarcodeL: string, palletIdL: number) => {
        const overrideAlloc = true;
        const markAsIssued = undefined;
        const insRollOverride = false;
        const phId = scannedRollInfo.rollInfo?.packListId;
        const reqFor = false ? CurrentPalletLocationEnum.INSPECTION : CurrentPalletLocationEnum.WAREHOUSE
        const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollIdL, rollBarcodeL);
        const phIdReq = new PalletRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, palletIdL, overrideAlloc, reqFor, false, [rollIdReq],markAsIssued, insRollOverride);
        locationService.confirmRollsToPallet(phIdReq).then((res => {
            if (res.status) {
                addDisplayMsg(res.internalMessage, true);
                restForms();
            } else {
                addDisplayMsg(res.internalMessage);
            }
            setManualBarcodeVal('');
            setBtnDisabled(false);
            form.setFieldValue('palletBarcode', '')
            form.setFieldValue('rollBarcode', '')
        })).catch(error => {
            addDisplayMsg(error.message);
            setBtnDisabled(false);
        })
    }
    const beforeScanPalletBarcode = (value: any) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanPalletBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }
    return (
        <>
            <Col style={{ display: 'flex', justifyContent: 'center' }} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} >
                <Card
                title='Pallet Allocation for Inpsection Rolls'
                extra={
                    <Space size={'large'}>
                        {displayMsg && <Alert
                            message={displayMsg.msg}
                            type={displayMsg.isSuccess ? "success" : 'error'}
                            style={{ padding: '8px 12px' }}
                            banner
                            showIcon
                            closable
                            afterClose={closeMsg}
                        />}
                       
                    </Space>
                }
                >
                    <Row justify="center">
                        <Form
                            {...layout}
                            form={form}
                            name="roll-form"
                            labelAlign="left"
                            style={{ width: '100%' }}
                        >
                            <Form.Item label="Scan Object Barcode">
                                <Space>
                                    <Form.Item name="rollBarcode" noStyle >
                                        <Input placeholder="Scan Object Barcode" ref={rollInputRef} onChange={(e) => scanRollBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                    </Form.Item>
                                    <Form.Item name="manBarcode" noStyle initialValue={manualBarcodeVal}>
                                        <Search placeholder="Type Object Barcode" onSearch={manualBarcode} enterButton />
                                    </Form.Item>
                                </Space>
                            </Form.Item>
                        </Form>

                        {/* </Col> */}
                    </Row>
                    <Row justify="center">
                        {scannedRollInfo && <>
                            <Form
                                {...layout}
                                form={form}
                                name="pallet-form"
                                labelAlign="left"
                                // labelWrap
                                // onFinish={onFinish}
                                style={{ maxWidth: 650 }}
                            >
                                <Row>
                                    <Col flex="100px"></Col>
                                    <Col flex="auto">

                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Roll Number</th>
                                                    <th>Lot Number</th>
                                                    <th>Roll Length</th>
                                                    <th>Roll Width</th>
                                                    <th>Shade</th>
                                                    <th>Measured Width</th>
                                                    <th>Measured Weight</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{scannedRollInfo.rollInfo.externalRollNumber}</td>
                                                    <td>{scannedRollInfo.rollInfo.lotNumber}</td>
                                                    <td>{scannedRollInfo.rollInfo.supplierLength}</td>
                                                    <td>{scannedRollInfo.rollInfo.supplierWidth}</td>
                                                    <td>{scannedRollInfo.rollInfo.shade}</td>

                                                    <td>
                                                        <Form.Item name="measuredWidth"  noStyle rules={[{ required: false }]}>
                                                            <InputNumber  readOnly disabled style={{ width: "100%" }} />
                                                        </Form.Item></td>
                                                    <td>
                                                        <Form.Item name="measuredWeight" noStyle rules={[{ required: false }]}>
                                                            <InputNumber  readOnly disabled style={{ width: "100%" }} />
                                                        </Form.Item></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <Space >
                                            <Row gutter={16} style={{ padding: '10px' }}>

                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<><GroupOutlined />Pallet Group</>}
                                                        value={scannedRollInfo.pgName}
                                                        valueStyle={{ color: '#3f8600' }}
                                                    />
                                                </Card>

                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<><PartitionOutlined />Sug Pallet</>}
                                                        value={scannedRollInfo.defaultPalletName ? scannedRollInfo.defaultPalletName : ' '}
                                                        valueStyle={{ color: '#ffbf00' }}
                                                    />
                                                </Card>

                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title="Pallet Allocated?"
                                                        value={scannedRollInfo.currentPalletName ? 'Yes' : 'No'}
                                                        valueStyle={{ color: scannedRollInfo.currentPalletName ? '#3f8600' : '#ff0014' }}
                                                    />
                                                </Card>
                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<><UngroupOutlined />Pallet Name</>}
                                                        value={scannedRollInfo.currentPalletName ? scannedRollInfo.currentPalletName : ' '}
                                                        valueStyle={{ color: scannedRollInfo.currentPalletName ? '#3f8600' : '#000' }}
                                                        prefix={scannedRollInfo.currentPalletName ? <CheckCircleOutlined /> : <QuestionOutlined />}
                                                    />
                                                </Card>
                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<>Roll Type</>}
                                                        value={scannedRollInfo.rollInfo.pickForInspection ? 'Inspection' : 'Warehouse'}
                                                        valueStyle={{ color: '#000' }}
                                                    />
                                                </Card>

                                            </Row>
                                        </Space>
                                    </Col>
                                </Row>

                                <Form.Item name="palletBarcode" label="Scan Pallet Barcode" rules={[{ required: false }]}>
                                    <Input placeholder="Scan Pallet Barcode" ref={palletInputRef} onChange={beforeScanPalletBarcode} prefix={<ScanOutlined />} />
                                </Form.Item>
                                {/* <Form.Item name="existingPallet" label="Scanned Pallets" rules={[{ required: false }]}>
                                    <Select
                                        placeholder="Select Scanned Pallets"
                                        showSearch
                                        allowClear
                                    >
                                        {palletsHead?.map(palletObj => <Option value={palletObj.palletId}>{palletObj.palletCode}</Option>)}
                                        <Option value="other">other</Option>
                                    </Select>
                                </Form.Item> */}
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) => {
                                        return prevValues.existingPallet !== currentValues.existingPallet
                                    }}
                                >
                                    {/* {({ getFieldValue }) => { */}
                                        {/* return getFieldValue('existingPallet') === 'other' ? ( */}

                                            <Form.Item name="otherPallet" label="Search Other Pallet" rules={[{ required: false }]}>
                                                <Select
                                                    showSearch
                                                    value={selectedOtherPallet}
                                                    placeholder={'Search Other Pallet'}
                                                    defaultActiveFirstOption={false}
                                                    suffixIcon={null}
                                                    filterOption={false}
                                                    onSearch={searchOtherPallet}
                                                    onChange={changeOtherPallet}
                                                    notFoundContent={null}
                                                    options={(searchedOtherPallets || []).map((d) => ({
                                                        value: d.value,
                                                        label: d['lable'],
                                                        key: d.value
                                                    }))}
                                                />
                                            </Form.Item>
                                        {/* ) : null */}
                                    {/* } */}
                                    {/* } */}
                                </Form.Item>
                                <Form.Item {...tailLayout}><Space>
                                    <Button type="primary" onClick={onFinish} disabled={btnDisabled}>
                                        Submit
                                    </Button>
                                    <Button htmlType="button"
                                        onClick={restForms}
                                    >
                                        Reset
                                    </Button>
                                </Space>
                                </Form.Item>
                            </Form>
                        </>
                        }
                    </Row>
                </Card>
            </Col>
        </>
    );
}