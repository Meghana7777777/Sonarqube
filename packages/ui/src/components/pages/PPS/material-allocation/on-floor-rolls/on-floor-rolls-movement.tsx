import { CommonRequestAttrs, LockedFabMaterialModel, MasterdataCategoryEnum, OnFloorRollIdsRequest, ReasonsCategoryRequest, ReasonsCreationModel, RollLocationEnum, RollLocationRequest, rollLocationEnumDisplayValues } from "@xpparel/shared-models"
import { DocketMaterialServices, ReasonssServices } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Col, Form, Input, Popover, Row, Select, Table, Tag } from "antd"
import { useAppSelector } from '../../../../../common';
import { CustomColumn } from "packages/ui/src/schemax-component-lib"
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../../common";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words'; 

const { Option } = Select;
export const OnFloorRollsMovement = () => {
    type floorRollsWithExtraParams = LockedFabMaterialModel & { checkbox: boolean }
    const [onFloorRolls, setOnFloorRolls] = useState<floorRollsWithExtraParams[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<RollLocationEnum>(null);
    const [onFloorIds, setOnFloorIds] = useState<number[]>([]);
    const service = new DocketMaterialServices();
    const user = useAppSelector((state) => state.user.user.user);
    const userName = user?.userName;
    const unitCode = user?.orgData?.unitCode;
    const companyCode = user?.orgData?.companyCode;
    const userId = user?.userId;
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [categoryReasonsData, setCategoryReasonsData] = useState<ReasonsCreationModel[]>([]);
    const categoryReasonsService = new ReasonssServices();
    const [form] = Form.useForm()
    const [selectedRows, setSelectedRows] = useState<any>()
    useEffect(() => {
        getOnFloorRollsByLocation(RollLocationEnum.ONFLOOR);
        getReasonsAgainstCategory()
    }, [])




    const getOnFloorRollsByLocation = (location: RollLocationEnum) => {
        const reqObj = new RollLocationRequest(userName, unitCode, companyCode, userId, [location], false);
        service.getOnFloorRolls(reqObj).then((res) => {
            if (res.status) {
                setOnFloorRolls(res.data.map(rec => {
                    return {
                        ...rec,
                        checkbox: false,
                    }
                }));
            } else {
                setOnFloorRolls([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }
    function handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    function handleReset(clearFilters) {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button size="small" style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters)
                        setSearchedColumn(dataIndex);
                        confirm({ closeDropdown: true });
                    }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: text =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            )
                : null

    });


    const getReasonsAgainstCategory = () => {
        const reasonCatReq = new ReasonsCategoryRequest(userName, unitCode, companyCode, userId, MasterdataCategoryEnum.RETURN);
        // TODO:CUT
        // categoryReasonsService.getReasonsAgainstCategory(reasonCatReq).then((res) => {
        //     if (res.status) {
        //         setCategoryReasonsData(res.data);
        //     } else {
        //         setCategoryReasonsData([]);
        //     }
        // }).catch((error) => {
        //     console.log(error.message)
        // })
    }

    const onFloorRollsColumns: CustomColumn<LockedFabMaterialModel>[] = [
        {
            title: 'S.No',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            isDefaultSelect: true,
            render: (val: number, row: LockedFabMaterialModel, index: number) => {
                return ++index;
            }
        },
        {
            title: 'Fabric Code',
            dataIndex: 'itemCode',
            key: 'itemCode',
            width: "10%",
            align: 'center',
            isDefaultSelect: true,
            ...getColumnSearchProps('itemCode') as any,
        },
        {
            title: 'Fabric Code Description',
            dataIndex: 'itemDesc',
            key: 'itemDesc',
            width: "30%",
            align: 'center',
            isDefaultSelect: true,
            ...getColumnSearchProps('itemDesc') as any,
        },
        // {
        //     title: 'Item No',
        //     dataIndex: 'itemNo',
        //     key: 'itemNo',
        //     isDefaultSelect: true,
        // },
        {
            title: 'Lot Number',
            dataIndex: 'lotNo',
            key: 'lotNo ',
            align: 'center',
            isDefaultSelect: true,
            ...getColumnSearchProps('lotNo') as any,
        },
        {
            title: 'Roll Barcode',
            dataIndex: 'barcode',
            key: 'barcode',
            align: 'center',
            isDefaultSelect: true,
            ...getColumnSearchProps('barcode') as any,
        },
        // {
        //     title: 'Roll Id',
        //     dataIndex: 'itemId',
        //     key: 'itemId',
        //     isDefaultSelect: true,
        // },
        {
            title: 'Actual Shade',
            dataIndex: 'actualShade',
            key: 'actualShade',
            align: 'center',
            isDefaultSelect: true,
            ...getColumnSearchProps('actualShade') as any,
        },
        {
            title: 'Roll Quantity',
            dataIndex: 'originalQty',
            key: 'originalQty',
            align: 'center',
            render: (qty: number) => {
                return <Tag color="blue">{qty}</Tag>
            },
        },
        {
            title: 'Consumed Quantity',
            dataIndex: 'consumedQty',
            align: 'center',
            key: 'consumedQty',
            render: (qty: number) => {
                return <Tag color="orange">{qty}</Tag>
            },
        },
        {
            title: 'Balance Quantity',
            dataIndex: 'balanceQty',
            align: 'center',
            key: 'balanceQty',
            render: (text: any, record: any) => {
                const balanceQty = record.originalQty - record.consumedQty;
                const formattedBalanceQty = balanceQty.toFixed(2);
                return (
                    <div>
                        <Tag color={balanceQty >= 0 ? 'green' : 'red'}>{formattedBalanceQty}</Tag>

                    </div>
                );
            },
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: number[], selectedRowsValues: any) => {
            setOnFloorIds(selectedRowKeys);
            setSelectedRows(selectedRowsValues)
        },
    };
    
    const changeOnFloorRollsLocation = () => {
        const otherIReason = form.getFieldValue("otherReason");
        const remarks = form.getFieldValue("remarks");
        const reqObj = new OnFloorRollIdsRequest(userName, unitCode, companyCode, userId, onFloorIds, selectedLocation, otherIReason, remarks, null);
        service.changeRollLocation(reqObj).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                clearPreviousFields();
                getOnFloorRollsByLocation(RollLocationEnum.ONFLOOR);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    }

    const onLocationDropChange = (e) => {
        setSelectedLocation(e);
    }

    const clearPreviousFields = () => {
        form.setFieldValue('opForm', null);
        form.setFieldValue('otherReason', null);
        form.setFieldValue('remarks', null);
    }

    const refreshPage = () => {
        getOnFloorRollsByLocation(RollLocationEnum.ONFLOOR);
        getReasonsAgainstCategory();
    }

    return (
        <>
            <Row justify="end" style={{ marginBottom: 8 }}>
                <Col xs={0} sm={2} md={1} lg={1} xl={1} xxl={1}>
                    <Popover title="Click to refersh the dashboard.">
                        <Button onClick={refreshPage} type="primary">
                            <ReloadOutlined />
                        </Button>
                    </Popover>
                </Col>
            </Row>
            <Table
                size="small"
                rowKey={record => record.id}
                rowSelection={rowSelection}
                columns={[...onFloorRollsColumns]}
                bordered
                scroll={{ x: 'max-content' }}
                pagination={false}
                dataSource={onFloorRolls} />
            <br />
            <Form form={form}>
                <Row gutter={[16, 16]} justify="start" wrap>
                     <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            label="Change Location To"
                            name="opForm"
                            rules={[{ required: false, message: 'Select the Operation Form' }]}>
                            <Select placeholder="Please Select Operation Form" value={rollLocationEnumDisplayValues} onChange={e => onLocationDropChange(e)}>
                                {/* {Object.keys(rollLocationEnumDisplayValues).map(key => (
                                    <Option key={key} value={key}>
                                        {rollLocationEnumDisplayValues[key]}
                                    </Option>
                                ))} */}
                                <Option key={RollLocationEnum.WAREHOUSE} value={RollLocationEnum.WAREHOUSE}>
                                    {rollLocationEnumDisplayValues[RollLocationEnum.WAREHOUSE]}
                                </Option>
                                <Option key={RollLocationEnum.CUTTABLE} value={RollLocationEnum.CUTTABLE}>
                                    {rollLocationEnumDisplayValues[RollLocationEnum.CUTTABLE]}
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            label="Other Reason"
                            name="otherReason"
                            rules={[{ required: false, message: 'Select the Other Form' }]}>
                            <Select placeholder="Please Select Operation Form">
                                {categoryReasonsData.map(reasons => (
                                    <Option key={reasons.id} value={reasons.id}>
                                        {reasons.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            label="Remarks"
                            name="remarks"
                            rules={[{ required: false, message: 'Please enter the remarks' }]}>
                            <Input placeholder="Enter remarks" />
                        </Form.Item>
                    </Col>

                      <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', alignItems: 'end' }}>
                        {(selectedLocation && onFloorIds.length > 0) ?
                            <Button type="primary" className="btn-green" onClick={changeOnFloorRollsLocation}>
                                Change Location
                            </Button> : ''}
                    </Col>

                </Row>
            </Form>
        </>
    )
}