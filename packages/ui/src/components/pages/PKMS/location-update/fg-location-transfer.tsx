import { CommonRequestAttrs, FgGetAllRackDto, FgLocationFilterReq, FgLocationModel, FgRackFilterRequest, LocationDetailsModel, WareHouseResponseDto } from "@xpparel/shared-models";
import { FGLocationAllocationService, FgRackServices, WareHouseService } from "@xpparel/shared-services";
import { Card, Col, Collapse, Descriptions, Form, Row, Select, Space, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { FGDraggableRackBlock } from "../fg-warehouse-dashboard/draggable-rack-block";

const { Option } = Select;
const { Panel } = Collapse;
export const FGLocationTransfer = () => {
    const [allLocations, setAllLocations] = useState<LocationDetailsModel[]>([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLocationData, setSelectedLocationData] = useState<LocationDetailsModel>(undefined);
    const [whData, setWhData] = useState<WareHouseResponseDto[]>([])
    const [selectedWh, setSelectedWh] = useState(null);
    const [racksData, setRacksData] = useState<FgGetAllRackDto[]>([]);
    const [selectedRack, setSelectedRack] = useState<number>(null);
    const [refreshKey, setRefreshKey] = useState(0);


    const [allLocations2, setAllLocations2] = useState<LocationDetailsModel[]>([]);
    const [selectedLocation2, setSelectedLocation2] = useState(null);
    const [selectedLocationData2, setSelectedLocationData2] = useState<LocationDetailsModel>(undefined);
    const [racks2Data, setRacks2Data] = useState<FgGetAllRackDto[]>([]);
    const [selected2Rack, setSelected2Rack] = useState<number>(null);
    const [refreshKey2, setRefreshKey2] = useState(0);


    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user

    const [form] = Form.useForm();

    const locationService = new FGLocationAllocationService();
    const racksService = new FgRackServices();
    const whService = new WareHouseService()

    useEffect(() => {
        getAllWareHouse();
    }, []);
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
        const obj = new FgRackFilterRequest(
            user?.orgData?.companyCode,
            user?.orgData?.unitCode,
            user?.userName,
            user?.userId,
            whId
        );
        racksService
            .getAllRacksDataDropdown(obj)
            .then((res) => {
                if (res.status) {
                    setRacksData(res.data);
                    setRacks2Data(res.data)
                } else {
                    setRacksData([]);
                    setRacks2Data([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                setRacksData([]);
                setRacks2Data([]);
                AlertMessages.getErrorMessage(err.message);
            });
    };

    const getAllSpaceFreeLocationsInWarehouse = (whId: number, rackId: number[]) => {
        const reqObj = new FgLocationFilterReq(user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId, whId, rackId);
        locationService.getAllSpaceFreeLocationsInWarehouse(reqObj).then((res => {
            if (res.status) {
                setAllLocations(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllLocations([]);
            }
        })).catch(error => {
            setAllLocations([]);
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getAllSpaceFreeLocationsInWarehouse2 = (whId: number, rackId: number[]) => {
        const reqObj = new FgLocationFilterReq(user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId, whId, rackId);
        locationService.getAllSpaceFreeLocationsInWarehouse(reqObj).then((res => {
            if (res.status) {
                setAllLocations2(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllLocations2([]);
            }
        })).catch(error => {
            setAllLocations2([]);
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const whOnChange = (whId: number) => {
        form.setFieldValue('rackId', '');
        form.setFieldValue('location', '');
        setSelectedWh(whId);
        getRacks(whId);
        setSelectedLocationData(undefined)
        setSelectedRack(undefined)
        getAllSpaceFreeLocationsInWarehouse(whId, []);
        setRefreshKey(prev => prev + 1);

        setSelectedLocationData2(undefined)
        setSelected2Rack(undefined)
        getAllSpaceFreeLocationsInWarehouse2(whId, []);
        setRefreshKey2(prev => prev + 1);
    }

    const racksOnChange = (rackId: number) => {
        setSelectedRack(rackId);
        setSelectedLocationData(undefined);
        form.setFieldValue('location', '');
        getAllSpaceFreeLocationsInWarehouse(selectedWh, [rackId]);
        setRefreshKey(prev => prev + 1);
    }

    const racks2OnChange = (rackId: number) => {
        setSelected2Rack(rackId);
        setSelectedLocationData2(undefined);
        form.setFieldValue('location2', '');
        getAllSpaceFreeLocationsInWarehouse2(selectedWh, [rackId]);
        setRefreshKey2(prev => prev + 1);
    }

    const locationOnChangeHandler = (locationId: number) => {
        setRefreshKey(prev => prev + 1);
        setSelectedLocation(locationId);
        const locationDetailData = allLocations.find(locationObj => locationObj.locationId == locationId)
        setSelectedLocationData(locationDetailData);
    }

    const location2OnChangeHandler = (locationId: number) => {
        setRefreshKey2(prev => prev + 1);
        setSelectedLocation2(locationId);
        const locationDetailData = allLocations2.find(locationObj => locationObj.locationId == locationId)
        setSelectedLocationData2(locationDetailData);
    }

    const convertAtoB = (location: LocationDetailsModel) => {
        const b = new FgLocationModel(location.locationId, location.locationBarCode, location.locationCode, location.locationDesc, location.level, location.column, location.totalSupportedContainers)
        return b
    }

    const refreshBoth = () => {
        setRefreshKey(prev => prev + 1);
        setRefreshKey2(prev => prev + 1);
    }

    return <Form form={form} >
        <Card size="small" style={{ margin: 5 }} title={<Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col flex="auto">
            <strong>Location Transfer</strong>
        </Col>
        <Col xs={24} sm={24} md={10} lg={8} xl={6}>
            <Form.Item name="whId" label="Select Warehouse" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                <Select
                size="small"
                    showSearch
                    placeholder={'Please Select Warehouse'}
                    suffixIcon={null}
                    onChange={whOnChange}
                >
                    {whData.map(wh => {
                        return <Option value={wh.id} key={wh.id}> {wh.wareHouseCode}</Option>
                    })}
                </Select>
            </Form.Item>
        </Col></Row>}>
        <Row gutter={[16, 16]}><Col xs={24} sm={24} md={12}>
        <Card title='Select From Location'>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name="rackId" label="Select Rack" rules={[{ required: false }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Rack'}
                            suffixIcon={null}
                            onChange={racksOnChange}
                        >
                            {racksData.map(rack => {
                                return <Option value={rack.id} key={rack.id}> {rack.code}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name="location" label="Select Location" rules={[{ required: true, message: 'Please Select the location' }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Location'}
                            suffixIcon={null}
                            onChange={locationOnChangeHandler}
                        >
                            {allLocations.map(location => {
                                return <Option value={location.locationId} key={location.locationId}> {location.locationCode}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
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
                        column={{ xs: 1, sm: 1, md: 2, lg: 2 }}
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
            <Row justify="center">
                {(selectedLocationData) && <>
                    <FGDraggableRackBlock rackId={selectedRack} key={refreshKey} filterVal={null} rackLevel={selectedLocationData.level} column={selectedLocationData.column} locationInfo={convertAtoB(selectedLocationData)} draggable={true} droppable={false} refreshBoth={refreshBoth} />
                </>}
            </Row>
        </Card></Col><Col xs={24} sm={24} md={12}>
        <Card title='Select To Location'>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name="rackId2" label="Select Rack" rules={[{ required: false }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Rack'}
                            suffixIcon={null}
                            onChange={racks2OnChange}
                        >
                            {racks2Data.map(rack => {
                                return <Option value={rack.id} key={rack.id}> {rack.code}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name="location2" label="Select Location" rules={[{ required: true, message: 'Please Select the location' }]}>
                        <Select
                            showSearch
                            placeholder={'Please Select Location'}
                            suffixIcon={null}
                            onChange={location2OnChangeHandler}
                        >
                            {allLocations2.map(location => {
                                return <Option value={location.locationId} key={location.locationId}> {location.locationCode}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Collapse>
                <Panel header={
                    <Space size="small" wrap>
                        <Col>Container Code : <Tag color="black">{selectedLocationData2?.locationCode}</Tag></Col>
                        <Col>Barcode : <Tag color="black">{selectedLocationData2?.locationBarCode}</Tag></Col>
                        <Col>Container Capacity : <Tag color="black"> {selectedLocationData2?.totalSupportedContainers}
                            &nbsp;
                            (Pc's)</Tag></Col>
                        <Col>Filled Container Items : <Tag color="black">{selectedLocationData2?.totalFilledContainers}</Tag></Col>
                    </Space>
                } key="1">
                    {selectedLocationData2 ? <Descriptions
                        title="Location Information"
                        bordered
                        column={{ xs: 1, sm: 1, md: 2, lg: 2 }}
                    >
                        <Descriptions.Item label="Location ID">{selectedLocationData2.locationId}</Descriptions.Item>
                        <Descriptions.Item label="Location Code">{selectedLocationData2.locationCode}</Descriptions.Item>
                        <Descriptions.Item label="Location Description">
                            {selectedLocationData2.locationDesc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Supported Containers">
                            {selectedLocationData2.totalSupportedContainers}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Filled Containers">
                            {selectedLocationData2.totalFilledContainers}
                        </Descriptions.Item>
                        <Descriptions.Item label="Empty Containers">
                            {selectedLocationData2.emptyContainers}
                        </Descriptions.Item>
                        <Descriptions.Item label="Rack ID">{selectedLocationData2.rackId}</Descriptions.Item>
                        <Descriptions.Item label="Rack Code">{selectedLocationData2.rackCode}</Descriptions.Item>
                        <Descriptions.Item label="Location Barcode">
                            {selectedLocationData2.locationBarCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Level">{selectedLocationData2.level}</Descriptions.Item>
                        <Descriptions.Item label="Column">{selectedLocationData2.column}</Descriptions.Item>
                    </Descriptions> : <>Please Select Container</>}
                </Panel>
            </Collapse>
            <Row justify="center">
                {(selectedLocationData2) && <>
                    <FGDraggableRackBlock rackId={selected2Rack} key={refreshKey2} filterVal={null} rackLevel={selectedLocationData2.level} column={selectedLocationData2.column} locationInfo={convertAtoB(selectedLocationData2)} draggable={false} droppable={true} refreshBoth={refreshBoth}/>
                </>}
            </Row>
        </Card></Col></Row></Card>
    </Form >;
};

export default FGLocationTransfer;
