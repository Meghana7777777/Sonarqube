import { ScanOutlined } from "@ant-design/icons"
import { BinDetailsModel, BinPalletMappingRequest, BinsCreateRequest, CommonRequestAttrs, PalletBinStatusEnum, PalletDetailsModel, PalletIdRequest } from "@xpparel/shared-models"
import { BinsServices, LocationAllocationService } from "@xpparel/shared-services"
import { Alert, Button, Card, Col, Form, Input, Row, Select, Space, Statistic } from "antd"
import Search from "antd/es/input/Search"
import layout from "antd/es/layout"
import { useAppSelector } from "packages/ui/src/common"
import { useEffect, useRef, useState } from "react"
import { AlertMessages } from "../../../common"


interface DisplayMsg {
    isSuccess: boolean;
    msg: string;
}
export const PalletBinAllocation = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [scannedPallet, setScannedPallet] = useState<PalletDetailsModel>();
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [debounceTimer, setDebounceTimer] = useState<any>();
    const [allBins, setAllBins] = useState<BinDetailsModel[]>([])
    const [isOverRideSysAllocation, setSsOverRideSysAllocation] = useState<boolean>(true);
    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);
    const locationService = new LocationAllocationService();
    const binService = new BinsServices();
    const { Option } = Select;
    const [form] = Form.useForm();
    const palletInputRef = useRef(null);
    const binInputRef = useRef(null);
    useEffect(() => {
        getAllSpaceFreeBinsInWarehouse();
    }, []);


    const getAllSpaceFreeBinsInWarehouse = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        locationService.getAllSpaceFreeBinsInWarehouse(reqObj).then((res => {
            if (res.status) {
                setAllBins(res.data);
            } else {
                addDisplayMsg(res.internalMessage);
                setAllBins([]);
            }
        })).catch(error => {
            setAllBins([]);
            addDisplayMsg(error.message)
        });
    }
    const scanPalletBarcode = (fullBarcode: string) => {
        removeDIsplayMsg();
        // confirmRollsToPallet pallet roll mapping
        const barcodeParts = fullBarcode.split('-');
        const prefix = barcodeParts[0];
        const refId = Number(barcodeParts[1]);


        const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
            const displayObj: DisplayMsg = { isSuccess, msg };
            setDisplayMsg(displayObj);
        }
        if (prefix == 'PL') {
            form.setFieldValue('binId', '');
            const palletIdReq = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, refId, fullBarcode);
            locationService.getPalletMappingInfoWithoutRolls(palletIdReq).then((res => {
                if (res.status) {
                    setScannedPallet(res.data[0]);
                } else {
                    addDisplayMsg(res.internalMessage);
                    restForms();
                }
                // setScanUpdateKey(preState => preState + 1);
            })).catch(error => {
                addDisplayMsg(error.message)
            })
            form.setFieldValue('palletBarcode', '')
            form.setFieldValue('manB', '')
            // locationService.getBinInfoWithoutPallets(phIdReq).then((res => {
            //     if (res.status) {
            //         setScannedPallets(res.data[0]);
            //     } else {
            //         AlertMessages.getErrorMessage(res.internalMessage);
            //     }
            //     setBarcodeVal('');
            //     setScanUpdateKey(preState => preState + 1);
            // })).catch(error => {
            //     AlertMessages.getErrorMessage(error.message)
            // })
        } else {
            addDisplayMsg("Please Scan A valid Pallet");
            restForms();
        }
        if (scannedPallet && prefix == 'PL1') {
            // const palletIdToScan = scannedPallets.binId;
            const palletIdToScan = 0;
            const palletIdReq = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, refId, fullBarcode);

            const phIdReq = new BinPalletMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, palletIdToScan, isOverRideSysAllocation, [{ palletId: refId, barcode: fullBarcode }]);
            locationService.confirmPalletsToBin(phIdReq).then((res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                // setScanUpdateKey(preState => preState + 1);
            })).catch(error => {
                AlertMessages.getErrorMessage(error.message)
            })
        }

    }

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    const manualBarcode = (val: string) => {
        scanPalletBarcode(val.trim());
    }

    const palletInputFocus = () => {
        if (palletInputRef.current) {
            palletInputRef.current.focus();
        }
    }

    const restForms = () => {
        palletInputFocus();
        form.resetFields();
        setScannedPallet(undefined);
        setBtnDisabled(false);
    }

    const binInputFocus = () => {
        if (binInputRef.current) {
            binInputRef.current.focus();
        }
    }

    const onFinish = () => {
        form.validateFields().then((values: any) => {
            setBtnDisabled(true);
            const { binId } = values;
            if (binId) {
                palletBinMapping(binId, scannedPallet.palletId, scannedPallet.barcode);
            } else {
                addDisplayMsg('Please Select Bin');
                binInputFocus();
                form.setFields([{ name: 'binId', errors: ['Please Select Bin'] }]);
                setBtnDisabled(false);
            }
        }).catch(err => console.log(err.message));
    };
    const palletBinMapping = (binId: number, palletId: number, palletBarcodeL: string): boolean | void => {
        if (binId == scannedPallet.confimredBinInfo?.binId) {
            alertMsgForBin("The pallet you're scanning is already in the bin you've chosen.");
            return false;
        }
        const palletIdReq = new PalletIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, scannedPallet.palletId, scannedPallet.barcode);
        const phIdReq = new BinPalletMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, binId, isOverRideSysAllocation, [{ palletId: palletId, barcode: palletBarcodeL }]);
        locationService.confirmPalletsToBin(phIdReq).then((res => {
            if (res.status) {
                addDisplayMsg(res.internalMessage, true);
                restForms();
            } else {
                setBtnDisabled(false);
                addDisplayMsg(res.internalMessage);
                form.setFieldValue('binBarcode', '');
                if (binInputRef.current) {
                    binInputRef.current.focus();
                }
            }

        })).catch(error => {
            addDisplayMsg(error.message);
            setBtnDisabled(false);
        })
    }
    const beforeScanPalletBarcode = (value: string) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanPalletBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const beforeScanBinBarcode = (e: any) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanBinBarcode(e);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const scanBinBarcode = (e: any) => {
        removeDIsplayMsg();
        const fullBarcode = e.target.value;
        const barcodeParts = fullBarcode.split('-');
        const prefix = barcodeParts[1];
        const refId = Number(barcodeParts[2]);
        if (prefix == 'BN' && refId) {
            setBtnDisabled(true);
            palletBinMapping(refId, scannedPallet.palletId, scannedPallet.barcode)
        } else {
            alertMsgForBin("Please Scan A valid Bin");
        }
    }

    const alertMsgForBin = (msg: string) => {
        addDisplayMsg(msg);
        setBtnDisabled(false);
        form.setFieldValue('binBarcode', '')
    }

    const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
        const displayObj: DisplayMsg = { isSuccess, msg }
        setDisplayMsg(displayObj);
    }

    const closeMsg = () => {
        removeDIsplayMsg();
        palletInputFocus();
    }
    const removeDIsplayMsg = () => {
        setDisplayMsg(undefined);
    }
    return (
        <Row gutter={16} justify="center">
            <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 24, order: 1 }} lg={{ span: 14, order: 2 }} xl={{ span: 12, order: 2 }} >
                <Card
                    size="small"
                    title="Pallet Bin Allocation"
                    // style={{ width: 'fit-content' }}
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
                        {/* <Col span={12} offset={2}> */}

                        <Form
                            {...layout}
                            form={form}
                            name="roll-form"
                            labelAlign="left"
                            // onFinish={onFinish}
                            style={{ maxWidth: 612, width: '100%' }}
                        >
                            <Form.Item label="Scan Pallet Barcode">
                                <Space>
                                    <Form.Item name="palletBarcode" noStyle>
                                        <Input placeholder="Scan Pallet Barcode" autoComplete="off" ref={palletInputRef} autoFocus onChange={(e) => beforeScanPalletBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                    </Form.Item>
                                    <Form.Item name="manB" noStyle>
                                        <Search placeholder="Type Pallet Barcode" name="manB" onSearch={manualBarcode} enterButton />
                                    </Form.Item>

                                </Space>
                            </Form.Item>
                        </Form>

                        {/* </Col> */}
                    </Row>
                    <Row justify="center">
                        {scannedPallet && <>
                            <Form
                                {...layout}
                                form={form}
                                name="pallet-form"
                                labelAlign="left"
                                // labelWrap
                                // onFinish={onFinish}
                                style={{ maxWidth: 612 }}
                            >
                                <Row>
                                    <Col flex="100px"></Col>
                                    <Col flex="auto">

                                        <Space >
                                            <Row gutter={16} style={{ padding: '10px' }}>

                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<>Pallet Code</>}
                                                        value={scannedPallet.palletCode}
                                                        valueStyle={{ color: '#3f8600' }}

                                                    />
                                                </Card>

                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<> Sug Bin</>}
                                                        value={scannedPallet.suggestedBinInfo?.binCode}
                                                        valueStyle={{ color: '#ffbf00' }}
                                                    // prefix={<PartitionOutlined />}
                                                    // suffix="%"
                                                    />
                                                </Card>
                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<> Current Bin</>}
                                                        value={scannedPallet.confimredBinInfo?.binCode}
                                                        valueStyle={{ color: '#ffbf00' }}
                                                    // prefix={<PartitionOutlined />}
                                                    // suffix="%"
                                                    />
                                                </Card>

                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title="Pallet Allocated?"
                                                        value={scannedPallet.status === PalletBinStatusEnum.CONFIRMED ? 'Yes' : 'No'}
                                                        valueStyle={{ color: scannedPallet.status === PalletBinStatusEnum.CONFIRMED ? '#3f8600' : '#ff0014' }}
                                                    // prefix={<CloseOutlined />}
                                                    // suffix="%"
                                                    />
                                                </Card>

                                                <Card size="small" bordered={true}>
                                                    <Statistic
                                                        title={<>Pallet Type</>}
                                                        value={scannedPallet.palletCurrentLoc}
                                                        valueStyle={{ color: '#000' }}
                                                    // prefix={scannedRollInfo.currentPalletName ? <CheckCircleOutlined /> : <QuestionOutlined />}
                                                    // suffix="%"
                                                    />
                                                </Card>

                                            </Row>
                                        </Space>
                                    </Col>
                                </Row>

                                <Form.Item name="binBarcode" label="Scan Bin Barcode" rules={[{ required: false }]}>
                                    <Input placeholder="Scan Bin Barcode" ref={binInputRef} autoFocus
                                        onChange={beforeScanBinBarcode}
                                        prefix={<ScanOutlined />} />
                                </Form.Item>
                                <Form.Item name="binId" label="Select Bin" rules={[{ required: false }]}>
                                    <Select
                                        filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                        placeholder="Select Bin"
                                        showSearch
                                        allowClear
                                    >
                                        {allBins.map(bO => {
                                            return <Option key={bO.binId} value={bO.binId}>{bO.binCode}</Option>
                                        })}
                                        {/* <Option value="other">other</Option> */}
                                    </Select>
                                </Form.Item>

                                <Form.Item {...tailLayout}>
                                    <Space>
                                        <Button type="primary" onClick={onFinish} disabled={btnDisabled}>Submit</Button>
                                        <Button htmlType="button" onClick={restForms}>Reset</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </>
                        }
                    </Row>
                </Card>
            </Col>
        </Row>
    )
}