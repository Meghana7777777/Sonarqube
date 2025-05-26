import { BarcodePrefixEnum, cartonBarcodePatternRegExp, cartonBarcodeRegExp, CartonBasicInfoUIModel, CartonIdRequest, CommonRequestAttrs, ContainerCartonMappingRequest, ContainerCartonsUIModel, ContainerDetailsModel, ContainerIdRequest, FgContainerFilterRequest, FgContainerLocationStatusEnum, FgCurrentContainerLocationEnum, FgWhHeaderIdReqDto, FgWhLinesResDto, PGCartonInfoModel, ScanToPackRequest, WareHouseResponseDto } from "@xpparel/shared-models";
import { FGLocationAllocationService, PackListService, PKMSFgWarehouseService, WareHouseService } from "@xpparel/shared-services";
import { Badge, Button, Card, Col, Collapse, Descriptions, Empty, Form, Input, message, Modal, Popover, Row, Select, Space, Table, Tag, Tooltip } from "antd";

import { CopyOutlined, ExclamationCircleFilled, ScanOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";
import { getCssFromComponent } from "../__masters__/print-barcodes";
import { constructWarehouseCarton } from "../fg-warehouse-dashboard/ware-house-helpers";
import './container-to-carton-allocation.css';
import { copyToCliBoard } from "../../../common/handle-to-cliboard-copy/handle-cliboard-write-text";


const { Option } = Select;
const { Panel } = Collapse;
const { Search } = Input;
const { confirm } = Modal;

interface IFGContainerToCartonAllocationProps {
    fgWhHeaderId?: number;
    pendingBarCodes?: string[];
}
export const FGContainerToCartonAllocation = (props: IFGContainerToCartonAllocationProps) => {
    const { fgWhHeaderId, pendingBarCodes } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [debounceTimer, setDebounceTimer] = useState<any>();

    const [whData, setWhData] = useState<WareHouseResponseDto[]>([]);
    // const [selectedWh, setSelectedWh] = useState(null);


    const [allContainers, setAllContainers] = useState<ContainerDetailsModel[]>([]);
    const [scannedCartonInfo, setScannedCartonInfo] = useState<PGCartonInfoModel>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    // const [selectedContainer, setSelectedContainer] = useState<string>(null);
    const [selectedContainerDetails, setSelectedContainerDetails] = useState<ContainerDetailsModel>(null);
    const [containerInfo, setContainerInfo] = useState<ContainerCartonsUIModel>();
    const [selectedContainerInfo, setSelectedContainerInfo] = useState<ContainerCartonsUIModel>();
    const [modalOpen, setModalOpen] = useState(false);
    const [fgWhLines, setFgWhLines] = useState<FgWhLinesResDto[]>([]);
    const [PendingCartonsInPalletisation, setPendingCartonsInPalletisation] = useState<Set<string>>(new Set(pendingBarCodes && pendingBarCodes?.length ? pendingBarCodes : []));
    const [pendingBarCodesInPalletisation, setPendingBarCodesInPalletisation] = useState<Set<string>>(new Set(pendingBarCodes && pendingBarCodes?.length ? pendingBarCodes : []));


    const { userName, orgData, userId } = user;

    const [form] = Form.useForm();
    const cartonInputRef = useRef(null);

    const pkListService = new PackListService();
    const locationService = new FGLocationAllocationService();
    const whService = new WareHouseService()
    const fgWHService = new PKMSFgWarehouseService();

    useEffect(() => {
        getAllWareHouse();
        getAllSpaceFreeContainersInWarehouse(undefined, undefined);
    }, []);


    useEffect(() => {
        if (fgWhHeaderId)
            getFgWhReqLines(fgWhHeaderId)
    }, [fgWhHeaderId]);

    const getFgWhReqLines = (requestId: number) => {
        const req = new FgWhHeaderIdReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, requestId)
        fgWHService.getFgWhReqLines(req).then(res => {
            if (res.status) {
                setFgWhLines(res.data);
            } else {
                setFgWhLines([]);
            };
        }).catch(err => console.log(err.message));
    }


    const getAllWareHouse = () => {
        const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId)
        whService.getAllWareHouse(req).then(res => {
            if (res.status) {
                setWhData(res.data)
            } else {
                setWhData([])
            }
        }).catch(err => console.log(err.message))
    }

    useEffect(() => {
        cartonInputFocus()
    }, [selectedContainerDetails]);


    const getAllSpaceFreeContainersInWarehouse = (whId: number, rackId: number) => {
        const phIdReq = new FgContainerFilterRequest(user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId, whId, rackId ? [rackId] : undefined);
        locationService.getAllSpaceFreeContainersInWarehouse(phIdReq).then((res => {
            if (res.status) {
                setAllContainers(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllContainers([]);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }

    const cartonInputFocus = () => {
        if (cartonInputRef.current) {
            cartonInputRef.current.focus();
        }
    }

    const restForms = () => {
        form.setFieldsValue({
            cartonBarcode: '',
            manBarcode: ''
        });
        setManualBarcodeVal('');
        setTimeout(() => cartonInputFocus(), 1)
        cartonInputFocus();
    }

    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        scanBarcode(val.trim());
    }

    const scanBarcode = (fullBarcode: string) => {
        if (props?.pendingBarCodes && props?.pendingBarCodes?.length) {
            if (!props?.pendingBarCodes.includes(fullBarcode)) {
                AlertMessages.getErrorMessage(`You can't palletise cartons other than the cartons in this request`);
                restForms();
            }
        }
        const prefix = fullBarcode.charAt(0);
        const barcode = Number(fullBarcode.substring(1));
        if (prefix == BarcodePrefixEnum.CARTON) {
            const rollIdReq = new ScanToPackRequest(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, barcode, fullBarcode, undefined, undefined);
            pkListService.getPGCartonInfoForCartonBarcode(rollIdReq).then((res => {
                if (res.status) {
                    setScannedCartonInfo(res.data);
                    validateCartonContainerMapping(res.data, selectedContainerDetails?.containerId);
                    setPendingBarCodesInPalletisation((prev) => {
                        const previous = new Set(prev);
                        previous.delete(fullBarcode);
                        return previous;
                    })
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setManualBarcodeVal('');
                form.setFieldValue('cartonBarcode', '');
                form.setFieldValue('manBarcode', '');
            })).catch(error => {
                console.log(error)
                AlertMessages.getErrorMessage(error.message)
            })
        } else {
            AlertMessages.getErrorMessage('Please Enter A Valid Carton Barcode');
            restForms();
        }
    }

    const showConfirmForMultipleMsgs = (msgs: string[], rollIdL: number, cartonBarcodeL: string, containerIdL: number) => {
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
                rollContainerMapping(rollIdL, cartonBarcodeL, containerIdL);
            },
            onCancel() {
                form.setFieldValue('containerBarcode', '')
            },
        });
    };

    const validateCartonContainerMapping = (pgCartonInfo: PGCartonInfoModel, containerIdL: number, isContainerDiff = false,) => {
        const overrideAlloc = pgCartonInfo?.defaultContainerId > 0;
        const phId = pgCartonInfo.cartonInfo?.packOrderId;
        const reqFor = false ? FgCurrentContainerLocationEnum.INSPECTION : FgCurrentContainerLocationEnum.WAREHOUSE
        const rollIdReq = new CartonIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, pgCartonInfo.cartonInfo.cartonId, pgCartonInfo.cartonInfo.barcode);
        const phIdReq = new ContainerCartonMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, containerIdL, overrideAlloc, reqFor, false, [rollIdReq]);
        locationService.validateConfirmCartonsToContainer(phIdReq).then((res => {
            const validationMsgs: string[] = [];
            if (isContainerDiff) {
                validationMsgs.push('System Suggested Container and Scanned Container are different. Do you want proceed Manual Container?')
            }
            if (res.status) {
                const data = res.data[0];
                if ((data.currentConfirmedCartonsInContainer + 1) > data.totalContainerCapacity) {
                    validationMsgs.push('Capacity Override - ' + data.totalContainerCapacity);
                    // AlertMessages.getErrorMessage('Capacity override - ' + data.totalContainerCapacity);
                }
                validationMsgs.length > 0 ? showConfirmForMultipleMsgs(validationMsgs, pgCartonInfo.cartonInfo.cartonId, pgCartonInfo.cartonInfo.barcode, containerIdL) : rollContainerMapping(pgCartonInfo.cartonInfo.cartonId, pgCartonInfo.cartonInfo.barcode, containerIdL);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const rollContainerMapping = (rollIdL: number, cartonBarcodeL: string, containerIdL: number) => {
        const overrideAlloc = true;
        const markAsIssued = undefined;
        const insCartonOverride = true;
        const phId = scannedCartonInfo?.cartonInfo?.packOrderId;
        const reqFor = scannedCartonInfo?.cartonInfo?.inspectionPick ? FgCurrentContainerLocationEnum.INSPECTION : FgCurrentContainerLocationEnum.WAREHOUSE
        const rollIdReq = new CartonIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollIdL, cartonBarcodeL);
        const phIdReq = new ContainerCartonMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, containerIdL, overrideAlloc, reqFor, false, [rollIdReq], markAsIssued, insCartonOverride);
        locationService.confirmCartonsToContainer(phIdReq).then((res => {
            if (res.status) {
                getWarehouseContainerMappingInfoWithCartons(selectedContainerDetails.containerId, selectedContainerDetails.containerCode)
                AlertMessages.getSuccessMessage(res.internalMessage);
                restForms();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
            setManualBarcodeVal('');
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        })
    }

    const scanCartonBarcode = (value: string) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const containerOnChangeHandler = (containerCode: string) => {
        // setSelectedContainer(containerCode);
        const containerDetailData = allContainers.find(containerObj => containerObj.containerCode == containerCode)
        setSelectedContainerDetails(containerDetailData);
        getWarehouseContainerMappingInfoWithCartons(containerDetailData?.containerId, containerDetailData?.containerCode)
    };

    const getWarehouseContainerMappingInfoWithCartons = (containerId: number, containerCode: string) => {
        const phIdReq = new ContainerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, containerId, containerCode);
        locationService.getWarehouseContainerMappingInfoWithCartons(phIdReq).then((res => {
            if (res.status) {
                setSelectedContainerDetails((prev) => {
                    const previous = prev;
                    previous.totalConfirmedCartons = res.data[0].totalMappedCartons;
                    previous.maxItems = res.data[0].maxItems;
                    return prev;
                })
                setContainerInfo(constructWarehouseCarton(res.data[0]))
            } else {
                setContainerInfo(undefined)
            }
        })).catch(error => {
            setContainerInfo(undefined)
            AlertMessages.getErrorMessage(error.message)
        })
    };


    const toolTip = (cartonInfo: CartonBasicInfoUIModel) => {
        return <div>
            <Descriptions
                // title={cartonInfo.rollNumber}
                bordered
                size='small'
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Carton No">{cartonInfo.cartonNo}</Descriptions.Item>
                <Descriptions.Item label="Barcode No">{cartonInfo.barcode}</Descriptions.Item>
                <Descriptions.Item label="Net Weight">{cartonInfo.netWeight}</Descriptions.Item>
                <Descriptions.Item label="Gross Weight">{cartonInfo.grossWeight}</Descriptions.Item>
            </Descriptions>
        </div>
    }

    const handleCopyBarcode = (cartonObj: string) => {
                copyToCliBoard(cartonObj, 'Barcode copied to clipboard');
        
      
    };

    const selectContainer = (containerInfo: ContainerCartonsUIModel) => {
        if (containerInfo) {
            setSelectedContainerInfo(containerInfo);
            setModalOpen(true);
        }
    }
    const closeModel = () => {
        setModalOpen(false);
        setSelectedContainerInfo(undefined);
    }

    const columns: ColumnsType<CartonBasicInfoUIModel> = [
        {
            title: 'Carton No',
            dataIndex: 'cartonNo',
        },
        {
            title: 'Barcode ',
            dataIndex: 'barcode',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
        },

        {
            title: 'Width',
            dataIndex: 'width',
        },
        {
            title: 'Length',
            dataIndex: 'length',
        },
        {
            title: 'Height',
            dataIndex: 'height',
        }
    ]
    const renderTitle = (containerInfoParam: ContainerCartonsUIModel) => {
        let containerCode = containerInfoParam.containerCode;
        let noOfcartons = containerInfoParam.cartonsInfo.length;
        return <Descriptions bordered size={'small'} title={<Space size='middle'><>Container Code : {containerCode} </>No Of Cartons : {noOfcartons} </Space>}
        // extra={<Button type="primary">Print</Button>}
        >

        </Descriptions>
    }

    const whOnChange = (whId: number) => {
        form.resetFields(['container'])
        // setSelectedWh(whId);
        // setSelectedContainer(undefined)
        setSelectedContainerDetails(undefined)
        setSelectedContainerInfo(undefined)
        setContainerInfo(undefined)
        getAllSpaceFreeContainersInWarehouse(whId, undefined);
    }
    const printContainer = async () => {
        const printAreaElement = document.getElementById('printArea') as HTMLElement | null;
        const divContents = printAreaElement?.innerHTML ?? '';
        const element = window.open('', '', 'height=700, width=1024');
        await element?.document.write(divContents);
        await getCssFromComponent(document, element?.document);
        await element?.document.close();
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

    return <Card
        title={'Container Carton Allocation'}
        extra={<>{pendingBarCodesInPalletisation.size ?
            <>{[...pendingBarCodesInPalletisation]?.slice(0, 10).map((rec) => {
                return <Tag
                    bordered
                    color='green'
                    icon={<CopyOutlined />}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCopyBarcode(rec)}
                >{rec}</Tag>
            })}  <Badge
                    count={pendingBarCodesInPalletisation.size}
                /></> : ''}
        </>}
    >
        <Form form={form}>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7 }} lg={{ span: 7 }} xl={{ span: 7 }}>
                    <Form.Item name="whId" label="Select Warehouse" rules={[{ required: false }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Warehouse'}
                            onChange={whOnChange}
                            allowClear
                        >
                            {whData.map(wh => {
                                return <Option value={wh.id} key={wh.id}> {wh.wareHouseCode}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7 }} lg={{ span: 7 }} xl={{ span: 7 }}>
                    <Form.Item name="container" label="Select Container" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Container'}
                            onChange={containerOnChangeHandler}
                            allowClear
                        >
                            {allContainers.map(containerObj => {
                                return <Option value={containerObj.containerCode} key={containerObj.containerId}> {containerObj.containerCode}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            {selectedContainerDetails ? <>
                <Collapse>
                    <Panel header={
                        <Space size="small" wrap>
                            <Col>Container Code : <Tag color="black">{selectedContainerDetails?.containerCode}</Tag></Col>
                            <Col>Barcode : <Tag color="black">{selectedContainerDetails?.barcode}</Tag></Col>
                            <Col>Container Capacity : <Tag color="black"> {selectedContainerDetails?.containerCapacity}
                                &nbsp;
                                ({selectedContainerDetails?.uom})</Tag></Col>
                            <Col>Max Items : <Tag color="black">{selectedContainerDetails?.maxItems}</Tag></Col>
                            <Col>Filled Items : <Tag color="black">{selectedContainerDetails.totalConfirmedCartons}</Tag></Col>
                        </Space>
                    } key="1"
                    >
                        {selectedContainerDetails ? <Descriptions
                            // title="Container Information"
                            bordered
                            column={{ xs: 1, sm: 2, md: 2, lg: 2 }}
                        >
                            <Descriptions.Item label="Barcode">{selectedContainerDetails.barcode}</Descriptions.Item>
                            <Descriptions.Item label="Container Code">{selectedContainerDetails.containerCode}</Descriptions.Item>
                            <Descriptions.Item label="Container Capacity">
                                {selectedContainerDetails.containerCapacity}
                                &nbsp;
                                ({selectedContainerDetails.uom})
                            </Descriptions.Item>
                            <Descriptions.Item label="Max Items">{selectedContainerDetails.maxItems}</Descriptions.Item>
                            <Descriptions.Item label="Container Current Location">
                                {selectedContainerDetails.containerCurrentLoc}
                            </Descriptions.Item>
                            <Descriptions.Item label="Container Current State">
                                {selectedContainerDetails.containerCurrentState}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Confirmed Cartons">
                                {selectedContainerDetails.totalConfirmedCartons}
                            </Descriptions.Item>
                            <Descriptions.Item label="Confirmed Quantity">
                                {selectedContainerDetails.confirmedQty}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Allocated Cartons">
                                {selectedContainerDetails.totalAllocatedCartons}
                            </Descriptions.Item>
                            <Descriptions.Item label="Allocated Quantity">
                                {selectedContainerDetails.allocatedQty}
                            </Descriptions.Item>
                        </Descriptions> : <>Please Select Container</>}
                    </Panel>
                </Collapse>
                <Card>
                    <Row justify="center">
                        <Form
                            form={form}
                            name="roll-form"
                            labelAlign="left"
                        >
                            <Form.Item label="Scan Carton Barcode">
                                <Space>
                                    <Form.Item name="cartonBarcode"
                                        noStyle
                                        rules={[{
                                            required: false, pattern: new RegExp(cartonBarcodeRegExp),
                                            message: 'Please Provide Valid Carton Barcode'
                                        }]}
                                    >
                                        <Input
                                            placeholder="Scan Carton Barcode"
                                            ref={cartonInputRef}
                                            onChange={(e) => {
                                                const pattern = cartonBarcodePatternRegExp;
                                                if (pattern.test(e.target.value)) {
                                                    scanCartonBarcode(e.target.value)
                                                }
                                            }
                                            }
                                            prefix={<ScanOutlined />}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        rules={[{
                                            required: true,
                                            pattern: new RegExp(cartonBarcodeRegExp),
                                            message: 'Please Provide Valid Carton Barcode'
                                        }]}
                                        name="manBarcode"
                                        noStyle
                                        initialValue={manualBarcodeVal}
                                    >
                                        <Search
                                            placeholder="Type Carton Barcode"
                                            onSearch={manualBarcode}
                                            onChange={(e) => {
                                                const pattern = cartonBarcodePatternRegExp;
                                                if (pattern.test(e.target.value)) {
                                                    scanCartonBarcode(e.target.value)
                                                }
                                            }
                                            }
                                            enterButton />
                                    </Form.Item>

                                </Space>
                            </Form.Item>
                        </Form>
                    </Row>
                    <Row justify="center">
                        {containerInfo && <div className='container-map'>
                            <div className='container-box'>
                                <div className='container-container' >
                                    <div className='cartons-container'>
                                        {containerInfo ? containerInfo.cartonsInfo.map(cartonObj => {
                                            return <Popover key={'p' + cartonObj.cartonNo} content={toolTip(cartonObj)}
                                                title={<Space><>Carton Barcode:<Tag style={{ color: 'green' }}> {cartonObj.barcode}</Tag></><>   <Tooltip title="Copy Barcode">
                                                    <CopyOutlined
                                                        onClick={() => handleCopyBarcode(cartonObj.barcode)}
                                                        style={{ fontSize: '16px', cursor: 'pointer', color: 'red' }}
                                                    />
                                                </Tooltip></><>Status: <Tag style={{ color: 'green' }}>{cartonObj.status == FgContainerLocationStatusEnum.OPEN ? 'Not Yet Scanned' : 'Scanned'}</Tag></> <> Carton No:<Tag style={{ color: 'green' }}>{cartonObj.cartonNo}</Tag></> <>Packing List Number:{cartonObj.packListCode}</></Space>}
                                            >
                                                <div key={cartonObj.cartonNo} id={cartonObj.barcode} roll-barcode={cartonObj.barcode} batch-no={cartonObj.packListCode} pack-no={cartonObj.packListCode} className={`carton`}></div>
                                            </Popover>

                                        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                    </div>

                                </div>
                                <div className="container-bottam">
                                    <div className="plank"></div>
                                    <div className="plank"></div>
                                    <div className="plank"></div>
                                </div>

                                <Tooltip title={`Container Name. Click to View & Print `} mouseEnterDelay={0} mouseLeaveDelay={0} color={'cyan'} key={`${selectedContainerDetails?.containerCode}c`}>
                                    <Button size='small'
                                        type="primary"
                                        style={{ padding: '2px', height: '19px', lineHeight: 0 }}
                                        onClick={() => selectContainer(containerInfo)}
                                    >{selectedContainerDetails?.containerCode}</Button>
                                </Tooltip>

                            </div>

                        </div>}</Row>
                </Card>
            </> : <></>}

        </Form>
        <Modal
            // title={<Button type="primary">Print</Button>}
            style={{ top: 20 }}
            width={'100%'}
            open={modalOpen}
            onOk={closeModel}
            onCancel={closeModel}
            footer={[<Button key="back" type="primary" onClick={() => printContainer()}>Print</Button>, <Button onClick={closeModel} >Close</Button>]}
        >
            <div id='printArea'>
                {selectedContainerInfo && renderTitle(selectedContainerInfo)}
                <Table columns={columns} pagination={false} scroll={{ x: true, }} bordered dataSource={selectedContainerInfo ? selectedContainerInfo.cartonsInfo : []} size="small" />
            </div>
        </Modal>
    </Card>

}


