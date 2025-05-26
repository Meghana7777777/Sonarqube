import { CommonRequestAttrs, LockedFabMaterialModel, MasterdataCategoryEnum, OnFloorConfirmedRollBarcodeRequest, OnFloorConfirmedRollIdsRequest, OnFloorRollIdsRequest, ReasonsCategoryRequest, ReasonsCreationModel, RollLocationEnum, RollLocationRequest, RollReceivingConfirmationStatusEnum, rollLocationEnumDisplayValues } from "@xpparel/shared-models"
import { DocketMaterialServices, ReasonssServices } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Col, Form, Input, Popover, Row, Select, Space, Table, Tag } from "antd"
import { useAppSelector } from '../../../../../common';
import { CustomColumn } from "packages/ui/src/schemax-component-lib"
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../../common";
import { ReloadOutlined, ScanOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words'; 
import Search from "antd/es/input/Search";

const { Option } = Select;
export const OnFloorRollsConfirmation = () => {
    type floorRollsWithExtraParams = LockedFabMaterialModel & { checkbox: boolean }
    const [pendingPresenceConfirmationRolls, setPendingPresenceConfirmationRolls] = useState<floorRollsWithExtraParams[]>([]);
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
    const [selectedRows, setSelectedRows] = useState<any>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();

    useEffect(() => {
        getPendingPresenceConfirmationRolls();
        getReasonsAgainstCategory();
    }, [])




    const getPendingPresenceConfirmationRolls = () => {
        const reqObj = new CommonRequestAttrs(userName, unitCode, companyCode, userId);
        service.getPendingPresenceConfirmationRolls(reqObj).then((res) => {
            if (res.status) {
                setPendingPresenceConfirmationRolls(res.data.map(rec => {
                    return {
                        ...rec,
                        checkbox: false,
                    }
                }));
            } else {
                setPendingPresenceConfirmationRolls([]);
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
        // TODO:CUT
        // const reasonCatReq = new ReasonsCategoryRequest(userName, unitCode, companyCode, userId, MasterdataCategoryEnum.RETURN);
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
            align: 'center',
            width: "10%",
            isDefaultSelect: true,
            ...getColumnSearchProps('itemCode') as any,
        },
        {
            title: 'Fabric Code Description',
            dataIndex: 'itemDesc',
            key: 'itemDesc',
            align: 'center',
            width: "30%",
            isDefaultSelect: true,
            ...getColumnSearchProps('itemDesc') as any,
        },
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
            key: 'consumedQty',
            align: 'center',
            render: (qty: number) => {
                return <Tag color="orange">{qty}</Tag>
            },
        },
        {
            title: 'Balance Quantity',
            dataIndex: 'balanceQty',
            key: 'balanceQty',
            align: 'center',
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
        {
            title: 'Current Location',
            dataIndex: 'currentLocation',
            key: 'currentLocation',
            align: 'center',
            render: (loc: RollLocationEnum) => {
                return rollLocationEnumDisplayValues[loc];
            },
        },
        {
            title: 'Reason',
            dataIndex: 'reasonId',
            key: 'reasonId',
            align: 'center',
            render: (reasonId: number) => {
                return categoryReasonsData.find(r => Number(r.id) == Number(reasonId))?.name;
            },
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: number[], selectedRowsValues: any) => {
            setOnFloorIds(selectedRowKeys);
            setSelectedRows(selectedRowsValues)
        },
    };

    const confirmRollPresence = () => {
        const reqObj = new OnFloorConfirmedRollIdsRequest(userName, unitCode, companyCode, userId, onFloorIds, RollReceivingConfirmationStatusEnum.RECEIVED, null);
        service.confirmRollPresence(reqObj).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                clearPreviousFields();
                getPendingPresenceConfirmationRolls();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    }

    const confirmRollPresenceByBarcode = (barcode: string) => {
        const barcodeReq = new OnFloorConfirmedRollBarcodeRequest(userName, unitCode, companyCode, userId, barcode, RollReceivingConfirmationStatusEnum.RECEIVED, null);
        service.confirmRollPresenceByBarcode(barcodeReq).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                // getPendingPresenceConfirmationRolls();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
            clearPreviousFields();
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
        });
    }

    
    const rollInputRef = useRef(null);
    const rollInputFocus = () => {
        if (rollInputRef.current) {
            rollInputRef.current.focus();
        }
    }

    const clearPreviousFields = () => {
        form.setFieldValue('manBarcode', '');
        form.setFieldValue('rollBarcode', '');
        setOnFloorIds([]);
        setManualBarcodeVal('');
        setTimeout(() => rollInputFocus(), 1)
    }

    
    const refreshPage = () => {
        getPendingPresenceConfirmationRolls();
        getReasonsAgainstCategory();
    }

    return (
        <>
            <Form form={form}>
                <Row gutter={[16, 16]} align="top">
                    <Col xs={24} md={20}>
                        <Form.Item label="Scan Roll Barcode">
                            <Space>
                                <Form.Item name="rollBarcode" noStyle >
                                    <Input placeholder="Scan Roll Barcode" ref={rollInputRef} onChange={(e) => confirmRollPresenceByBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                </Form.Item>
                                <Form.Item name="manBarcode" noStyle initialValue={manualBarcodeVal}>
                                    <Search placeholder="Type Roll Barcode" onSearch={e => confirmRollPresenceByBarcode(e)} enterButton />
                                </Form.Item>
                            </Space>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4} style={{ textAlign: 'right' }}>
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
                    dataSource={pendingPresenceConfirmationRolls} />
                <br />
                <Row style={{ display: "flex", flexDirection: "row", justifyContent: "start" }}>
                    <Col span={5} offset={1}  style={{ width: "30%" }}>
                        {( onFloorIds.length > 0) ?
                            <Button type="primary" className="btn-green" onClick={confirmRollPresence}>
                                Confirm Roll Presence
                            </Button> : ''}
                    </Col>
                </Row>
            </Form>
        </>
    )
}