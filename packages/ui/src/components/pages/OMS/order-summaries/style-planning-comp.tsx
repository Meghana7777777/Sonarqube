import { CreatePlanningDateRequest, OrderSummaryEnum, RawOrderInfoModel, MoStatusRequest } from "@xpparel/shared-models";
import { useState } from "react";
import { StylePlannedColumns } from "./order-summery-columns";
import { Button, Col, Input, Row, Table, TreeSelect } from "antd";
import { TreeNode } from "antd/es/tree-select";
import { AlertMessages } from "../../../common";
import { OrderManipulationServices } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import moment from "moment";
import MoLineChildComponent from "./mo-line-child-component";
import { DownCircleFilled, UpCircleFilled } from "@ant-design/icons";

interface IOSTABInsideCompProps {
    orderSummery: RawOrderInfoModel[]
    onStepChange?: (step: number, selectedRecord: RawOrderInfoModel) => void;
    onChangeTab: (tabKey: any, iNeedOnlyPlantStyleUpdatesMos?: boolean) => void;
    // getOrderSummery: (req: MoStatusRequest, tabKey: any) => void;
}
export const StylePlanningComp = (props: IOSTABInsideCompProps) => {
    const { orderSummery, onStepChange, onChangeTab } = props;
    const [searchedText, setSearchedText] = useState("");
    const [firstColumn, ...restColumns] = StylePlannedColumns;
    const omsManipulationService = new OrderManipulationServices();
    const user = useAppSelector((state) => state.user.user.user);
    const [expandedIndex, setExpandedIndex] = useState([]);



    const modifiedFirstColumn = {
        ...firstColumn,
        filteredValue: [String(searchedText).toLowerCase()],
        onFilter: (value, record) => {
            const aaa = new Set(Object.keys(record).map((key) => {
                return String(record[key]).toLowerCase().includes(value.toLocaleString())
            }))
            if (aaa.size && aaa.has(true))
                return true;
            else
                return false;
        },
    };
    const packListPreviewColumnsWithFilter = [modifiedFirstColumn, ...restColumns];
    const [visibleColumns, setVisibleColumns] = useState(
        packListPreviewColumnsWithFilter.filter((column) => column.isDefaultSelect == true).map(column => column.key)
    );
    const dynamicColumns = packListPreviewColumnsWithFilter.filter((column) => visibleColumns.includes(column.key));


    const handleColumnToggle = (checkedValues) => {
        setVisibleColumns(checkedValues);
    };

    const columnChooserOptions = packListPreviewColumnsWithFilter.map((column) => ({
        label: column.title,
        value: column.key,
        isDefaultSelect: column.isDefaultSelect
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
                    <TreeNode key={option.value} value={option.value} title={option.label} disableCheckbox={option.isDefaultSelect} disabled={option.isDefaultSelect} />
                ))}
            </TreeSelect>
        </>
    );

    const deletePlannedCutDate = (record, index) => {
        try {
            const req = new CreatePlanningDateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.orderIdPk, record.plantStyle, record.plannedCutDate)
            omsManipulationService.deletePlannedCutDate(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage('deleted successfully');
                    onChangeTab(OrderSummaryEnum.OPEN, false)
                    // getOrderSummery
                }
            }).catch(err => console.log(err.message))
        } catch (error) {
            console.error('Error deleting planned cut date:', error);
        }
    };

    const setIndex = (expanded, record) => {
        const expandedRows = new Set(expandedIndex);
        if (expanded) {
            expandedRows.add(record?.orderIdPk);
            setExpandedIndex(Array.from(expandedRows));
        } else {
            expandedRows.delete(record?.orderIdPk);
            setExpandedIndex(Array.from(expandedRows));
        }
    }
    const renderItems = (record: RawOrderInfoModel, index, indent, expanded) => {
        return <MoLineChildComponent selectedMo={null} tabkey={undefined}/>
    }


    const actionButtonHandler = (): any => {
        return [{
            title: 'Activity',
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 200,
            render: (text, record, index) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button size='small' type='primary' style={{ marginRight: '5px' }} onClick={() => { onStepChange(1, record); }}>Proceed</Button>
                    <Button size='small' type='primary' danger ghost onClick={() => deletePlannedCutDate(record, index)}>Delete</Button>
                </div>
            )
        }]
    }
    return (
        <div>
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
                rowKey={record => record.orderIdPk}
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
                expandIcon={({ expanded, onExpand, record }) =>
                    expanded ? (
                        <UpCircleFilled onClick={(e) => onExpand(record, e)}>Collapse</UpCircleFilled>
                    ) : (
                        <DownCircleFilled onClick={(e) => onExpand(record, e)}>Expand</DownCircleFilled>
                    )
                }
            />
        </div>
    )
}