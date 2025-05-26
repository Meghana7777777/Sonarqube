import { ScanOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, GrnRollInfoModel, RollIdRequest, RollIdsRequest, TrayBarcodesRequest, TrayIdsRequest, TrayModel, TrayTrolleyMappingRequest, TrollyModel } from "@xpparel/shared-models";
import { PackingListService, TrayTrolleyService, TraysServices, TrolleysServices } from "@xpparel/shared-services";
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
    barcode: string;
}
enum ActionTypeEnum {
    allocate = 'allocate',
    deAllocate = 'deAllocate'
}
export const TrolleyTrayAllocation = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
    const [scannedTrayInfo, setScannedTrayInfo] = useState<TrayModel>();
    const [trolleyInfo, setTrolleyInfo] = useState<TrollyModel>();
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();

    const [selectedManualTrolley, setSelectedManualTrolley] = useState<number>();
    const [searchedManualTrolleys, setSearchedManualTrolleys] = useState<SelectProps['options']>([]);
    const [allTrolleysInfo, setAllTrolleysInfo] = useState<LabelVal[]>([]);
    const [actionType, setActionType] = useState<ActionTypeEnum>(ActionTypeEnum.allocate);

    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);




    const trayTrolleyService = new TrayTrolleyService();
    const trayMasterService = new TraysServices();
    const trolleysServices = new TrolleysServices();

    const [form] = Form.useForm();
    const rollInputRef = useRef(null);
    const trayInputRef = useRef(null);

    useEffect(() => {
        getAllTrolleys();
    }, [])
    const getAllTrolleys = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        trolleysServices.getAllTrollys(req).then((res => {
            if (res.status) {
                const allTrays = res.data.map(trolleyObj => {
                    return { label: trolleyObj.code, value: trolleyObj.id, barcode: trolleyObj.barcode }
                });
                setAllTrolleysInfo(allTrays);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllTrolleysInfo([]);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const scanTrayBarcode = (value: string) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const scanBarcode = (fullBarcode: string) => {

        removeDIsplayMsg();
        // const barcodeParts = fullBarcode.split('-');
        // const prefix = barcodeParts[0];
        // const prefix:string = fullBarcode.slice(0, 4);
        // if (prefix == 'TRAY') {
            form.setFieldValue('manualTrolley', '')
            const rollIdReq = new TrayBarcodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [fullBarcode], false, false, true);
            trayMasterService.getTraysByTrayBarcodes(rollIdReq).then((res => {
                if (res.status) {
                    setScannedTrayInfo(res.data?.[0]);
                    setBtnDisabled(false);
                    getTrolleyInfoForTrayIds(res.data?.[0]?.id);
                } else {
                    addDisplayMsg(res.internalMessage);
                    restForms();
                    setScannedTrayInfo(undefined);

                }

            })).catch(error => {
                addDisplayMsg(error.message)
            })
        // } else {
        //     addDisplayMsg('Please Enter A Valid Tray Barcode');
        //     restForms();
        // }

    }
    const getTrolleyInfoForTrayIds = (trayId: number) => {
        const rollIdsRequest = new TrayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [trayId], false, true, false);
        trayTrolleyService.getTrolleyInfoForTrayIds(rollIdsRequest).then((res => {
            if (res.status) {
                setTrolleyInfo(res.data?.[0]);
                setBtnDisabled(false);
            } else {
                setTrolleyInfo(undefined);
                // addDisplayMsg(res.internalMessage);
            }
            setManualBarcodeVal('');
            form.setFieldValue('trayBarcode', '');
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
            const { manualTrolley } = values;
            if (!manualTrolley) {
                addDisplayMsg("Please Select Trolly");               
                setTimeout(() => {
                    if (trayInputRef.current) {
                        trayInputRef.current.focus();
                    }
                }, 1)
                return;
            }
            validateAndTrolleyTrayMapping(selectedManualTrolley);
        }).catch(err => console.log(err.message));
    };

    const searchManualTrolley = (newValue: string) => {
        const matchedObjects = allTrolleysInfo.filter((item) => {
            // Convert both the label and value to lowercase for case-insensitive matching         
            const valueLowerCase = item.label.toLowerCase();
            const inputLowerCase = newValue.toLowerCase();
            // Check if the label or value contains the input string
            return valueLowerCase.includes(inputLowerCase);
        });
        setSearchedManualTrolleys(newValue ? matchedObjects : []);
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

    const changeManualTrolley = (trayId: string, displayVal) => {
        setSelectedManualTrolley(displayVal['id']);
        // setSelectedManualTrolleyDisplayVal(displayVal['label']);       
        setSearchedManualTrolleys([]);        
        setBtnDisabled(false);
    };

    const restForms = () => {
        form.resetFields();
        setScannedTrayInfo(undefined);
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

    const scanTrolleyBarcode = (e: any) => {
        removeDIsplayMsg();
        const fullBarcode = e.target.value;
        // const barcodeParts = fullBarcode.split('-');
        const prefix:string = fullBarcode.slice(0, 7);
        // Here we need get tray id for tray barcode if it's not barcode like TR-56

        const trolleyObj = allTrolleysInfo.find(e => e.barcode == fullBarcode);
        // Add Suffix here 
        if (trolleyObj) {
            setBtnDisabled(true);
            validateAndTrolleyTrayMapping(Number(trolleyObj.value));
        } else {
            addDisplayMsg("Please Scan A Valid Trolly");
            form.setFieldValue('trolleyBarcode', '');
            setBtnDisabled(false);

        }
    }



    const validateAndTrolleyTrayMapping = (trolleyId: number): boolean | void => {
        const { trollyId, id } = scannedTrayInfo;

        if (trolleyInfo && trolleyInfo.id == trolleyId) {
            addDisplayMsg('The current tray you are scanning is already in the current Trolley you selected');
            setBtnDisabled(false);
            form.setFieldValue('trolleyBarcode', '');
            return;
        } else {
            const trolleyTrayMapReq = new TrayTrolleyMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [id], trolleyId, false);
            trayTrolleyService.mapTrayToTrolley(trolleyTrayMapReq).then((res => {
                if (res.status) {
                    addDisplayMsg(res.internalMessage, true);
                    restForms();
                } else {
                    addDisplayMsg(res.internalMessage);
                }
                setManualBarcodeVal('');
                setBtnDisabled(false);
                setScannedTrayInfo(undefined);
                setTrolleyInfo(undefined);
                form.setFieldValue('trolleyBarcode', '')
                form.setFieldValue('trayBarcode', '')
            })).catch(error => {
                addDisplayMsg(error.message);
                setBtnDisabled(false);
            })
        }
    }
    const validateAndTrolleyTrayUnMapping = (): boolean | void => {

        const { id } = scannedTrayInfo;

        if (!trolleyInfo) {
            addDisplayMsg('Tray not mapped to Trolly..!');
            setBtnDisabled(false);
            setScannedTrayInfo(undefined);

            restForms();
            return;
        } else {
            const trolleyTrayMapReq = new TrayTrolleyMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [id], trolleyInfo?.id, false);
            trayTrolleyService.unmapTrayFromTrolley(trolleyTrayMapReq).then((res => {
                if (res.status) {
                    addDisplayMsg(res.internalMessage, true);
                    restForms();
                } else {
                    addDisplayMsg(res.internalMessage);
                }
                setManualBarcodeVal('');
                setBtnDisabled(false);
                form.setFieldValue('trolleyBarcode', '');
                form.setFieldValue('trayBarcode', '');
                setScannedTrayInfo(undefined);

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
        setScannedTrayInfo(undefined);

    }

    const beforeScanTrolleyBarcode = (value: any) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanTrolleyBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }
    return (
        <>
            <Col style={{ display: 'flex', justifyContent: 'center' }} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} >
                <Card
                    size="small"
                    title='Tray Trolly Allocation'
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

                            <Form.Item label="Select Action" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                <Radio.Group defaultValue="allocate" buttonStyle="solid" onChange={changeActionType}>
                                    <Radio value="allocate">Allocate</Radio>
                                    <Radio value="deAllocate">De-Allocate</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="Scan Tray Barcode">
                                <Space>
                                    <Form.Item name="trayBarcode" noStyle >
                                        <Input placeholder="Scan Tray Barcode" ref={rollInputRef} onChange={(e) => scanTrayBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                    </Form.Item>
                                    <Form.Item name="manBarcode" noStyle initialValue={manualBarcodeVal}>
                                        <Search placeholder="Type Tray Barcode" onSearch={manualBarcode} enterButton />
                                    </Form.Item>
                                </Space>
                            </Form.Item>
                        </Form>

                        {/* </Col> */}
                    </Row>

                    <Row justify="center">
                        {scannedTrayInfo && <>
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
                                                    <th>Tray Code</th>
                                                    <th>Capacity</th>
                                                    <th>Current No of Allocated Rolls </th>
                                                    <th>Trolly Code</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{scannedTrayInfo.code}</td>
                                                    <td>{scannedTrayInfo.capacity}</td>
                                                    <td>{scannedTrayInfo.rollIds.length}</td>
                                                    <td>{trolleyInfo?.code}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </Col>
                                </Row>
                                <br />
                                {actionType === ActionTypeEnum.allocate && <>
                                    <Form.Item name="trolleyBarcode" label="Scan Trolly Barcode" rules={[{ required: false }]}>
                                        <Input placeholder="Scan Trolly Barcode" ref={trayInputRef} onChange={beforeScanTrolleyBarcode} prefix={<ScanOutlined />} />
                                    </Form.Item>



                                    <Form.Item name="manualTrolley" label="Search Trolly Code" rules={[{ required: false }]}>
                                        <Select
                                            showSearch
                                            // value={selectedManualTrolleyDisplayVal}
                                            placeholder={'Search Trolly'}
                                            defaultActiveFirstOption={false}
                                            suffixIcon={null}
                                            filterOption={false}
                                            onSearch={searchManualTrolley}
                                            onChange={changeManualTrolley}
                                            notFoundContent={null}
                                            options={(searchedManualTrolleys || []).map((d) => ({
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
                                        : <Button type="primary" danger onClick={validateAndTrolleyTrayUnMapping} disabled={btnDisabled}> De-Allocate </Button>}
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