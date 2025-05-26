import { ScanOutlined } from "@ant-design/icons";
import { BinDetailsModel, RackIdsAndLevelsRequest, TrolleyBinMappingRequest, TrollyBarcodesRequest, TrollyIdsRequest, TrollyModel } from "@xpparel/shared-models";
import { BinsServices, TrayTrolleyService, TrolleysServices } from "@xpparel/shared-services";
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
export const BinTrolleyAllocation = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();
    const [scannedTrolleyInfo, setScannedTrolleyInfo] = useState<TrollyModel>();
    const [binInfo, setBinInfo] = useState<BinDetailsModel>();
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();

    const [selectedManualBin, setSelectedManualBin] = useState<number>();
    const [searchedManualBins, setSearchedManualBins] = useState<SelectProps['options']>([]);
    const [allBinsInfo, setAllBinsInfo] = useState<LabelVal[]>([]);
    const [actionType, setActionType] = useState<ActionTypeEnum>(ActionTypeEnum.allocate);

    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);

    const trayTrolleyService = new TrayTrolleyService();
    const trolleysServices = new TrolleysServices();
    const binsServices = new BinsServices();

    const [form] = Form.useForm();
    const trolleyInputRef = useRef(null);
    const binInputRef = useRef(null);

    useEffect(() => {
        getAllBinsForRack();
    }, [])
    const getAllBinsForRack = () => {
        const req = new RackIdsAndLevelsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, [1]);
        binsServices.getSpecificLevelBinsOfAllRacks(req).then((res => {
            if (res.status) {
                const allTrays = res.data?.[0].binData.map(binsObj => {
                    return { label: binsObj.binCode, value: binsObj.binId, barcode: binsObj.binBarcode }
                });
                setAllBinsInfo(allTrays);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllBinsInfo([]);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const scanTrolleyBarcode = (value: string) => {
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
        // const prefix = fullBarcode.slice(0, 7);;
        // if (prefix == 'TROLLEY') {
            form.setFieldValue('manualBin', '')
            const rollIdReq = new TrollyBarcodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [fullBarcode], false, true, false, false);
            trolleysServices.getTrollysByTrollyBarcodes(rollIdReq).then((res => {
                if (res.status) {
                    setScannedTrolleyInfo(res.data?.[0]);
                    setBtnDisabled(false);
                    getBinInfoForTrolleyIds(res.data?.[0]?.id);
                } else {
                    addDisplayMsg(res.internalMessage);
                    restForms();
                    setScannedTrolleyInfo(undefined);

                }

            })).catch(error => {
                addDisplayMsg(error.message)
            })
        // } else {
        //     addDisplayMsg('Please Enter A Valid Trolly Barcode');
        //     restForms();
        // }

    }
    const getBinInfoForTrolleyIds = (trolleyId: number) => {
        const rollIdsRequest = new TrollyIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [trolleyId], false, true, false);
        trayTrolleyService.getBinInfoForTrolleyIds(rollIdsRequest).then((res => {
            if (res.status) {
                setBinInfo(res.data?.[0]);
                setBtnDisabled(false);
            } else {
                setBinInfo(undefined);
                // addDisplayMsg(res.internalMessage);
            }
            setManualBarcodeVal('');
            form.setFieldValue('trolleyBarcode', '');
            form.setFieldValue('manBarcode', '');
            setTimeout(() => {
                if (binInputRef.current) {
                    binInputRef.current.focus();
                }
            }, 1)
        })).catch(error => {
            addDisplayMsg(error.message)
        })
    }
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            setBtnDisabled(true);
            const { manualBin } = values;
            if (!manualBin) {
                addDisplayMsg("Please select Bin Before Confirm.");
                setTimeout(() => {
                    if (binInputRef.current) {
                        binInputRef.current.focus();
                    }
                }, 1)
                return;
            }
            validateAndBinTrolleyMapping(selectedManualBin);
        }).catch(err => console.log(err.message));
    };

    const searchManualBin = (newValue: string) => {
        const matchedObjects = allBinsInfo.filter((item) => {
            // Convert both the label and value to lowercase for case-insensitive matching         
            const valueLowerCase = item.label.toLowerCase();
            const inputLowerCase = newValue.toLowerCase();
            // Check if the label or value contains the input string
            return valueLowerCase.includes(inputLowerCase);
        });
        setSearchedManualBins(newValue ? matchedObjects : []);
    };

    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        scanBarcode(val.trim());
    }

    const rollInputFocus = () => {
        if (trolleyInputRef.current) {
            trolleyInputRef.current.focus();
        }
    }

    const changeManualBin = (trayId: string, displayVal) => {
        setSelectedManualBin(displayVal['id']);
        // setSelectedManualTrolleyDisplayVal(displayVal['label']);       
        setSearchedManualBins([])
    };

    const restForms = () => {
        form.resetFields();
        setScannedTrolleyInfo(undefined);
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

    const scanBinBarcode = (e: any) => {
        removeDIsplayMsg();
        const fullBarcode = e.target.value;
        const barcodeParts = fullBarcode.split('-');
        const prefix = barcodeParts[0];
        const secondPrefix = barcodeParts[1];
        // Here we need get tray id for tray barcode if it's not barcode like TR-56

        const binObj = allBinsInfo.find(e => e.barcode == fullBarcode);
        // Add Suffix here  
        if (prefix == 'RA' && secondPrefix == 'BN' && binObj) {
            setBtnDisabled(true);
            validateAndBinTrolleyMapping(Number(binObj.value));
        } else {
            addDisplayMsg("Please Scan A Valid Bin");
            form.setFieldValue('binBarcode', '');
            setBtnDisabled(false);

        }
    }



    const validateAndBinTrolleyMapping = (binId: number): boolean | void => {
        const { id } = scannedTrolleyInfo;

        if (binInfo && binInfo.binId == binId) {
            addDisplayMsg('The current tray you are scanning is already in the current Trolly you selected');
            setBtnDisabled(false);
            form.setFieldValue('binBarcode', '');
            return;
        } else {
            const binTrolleyMapReq = new TrolleyBinMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, binId, id, false);
            trayTrolleyService.mapTrolleyToBin(binTrolleyMapReq).then((res => {
                if (res.status) {
                    addDisplayMsg(res.internalMessage, true);
                    restForms();
                } else {
                    addDisplayMsg(res.internalMessage);
                }
                setManualBarcodeVal('');
                setBtnDisabled(false);
                setScannedTrolleyInfo(undefined);
                setBinInfo(undefined);
                form.setFieldValue('binBarcode', '')
                form.setFieldValue('trolleyBarcode', '')
            })).catch(error => {
                addDisplayMsg(error.message);
                setBtnDisabled(false);
            })
        }
    }
    const validateAndBinTrolleyUnMapping = (): boolean | void => {

        const { id } = scannedTrolleyInfo;

        if (!binInfo) {
            addDisplayMsg('Trolly not mapped to Bin..!');
            setBtnDisabled(false);
            setScannedTrolleyInfo(undefined);

            restForms();
            return;
        } else {
            const binTrolleyMapReq = new TrolleyBinMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, binInfo?.binId, id, false);
            trayTrolleyService.unmapTrolleyFromBin(binTrolleyMapReq).then((res => {
                if (res.status) {
                    addDisplayMsg(res.internalMessage, true);
                    restForms();
                } else {
                    addDisplayMsg(res.internalMessage);
                }
                setManualBarcodeVal('');
                setBtnDisabled(false);
                form.setFieldValue('binBarcode', '');
                form.setFieldValue('trolleyBarcode', '');
                setScannedTrolleyInfo(undefined);

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
        setScannedTrolleyInfo(undefined);

    }

    const beforeScanBinBarcode = (value: any) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanBinBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }
    return (
        <>
            <Col style={{ display: 'flex', justifyContent: 'center' }} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }} >
                <Card
                    size="small"
                    title='Trolly Bin Allocation'
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
                            <Form.Item label="Scan Trolly Barcode">
                                <Space>
                                    <Form.Item name="trolleyBarcode" noStyle >
                                        <Input placeholder="Scan Trolly Barcode" ref={trolleyInputRef} onChange={(e) => scanTrolleyBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                    </Form.Item>
                                    <Form.Item name="manBarcode" noStyle initialValue={manualBarcodeVal}>
                                        <Search placeholder="Type Trolly Barcode" onSearch={manualBarcode} enterButton />
                                    </Form.Item>
                                </Space>
                            </Form.Item>
                        </Form>

                        {/* </Col> */}
                    </Row>

                    <Row justify="center">
                        {scannedTrolleyInfo && <>
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
                                                    <th>Trolly Code</th>
                                                    <th>Capacity</th>
                                                    <th>Current No of Trays </th>
                                                    <th>Bin Code</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{scannedTrolleyInfo.code}</td>
                                                    <td>{scannedTrolleyInfo.capacity}</td>
                                                    <td>{scannedTrolleyInfo.trayIds.length}</td>
                                                    <td>{binInfo?.binCode}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </Col>
                                </Row>
                                <br />
                                {actionType === ActionTypeEnum.allocate && <>
                                    <Form.Item name="binBarcode" label="Scan Bin Barcode" rules={[{ required: false }]}>
                                        <Input placeholder="Scan Bin Barcode" ref={binInputRef} onChange={beforeScanBinBarcode} prefix={<ScanOutlined />} />
                                    </Form.Item>



                                    <Form.Item name="manualBin" label="Search Bin Code" rules={[{ required: false }]}>
                                        <Select
                                            showSearch
                                            // value={selectedmanualBinDisplayVal}
                                            placeholder={'Search Bin'}
                                            defaultActiveFirstOption={false}
                                            suffixIcon={null}
                                            filterOption={false}
                                            onSearch={searchManualBin}
                                            onChange={changeManualBin}
                                            notFoundContent={null}
                                            options={(searchedManualBins || []).map((d) => ({
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
                                        : <Button type="primary" danger onClick={validateAndBinTrolleyUnMapping} disabled={btnDisabled}> De-Allocate </Button>}
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