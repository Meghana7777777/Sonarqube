import { ScanOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, GrnRollInfoModel, RollIdRequest, RollIdsRequest, TrayIdsRequest, TrayModel, TrayRollMappingRequest } from "@xpparel/shared-models";
import { PackingListService, TrayTrolleyService, TraysServices } from "@xpparel/shared-services";
import { Alert, Button, Card, Col, Form, Input, Radio, RadioChangeEvent, Row, Select, SelectProps, Space } from "antd";
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
    label: string;
    value: number;
    barCode: string;
}
enum ActionTypeEnum {
    allocate = 'allocate',
    deAllocate = 'deAllocate'
}
export const TrayRollAllocation = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
    const [scannedRollInfo, setScannedRollInfo] = useState<GrnRollInfoModel>();
    const [scannedRollTray, setScannedRollTray] = useState<TrayModel>();
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();

    const [selectedManualTray, setSelectedManualTray] = useState<number>();
    const [searchedManualTrays, setSearchedManualTrays] = useState<SelectProps['options']>([]);
    const [allTraysInfo, setAllTraysInfo] = useState<LabelVal[]>([]);
    const [actionType, setActionType] = useState<ActionTypeEnum>(ActionTypeEnum.allocate);

    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);



    const packingService = new PackingListService();
    const trayTrolleyService = new TrayTrolleyService();
    const trayMasterService = new TraysServices();

    const [form] = Form.useForm();
    const rollInputRef = useRef(null);
    const trayInputRef = useRef(null);

    useEffect(() => {
        getAllTrays();
    }, [])
    const getAllTrays = () => {
        const req = new TrayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,[],false,true,false);
        trayMasterService.getAllTrays(req).then((res => {
            if (res.status) {
                const allTrays = res.data.map(trayObj => {
                    return { label: trayObj.code, value: trayObj.id, barCode: trayObj.barcode }
                });
                setAllTraysInfo(allTrays);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllTraysInfo([]);
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

        const barcode = (fullBarcode.substring(1));
        if (prefix == 'R') {
            form.setFieldValue('manualTray', '')
            const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, fullBarcode);
            packingService.getGrnRollInfoForRollId(rollIdReq).then((res => {
                if (res.status) {
                    setScannedRollInfo(res.data);
                    setBtnDisabled(false);
                    getTrayInfoForRollId(res.data?.rollInfo?.id);
                } else {
                    addDisplayMsg(res.internalMessage);
                    restForms();
                    setScannedRollInfo(undefined);
                    setScannedRollTray(undefined);
                }

            })).catch(error => {
                addDisplayMsg(error.message)
            })
        } else {
            addDisplayMsg('Please Enter A Valid Roll Barcode');
            restForms();
        }

    }
    const getTrayInfoForRollId = (rollId: number) => {
        const rollIdsRequest = new RollIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [rollId], false);
        trayTrolleyService.getTrayInfoForRollIds(rollIdsRequest).then((res => {
            if (res.status) {
                setScannedRollTray(res.data?.[0]);
                setBtnDisabled(false);
            } else {
                setScannedRollTray(undefined);
                // addDisplayMsg(res.internalMessage);
            }
            setManualBarcodeVal('');
            form.setFieldValue('rollBarcode', '');
            form.setFieldValue('manBarcode', '');
            setTimeout(() => {
                if (trayInputRef.current) {
                    trayInputRef.current.focus();
                }
            }, 1)
        })).catch(error => {
            addDisplayMsg(error.message)
        })
    }


    const onFinish = () => {
        form.validateFields().then((values: any) => {
            setBtnDisabled(true);
            const { manualTray } = values;
            if (!manualTray) {
                addDisplayMsg("Please select Tray");
                setTimeout(() => {
                    if (trayInputRef.current) {
                        trayInputRef.current.focus();
                    }
                }, 1)
                return;
            }
            validateAndTrayRollMapping(selectedManualTray);
        }).catch(err => console.log(err.message));
    };

    const searchManualTray = (newValue: string) => {
        const matchedObjects = allTraysInfo.filter((item) => {
            // Convert both the label and value to lowercase for case-insensitive matching         
            const valueLowerCase = item.label.toLowerCase();
            const inputLowerCase = newValue.toLowerCase();
            // Check if the label or value contains the input string
            return valueLowerCase.includes(inputLowerCase);
        });
        setSearchedManualTrays(newValue ? matchedObjects : []);
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

    const changeManualTray = (trayId: string, displayVal) => {
        setSelectedManualTray(displayVal['id']);
        // setSelectedManualTrayDisplayVal(displayVal['label']);
        setSearchedManualTrays([])
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

    const scanTrayBarcode = (e: any) => {
        removeDIsplayMsg();
        const fullBarcode = e.target.value;
        // const barcodeParts = fullBarcode.split('-');
        const prefix:string = fullBarcode.slice(0, 4);
        // const trayNumber = fullBarcode.slice(4);
        // Here we need get tray id for tray barcode if it's not barcode like TR-56       
        const trayObj = allTraysInfo.find(e=>e.barCode == fullBarcode);

        // Add Suffix here 
    
        if (prefix.toUpperCase() == 'TRAY' && trayObj) {
            setBtnDisabled(true);
            validateAndTrayRollMapping(Number(trayObj.value));
        } else {
            addDisplayMsg("Please Scan A Valid Tray");
            form.setFieldValue('trayBarcode', '');
            setBtnDisabled(false);

        }
    }



    const validateAndTrayRollMapping = (trayId: number): boolean | void => {
        const { barcode, externalRollNumber, id } = scannedRollInfo?.rollInfo;
        if (scannedRollTray && scannedRollTray.id == trayId) {
            addDisplayMsg('The current roll you are scanning is already in the current Tray you selected');
            setBtnDisabled(false);
            form.setFieldValue('trayBarcode', '');
            return;
        } else {
            const trayRollMapReq = new TrayRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, trayId, [id], false);
            trayTrolleyService.mapRollToTray(trayRollMapReq).then((res => {
                if (res.status) {
                    addDisplayMsg(res.internalMessage, true);
                    restForms();
                } else {
                    addDisplayMsg(res.internalMessage);
                }
                setScannedRollInfo(undefined);
                setScannedRollTray(undefined);
                setManualBarcodeVal('');
                setBtnDisabled(false);
                form.setFieldValue('trayBarcode', '')
                form.setFieldValue('rollBarcode', '')
            })).catch(error => {
                addDisplayMsg(error.message);
                setBtnDisabled(false);
            })
        }
    }
    const validateAndTrayRollUnMapping = (): boolean | void => {

        const { barcode, externalRollNumber, id } = scannedRollInfo?.rollInfo;

        if (!scannedRollTray) {
            addDisplayMsg('Roll not mapped to tray..!');
            setBtnDisabled(false);
            setScannedRollInfo(undefined);
            setScannedRollTray(undefined);
            restForms();
            return;
        } else {
            const trayRollMapReq = new TrayRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, scannedRollTray?.id, [id], false);
            trayTrolleyService.unmapRollFromTray(trayRollMapReq).then((res => {
                if (res.status) {
                    addDisplayMsg(res.internalMessage, true);
                    restForms();
                } else {
                    addDisplayMsg(res.internalMessage);
                }
                setManualBarcodeVal('');
                setBtnDisabled(false);
                form.setFieldValue('trayBarcode', '');
                form.setFieldValue('rollBarcode', '');
                setScannedRollInfo(undefined);
                setScannedRollTray(undefined);
                restForms();
            })).catch(error => {
                addDisplayMsg(error.message);
                setBtnDisabled(false);
            })
        }
    }
    const changeActionType = ({ target: { value } }: RadioChangeEvent) => {
        setActionType(value);
        restForms();
        setScannedRollInfo(undefined);
        setScannedRollTray(undefined);
    }

    const beforeScanTrayBarcode = (value: any) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanTrayBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }
    return (
        <>
            <Col style={{ display: 'flex', justifyContent: 'center' }} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} >
                <Card
                    size="small"
                    title='Roll Tray Allocation'
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

                            <Form.Item  label="Select Action" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                <Radio.Group defaultValue="allocate" buttonStyle="solid" onChange={changeActionType}>
                                    <Radio value="allocate">Allocate</Radio>
                                    <Radio value="deAllocate">De-Allocate</Radio>
                                </Radio.Group>
                            </Form.Item>
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
                                name="tray-form"
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
                                                    <th>Object Number</th>
                                                    <th>Lot Number</th>
                                                    <th>Object Barcode</th>
                                                    <th>Quantity</th>
                                                    <th>Allocated Qty</th>
                                                    <th>Issued Qty</th>
                                                    <th>Tray Code</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{scannedRollInfo.rollInfo.externalRollNumber}</td>
                                                    <td>{scannedRollInfo.rollInfo.lotNumber}</td>
                                                    <td>{scannedRollInfo.rollInfo.barcode}</td>
                                                    <td>{scannedRollInfo.rollInfo.supplierQuantity}</td>
                                                    <td>{scannedRollInfo.rollInfo.allocatedQuantity}</td>
                                                    <td>{scannedRollInfo.rollInfo.issuedQuantity}</td>
                                                    <td>{scannedRollTray?.code}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </Col>
                                </Row>
                                <br />
                                {actionType === ActionTypeEnum.allocate && <>
                                    <Form.Item name="trayBarcode" label="Scan Tray Barcode" rules={[{ required: false }]}>
                                        <Input placeholder="Scan Tray Barcode" ref={trayInputRef} onChange={beforeScanTrayBarcode} prefix={<ScanOutlined />} />
                                    </Form.Item>



                                    <Form.Item name="manualTray" label="Search Tray Code" rules={[{ required: false }]}>
                                        <Select
                                            showSearch
                                            // value={selectedManualTrayDisplayVal}
                                            placeholder={'Search Tray'}
                                            defaultActiveFirstOption={false}
                                            suffixIcon={null}
                                            filterOption={false}
                                            onSearch={searchManualTray}
                                            onChange={changeManualTray}
                                            notFoundContent={null}
                                            options={(searchedManualTrays || []).map((d) => ({
                                                value: d.label,
                                                label: d.label,
                                                id: d.value,
                                                key: d.value
                                            }))}
                                        />
                                    </Form.Item>
                                </>
                                }

                                <Form.Item {...tailLayout}><Space>
                                    {actionType === ActionTypeEnum.allocate ?
                                        <Button type="primary" onClick={onFinish} disabled={btnDisabled}> Allocate </Button>
                                        : <Button type="primary" danger onClick={validateAndTrayRollUnMapping} disabled={btnDisabled}> De-Allocate </Button> }
                                    <Button htmlType="button" onClick={restForms}>Reset</Button>
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