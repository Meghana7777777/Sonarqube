import { ProjectOutlined, ReloadOutlined } from '@ant-design/icons';
import { CommonRequestAttrs, PackMatReqStatusEnum, PackTableModel, PackSerialDropDownModel } from '@xpparel/shared-models';
import { PackTableService, PreIntegrationServicePKMS } from '@xpparel/shared-services';
import { Affix, Button, Card, Col, Form, Row, Select, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { OpenPackJobContainer } from './open-pack-job-container';
import './pack-job-plan.css';
import { PackingWorkStations } from './packing-work-stations';

const { Option } = Select;
export const PlanningScreenComponent = () => {
    const [poData, setPoData] = useState<PackSerialDropDownModel[]>([]);
    const [selectedPo, setSelectedPo] = useState<number>();
    const [packTables, setPackTables] = useState<PackTableModel[]>([]);
    const [unplannedStateKey, setUnplannedStateKey] = useState<number>(0);
    const [plannedStateKeys, setPlannedStateKeys] = useState<{ [key: number]: number }>(undefined);


    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;

    const [formRef] = Form.useForm();



    const preIntegrationService = new PreIntegrationServicePKMS();
    const packTableService = new PackTableService()

    useEffect(() => {
        getAllPackTables();
        getAllPos();
    }, []);



    const getAllPos = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        preIntegrationService.getAllPackSerialDropdownData(reqObj)
            .then((res) => {
                if (res.status) {
                    setPoData(res.data);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                    setPoData([]);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setPoData([]);
            })
    };



    const getAllPackTables = () => {
        const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId);
        packTableService.getAllPackTables(req)
            .then((res) => {
                if (res.status) {
                    setPackTables(res.data);
                    const tblIds = {};
                    res.data.forEach(tblObj => tblIds[tblObj.id] = 0);
                    setPlannedStateKeys(tblIds);
                } else {
                    setPackTables([]);
                }
            })
            .catch((err) => console.error(err.message));
    };


    const refreshDashboard = () => {
        setPackTables([]);
        getAllPackTables();
    }

    const refreshUnplannedPackJobs = () => {
        setUnplannedStateKey(preSt => preSt + 1);
    }

    const refreshPlannedPackJobs = (tblId: number) => {
        setPlannedStateKeys(preState => {
            return { ...preState, [tblId]: preState[tblId] + 1 };
        })
    }

    const poChangeHandler = (poId: number) => {
        setSelectedPo(poId);
        formRef.setFieldValue('po', undefined);
    }

    const getClassName = (materialStatus: PackMatReqStatusEnum) => {
        switch (materialStatus) {
            case PackMatReqStatusEnum.OPEN: return 'w-gray';
            case PackMatReqStatusEnum.PREPARING_MATERIAL: return 'w-yellow';
            case PackMatReqStatusEnum.MATERIAL_NOT_AVL: return 'w-red';
            case PackMatReqStatusEnum.MATERIAL_READY: return 'w-ready';
            case PackMatReqStatusEnum.MATERIAL_ON_TROLLEY: return 'w-tro';
            case PackMatReqStatusEnum.MATERIAL_IN_TRANSIT: return 'w-tran';
            case PackMatReqStatusEnum.REACHED_DESITNATION: return 'w-lgreen';
            case PackMatReqStatusEnum.MATERIAL_ISSUED: return 'w-green';
            default: return 'w-dark-pink'
        }
    }

    return (<><Card title={<span><ProjectOutlined style={{ marginRight: 4 }} />Planning Screen</span>} size='small' extra={<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Refresh">
        <Button onClick={refreshDashboard} type="primary">
            <ReloadOutlined />
        </Button>
    </Tooltip>}>
        <Form form={formRef}>
            <Row>
                <Col>
                    <Form.Item
                        label="Pack Order No"
                        name='mo'
                        rules={[{ required: true, message: 'Please Select Pack Order No' }]}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder='Select Pack Order No'
                            showSearch
                            allowClear
                            onChange={poChangeHandler}
                            filterOption={(input, option) =>
                                (option!.children as unknown as string)
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            {poData.map((po) => (
                                <Select.Option key={po.id} value={po.id}>
                                    {po.packSerial}-{po.packOrderDescription}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 5, offset: 0 }} lg={{ span: 4, offset: 0 }} xl={{ span: 4, offset: 0 }}>
                {selectedPo && <Affix offsetTop={70}><OpenPackJobContainer refreshPlannedPackJobs={refreshPlannedPackJobs} refreshKey={unplannedStateKey} selectedPo={selectedPo} /></Affix>}
            </Col>
            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 19, offset: 0 }} lg={{ span: 20, offset: 0 }} xl={{ span: 20, offset: 0 }}>
                <Row justify='space-evenly'>
                    {packTables.map((rec, index) => {
                        return <Col><PackingWorkStations refreshKey={plannedStateKeys ? plannedStateKeys[rec.id] : 0} packTable={rec} refreshUnplannedPackJobs={refreshUnplannedPackJobs} /><br /></Col>
                    })}
                </Row>
            </Col>
        </Row>
    </Card >
        <br />
        <Card title="Color Legend" size='small'>
            <Space wrap>
                <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.OPEN)} type="primary" >OPEN </Button>
                <Button style={{ minWidth: '180px' }} className={getClassName(undefined)} type="primary" >MATERIAL REQUESTED </Button>
                {/* <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.PREPARING_MATERIAL)} type="primary" >PREPARING MATERIAL </Button>
                <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.MATERIAL_NOT_AVL)} type="primary" >MATERIAL NOT AVAILABLE </Button>
                <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.MATERIAL_READY)} type="primary" >MATERIAL READY </Button>
                <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.MATERIAL_ON_TROLLEY)} type="primary" >MATERIAL ON TROLLEY </Button>
                <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.MATERIAL_IN_TRANSIT)} type="primary" >MATERIAL IN TRANSIT </Button>
                <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.REACHED_DESITNATION)} type="primary" >REACHED DESTINATION </Button> */}
                <Button style={{ minWidth: '180px' }} className={getClassName(PackMatReqStatusEnum.MATERIAL_ISSUED)} type="primary" >MATERIAL ISSUED </Button>
            </Space>
        </Card></>);
};

export default PlanningScreenComponent;
