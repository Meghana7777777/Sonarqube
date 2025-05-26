import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { PackingListSummaryModel, PackingListSummaryRequest, PhBatchLotRollRequest } from '@xpparel/shared-models';
import { PackingListService } from '@xpparel/shared-services';
import { Card, Col, Input, Popconfirm, Row, Table, Tooltip, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { summaryColumns } from '../pack-list-summary/summery-columns';

interface IPackListSummeryProps {
    spoCode: string;
    getPackListInfo: (req: PhBatchLotRollRequest) => void;
    deletePackList: (req: PhBatchLotRollRequest) => void
}
const { TreeNode } = TreeSelect;
export const PackListSummery = (props: IPackListSummeryProps) => {
    const { spoCode, getPackListInfo, deletePackList } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [packListSummery, setPackListSummery] = useState<PackingListSummaryModel[]>([]);
    const [searchedText, setSearchedText] = useState("");
    const [firstColumn, ...restColumns] = summaryColumns;
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

    const service = new PackingListService();

    useEffect(() => {
        const req = new PackingListSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, spoCode, undefined, undefined, undefined, undefined, []);
        getPackListSummery(req);
    }, []);

    const getPackListSummery = (req: PackingListSummaryRequest) => {
        service
            .getPackListSummery(req)
            .then((res) => {
                if (res.status) {
                    setPackListSummery(res.data);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    return (
        <Card>
            <Row justify='space-between'>
                <Col>
                    {columnChooser}
                </Col>
                <Col>
                    <Input.Search placeholder="Search" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, float: "right" }} />
                </Col>
            </Row>
            <Table dataSource={packListSummery} columns={[...dynamicColumns,
            {
                title: '',
                key: 'actions',
                fixed: 'right',
                width: 80,
                render: (text, rowData) => (
                    <span>
                        <Tooltip title='View'>
                            <EyeOutlined className={'editSamplTypeIcon'} type="edit"
                                onClick={() => {
                                    const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rowData.id, undefined, undefined, undefined, spoCode,undefined)
                                    getPackListInfo(req)
                                }}
                                style={{ color: '#1890ff', fontSize: '20px' }}
                            />
                        </Tooltip>
                        <Popconfirm
                            onConfirm={
                                e => {
                                    const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rowData.id, undefined, undefined, undefined, spoCode,undefined)
                                    deletePackList(req)
                                }}
                            title={"Are you sure to Delete Pack list?"}>
                            <Tooltip title='Delete'>
                                <DeleteOutlined type='delete' style={{ color: 'red', fontSize: '20px' }} /></Tooltip>
                        </Popconfirm>

                    </span>
                )
            }]}
                bordered
                scroll={{ x: 'max-content' }} 
                size='small'
                />
        </Card>
    )
}

export default PackListSummery