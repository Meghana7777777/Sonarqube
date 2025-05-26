import { ScanOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ContainerDetailsModel, ContainerIdRequest, FgContainerTypePrefixes, FgGetAllRackDto, FgLocationFilterReq, FgLocationModel, FgRackFilterRequest, LocationContainerMappingRequest, LocationDetailsModel, WareHouseResponseDto } from "@xpparel/shared-models";
import { FGLocationAllocationService, FgRackServices, WareHouseService } from "@xpparel/shared-services";
import { Card, Col, Collapse, Descriptions, Form, Input, Modal, Row, Select, Space, Switch, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";
import FGRackBlock from "../fg-warehouse-dashboard/rack-block";
import { FGWareHouseAnalysisDashboard } from "../location-dash-board";


const { Option } = Select;
const { Panel } = Collapse;
const { Search } = Input;
const { confirm } = Modal;
export const FgContainerToLocationAllocation = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user

    const [scannedContainer, setScannedContainer] = useState<ContainerDetailsModel>();
    const [allLocations, setAllLocations] = useState<LocationDetailsModel[]>([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLocationData, setSelectedLocationData] = useState<LocationDetailsModel>(undefined);


    const [debounceTimer, setDebounceTimer] = useState<any>();
    const [isOverRideSysAllocation, setSsOverRideSysAllocation] = useState<boolean>(true);

    const [whData, setWhData] = useState<WareHouseResponseDto[]>([])
    const [selectedWh, setSelectedWh] = useState(null);
    const [racksData, setRacksData] = useState<FgGetAllRackDto[]>([]);
    const [selectedRack, setSelectedRack] = useState<number>(null);
    const [selectedRackBarcodeId, setSelectedRackBarcodeId] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [form] = Form.useForm();
    const containerInputRef = useRef(null);

    const locationService = new FGLocationAllocationService();
    const racksService = new FgRackServices();
    const whService = new WareHouseService()

    useEffect(() => {
        getAllWareHouse();
    }, []);

    const manualBarcode = (val: string) => {
        scanContainerBarcode(val.trim());
    }

    const restForms = () => {
        containerInputFocus();
        form.resetFields();
        setScannedContainer(undefined);
    }

    const containerInputFocus = () => {
        if (containerInputRef.current) {
            containerInputRef.current.focus();
        }
    }

    const scanContainerBarcode = (fullBarcode: string) => {
        const barcodeParts = fullBarcode.split('-');
        const prefix = barcodeParts[0];
        const refId = Number(barcodeParts[1]);
        if (Object.values(FgContainerTypePrefixes).includes(prefix)) {
            const containerIdReq = new ContainerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, refId, fullBarcode);
            locationService.getContainerMappingInfoWithoutCartons(containerIdReq).then((res => {
                if (res.status) {
                    setScannedContainer(res.data[0]);
                    const phIdReq = new LocationContainerMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedLocation, isOverRideSysAllocation, [{ containerId: refId, barcode: fullBarcode }]);
                    locationService.confirmContainersToLocation(phIdReq).then((res => {
                        if (res.status) {
                            form.setFieldValue('containerBarcode', '')
                            form.setFieldValue('manB', '')
                            setRefreshKey(prev => prev + 1);
                            AlertMessages.getSuccessMessage(res.internalMessage);
                        } else {
                            AlertMessages.getErrorMessage(res.internalMessage);
                        }
                        // setScanUpdateKey(preState => preState + 1);
                    })).catch(error => {
                        AlertMessages.getErrorMessage(error.message)
                    })
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                    restForms();
                }
                // setScanUpdateKey(preState => preState + 1);
            })).catch(error => {
                AlertMessages.getErrorMessage(error.message)
            })
        } else {
            AlertMessages.getErrorMessage("Please Scan A valid Container");
        }
    }


    const getAllWareHouse = () => {
        const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId)
        whService.getAllWareHouse(req).then(res => {
            if (res.status) {
                setWhData(res.data)
            } else {
                setWhData([])
            }
        }).catch(err => {
            setWhData([])
            console.log(err.message)
        })
    }

    const getRacks = (whId: number) => {
        const obj = new FgRackFilterRequest(user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId, whId);
        racksService.getAllRacksDataDropdown(obj).then((res) => {
            if (res.status) {
                setRacksData(res.data);
                containerInputFocus();
            } else {
                setRacksData([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })
            .catch((err) => {
                setRacksData([]);
                AlertMessages.getErrorMessage(err.message);
            });
    };

    const getAllSpaceFreeLocationsInWarehouse = (whId: number, rackId: number[]) => {
        const reqObj = new FgLocationFilterReq(user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId, whId, rackId);
        locationService.getAllSpaceFreeLocationsInWarehouse(reqObj).then((res => {
            if (res.status) {
                setAllLocations(res.data);
                containerInputFocus();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllLocations([]);
            }
        })).catch(error => {
            setAllLocations([]);
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const whOnChange = (whId: number) => {
        form.resetFields(['rackId', 'location'])
        setSelectedWh(whId);
        getRacks(whId);
        setSelectedLocationData(undefined)
        setSelectedRack(undefined)
        getAllSpaceFreeLocationsInWarehouse(whId, []);
        setRefreshKey(prev => prev + 1);
    }

    const racksOnChange = (rackId: number, option: any) => {
        setSelectedRack(rackId);
        setSelectedLocationData(undefined);
        form.resetFields(['location'])
        getAllSpaceFreeLocationsInWarehouse(selectedWh, rackId ? [rackId] : []);
        setRefreshKey(prev => prev + 1);
        setSelectedRackBarcodeId(option?.rackBarCodeId);
    }

    const beforeScanContainerBarcode = (value: string) => {
        const location = form.getFieldValue('location');
        if (!location) {
            AlertMessages.getErrorMessage('Please select the location');
            return
        }
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanContainerBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const locationOnChangeHandler = (locationId: number) => {
        setRefreshKey(prev => prev + 1);
        setSelectedLocation(locationId);
        const locationDetailData = allLocations.find(locationObj => locationObj.locationId == locationId)
        setSelectedLocationData(locationDetailData);
        containerInputFocus();
    }

    const convertAtoB = (location: LocationDetailsModel) => {
        const b = new FgLocationModel(location.locationId, location.locationBarCode, location.locationCode, location.locationDesc, location.level, location.column, location.totalSupportedContainers)
        return b
    }



    return <Card title='Container To Location Allocation' extra={<>
        {(selectedWh && selectedRackBarcodeId) && <Switch
            checked={showSuggestions}
            onChange={(checked) => setShowSuggestions(checked)}
            checkedChildren="Rack Occupancy"
            unCheckedChildren="Show Rack Occupancy"
        />}
    </>}>
        <Form form={form}>
            <Row gutter={16}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7 }} lg={{ span: 7 }} xl={{ span: 7 }}>
                    <Form.Item name="whId" label="Select Warehouse" rules={[{ required: true }]}>
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
                    <Form.Item name="rackId" label="Select Rack" rules={[{ required: false }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Rack'}
                            onChange={(value, option) => racksOnChange(value, option)}
                            allowClear
                        >
                            {racksData.map(rack => {
                                return <Option value={rack.id} key={rack.id} rackBarCodeId={rack.barcodeId}> {rack.code ? rack.code : rack.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 7 }} lg={{ span: 7 }} xl={{ span: 7 }}>
                    <Form.Item name="location" label="Select Location" rules={[{ required: true, message: 'Please Select the location' }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Location'}
                            onChange={locationOnChangeHandler}
                            allowClear
                        >
                            {allLocations.map(location => {
                                return <Option value={location.locationId} key={location.locationId}> {location.locationCode ? location.locationCode : location.locationDesc}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        {
            selectedLocationData ? <>
                <Collapse>
                    <Panel header={
                        <Space size="small" wrap>
                            <Col>Container Code : <Tag color="black">{selectedLocationData?.locationCode}</Tag></Col>
                            <Col>Barcode : <Tag color="black">{selectedLocationData?.locationBarCode}</Tag></Col>
                            <Col>Container Capacity : <Tag color="black"> {selectedLocationData?.totalSupportedContainers}
                                &nbsp;
                                (Pc's)</Tag></Col>
                            <Col>Filled Container Items : <Tag color="black">{selectedLocationData?.totalFilledContainers}</Tag></Col>
                        </Space>
                    } key="1">
                        {selectedLocationData ? <Descriptions
                            title="Location Information"
                            bordered
                            column={{ xs: 1, sm: 2, md: 2, lg: 2 }}
                        >
                            <Descriptions.Item label="Location ID">{selectedLocationData.locationId}</Descriptions.Item>
                            <Descriptions.Item label="Location Code">{selectedLocationData.locationCode}</Descriptions.Item>
                            <Descriptions.Item label="Location Description">
                                {selectedLocationData.locationDesc}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Supported Containers">
                                {selectedLocationData.totalSupportedContainers}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Filled Containers">
                                {selectedLocationData.totalFilledContainers}
                            </Descriptions.Item>
                            <Descriptions.Item label="Empty Containers">
                                {selectedLocationData.emptyContainers}
                            </Descriptions.Item>
                            <Descriptions.Item label="Rack ID">{selectedLocationData.rackId}</Descriptions.Item>
                            <Descriptions.Item label="Rack Code">{selectedLocationData.rackCode}</Descriptions.Item>
                            <Descriptions.Item label="Location Barcode">
                                {selectedLocationData.locationBarCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="Level">{selectedLocationData.level}</Descriptions.Item>
                            <Descriptions.Item label="Column">{selectedLocationData.column}</Descriptions.Item>
                        </Descriptions> : <>Please Select Container</>}
                    </Panel>
                </Collapse>
                <Card>
                    <Row justify="center">
                        <Form
                            form={form}
                            name="roll-form"
                            labelAlign="left"
                            // onFinish={onFinish}
                            style={{ maxWidth: 612, width: '100%' }}
                        >
                            <Form.Item label="Scan Container Barcode">
                                <Space>
                                    <Form.Item name="containerBarcode" noStyle>
                                        <Input placeholder="Scan Container Barcode" autoComplete="off" ref={containerInputRef} autoFocus onChange={(e) => beforeScanContainerBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                    </Form.Item>
                                    <Form.Item name="manB" noStyle>
                                        <Search placeholder="Type Container Barcode" name="manB" onSearch={manualBarcode} enterButton />
                                    </Form.Item>

                                </Space>
                            </Form.Item>
                        </Form>
                    </Row>
                    <Row justify="center">
                        {(selectedLocationData) && <>
                            <FGRackBlock
                                containerInputFocus={containerInputFocus}
                                rackId={selectedRack}
                                key={refreshKey}
                                filterVal={null}
                                rackLevel={selectedLocationData.level}
                                column={selectedLocationData.column}
                                locationInfo={convertAtoB(selectedLocationData)}
                            />
                        </>}
                    </Row>
                </Card>
            </> : <></>
        }


        {
            (selectedWh && selectedRackBarcodeId && showSuggestions) && <FGWareHouseAnalysisDashboard whId={selectedWh} selectedRackBarcodeId={selectedRackBarcodeId} />
        }

    </Card >;
};

export default FgContainerToLocationAllocation;
