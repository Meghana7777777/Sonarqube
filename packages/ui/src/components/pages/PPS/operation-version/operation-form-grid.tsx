import { CommonRequestAttrs, OpCategoryEnum, OpGroupModel, OpVerIdRequest, OpVersionModel, OpVersionRequest, OperationModel, PoProductFgColorRequest, PoProdutNameRequest, opCategoryEnumDisplayValues } from "@xpparel/shared-models";
import { OpVersionService, OperationService, POService, PoMaterialService } from "@xpparel/shared-services";
import { Button, Col, Divider, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { ColumnProps } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import { version } from "os";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select


interface IProps {
    poSerial: number;
    productName: string;
    style: string;
    fgColor: string;
    components: string[]
}
const OperationVersionFormGrid = (props: IProps) => {
    const [form] = Form.useForm();
    const [opGroupsForm] = Form.useForm();
    const [pageForm] = Form.useForm();
    const [opVersionData, setOpVersionData] = useState<OperationModel[]>([]);
    const [opFormData, setOpFormData] = useState<OperationModel[]>([]);
    const [opCodesData, setOpCodesData] = useState<OperationModel[]>([]);
    const [opGroupsData, setOpGroupsData] = useState<OpGroupModel[]>([]);
    const [updateState, setUpdateState] = useState<number>(0);
    const [btnDisableFlag, setBtnDisableFlag] = useState<boolean>(false);
    const [confirmBtnFlag, setConfirmBtnflag] = useState<boolean>(false);
    const [componentsData, setComponentsData] = useState<string[]>([]);
    const [isOpSeqExists, setIsOpSeqExists] = useState<boolean>(false);
    const [opVersionId, setOpVersionId] = useState<number>();


    useEffect(() => {
        if (props.poSerial) {
            // console.log(props)
            setComponentsData(props.components)
            getAllOperations();
            getOpVersionForPoProductName(props.poSerial, props.productName, props.style, props.fgColor);
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);

    const opVersionService = new OpVersionService();
    const opService = new OperationService()
    /**
     * Get All Operations
     * @param poSerial 
     */
    const getAllOperations = () => {
        const opreq = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
        opService.getAllOperations(opreq)
            .then((res) => {
                if (res.status) {
                    setOpCodesData(res.data);
                } else {
                    setOpCodesData([]);
                    // AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }
    const getOpVersionForPoProductName = (poSerial: number, productName: string, style: string, fgColor: string) => {
        const req = new PoProductFgColorRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, productName, style, fgColor)
        opVersionService.getOpVersionForPoProductName(req)
            .then((res) => {
                if (res.status) {
                    setOpVersionData(res.data[0].operations);
                    setOpGroupsData(res.data[0].opGroups);
                    setIsOpSeqExists(true)
                    pageForm.setFieldsValue({ version: res.data[0].version })
                    pageForm.setFieldsValue({ description: res.data[0].description })
                    setOpVersionId(res.data[0].id)
                } else {
                    setOpVersionId(undefined);
                    setIsOpSeqExists(false)
                    setOpGroupsData([])
                    setOpVersionData([{
                        opCode: null,
                        eOpCode: null,
                        opName: null,
                        opCategory: null,
                        opForm: null,
                        opSeq: null,
                        group: null,
                        smv: null
                    }]);
                    // AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });

    }

    const handleOpChange = (val, record, index) => {
        const selOpcode = opVersionData.filter(item => item.opCode == val)
        if (selOpcode.length > 0) {
            form.setFieldsValue({ [`opCode${index}`]: null })
            opVersionData[index].opCode = null
            setOpVersionData([...opVersionData])
            AlertMessages.getWarningMessage('Same operation code existed')
        } else {
            opVersionData[index].opCategory = record.opData.opCategory
            opVersionData[index].opForm = record.opData.opForm
            opVersionData[index].opName = record.opData.opName
            opVersionData[index].smv = record.opData.smv
            opVersionData[index].opCode = record.opData.opCode
            opVersionData[index].opSeq = index + 1
            setOpVersionData([...opVersionData])
            setUpdateState(prev => prev + 1)
        }

    }

    const handleGroupChange = (val, option, index, record) => {
        const selGroups = opVersionData.filter(item => item.group == val)
        //validation to restrict the same group for more than 2 same operation categories
        if (selGroups.length == 2) {
            AlertMessages.getWarningMessage('Same group should not allowed for morethan 2 operation categories')
            opVersionData[index].group = null
            form.setFieldsValue({ [`group${index}`]: null })
            setOpVersionData([...opVersionData])
            // setOpVersionData([...opVersionData])
        } else if (selGroups.length == 1 && selGroups[0].opCategory != record.opCategory) {
            AlertMessages.getWarningMessage('Operation category must be same for all operation under a group')
            opVersionData[index].group = null
            form.setFieldsValue({ [`group${index}`]: null })
            setOpVersionData([...opVersionData])
        } else {
            opVersionData[index].group = val
            setOpVersionData([...opVersionData])
        }

    }

    const handleDepGroupChange = (record, val, index, group) => {
        const isGreaterGroupSelected = record.some(value => { return value >= group })
        if (isGreaterGroupSelected) {
            AlertMessages.getWarningMessage('Next operation will not be the dependent group')
            opGroupsForm.setFieldsValue({ [`depGroups${index}`]: [] })
            setOpGroupsData([...opGroupsData])
        } else {
            opGroupsData[index].depGroups = record
            setOpGroupsData([...opGroupsData])
        }
    }

    const handleComponentChange = (record, val, index) => {
        opGroupsData[index].components = record
        setOpGroupsData([...opGroupsData])
    }



    // const constructOperationSeqTableData = () => {
    const operationColumns: ColumnProps<any>[] = [
        {
            key: 'opCode',
            title: 'Op Code',
            align: 'center',
            dataIndex: "opCode",
            render: (text, record, index) => (
                isOpSeqExists ? <>{text}</> :
                    <>

                        <Form.Item
                            name={`opCode${index}`}
                            // initialValue={record.opCode}
                            rules={[
                                {
                                    required: true,
                                    message: 'Select Op Code',
                                },
                            ]}
                        >
                            <Select
                                // allowClear
                                placeholder={'Select Op Code'}
                                style={{ width: '150px' }}
                                defaultValue={record.opCode}
                                onChange={(record, value) => handleOpChange(record, value, index)}
                            >
                                {opCodesData.map((opInfo) => (
                                    <Option key={opInfo.opCode} opData={opInfo} value={opInfo.opCode}>
                                        {opInfo.opCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>


                    </>
            )
        },
        {
            key: 'opCategroy',
            title: 'Op Category',
            align: 'center',
            dataIndex: "opCategory",
            render: (value: OpCategoryEnum) => {
                return opCategoryEnumDisplayValues[value];
            }
        },
        {
            key: 'opForm',
            title: 'Op Form',
            align: 'center',
            dataIndex: "opForm",
        },
        {
            key: 'opName',
            title: 'Op Name',
            align: 'center',
            dataIndex: "opName",
        },
        {
            key: 'smv',
            title: 'SMV',
            align: 'center',
            dataIndex: "smv",
            width: '10%',
            render: (text, record, index) => (
                <span>
                    {isOpSeqExists ? <>{text}</> :
                        record.opCode ?
                            <Form.Item name="smv">
                                <Input placeholder="smv" disabled defaultValue={0} />
                            </Form.Item>
                            : null}

                </span>
            )
        },
        {
            key: 'opSeq',
            title: 'Op Sequence',
            align: 'center',
            dataIndex: "opSeq",
        },
        {
            key: 'group',
            title: 'Op Group',
            align: 'center',
            dataIndex: "group",
            render: (text, record, index) => {
                return <>
                    <span>{isOpSeqExists ? <>{text}</> :
                        record.opCode ?
                            <Form form={form}>
                                <Form.Item
                                    name={`group${index}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing Group',
                                        },
                                    ]}
                                // initialValue={record.group}
                                >
                                    <Select
                                        // allowClear
                                        placeholder={'Group'}
                                        style={{ width: '120px' }}
                                        defaultValue={record.group}
                                        onChange={(value, option) => handleGroupChange(value, option, index, record)}
                                    >
                                        {Array.from({ length: opVersionData.length }, (_, index) => index + 1).map((number) => (
                                            <Option key={number} value={String(number)}>
                                                {number}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Form>
                            : null}


                    </span>
                </>
            }
        },
        (isOpSeqExists) ? <></> :
            {
                key: 'action',
                title: 'Action',
                align: 'center',
                // dataIndex: "group",
                render: (text, rec, index) => {
                    return <>{
                        (opVersionData.length - 1) == (index) ?
                            <span>
                                <Row>
                                    <Space><Button disabled={btnDisableFlag} icon={<PlusOutlined />} className="btn-green" danger onClick={e => addRow(index)} type="primary" />
                                        <Button disabled={btnDisableFlag} danger icon={<MinusOutlined />} onClick={e => RemoveRow(index, rec)} type="primary" />
                                    </Space>
                                </Row>
                            </span>
                            : <></>}</>
                }

            }



    ]
    // return operationColumns

    // }

    const opGroupsColumns: ColumnProps<any>[] = [
        {
            key: 'opgroup',
            title: 'Group',
            align: 'center',
            dataIndex: "group",
        },
        {
            key: 'groupCategory',
            title: 'Category',
            align: 'center',
            dataIndex: "groupCategory",
        },
        {
            key: 'operations',
            title: 'Operations',
            align: 'center',
            dataIndex: "groupCategory",
            render: (text, record) => {
                return <>{(record.operations).toString()}</>
            }
        },
        {
            key: 'dependentGroup',
            title: 'Dependent Group',
            align: 'center',
            dataIndex: "depGroups",
            render: (text, item, index) => {
                return <>
                    {
                        index != 0 ?
                            isOpSeqExists ? <>{
                                text?.map(c => <Tag color="orange">{c}</Tag>)
                            }</> :
                                <span>
                                    <Form form={opGroupsForm}>
                                        <Form.Item
                                            name={`depGroups${index}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing Dependent Group',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder={'Select Dependent Group'}
                                                style={{ width: '200px' }}
                                                mode="multiple"
                                                allowClear
                                                defaultValue={item.depGroups}
                                                onChange={(record, value) => handleDepGroupChange(record, value, index, item.group)}
                                            >
                                                {Array.from({ length: opGroupsData.length }, (_, index) => index + 1).map((number) => (
                                                    <Option key={number} value={String(number)}>
                                                        {number}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </span>
                            : <>N/A</>}
                </>


            }

        },
        {
            key: 'components',
            title: 'Components',
            align: 'center',
            width: '30%',
            dataIndex: "components",
            render: (text, record, index) => (
                isOpSeqExists ? <>{
                    text?.map(c => <Tag color="blue">{c}</Tag>)
                }</> :
                    <span>
                        <Form form={opGroupsForm}>
                            <Form.Item
                                name={`component${index}`}
                                initialValue={record.components}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing Components',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={'Select Component'}
                                    style={{ width: '450px' }}
                                    // mode={opGroupsData[index].groupCategory != ProcessTypeEnum.EMB ? "multiple" : null}
                                    allowClear
                                    defaultValue={record.components}
                                    onChange={(record, value) => handleComponentChange(record, value, index)}
                                    disabled={index == 0 ? true : false}
                                >
                                    {componentsData.map((info) => (
                                        <Option key={info} value={info}>
                                            {info}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>

                    </span>
            )
        },
    ]


    const addRow = (index) => {
        if (opVersionData[index].opSeq == null || opVersionData[index].opCode == null) {
            AlertMessages.getErrorMessage('Operation code should select to proceed')
        } else {
            setOpVersionData([...opVersionData, {
                opCode: null,
                eOpCode: null,
                opName: null,
                opCategory: null,
                opForm: null,
                opSeq: null,
                group: null,
                smv: null
            }]);
        }
        setUpdateState(prev => prev + 1)
    }
    const RemoveRow = (index, rowData) => {
        form.resetFields([`opCode${index}`, `group${index}`]);
        if (opVersionData.length > 1) {
            opVersionData.splice(index, 1);
            setOpVersionData([...opVersionData])
        }
        setUpdateState(prev => prev + 1)
    }

    const confirmOperation = () => {
        form.validateFields().then(() => {
            setBtnDisableFlag(true)
            setConfirmBtnflag(true)
            let groupWiseOperations: OpGroupModel[] = []
            opVersionData.map((element, index) => {
                const findGroup = groupWiseOperations.find(i => i.group == element.group)
                if (!(findGroup)) {
                    const obj = {
                        group: element.group,
                        sequence: null,
                        depGroups: [],
                        operations: [element.opCode],
                        components: [],
                        groupCategory: element.opCategory
                    }
                    if (index == 0) { // CHANGES BY SRI
                        obj.components = componentsData; // CHANGES BY SRI
                    }
                    groupWiseOperations.push(obj)
                } else {
                    groupWiseOperations.find(i => i.group == element.group).operations.push(element.opCode)
                }
            })
            setOpGroupsData(groupWiseOperations)
        }).catch((err) => {
            AlertMessages.getErrorMessage('some Info missing')
        })

    }
    const unConfirmOperation = () => {
        setBtnDisableFlag(false)
        setConfirmBtnflag(false)
        setOpGroupsData([])
        opGroupsForm.resetFields()
        pageForm.resetFields()

    }

    const saveSequence = (val) => {
        // createOpVersionForProduct
        // opGroupsForm.validateFields().then(() => {
        //     pageForm.validateFields().then(() => {
        //         const verisonname = pageForm.getFieldValue('version')
        //         const description = pageForm.getFieldValue('description')
        //         const opversiondata = new OpVersionModel(null, verisonname, description, opVersionData, opGroupsData, null, null)
        //         const opVersionReq = new OpVersionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.productName, props.poSerial, opversiondata)
        //         opVersionService.createOpVersionForProduct(opVersionReq)
        //             .then((res) => {
        //                 if (res.status) {
        //                     AlertMessages.getSuccessMessage(res.internalMessage);
        //                     getOpVersionForPoProductName(props.poSerial, props.productName);
        //                 } else {
        //                     AlertMessages.getErrorMessage(res.internalMessage);
        //                 }
        //             })
        //             .catch((err) => {
        //                 AlertMessages.getErrorMessage(err.message);
        //             });
        //     }).catch(() => {

        //     })
        // }).catch(() => {

        // })
    }
    const resetAllData = () => {
        form.resetFields();
        unConfirmOperation();
        setOpVersionId(undefined);
        setIsOpSeqExists(false)
        setOpVersionData([{
            opCode: null,
            eOpCode: null,
            opName: null,
            opCategory: null,
            opForm: null,
            opSeq: null,
            group: null,
            smv: null
        }]);
    }
    const deleteSequence = () => {
        // deleteOpVersion
        const delOpReq = new OpVerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, opVersionId)
        opVersionService.deleteOpVersion(delOpReq)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    resetAllData();
                    //notify the response
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }
    return (<>
        {/* {opVersionData ? 
        //if operation version existed ,saved data shoud show here
        <></>
        : */}
        <Form form={form} >
            <Table
                rowKey={record => record.opCode}
                columns={operationColumns}
                dataSource={opVersionData}
                bordered
                scroll={{ x: 'max-content' }}
                pagination={false}
                size='small'
            />
        </Form>
        {/* } */}
        <br />
        {isOpSeqExists ? <></> :
            <Row justify={"end"}>
                <Button disabled={confirmBtnFlag} onClick={e => confirmOperation()} type="primary" >
                    Confirm Operations
                </Button>
                <Divider type="vertical" />
                <Button danger disabled={!confirmBtnFlag} onClick={e => unConfirmOperation()} type="primary" >
                    Un Confirm
                </Button>
            </Row>
        }
        <br />
        {(opGroupsData.length > 0 || isOpSeqExists) ?
            <Table
                rowKey={record => record.group}
                columns={opGroupsColumns}
                dataSource={opGroupsData}
                bordered
                scroll={{ x: 'max-content' }}
                pagination={false}
                size='small'
            />
            : <></>}
        <br />
        {opGroupsData.length > 0 ?
            <Form form={pageForm} >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="version" label="Version" rules={[
                            {
                                required: true,
                                message: 'Missing Version',
                            },
                        ]}>
                            <Input placeholder="only 20 characters are accepted" disabled={isOpSeqExists ? true : false} maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="description" label="Version Description" rules={[
                            {
                                required: true,
                                message: 'Missing Description',
                            },
                        ]}>
                            <TextArea rows={1} disabled={isOpSeqExists ? true : false} placeholder="only 30 characters are accepted" maxLength={30} />
                        </Form.Item>
                    </Col>
                    {/* {!isOpSeqExists ?
                        <><Button className="btn-green"
                            // disabled={confirmbtnflag}
                            onClick={e => saveSequence(e)} type="primary" >
                            Save Sequence
                        </Button>
                            <Divider type="vertical" />
                        </>
                        :
                        <Button danger onClick={e => deleteSequence()} type="primary" >
                            Delete Sequence
                        </Button>
                    } */}
                </Row>
            </Form>
            : <></>}

    </>)
}
export default OperationVersionFormGrid;