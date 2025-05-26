import { FilterTwoTone } from "@ant-design/icons";
import { CommonRequestAttrs, FgLocationModel, FgRackCreationModel, FgRackFilterRequest, RackIdRequest, WareHouseResponseDto } from "@xpparel/shared-models";
import { FGRackDashboardService, FgRackServices, WareHouseService } from "@xpparel/shared-services";
import { Button, Card, Col, Empty, Form, Row, Select, Space, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import FGRackBlock from "./rack-block";

export const FGWhDashboardPage = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user
    const { Option } = Select;
    const [whData, setWhData] = useState<WareHouseResponseDto[]>([])
    const [selectedWh, setSelectedWh] = useState(null);
    const [racksData, setRacksData] = useState<FgRackCreationModel[]>([]);
    const [locationsData, setLocationsData] = useState<FgLocationModel[]>([]);
    const [selectedRackId, setSelectedRackId] = useState<number>(null);
    const [filteredCategory, setFilteredCategory] = useState<string>();
    const [filteredVal, setFilteredVal] = useState<string>('');
    const [form] = Form.useForm();


    const rackService = new FgRackServices();
    const rackDashboardServices = new FGRackDashboardService();
    const whService = new WareHouseService()


    useEffect(() => {
        if (user) {
            getAllWareHouse();
        }
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


    const getAllRacks = (whId: number) => {
        const fgRackFilterReq = new FgRackFilterRequest(
            user?.orgData?.companyCode,
            user?.orgData?.unitCode,
            user?.userName,
            user?.userId,
            whId
        );
        rackService.getAllRacksData(fgRackFilterReq).then(res => {
            if (res.status) {
                setRacksData(res.data);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        });
    }
    const changeRack = (rackId: number) => {
        setSelectedRackId(rackId);
        setLocationsData([]);
        const rackIdReq = new RackIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rackId, 1, 1);
        rackDashboardServices.getRackAndLocationData(rackIdReq).then(res => {
            if (res.status) {
                setLocationsData(res.data[0] ? res.data[0].locationData : []);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }
    const whOnChange = (whId: number) => {
        form.setFieldValue('rackId', null);
        setSelectedWh(whId);
        setSelectedRackId(null);
        setRacksData([]);
        setLocationsData([]);
        getAllRacks(whId);
    }
    const renderSelectRack = () => {
        return <Form style={{ color: '#fff', fontWeight: 'bold' }} form={form} layout="horizontal">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={8}>
                    <Form.Item name="whId" label="Select Warehouse" rules={[{ required: true }]} noStyle>
                        Select Warehouse :<Select
                            allowClear
                            // style={{ width: '200px' }}
                            showSearch
                            placeholder={'Please Select Warehouse'}
                            onChange={whOnChange}
                        >
                            {whData.map(wh => {
                                return <Option value={wh.id} key={wh.id}> {wh.wareHouseCode}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                    {selectedWh && <div key={selectedWh}>
                        <Form.Item label='Select Rack' noStyle name='rackId'>
                            Select Rack : <Select
                                allowClear
                                showSearch
                                // style={{ width: '200px' }}
                                placeholder='Select Rack'
                                onChange={changeRack}
                            >
                                {racksData.map(rackObj => {
                                    return <Option value={rackObj.id} key={`rck-${rackObj.id}`}>{rackObj.name.concat(`-`, rackObj.code)}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </div>}
                </Col>

            </Row>
        </Form>
    }
    const renderRackGrid = (rackId: number, racksInfo: FgRackCreationModel[], locationsInfo: FgLocationModel[]) => {
        console.log(rackId, racksInfo, locationsInfo)
        const rackObj = racksInfo.find(rack => rack.id == rackId);
        if (rackObj) {
            const { levels, columns } = rackObj;
            const trs = [];
            const ths = [];
            for (let c = 1; c <= columns; c++) {
                ths.push(<th>Column - {c}</th>)
            }

            for (let l = levels; l > 0; l--) {
                const tds = [];
                tds.push(<td key={`ftd${l}`}>Level-{l}</td>)
                for (let c = 1; c <= columns; c++) {
                    const locationObj = locationsInfo.find(locationEntity => { return locationEntity.locationLevel == l && locationEntity.locationColumn == c });
                    tds.push(<td key={`td${l}-${c}`} >
                        <FGRackBlock
                            rackId={rackId}
                            key={`rc${l}-${c}-${rackId}`}
                            filterVal={filteredVal}
                            rackLevel={l}
                            column={c}
                            locationInfo={locationObj}
                            containerInputFocus={() => { }}
                        />
                    </td>)
                }
                trs.push(<tr key={`tr${l}`}>{tds}</tr>)
            }
            return <table>
                <thead>
                    <tr><th>Levels</th>{ths}</tr>
                </thead>
                <tbody>
                    {trs}
                </tbody>
            </table>
        } else {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }
    }
    const filter = (val: string) => {
        setFilteredVal(val);

        const packElement = document.querySelector(`[pack-no = '${val}']`);
        const batchElement = document.querySelector(`[batch-no = '${val}']`);
        const rollElement = document.getElementById(val);
        const element = packElement ? packElement : batchElement ? batchElement : rollElement;
        // if (filteredCategory) {
        //     if (filteredCategory == WhDashboardFilterEnum.PACKING_LIST) {
        //         element = document.querySelector(`[pack-no = '${val}']`);
        //     } else if (filteredCategory == WhDashboardFilterEnum.BATCH_NO) {
        //         element = document.querySelector(`[batch-no = '${val}']`);
        //     } else {
        //         element = document.getElementById(val);
        //     }
        // }
        // var element = document.getElementById("RL-91");
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const filterCategory = (val: string) => {
        setFilteredCategory(val);
    }
    const renderFilters = () => {
        return <Space>
            {renderSelectRack()}
            {/* <div style={{ width: '145px' }}>
                <Select allowClear placeholder='FIlter' onChange={filterCategory} style={{ width: '100%' }}>
                    {Object.keys(WhDashboardFilterEnum).map(whFil => {
                        return <Option value={WhDashboardFilterEnum[whFil]}>{whDasFilEnumDisVal[whFil]}</Option>
                    })}
                </Select>
            </div> */}
            <Tooltip title={"Batch No | Pack List Code | Carton Barcode"}>
                <Search name="manB" placeholder="Batch | Pack Code | Carton Barcode" onSearch={filter} enterButton={<Button icon={<FilterTwoTone />} className="btn-yellow" />} />
            </Tooltip>



        </Space>
    }
    return (
        <Card size="small" title="WAREHOUSE DASHBOARD" bodyStyle={{ overflow: 'scroll' }} headStyle={{ background: '#6ac0a9', color: '#fff', textAlign: 'center' }} extra={renderFilters()} >
            {selectedRackId ? renderRackGrid(selectedRackId, racksData, locationsData) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Please Select Rack' />}
        </Card>
    )
}

export default FGWhDashboardPage;