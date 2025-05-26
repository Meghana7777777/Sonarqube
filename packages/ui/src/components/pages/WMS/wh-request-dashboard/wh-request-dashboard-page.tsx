import { CutTableService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react"
import { AlertMessages } from "../../../common";
import { CommonRequestAttrs, CutTableModel, WhMatReqLineStatusEnum } from "@xpparel/shared-models";
import { Button, Card, Col, Form, Input, Popover, Row, Space } from "antd";
import WarehouseRequestCutTable from "./wh-request-cut-table";
import Icon from "@ant-design/icons/lib/components/Icon";
import { ReloadOutlined } from "@ant-design/icons";


export const WarehouseRequestDashboardPage = () => {

    useEffect(() => {
        getAllCutTables();
    }, []);
    const user = useAppSelector((state) => state.user.user.user);
    const ctdService = new CutTableService();
    const [cutTables, setCutTables] = useState<CutTableModel[]>([]);
    const [searchString, setSearchString] = useState<string>("");

    const getAllCutTables = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        ctdService.getAllCutTables(req).then((res => {
            if (res.status) {
                setCutTables(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getClassName = (materialStatus: WhMatReqLineStatusEnum) => {
        switch (materialStatus) {
            case WhMatReqLineStatusEnum.OPEN: return 'w-gray';
            case WhMatReqLineStatusEnum.PREPARING_MATERIAL: return 'w-yellow';
            case WhMatReqLineStatusEnum.MATERIAL_NOT_AVL: return 'w-red';
            case WhMatReqLineStatusEnum.MATERIAL_READY: return 'w-ready';
            case WhMatReqLineStatusEnum.MATERIAL_ON_TROLLEY: return 'w-tro';
            case WhMatReqLineStatusEnum.MATERIAL_IN_TRANSIT: return 'w-tran';
            case WhMatReqLineStatusEnum.REACHED_DESITNATION: return 'w-lgreen';
            // case WhMatReqLineStatusEnum.MATERIAL_ISSUED: return 'w-green';
            default: return ''
        }
    }

    const handleDocketSearchChange = (inputString: string) => {
        setSearchString(inputString);
        const rollElement = document.getElementById(inputString);
        rollElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const refreshDashboard = () => {
        setCutTables([]);
        getAllCutTables();
    }

    return <>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '16px' }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between" wrap>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            label="Search Docket"
                        >
                            <Input type="text" placeholder="Search  Docket" onChange={e => handleDocketSearchChange(e.target.value)} allowClear={true}/>
                        </Form.Item>
                    </Col>
                     <Col xs={24} sm={12} md={4} lg={2} style={{ textAlign: 'right' }}>
                        <Popover title="Click to refresh the dashboard.">
                            <Button onClick={refreshDashboard} type="primary">
                                <ReloadOutlined />
                            </Button>
                        </Popover>
                    </Col>
                </Row>
                {cutTables.map(c => <WarehouseRequestCutTable cutTable={c} searchableDocket={searchString} />)}

            </div>
            <div style={{ position: 'sticky', bottom: 0, marginBottom: -50, }}>
                <Card title={<span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>Color Legend</span>} size="small" style={{ padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
                    <Space wrap>
                        <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.OPEN)} type="primary">OPEN</Button>
                        <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.PREPARING_MATERIAL)} type="primary">PREPARING MATERIAL</Button>
                        <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_NOT_AVL)} type="primary">MATERIAL NOT AVAILABLE</Button>
                        <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_READY)} type="primary">MATERIAL READY</Button>
                        <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_ON_TROLLEY)} type="primary">MATERIAL ON TROLLEY</Button>
                        <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_IN_TRANSIT)} type="primary">MATERIAL IN TRANSIT</Button>
                        <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.REACHED_DESITNATION)} type="primary">REACHED DESTINATION</Button>
                        {/* <Button style={{ minWidth: '150px' }} className={getClassName(WhMatReqLineStatusEnum.MATERIAL_ISSUED)} type="primary">MATERIAL ISSUED</Button> */}
                    </Space>
                </Card>
            </div>
        </div>
    </>
}
export default WarehouseRequestDashboardPage;