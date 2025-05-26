import { BinModel, CommonRequestAttrs, RackAndBinModel, RackIdRequest, RacksCreationModel, WhDashboardFilterEnum, whDasFilEnumDisVal } from "@xpparel/shared-models";
import { 
    // RackDashboardService,  // TODO:CUT
    RacksServices } from "@xpparel/shared-services";
import { Button, Card, Empty, Form, Input, Select, Space, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
// import { AlertMessages } from "../../../../common";
import { useEffect, useState } from "react";
import RackBlock from "./rack-block";
import Search from "antd/es/input/Search";
import { FilterOutlined, FilterTwoTone } from "@ant-design/icons";
import { AlertMessages } from "../../../common";

export const WhDashboardPage = () => {
    const user = useAppSelector((state) => state.user.user.user);
    useEffect(() => {
        if (user) {
            getAllRacks();
        }
    }, []);
    const { Option } = Select;
    const rackService = new RacksServices();
    // const rackDashboardServices = new RackDashboardService(); // TODO:CUT
    const [racksData, setRacksData] = useState<RacksCreationModel[]>([]);
    const [binsData, setBinsData] = useState<BinModel[]>([]);
    const [selectedRackId, setSelectedRackId] = useState<number>(0);
    const [filteredCategory, setFilteredCategory] = useState<string>();
    const [filteredVal, setFilteredVal] = useState<string>('');
    const getAllRacks = () => {
        const commonReq = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        rackService.getAllRacksData(commonReq).then(res => {
            if (res.status) {
                setRacksData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        });
    }
    const changeRack = (rackId: number) => {
        setSelectedRackId(rackId);
        setBinsData([]);
        const rackIdReq = new RackIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rackId, 1, 1);
        // TODO:CUT
        // rackDashboardServices.getRackAndBinData(rackIdReq).then(res => {
        //     if (res.status) {
        //         setBinsData(res.data[0] ? res.data[0].binData : []);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage)
        //     }
        // }).catch(err => {
        //     AlertMessages.getErrorMessage(err.message)
        // })
    }
    const renderSelectRack = (rackInfo: RacksCreationModel[]) => {
        return <Form style={{ padding: '2px', color: '#fff', fontWeight: 'bold' }}>
            <Form.Item label='Select Rack' noStyle>
                Select Rack : <Select style={{ width: '200px' }} placeholder='Select Rack' onChange={changeRack}>
                    {rackInfo.map(rackObj => {
                        return <Option value={rackObj.id} key={`rck-${rackObj.id}`}>{rackObj.name.concat(`-`, rackObj.code)}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form>
    }
    const renderRackGrid = (rackId: number, racksInfo: RacksCreationModel[], binsInfo: BinModel[]) => {
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
                    const binObj = binsInfo.find(binEntity => { return binEntity.binLevel == l && binEntity.binColumn == c });
                    tds.push(<td key={`td${l}-${c}`} ><RackBlock rackId={rackId} key={`rc${l}-${c}-${rackId}`} filterVal={filteredVal} rackLevel={l} column={c} binInfo={binObj} /></td>)
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
            {renderSelectRack(racksData)}
            {/* <div style={{ width: '145px' }}>
                <Select allowClear placeholder='FIlter' onChange={filterCategory} style={{ width: '100%' }}>
                    {Object.keys(WhDashboardFilterEnum).map(whFil => {
                        return <Option value={WhDashboardFilterEnum[whFil]}>{whDasFilEnumDisVal[whFil]}</Option>
                    })}
                </Select>
            </div> */}
            <Tooltip title={"Batch No | Pack List Code | Roll Barcode"}>
            <Search name="manB" placeholder="Batch | Pack Code | Roll Barcode" onSearch={filter} enterButton={<Button icon={<FilterTwoTone />}  className="btn-yellow" />} />
            </Tooltip>



        </Space>
    }
    return (
        <Card size="small" title="WAREHOUSE DASHBOARD" bodyStyle={{ overflow: 'scroll' }} headStyle={{ background: '#6ac0a9', color: '#fff', textAlign: 'center' }} extra={renderFilters()} >
            {selectedRackId ? renderRackGrid(selectedRackId, racksData, binsData) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Please Select Rack' />}
        </Card>
    )
}

export default WhDashboardPage;