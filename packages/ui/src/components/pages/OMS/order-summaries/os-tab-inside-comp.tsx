import { DownCircleFilled, UpCircleFilled } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, FormInstance, Input, Row, Table, Tooltip, TreeSelect } from 'antd';
import { TreeNode } from 'antd/es/tree-select';
import { Dispatch, useState } from 'react';
import { OrderCreationService, OrderManipulationServices } from '@xpparel/shared-services';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from '../../../common';
import { orderSummaryColumns } from './order-summery-columns';
import MoLineChildComponent from './mo-line-child-component';
import dayjs from 'dayjs';
import { ManufacturingOrderSummaryEnum, MoStatusRequest, SI_ManufacturingOrderInfoModel, SI_MoNumberRequest } from '@xpparel/shared-models';
import './style.css'
interface IOSTABInsideCompProps {
    orderSummery: SI_ManufacturingOrderInfoModel[];
    onStepChange?: (step: number, selectedRecord: SI_ManufacturingOrderInfoModel) => void;
    tabKey?: ManufacturingOrderSummaryEnum;
    onChangeTab?: (tabKey: any, iNeedOnlyPlantStyleUpdatesMos?: boolean) => void;
    setActiveTab?: Dispatch<(prevState: undefined) => undefined>;
    getOrderSummery?: (req: MoStatusRequest, tabKey: any) => void;
    form?: FormInstance<any>
}

export const OSTABInsideComp = (props: IOSTABInsideCompProps) => {
    const { orderSummery, onStepChange, tabKey, onChangeTab, setActiveTab, getOrderSummery } = props;
    const [expandedIndex, setExpandedIndex] = useState([]);
    const [searchedText, setSearchedText] = useState("");
    const [firstColumn, ...restColumns] = orderSummaryColumns;
    const user = useAppSelector((state) => state.user.user.user);
    const [form] = Form.useForm();
    const orderCreationService = new OrderCreationService()
    const modifiedFirstColumn = {
    ...firstColumn,
    filteredValue: [String(searchedText).toLowerCase()],
    onFilter: (value, record) => {
        const searchVal = String(value).toLowerCase();
        let filterCheck = Object.keys(record).some(key => {
            const val = record[key];
            return String(val).toLowerCase().includes(searchVal);
        });
        if (!filterCheck) {
            const productNames = getProductsOfMo(record);
            filterCheck = productNames.some(prod =>
                String(prod).toLowerCase().includes(searchVal)
            );
        }
        return filterCheck;
    },
};


    const getProductsOfMo = (manufacturingOrderData: SI_ManufacturingOrderInfoModel) => {
    const prods = [];
    manufacturingOrderData.moLineModel.map(line => line.moLineProducts.map(product => prods.push(product.productName)));
    return [...new Set(prods)];
};
    const handelReset = () => {
        form.resetFields()
    }

    const packListPreviewColumnsWithFilter = tabKey === ManufacturingOrderSummaryEnum.OPEN ? [ ...orderSummaryColumns] : [modifiedFirstColumn, ...restColumns];
    const [visibleColumns, setVisibleColumns] = useState(
        packListPreviewColumnsWithFilter.filter(column => column.key).map(column => column.key)
    );
    const dynamicColumns = packListPreviewColumnsWithFilter.filter(column => visibleColumns.includes(column.key));

    const handleColumnToggle = (checkedValues) => {
        setVisibleColumns(checkedValues);
    };

    const columnChooserOptions = packListPreviewColumnsWithFilter.map((column) => ({
        label: column.title,
        value: column.key,
    }));

    const columnChooser = (
        <>
            <span style={{ marginRight: '8px' }}>Select columns to show:</span>
            <TreeSelect
                showSearch
                treeCheckable
                treeDefaultExpandAll
                style={{ width: '200px' }}
                size='small'
                value={visibleColumns}
                onChange={handleColumnToggle}
                dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                placeholder="Select Columns"
                tagRender={() => <></>}
            >
                {columnChooserOptions.map((option) => (
                    <TreeNode key={option.value} value={option.value} title={option.label} disableCheckbox={option.value} disabled={option.value} />
                ))}
            </TreeSelect>
        </>
    );

    const setIndex = (expanded, record) => {
        const expandedRows = new Set(expandedIndex);
        if (expanded) {
            expandedRows.add(record?.moPk);
            setExpandedIndex(Array.from(expandedRows));
        } else {
            expandedRows.delete(record?.moPk);
            setExpandedIndex(Array.from(expandedRows));
        }
    };

    const renderItems = (record: SI_ManufacturingOrderInfoModel) => {
        return <MoLineChildComponent selectedMo={record} tabkey={tabKey} />;
    };

    const onProceedClick = (moNumber: string) => {
        const req = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber, null, false, false, false, false, false, false, false, false, false, false, false, null, null)
        orderCreationService.proceedOpenToInprogress(req)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }
    const actionButtonHandler = (): any => {
        return [{
            title: 'Activity',
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 80,
            render: (text, record, index) => (
                <>
                    {tabKey === ManufacturingOrderSummaryEnum.OPEN ? (
                        <Button size='small' type='primary' onClick={() => {
                            onProceedClick(record.moNumber)
                            onChangeTab(ManufacturingOrderSummaryEnum.IN_PROGRESS, true)
                        }}>Proceed</Button>

                    ) : (
                        <Tooltip title='Click to Proceed'>
                            <Button size='small' type='primary' onClick={() => { onStepChange(1, record); }}>Proceed</Button>
                        </Tooltip>
                    )}
                </>
            )
        }];
    };

    return (
        <Form form={form} layout="vertical">
            <Row justify='space-between'>
                <Col>
                    {columnChooser}
                </Col>
                <Col>
                    <Input.Search placeholder="Search" size='small' allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />
                </Col>
            </Row>
            <br />
            <Table
    rowKey={(record) => record.moPk}
    dataSource={orderSummery}
    size='small'
    columns={[...dynamicColumns, ...actionButtonHandler()]}
    bordered
    scroll={{ x: 500 }}
    expandable={{
        expandedRowRender: renderItems,
        expandedRowKeys: expandedIndex,
        onExpand: setIndex
    }}
    expandIcon={({ expanded, onExpand, record }) => (
        <div style={{ position: 'relative' }}>
            {record.proceedingStatus && (
                <span className="proceeded-tag">Proceeded</span>
            )}
            {expanded ? (
                   <UpCircleFilled onClick={(e) => onExpand(record, e)}>Collapse</UpCircleFilled>
                ) : (
                    <DownCircleFilled onClick={(e) => onExpand(record, e)}>Expand</DownCircleFilled>
                
            )}
        </div>
    )}
    
    rowClassName={(record) => record.proceedingStatus ? 'proceeded-row' : ''}
/>
        </Form>
    );
};

export default OSTABInsideComp;