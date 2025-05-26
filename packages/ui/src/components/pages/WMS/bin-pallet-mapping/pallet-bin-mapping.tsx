import { CommentOutlined, CopyTwoTone, CustomerServiceOutlined, GroupOutlined, PartitionOutlined, ReloadOutlined, ScanOutlined } from "@ant-design/icons";
import { InspectionPalletRollsModel, PalletRollsUIModel, RollInfoUIModel, RackBinPalletsModel, WarehousePalletRollsModel, CurrentPalletLocationEnum, CurrentPalletStateEnum, PackListIdRequest, BinDetailsModel, BinIdRequest, BinPalletMappingRequest, PalletIdRequest, PalletDetailsModel, PalletBinStatusEnum } from "@xpparel/shared-models";
import { LocationAllocationService } from "@xpparel/shared-services";
import { Alert, Button, Card, Col, Descriptions, Divider, Drawer, Empty, FloatButton, Form, Input, Modal, Row, Select, Space, Statistic, Switch, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";
import Bin from "../pallet-bin-allocation/bin";
import Search from "antd/es/input/Search";
import { getCssFromComponent } from "../print-barcodes/print-barcode-css.util";
import { copyToCliBoard } from "../../../common/handle-to-cliboard-copy/handle-cliboard-write-text";

// import EmptyPalletBox from "./empty-pallet-box";
interface PalletBinMapProps {
    phId: number;
}
interface DisplayMsg {
    isSuccess: boolean;
    msg: string;
}
export const PalletBinMappingPage = (props: PalletBinMapProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const phId = props?.phId;
    const [scanUpdateKey, setScanUpdateKey] = useState<number>(0);
    useEffect(() => {
        defaultLoad(phId);
    }, [scanUpdateKey])

    const defaultLoad = (phIdL: number) => {
        if (phIdL) {
            getBinsMappedForPackingList(phIdL);
            getPalletsMappedForPackingList(phIdL);
            getAllSpaceFreeBinsInWarehouse(phIdL);
        }
    }
    const [bins, setBins] = useState<BinDetailsModel[]>([]);
    const [palletsBins, setPalletBins] = useState<RackBinPalletsModel[]>();
    const [insPalletsRolls, setInsPalletsRolls] = useState<PalletRollsUIModel[]>([]);
    const [warehPalletsRolls, setWarehPalletsRolls] = useState<PalletRollsUIModel[]>([]);
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>('');
    const [selectedPalletId, setSelectedPalletId] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false); // Scan Interface
    const [scannedPallet, setScannedPallet] = useState<PalletDetailsModel>();
    const [barcodeVal, setBarcodeVal] = useState<string>();

    const [isScanned, setIsScanned] = useState<boolean>(false);
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const locationService = new LocationAllocationService();
    const [isOverRideSysAllocation, setSsOverRideSysAllocation] = useState<boolean>(false);
    const [pendingPallets, setPendingPallets] = useState<PalletDetailsModel[]>([])
    const [allBins, setAllBins] = useState<BinDetailsModel[]>([])
    const { Option } = Select;
    const [form] = Form.useForm();
    const palletInputRef = useRef(null);
    const binInputRef = useRef(null);
    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);
    const [debounceTimer, setDebounceTimer] = useState<any>();
    const getBinsMappedForPackingList = (phId: number) => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
        locationService.getBinsMappedForPackingList(phIdReq).then((res => {
            if (res.status) {
                setBins(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setBins([]);
            }
        })).catch(error => {
            setBins([]);
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getPalletsMappedForPackingList = (phIdL: number) => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phIdL);
        locationService.getPalletsMappedForPackingList(phIdReq).then((res => {
            if (res.status) {
                const pendingPalletsInfo = res.data.filter(pB => pB.status === PalletBinStatusEnum.OPEN)
                setPendingPallets(pendingPalletsInfo);
            } else {
                addDisplayMsg(res.internalMessage);
                setPendingPallets([]);
            }
        })).catch(error => {
            setBins([]);
            addDisplayMsg(error.message)
        });
    }
    const getAllSpaceFreeBinsInWarehouse = (phIdL: number) => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phIdL);
        locationService.getAllSpaceFreeBinsInWarehouse(phIdReq).then((res => {
            if (res.status) {
                setAllBins(res.data);
            } else {
                addDisplayMsg(res.internalMessage);
                setAllBins([]);
            }
        })).catch(error => {
            setAllBins([]);
            addDisplayMsg(error.message);
        });
    }

    const clsoeModel = () => {
        setModalOpen(false);
        setSelectedPalletId(0);
    }
    const renderTitle = (palletId: number) => {
        let palletCode = '';
        let noOfrolls = 0;
        const insRolls = insPalletsRolls.find(palletObj => palletObj.palletId === palletId);
        if (insRolls) {
            palletCode = insRolls.palletCode;
            noOfrolls = insRolls?.rollsInfo?.length;
        }
        const wareRolls = warehPalletsRolls.find(palletObj => palletObj.palletId === palletId);
        if (wareRolls) {
            palletCode = wareRolls.palletCode;
            noOfrolls = wareRolls?.rollsInfo?.length;
        }
        return <Descriptions bordered size={'small'} title={<Space size='middle'><>Pallet Code : {palletCode} </>No Of Rolls : {noOfrolls} </Space>}
        // extra={<Button type="primary">Print</Button>}
        >
            {/* <Descriptions.Item label="Pallet Code">{palletCode}</Descriptions.Item>
            <Descriptions.Item label="No Of Rolls">{noOfrolls}</Descriptions.Item> */}
        </Descriptions>
    }

    const print = () => {
        const printAreaElement = document.getElementById('printArea') as HTMLElement | null;
        const divContents = printAreaElement?.innerHTML ?? '';
        const element = window.open('', '', 'height=700, width=1024');
        element?.document.write(divContents);
        getCssFromComponent(document, element?.document);
        element?.document.close();
        // Loading image lazy
        setTimeout(() => {
            element?.print();
            element?.close()
        }, 1000);
        // clsoeModel();
    }
    const onClose = () => {
        removeDIsplayMsg();
        setOpen(false);
        setSsOverRideSysAllocation(undefined);
        setScannedPallet(undefined);
        restForms();
        if (isScanned) {
            setIsScanned(false);
            // getBinsMappedForPackingList(phId);
            // refresh(phId)
            setScanUpdateKey(preState => preState + 1);
        }
    };
    const showLargeDrawer = () => {
        setOpen(true);
        setTimeout(() => palletInputFocus(), 1);
    };
    const changeIsOverRide = (checked: boolean) => {
        setSsOverRideSysAllocation(checked);
    }
    const beforeScanPalletBarcode = (value: string) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanPalletBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }
    const scanPalletBarcode = (fullBarcode: string) => {
        removeDIsplayMsg();
        // confirmRollsToPallet pallet roll mapping
        const barcodeParts = fullBarcode.split('-');
        const prefix = barcodeParts[0];
        const refId = Number(barcodeParts[1]);

        setBarcodeVal(fullBarcode);
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
                setBarcodeVal('');
                setManualBarcodeVal('');
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
                    setIsScanned(true);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                // setScanUpdateKey(preState => preState + 1);
                setBarcodeVal('');
                setManualBarcodeVal('');
            })).catch(error => {
                AlertMessages.getErrorMessage(error.message)
            })
        }

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
                setIsScanned(true);
                restForms();
                getPalletsMappedForPackingList(phId);
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
    const getRollsQtyForPallet = (palletInfo: WarehousePalletRollsModel) => {
        let sum = 0;

        for (const rollInfo of palletInfo.rollsInfo) {
            sum += rollInfo.supplierQuantity;
        }
        return sum;
    }
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const palletInputFocus = () => {
        if (palletInputRef.current) {
            palletInputRef.current.focus();
        }
    }
    const binInputFocus = () => {
        if (binInputRef.current) {
            binInputRef.current.focus();
        }
    }
    const restForms = () => {
        palletInputFocus();
        form.resetFields();
        setScannedPallet(undefined);
        setBtnDisabled(false);
        setBarcodeVal('');
        setManualBarcodeVal('');
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
                // form.setFields([{name:'binId',errors:['Please Select Bin']}]);
                setBtnDisabled(false);
            }
        }).catch(err => console.log(err.message));
    };
    const pendingPalletcolumns: ColumnsType<PalletDetailsModel> = [
        {
            title: 'Pallet Code',
            dataIndex: 'palletCode',
        },
        {
            title: 'Pallet Barcode',
            dataIndex: 'barcode',
            render: (v) => {
                return <>
                    {v}&nbsp;<><CopyTwoTone
                        onClick={() => copyToCliBoard(v, 'Barcode copied to clipboard')}
                    /></>
                </>
            }
        },
        {
            title: 'Bin Code',
            dataIndex: 'suggestedBinInfo',
            render: (val: string, record: PalletDetailsModel) => {
                return record?.suggestedBinInfo?.binCode ?? '-';
            }
        },
        {
            title: 'Rack Code',
            render: (val: string, record: PalletDetailsModel) => {
                return record?.suggestedBinInfo?.rackCode ?? '-';
            }
        },
        {
            title: 'No Of Objects',
            dataIndex: 'totalConfirmedRolls',
        },
        {
            title: 'Pallet Type',
            dataIndex: 'palletCurrentLoc',
        },
    ]
    const refresh = (phIdl: number) => {
        defaultLoad(phIdl)
    }
    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        scanPalletBarcode(val.trim());
    }
    const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
        const displayObj: DisplayMsg = { isSuccess, msg }
        setDisplayMsg(displayObj);
    }
    const removeDIsplayMsg = () => {
        setDisplayMsg(undefined);
    }
    const closeMsg = () => {
        removeDIsplayMsg();
        palletInputFocus();
    }
    return (<>
        <Card size="small" className="card-title-bg-cyan" title="Bin Pallet Allocation" extra={<><Button onClick={() => refresh(phId)} icon={<ReloadOutlined />} /> <Button onClick={() => showLargeDrawer()} icon={<ScanOutlined />} /></>} >

            {/* <Space direction="vertical" size="middle" style={{ width: '100%' }}> */}
            <Row gutter={24}>
                {
                    bins.map((rack, index) => {
                        return <Bin binInfo={rack} key={`${scanUpdateKey}-${index}`} phId={phId} />
                    })
                }
            </Row>
            {bins.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {/* </Space> */}

        </Card>
        <Divider />

        <Modal
            // title={<Button type="primary">Print</Button>}
            style={{ top: 20 }}
            width={'100%'}
            open={modalOpen}
            onOk={clsoeModel}
            onCancel={clsoeModel}
            footer={[<Button key="back" type="primary" onClick={print}>Print</Button>, <Button onClick={clsoeModel} >Close</Button>]}
        >
            <div id='printArea'>
                {renderTitle(selectedPalletId)}

            </div>
        </Modal>
        <Drawer
            title={`Pallet Bin Allocation`}
            placement="right"
            size={'large'}
            onClose={onClose}
            open={open}
            width='100%'
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
                    <Button onClick={onClose}>Cancel</Button>
                    {/* <Button type="primary" onClick={onChange}>
                        OK
                    </Button> */}
                </Space>
            }
        >
            <>
                <Row gutter={16}>
                    <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 24, order: 1 }} lg={{ span: 14, order: 2 }} xl={{ span: 12, order: 2 }} >
                        <Card
                        // style={{ width: 'fit-content' }}
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
                                                {/* <h4>Pallet Name : <Text type="success">P4-85RG</Text></h4>
                        <h4>Pallet Status: <Text type="danger">No Pallet Allocated</Text></h4> */}
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
                                                {allBins.map(bO => <Option key={bO.binId} value={bO.binId}>{bO.binCode}</Option>)}
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
                    <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 24, order: 2 }} lg={{ span: 10, order: 1 }} xl={{ span: 12, order: 1 }} >
                        <Card title="Pending Pallets"
                        // style={{ width: 'fit-content' }}
                        >
                            <Table
                                columns={pendingPalletcolumns}
                                pagination={false} scroll={{ x: 'max-content', y: 300 }}
                                bordered
                                dataSource={pendingPallets}
                                size="small" />
                        </Card>
                    </Col>
                </Row>


                <Row gutter={24}>
                    <Col span={12}>
                        {/* <Bin binInfo={scannedPallets} key={`scan-empty-bin${scanUpdateKey + 1}`} phId={phId} binColSize={12} /> */}
                    </Col>

                </Row>
                {/* <Divider >Pending Pallets    </Divider> */}
                {palletsBins && palletsBins.map(rack => {
                    return rack.binInfo.map(binInfo => {
                        return binInfo.palletsInfo.map(pallet => {
                            return <Button type="dashed" >
                                <Space >

                                    <>{pallet.palletCode}</>
                                    <Tooltip title={`No Of Objects `} mouseEnterDelay={0} mouseLeaveDelay={0} key={'cyan'}>
                                        <Tag color="#f50">{pallet?.rollsInfo?.length}</Tag>
                                    </Tooltip>
                                    <Tooltip title={`Total Object Qty `} mouseEnterDelay={0} mouseLeaveDelay={0} key={'#87d068'}>
                                        <Tag color="#87d068">{getRollsQtyForPallet(pallet)}</Tag>
                                    </Tooltip>
                                </Space>
                            </Button>
                        })
                    })
                })}
            </>
        </Drawer>

        {/* <Switch onChange={onChange} checked={open} style={{ margin: 16 }} /> */}
    </>)
}
export default PalletBinMappingPage;