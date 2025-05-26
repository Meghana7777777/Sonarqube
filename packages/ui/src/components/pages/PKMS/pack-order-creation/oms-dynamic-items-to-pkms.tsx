import { ItemsServices, MaterialTypeService, PackListService } from "@xpparel/shared-services";
import { AlertMessages } from "../../../common";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CommonRequestAttrs, ItemsModelDto, MaterialTypeEnum, MaterialTypeRequestModel, MoNumberResDto, PackSerialRequest, PoIdRequest } from "@xpparel/shared-models";
import { useAppSelector } from "packages/ui/src/common";
import { Affix, Button, Card, Col, Form, Input, InputNumber, Row, Select, Table, message } from "antd";
import { SaveFilled, SaveTwoTone, StarFilled } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

interface IProps {
    selectedSummeryRecord?: PackSerialRequest;
    setCurrentStep: Dispatch<SetStateAction<number>>
}


const OmsDynamicItemsFromToPkms = (props: IProps) => {
    const { selectedSummeryRecord, setCurrentStep } = props
    const [omsItems, setOmsItems] = useState<{ code: string, desc: string }[]>([]);
    const [materialTypes, setMaterialTypes] = useState<MaterialTypeRequestModel[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [rowSelectedRecords, setRowSelectedRecords] = useState<Map<string, { code: string, desc: string }>>(new Map());
    const [category, setCategory] = useState<Map<string, MaterialTypeEnum>>(new Map());
    const [poBomItems, setPoBomItems] = useState<ItemsModelDto[]>([]);


    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;


    const packListService = new PackListService();
    const materialTypeService = new MaterialTypeService();
    const itemsServices = new ItemsServices();

    useEffect(() => {
        getMaterialsToItems();
    }, [])

    useEffect(() => {
        getOMSItemsForPKMS();
        getBOMItemsForPackOrder()
    }, [selectedSummeryRecord])

    const getBOMItemsForPackOrder = () => {
        const req = new PoIdRequest(selectedSummeryRecord.id, userName, orgData.unitCode, orgData.companyCode, userId);
        packListService.getBOMItemsForPackOrder(req).then(res => {
            if (res.status) {
                setPoBomItems(res.data);
            } else {
                setPoBomItems([]);
            }
        }).catch(error => console.log(error.message));
    };



    const getOMSItemsForPKMS = () => {
        const req = new MoNumberResDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        req.moNumber = selectedSummeryRecord.moNumber;
        req.packSerial = String(selectedSummeryRecord?.packSerial)
        packListService.getOMSItemsForPKMS(req).then(res => {
            if (res.status) {
                setOmsItems(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => err.message)
    }

    const getMaterialsToItems = () => {
        materialTypeService.getMaterialsToItems()
            .then((res) => {
                if (res.status) {
                    setMaterialTypes(res.data);
                } else {
                    setMaterialTypes([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const saveItems = () => {
        formRef.validateFields().then(values => {
            const formValues: any[] = Object.values(values);
            const filledValues = [];
            const commonAttributes = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
            rowSelectedRecords.forEach((selectedR, key) => {
                const findFilledValues = formValues.find(rec => rec.code === selectedR.code)
                if (findFilledValues) {
                    filledValues.push({ ...findFilledValues, ...commonAttributes, packSerial: selectedSummeryRecord?.packSerial })
                }
            })
            itemsServices.createItems(filledValues).then(res => {
                if (res.status) {
                    formRef.resetFields()
                    getOMSItemsForPKMS();
                    setSelectedRowKeys([])
                    setRowSelectedRecords(new Map());
                    setCategory(new Map());
                    setCurrentStep(2)
                    AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }

    const columns = [
        {
            title: 'Sl.No',
            render: (v, r, i) => i + 1
        },
        {
            title: 'Code',
            dataIndex: 'code',
            render: (v, r, index) => {
                formRef.setFieldValue([index, 'code'], v)
                return <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#d50b0b', fontSize: 8, display: rowSelectedRecords.has(v) ? '' : 'none' }} />
                    <Form.Item
                        rules={[{ required: rowSelectedRecords.has(v), message: 'Required Code' }]}
                        name={[index, 'code']}>
                        <Input
                            disabled={true}
                            placeholder="Code"
                        ></Input>
                    </Form.Item>
                </span>
            }
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            render: (v, r, index) => {
                formRef.setFieldValue([index, 'desc'], v)
                return <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#d50b0b', fontSize: 8, display: rowSelectedRecords.has(r.code) ? '' : 'none' }} />
                    <Form.Item
                        rules={[{ required: rowSelectedRecords.has(r.code), message: 'Required Description' }]}
                        name={[index, 'desc']}

                    >
                        <Input
                            disabled={true}
                            placeholder="Description"
                        ></Input>
                    </Form.Item>
                </span>
            }
        },
        {
            title: 'Material Type',
            dataIndex: 'code',
            render: (v, r, index) => {
                return <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#d50b0b', fontSize: 8, display: rowSelectedRecords.has(v) ? '' : 'none' }} />
                    <Form.Item
                        rules={[{ required: rowSelectedRecords.has(v), message: 'Required Material Type' }]}
                        name={[index, 'materialType']}
                    >
                        <Select
                            disabled={!rowSelectedRecords.has(v)}
                            allowClear
                            showSearch
                            placeholder={'Select Material Type'}
                        >

                            {materialTypes.map((rec => {
                                return <Select.Option value={rec.id}>{rec.materialTypeDesc}</Select.Option>
                            }))}
                        </Select>
                    </Form.Item>
                </span>
            }
        },
        {
            title: 'Category',
            dataIndex: 'code',
            render: (v, r, index) => {
                return <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#d50b0b', fontSize: 8, display: rowSelectedRecords.has(v) ? '' : 'none' }} />
                    <Form.Item
                        style={{ margin: 0 }}
                        rules={[{ required: rowSelectedRecords.has(v), message: 'Required Category' }]}
                        name={[index, 'category']}
                    >
                        <Select
                            disabled={!rowSelectedRecords.has(v)}
                            allowClear
                            showSearch
                            placeholder={'Select Category'}
                            onChange={(value) => {
                                setCategory((prev) => {
                                    const prevMap = new Map(prev);
                                    prevMap.set(v, value);
                                    return prevMap
                                })
                            }}
                        >
                            {Object.keys(MaterialTypeEnum).map((rec => {
                                return <Select.Option value={MaterialTypeEnum[rec]}>{MaterialTypeEnum[rec]}</Select.Option>
                            }))}
                        </Select>
                    </Form.Item>
                </span>
            }
        },
        {
            title: 'Length',
            dataIndex: 'code',
            render: (v, r, index) => {
                const disabledInput = () => {
                    if (rowSelectedRecords.has(v) && (category.get(v) === MaterialTypeEnum.CARTON || category.get(v) === MaterialTypeEnum.POLY_BAG)) {
                        return false
                    } else {
                        return true
                    }
                }
                return <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#d50b0b', fontSize: 8, display: !disabledInput() ? '' : 'none' }} />
                    <Form.Item
                        name={[index, 'length']}
                        rules={[{ required: !disabledInput(), message: 'Required Length' }]}
                    >
                        <InputNumber
                            disabled={disabledInput()}
                            style={{ width: '100%' }}
                            placeholder="Length"
                            min={0}
                        />
                    </Form.Item>
                </span>
            }
        },
        {
            title: 'Width',
            dataIndex: 'code',
            render: (v, r, index) => {
                const disabledInput = () => {
                    if (rowSelectedRecords.has(v) && (category.get(v) === MaterialTypeEnum.CARTON || category.get(v) === MaterialTypeEnum.POLY_BAG)) {
                        return false
                    } else {
                        return true
                    }
                }
                return <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#d50b0b', fontSize: 8, display: !disabledInput() ? '' : 'none' }} />
                    <Form.Item
                        rules={[{ required: !disabledInput(), message: 'Required Width' }]}
                        name={[index, 'width']} >
                        <InputNumber
                            disabled={disabledInput()}
                            style={{ width: '100%' }}
                            placeholder="Width"
                            min={0}
                        />
                    </Form.Item>
                </span>
            }
        },
        {
            title: 'Height',
            dataIndex: 'code',
            render: (v, r, index) => {
                const disabledInput = () => {
                    if (rowSelectedRecords.has(v) && category.get(v) === MaterialTypeEnum.CARTON) {
                        return false
                    } else {
                        return true
                    }
                }
                return <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#d50b0b', fontSize: 8, display: !disabledInput() ? '' : 'none' }} />
                    <Form.Item
                        rules={[{ required: !disabledInput(), message: 'Required Height' }]}
                        name={[index, 'height']} >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Height"
                            min={0}
                            disabled={disabledInput()}
                        />
                    </Form.Item>
                </span>
            }
        },
    ];

    const displayColumns: ColumnsType<any> = [
        {
            title: "Code",
            dataIndex: 'code',
            sorter: (a, b) => { return a.code.localeCompare(b.code) },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: "Description",
            dataIndex: 'desc'
        },
        {
            title: "Material Type",
            dataIndex: 'materialTypeDesc'

        },
        {
            title: "Length",
            dataIndex: 'length',

        },
        {
            title: "Width",
            dataIndex: 'width',
        },

        {
            title: "Height",
            dataIndex: 'height',
        },
        {
            title: "Category",
            dataIndex: 'category',
            align: 'center',
        }
    ];

    return <>
        <Card title='OMS Items'>
            <Form
                form={formRef}
                layout='vertical'

            >
                <Table
                    columns={columns}
                    dataSource={omsItems}
                    size={'small'}
                    bordered
                    scroll={{x: 'max-content'}}
                    rowKey={(r) => r.code}
                    pagination={false}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedRowKeys,
                        onSelect: (record, selected) => {
                            if (!selected) {
                                const findIndex = omsItems.findIndex(rec => rec.code === record.code);
                                formRef.resetFields(
                                    [
                                        [findIndex, 'materialType'],
                                        [findIndex, 'category'],
                                        [findIndex, 'length'],
                                        [findIndex, 'width'],
                                        [findIndex, 'height'],
                                    ]
                                )
                                category.delete(record.code)
                            }
                        },
                        onChange: (rowSelectedRowKeys: string[], selectedRows: any[]) => {
                            const selectedMap = new Map();
                            selectedRows.forEach(row => selectedMap.set(row.code, row));
                            setRowSelectedRecords(selectedMap);
                            setSelectedRowKeys(rowSelectedRowKeys);
                        }
                    }}
                >
                </Table>
                <Button
                    type='primary'
                    style={{ float: 'right' }}
                    icon={<SaveFilled />}
                    onClick={() => {
                        saveItems()
                    }}
                >Submit</Button>
            </Form >
        </Card>
        <br />
        <Card title='Pack Oder Items' style={{ marginTop: 10 }}>
            <Table
                columns={displayColumns}
                dataSource={poBomItems}
                size={'small'}
                bordered
                scroll={{x: 'max-content'}}
                rowKey={(r) => r.code}
                pagination={false}
            >
            </Table>
        </Card>

    </>
}

export default OmsDynamicItemsFromToPkms