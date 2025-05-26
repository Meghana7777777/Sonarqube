import { SearchOutlined } from '@ant-design/icons'
import { OrderTypeDisplayValues, ProcessingOrderCreationInfoModel, ProcessingOrderCreationRequest, ProcessingOrderSubLineRequest, ProcessTypeEnum, RoutingGroupDetail } from '@xpparel/shared-models'
import { Button, Col, Form, Input, message, Row, Select, Table, TableProps } from 'antd'

import React, { useEffect, useRef, useState } from 'react'
import { AlertMessages } from '../../components/common'
import { useAppSelector } from '../hooks'
import { POQtyRecommendationUtil } from '../utils/qty-recommendations'
import moment from 'moment'
import { defaultDateFormat } from '../../components/common/data-picker/date-picker'
const { Item } = Form
const { TextArea } = Input;


export interface IPoCreationProps {
    processType: ProcessTypeEnum[],
    styleCode: string,
    moInfo: ProcessingOrderCreationInfoModel[]
    onCreatePo: (values: ProcessingOrderCreationRequest) => void;
    updateKey: number;
    routingGroup: string
}
export default function ProcessingOrderCreation(props: IPoCreationProps) {
    const { styleCode, processType, onCreatePo, moInfo, updateKey, routingGroup } = props
    const [form] = Form.useForm()
    const [moQtys, setMoQtys] = useState<Record<string, number>>({})
    const [selectedRows, setSelectedRows] = useState<ProcessingOrderCreationInfoModel[]>([])
    const [anotherOptions, setAnotherOptions] = useState<any[]>([]);
    const poQtyRecommendationUtil = new POQtyRecommendationUtil()
    const searchInput = useRef(null);
    useEffect(() => {
        setSelectedRows([]);
        setMoQtys({})
        form.resetFields();
        if (moInfo) {
            updateDefaultQty(moInfo);
        }
    }, [updateKey]);

    const updateDefaultQty = (moData: ProcessingOrderCreationInfoModel[]) => {
        const moQtyObj: Record<string, number> = {};
        moData.forEach(moObj => {
            moQtyObj[moObj.moProductSubLineId] = moObj.balanceQty
        })
        setMoQtys(moQtyObj)
    }

    const user = useAppSelector((state) => state.user.user.user);


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();

    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
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
                <Button
                    size="small"
                    style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters);
                        confirm({ closeDropdown: true });
                    }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                type="search"
                style={{ color: filtered ? 'black' : 'white' }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select());
            }
        },
        // render: (text) =>
        //   text ? (
        //     searchedColumn === dataIndex ? (
        //       <Highlighter
        //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //         searchWords={[searchText]}
        //         autoEscape
        //         textToHighlight={text.toString()}
        //       />
        //     ) : (
        //       text
        //     )
        //   ) : null,
    });



    // New helper function
    const constructDefaultOptions = (record: ProcessingOrderCreationInfoModel) => {
        return poQtyRecommendationUtil
            .getPossibleQuantities(record.pslBundleCountDetail)
            .quantities.map(qty => ({
                key: qty.toString(),
                value: qty.toString(),
                label: `${qty}`,
                style: { backgroundColor: '#e6f4ff' }
            }));
    };

    const handleQtySearch = (
        searchText: string,
        record: ProcessingOrderCreationInfoModel,
        key: number
    ) => {
        const numericInput = parseInt(searchText);

        if (!searchText) {
            // When empty, show all valid quantities
            setAnotherOptions(prev => ({
                ...prev,
                [key]: constructDefaultOptions(record)
            }));
            return;
        }

        if (isNaN(numericInput)) {
            setAnotherOptions(prev => ({ ...prev, [key]: [] }));
            return;
        }

        // Generate recommendations based on input
        const recommendations = poQtyRecommendationUtil
            .getRecommendedQuantities(record.pslBundleCountDetail, numericInput)
            .map(qty => ({
                value: qty.toString(),
                label: `${qty}`,
                style: { backgroundColor: '#fff7e6' }
            }));

        // Include valid quantities that match input
        const matchingValids = poQtyRecommendationUtil
            .getPossibleQuantities(record.pslBundleCountDetail)
            .quantities
            .filter(qty => qty.toString().includes(searchText))
            .map(qty => ({
                value: qty.toString(),
                label: `${qty}`,
                style: { backgroundColor: '#e6f4ff' }
            }));

        setAnotherOptions(prev => ({
            ...prev,
            [key]: [...recommendations, ...matchingValids]
        }));
    };

    const handleMoQtyChange = (value: string | null, record: ProcessingOrderCreationInfoModel) => {
        const key = record.moProductSubLineId;

        if (!value) {
            setMoQtys(prev => ({ ...prev, [key]: null }));
            return;
        }

        const numericValue = Number(value);
        if (numericValue > record.balanceQty) {
            AlertMessages.getErrorMessage(`Quantity cannot exceed balance of ${record.balanceQty}`);
            return;
        }

        setMoQtys(prev => ({ ...prev, [key]: numericValue }));
    };


    const columns: any[] = [
        {
            title: 'Sno',
            key: "sno",
            render: (text, record, index) => index + 1,
        },
        {
            title: 'MO Number',
            dataIndex: 'moNumber',
        },
        {
            title: 'MO line',
            dataIndex: 'moLine',
            ...getColumnSearchProps('moLine'),
        }, {
            title: 'Product name',
            dataIndex: 'productName',
            ...getColumnSearchProps('productName'),

        }, {
            title: 'Color',
            dataIndex: 'color',
            ...getColumnSearchProps('color'),

        }, {
            title: 'destination',
            dataIndex: 'destination',
            ...getColumnSearchProps('destination'),

        }, {
            title: 'Delivery date',
            dataIndex: 'delDate',
            render: (value: string) => {
                return moment(new Date(value)).format(defaultDateFormat)
            }
        }, {
            title: 'CO',
            dataIndex: 'coVpo',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            ...getColumnSearchProps('size'),

        },
        {
            title: 'Order Quantity Type',
            dataIndex: 'oqType',
            render: (v) => OrderTypeDisplayValues[v],
            filters: Object.entries(OrderTypeDisplayValues).map(([key, label]) => ({
                text: label,
                value: key,
            })),
            onFilter: (value, record) => record.oqType === value,

        },
        {
            title: 'Original Qty',
            dataIndex: 'orginalQty',
        }, {
            title: 'Balance Qty',
            dataIndex: 'balanceQty',
            render: (value: number, record: ProcessingOrderCreationInfoModel) => {
                const key = record.moProductSubLineId
                const moQty = moQtys[key] || 0
                return value - moQty // Calculate remaining balance
            }
        },
        // Update the PO Qty column render function
        {
            title: 'PO Qty',
            dataIndex: 'poQty',
            fixed: 'right',
            render: (v, rec: ProcessingOrderCreationInfoModel) => {
                const key = rec.moProductSubLineId;
                const isSelected = selectedRows.some(r =>
                    r.moProductSubLineId === rec.moProductSubLineId
                );

                return (
                    <Select
                        key={key}
                        showSearch
                        disabled={rec.balanceQty < 1}
                        value={moQtys[key]?.toString()}
                        options={anotherOptions[key] || constructDefaultOptions(rec)}
                        style={{ width: 200 }}
                        onSearch={(text) => handleQtySearch(text, rec, key)}
                        onChange={(value) => handleMoQtyChange(value, rec)}
                        placeholder="Select PO Qty"
                        filterOption={false}
                        notFoundContent={<div style={{ padding: 8 }}>No matching quantities found</div>}
                        status={isSelected && !moQtys[key] ? 'error' : ''}
                    />
                );
            }
        }
    ]

    const rowSelection: TableProps<any>['rowSelection'] = {
        selectedRowKeys: selectedRows.map(e => e.moProductSubLineId),
        onChange: (selectedRowKeys: React.Key[], selectedRows: ProcessingOrderCreationInfoModel[]) => {
            setSelectedRows(selectedRows)

        },
        getCheckboxProps: (record: ProcessingOrderCreationInfoModel) => ({
            disabled: record.balanceQty <= 0,
        }),
    };



    const validatePoCreation = () => {

        if (selectedRows.length === 0) {
            AlertMessages.getErrorMessage('Select atleast one row to create PO')
            return false
        }

        // Validate selected rows
        let isValidated = true
        selectedRows.forEach(row => {
            const key = row.moProductSubLineId
            const moQty = moQtys[key] || null

            // Validation 1: Check if any selected row has empty MO Qty
            const hasEmptyMoQty = selectedRows.some(row =>
                !moQtys[key]
            )

            if (hasEmptyMoQty) {
                AlertMessages.getErrorMessage('PO Quantity is required for all selected rows')
                isValidated = false
            }

        })

        return isValidated
    }

    /**
     * @returns {ProcessingOrderCreationRequest}
     */
    const handleCreatePO = () => {
        const isValidated = validatePoCreation()

        if (isValidated) {
            // Proceed with MO creation logic
            const formValues = form.getFieldsValue()
            const moSublines: ProcessingOrderSubLineRequest[] = []
            selectedRows.map((v) => {
                const key = v.moProductSubLineId
                const moSubline = new ProcessingOrderSubLineRequest(key, Number(moQtys[key]))
                moSublines.push(moSubline)
            })
            const moCreationReq = new ProcessingOrderCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, formValues.poDescription, formValues.poRemarks, props.processType, moSublines, styleCode, routingGroup)
            onCreatePo(moCreationReq)
        }
        return false
    }

    const handleRemarksChange = (e) => {
        const value = e.target.value;
        if (value.length === 50) {
            message.warning('You have reached the maximum limit of 50 characters');
        }
    };

    const handlePoChange = (e) => {
        const po = e.target.value;
        if (po.length === 50) {
            message.warning('You have reached the maximum limit of 50 characters');
        }
    };

    return (
        <>
            <Form form={form} layout='horizontal' onFinish={handleCreatePO} key={`po-creation-form-${processType}`} name={`po-creation-form-${processType}`}>
                {moInfo && moInfo.length ? <>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Table pagination={{ pageSize: 10 }} rowKey={(row) => row.moProductSubLineId} size="small" columns={columns} rowSelection={rowSelection} bordered dataSource={moInfo}
                                scroll={{ x: 'max-content' }}
                                rowClassName={() => 'small-row'} />
                        </Col>
                    </Row>

                    <Row style={{ paddingTop: '30px' }} gutter={[24, 24]} justify={'space-around'}>
                        <Col span={8}>
                            <Item label="PO Name"
                                rules={[{ required: true, message: 'Please enter  PO Name' }]}
                                name={'poDescription'}><TextArea maxLength={50} showCount onChange={handlePoChange} rows={2} placeholder='Enter PO Name' /></Item>
                        </Col>

                        <Col span={8}>
                            <Item rules={[{ required: true, message: 'Please enter remarks' }]} label="Remarks" name={'poRemarks'}><TextArea maxLength={50} showCount rows={2} onChange={handleRemarksChange} placeholder='Enter Remarks' /></Item>
                        </Col>

                        <Col span={4} style={{ paddingTop: '23px' }}>
                            <Button className='btn-green' type='primary' htmlType="submit">Create PO</Button>
                        </Col>
                    </Row>
                </> : <></>
                }
            </Form>
        </>
    );

}
