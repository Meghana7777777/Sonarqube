import { CommonIdReqModal, CommonRequestAttrs, ManufacturingOrderNumberRequest, MOToPOMappingModel, MOToPOMappingReq, PackListDropDownModel, PLHeadIdReq, SI_ManufacturingOrderInfoAbstractModel, SupplierCodeReq } from "@xpparel/shared-models";
import { FabricRequestCreationService, MoToRMPoMapService, OrderCreationService, PackingListService, SupplierServices } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Popconfirm, Row, Select, Table, Tooltip } from "antd";
import { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../common";
import { AlertMessages } from "../../../common";
import './mo-to-rm-po.mapping.css';
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
export interface IMOToPOMappingModel extends MOToPOMappingModel {
    isNew: boolean
}
export const MoToRmPoMapping = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [packListData, setPackListData] = useState<PackListDropDownModel[]>([]);
    const [rmPoNos, setRmPoNos] = useState([]);
    const [moNos, setMoNos] = useState<SI_ManufacturingOrderInfoAbstractModel[]>([]);
    const [moNoToIdMap, setMoNoToIdMap] = useState(new Map<string, number>());
    const [plIdToCodeMap, setPlIdToCodeMap] = useState(new Map<number, string>());

    const [saveObjects, setSaveObjects] = useState<MOToPOMappingModel[]>([]);
    const [savedMappingRecords, setSavedMappingRecords] = useState<MOToPOMappingModel[]>([]);

    const [isMappingDeletable, setIsMappingDeletable] = useState(false);






    const [form] = Form.useForm();

    const user = useAppSelector((state) => state.user.user.user);
    const supplierServices = new SupplierServices();
    const moTOMapService = new MoToRMPoMapService();
    const packingListService = new PackingListService();
    const orderCreationService = new OrderCreationService();
    const materialRequestService = new FabricRequestCreationService();

    useEffect(() => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        getAllSuppliers(req);
        getAllMoNos(req);
    }, []);

    const getAllMoNos = (req: CommonRequestAttrs) => {
        orderCreationService.getManufacturingOrdersList(req).then((res) => {
            if (res.status) {
                const moNoToIdMap = new Map<string, number>()
                res.data.forEach(mo => {
                    moNoToIdMap.set(mo.moNumber, mo.moPk);
                })
                setMoNos(res.data);
                setMoNoToIdMap(moNoToIdMap);
                setSaveObjects([]);
            } else {
                setMoNos([]);
                setMoNoToIdMap(new Map<string, number>());
                setSaveObjects([]);
            }
        }).catch((err) => {
            setMoNos([]);
            setMoNoToIdMap(new Map<string, number>());
            setSaveObjects([]);
        })
    }


    const getAllSuppliers = (req: CommonRequestAttrs) => {
        supplierServices.getAllSuppliersData(req).then((res) => {
            if (res.status) {
                setSuppliers(res.data);
            } else {
                setSuppliers([]);
            }
        }).catch((err) => {
            console.log(err.message);
            setSuppliers([]);
        })
    }


    const getAllPackLists = (supplierCode: string) => {
        const req = new SupplierCodeReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, supplierCode);
        packingListService.getPackListsForSupplier(req).then((res) => {
            if (res.status) {
                setPackListData(res.data);
                const plIdToPlMap = new Map<number, string>()
                res.data.forEach(mo => {
                    plIdToPlMap.set(mo.phId, mo.packListNo);
                })
                setPlIdToCodeMap(plIdToPlMap);
            } else {
                setPackListData([]);
            }
        }).catch((err) => {
            console.log(err.message);
            setPackListData([]);
        })
    }

    const getRmPosForPackList = (phId: number) => {
        const reqModel: PLHeadIdReq = new PLHeadIdReq(phId, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        packingListService.getRmPosForPackList(reqModel).then((res) => {
            if (res.status) {
                setRmPoNos(res.data);
            } else {
                setRmPoNos([]);
            }
        }).catch((err) => {
            setRmPoNos([]);
        })
    }

    const getMoToRmPoMapData = (moNo: string) => {
        const reqModel: ManufacturingOrderNumberRequest = new ManufacturingOrderNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [moNo]);
        moTOMapService.getMoToRmPoMapData(reqModel).then((res) => {
            if (res.status) {
                const data = [];
                res?.data?.forEach(mo => {
                    data.push(new MOToPOMappingModel(mo.poNumber, mo.moRefId, mo.moNo, mo.phRefId, mo.packListCode, mo.id));
                })
                setSavedMappingRecords(data);
            } else {
                setSavedMappingRecords([]);
            }
        }).catch((err) => {
            console.log(err.message);
            setSavedMappingRecords([]);
        })
    }

    const checkIsMappingDeletable = (moNo: string) => {
        const reqModel: ManufacturingOrderNumberRequest = new ManufacturingOrderNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [moNo]);
        materialRequestService.checkMRExistForGivenMoNo(reqModel).then((res) => {
            if (res.status) {
                setIsMappingDeletable(false);
            } else {
                setIsMappingDeletable(true);
            }
        }).catch((err) => {
            console.log(err.message);
            setIsMappingDeletable(false);
        })
    }

    const moOnChangeHandler = (value: string) => {
        getMoToRmPoMapData(value);
        checkIsMappingDeletable(value);
    }

    const supplierOnChangeHandler = (value: string) => {
        getAllPackLists(value);
        setRmPoNos([]);
        form.setFieldValue('packList', '');
        form.setFieldValue('rmPoNumbers', []);
    }

    const packListOnChangeHandler = (value: number) => {
        getRmPosForPackList(value);
        form.setFieldValue('rmPoNumbers', []);
    }

    const handleAdd = () => {
        form.validateFields().then((values) => {
            const newRecords = [];
            let isDuplicate = false;
            values.rmPoNumbers.forEach(rmPoNo => {
                const isExist = savedMappingRecords.find(rec => rec.moNumber == values.moNumber && rec.plHeadRefId == values.packList && rec.poNumber == rmPoNo);
                if (!isExist) {
                    const moToRmPoMapModel: MOToPOMappingModel = new MOToPOMappingModel(rmPoNo, moNoToIdMap.get(values.moNumber), values.moNumber, values.packList, plIdToCodeMap.get(values.packList), undefined);
                    newRecords.push(moToRmPoMapModel);
                } else {
                    isDuplicate = true;
                    AlertMessages.getWarningMessage("Mapping already exist");
                }
            })
            if (!isDuplicate)
                setSaveObjects([...saveObjects, ...newRecords]);
        }).catch(err => console.log(err.message));
    }

    const handleSubmit = () => {
        const reqModel: MOToPOMappingReq = new MOToPOMappingReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, saveObjects);
        moTOMapService.mapMoToRMPo(reqModel).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                setSaveObjects([]);
                form.resetFields();
                setSavedMappingRecords([]);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const handleDelete = (record: IMOToPOMappingModel) => {
        if (record.isNew) {
            setSaveObjects(saveObjects.filter(mo => !(mo.moRefId == record.moRefId && mo.poNumber == record.poNumber && mo.plHeadRefId == record.plHeadRefId)));
        } else {
            const reqModel: CommonIdReqModal = new CommonIdReqModal(record.id, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
            moTOMapService.deleteMapping(reqModel).then((res) => {
                if (res.status) {
                    getMoToRmPoMapData(form.getFieldValue('moNumber'));
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch((err) => {
                console.log(err.message);
            })
        }
    }

    const columns: ColumnType<any>[] = [
        {
            title: "MO No",
            dataIndex: "moNumber",
            key: "moNumber",
            align: "center"
        },
        {
            title: "PO No",
            dataIndex: "poNumber",
            key: "poNumber",
            align: "center"
        },
        {
            title: "PackList No",
            dataIndex: "packLisNo",
            key: "packLisNo",
            align: "center"
        },
        {
            title: "Action",
            align: "center",
            render: (value, record: IMOToPOMappingModel) => <Tooltip title="delete">
                <Popconfirm
                    title={`Are you sure you want to delete?`}
                    onConfirm={(e) => {
                        e.stopPropagation();
                        handleDelete(record)
                    }}
                    onCancel={(e) => {
                        e.stopPropagation();
                    }}
                    okText="Yes"
                    cancelText="No">
                    <Button size="small" type="primary" onClick={(e) => e.stopPropagation()} danger icon={<DeleteOutlined />} disabled={record.isNew ? false : !isMappingDeletable}>Delete</Button>
                </Popconfirm></Tooltip>
        }
    ];

    const getTableData = () => {
        return [...savedMappingRecords, ...saveObjects.map(rec => { return { ...rec, isNew: true } })];
    }





    return <Card title="MO to RM PO Mapping" size="small">
        <Form form={form} layout="vertical">
            <Row>
                <Col>
                    <Form.Item name="moNumber" label="Manufacturing Order" rules={[{ required: true, message: "Manufacturing Order is required" }]}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Select MO No"
                            style={{ minWidth: 250 }}
                            onChange={moOnChangeHandler}
                        >
                            {moNos.map((order) => (
                                <Option key={order.moNumber} value={order.moNumber}>
                                    {order.moNumber}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item></Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col>
                    <Form.Item name="supplierCode" label="Supplier Code"
                        rules={[{ required: true, message: "Supplier code  is required" }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Select Supplier"
                            style={{ minWidth: 250 }}
                            onChange={supplierOnChangeHandler}
                        >
                            {suppliers.map((supplier) => (
                                <Option key={supplier.supplierCode} value={supplier.supplierCode}>
                                    {supplier.supplierName} ({supplier.supplierCode})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="packList" label="Select Pack List"
                        rules={[{ required: true, message: "Select pack list is required" }]}>
                        <Select
                            showSearch
                            allowClear
                            placeholder="Select Pack List"
                            optionFilterProp="label"
                            style={{ minWidth: 250 }}
                            onChange={packListOnChangeHandler}
                        >
                            {packListData?.map((data) => (
                                <Option key={data.phId} value={data.phId} label={data.packListNo}>
                                    {data.packListNo}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name="rmPoNumbers" label="RM PO No "
                        rules={[{ required: true, message: "RM PO No  is required" }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            mode="multiple"
                            style={{ width: 250 }}
                            placeholder="Select RM PO No"
                        >
                            {rmPoNos.map((po) => (
                                <Option key={po} value={po}>
                                    {po}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label={' '}>
                        <Button type="primary" onClick={handleAdd}  >
                            Add
                        </Button>
                    </Form.Item>

                </Col>
            </Row>
        </Form>
        <Table columns={columns} dataSource={getTableData()} pagination={false} size="small" bordered scroll={{x: 'max-content'}} style={{ marginTop: 20 }}
            rowClassName={(record) => (record.isNew ? 'new-row' : '')}
        />
        <Button type="primary" style={{ marginTop: 20, float: 'right' }} onClick={handleSubmit} disabled={saveObjects.length === 0}>
            Submit
        </Button>
    </Card>;
};

export default MoToRmPoMapping;
