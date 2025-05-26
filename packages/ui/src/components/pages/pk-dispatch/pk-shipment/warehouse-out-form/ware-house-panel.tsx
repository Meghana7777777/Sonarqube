import { DownCircleFilled, UpCircleFilled } from "@ant-design/icons";
import { PKMSCartonIdsRequest, PKMSCartonInfoModel, PackListCartoonIDs } from "@xpparel/shared-models";
import { PackListService } from "@xpparel/shared-services";
import { Card, Tag, Table, Typography } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useState } from "react";

interface IProps {
    warehouse: any;
    cartonIds: PackListCartoonIDs[]
}
const { Text } = Typography;


export const WarehousePanel = (props: IProps) => {
    const { warehouse, cartonIds } = props
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const packListService = new PackListService();
    const user = useAppSelector((state) => state.user.user.user);
    const [cartons, setCartons] = useState<Map<number, PKMSCartonInfoModel[]>>(new Map());

    const tableColumns = [
        {
            title: 'PL No',
            dataIndex: 'packListNo',
            key: 'packListNo',
            width: '25%',
        },
        {
            title: 'PL Code',
            dataIndex: 'packListCode',
            key: 'packListCode',
            width: '25%',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '25%',
        },
        {
            title: 'Cartons',
            dataIndex: 'noOfCartons',
            key: 'noOfCartons',
            width: '25%',
        },
    ];

    const handleExpand = (expanded: boolean, record: any) => {
        if (expanded) {
            getCartons(record?.cartonIds, record?.packListId)
        }

        setExpandedRowKeys(expanded ?
            [...expandedRowKeys, record?.packListId] :
            expandedRowKeys.filter(key => key !== record?.packListId)
        );
    };

    const getCartons = async (cartonIds: number[], pckListId: number) => {
        const req = new PKMSCartonIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.user?.userId, cartonIds, false);
        try {
            const res = await packListService.getCartonsByCartonId(req);
            if (res.status) {
                setCartons(prev => {
                    const previous = new Map(prev);
                    previous.set(pckListId, res.data);
                    return previous
                });
            } else {
                cartons.delete(pckListId)
            }
        } catch (err) {
            console.log(err.message);
        }
    };


    const renderItem = (record: any) => {
        return <Table
            dataSource={cartons.get(record?.packListId)}
            pagination={false}
            bordered={true}
            scroll={{ x: 'max-content' }}
            columns={
                [
                    {
                        title: 'Carton Barcode',
                        dataIndex: 'barcode',
                        render: (v) => <Tag color='cyan-inverse'>{v}</Tag>
                    },
                    {
                        title: 'Qty',
                        dataIndex: 'qty'
                    },

                ]
            }


        >


        </Table >
    }

    return (
        <Card
            size="small"
            // style={{ marginBottom: '16px', width: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
            bodyStyle={{ padding: '12px' }}
        >
            <div style={{ backgroundColor: '#01576f', marginBottom: '8px', display: 'flex' }}>
                <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    <Text style={{ color: 'white', marginRight: '4px' }}>Warehouse:</Text>
                    <Tag color="black" style={{ fontSize: '12px', padding: '0 4px' }}>
                        {warehouse.warehouseCode}
                    </Tag>
                </div>
                <div style={{ fontSize: '12px' }}>
                    <Text style={{ color: 'white', marginRight: '4px' }}>Floor:</Text>
                    <Tag color="black" style={{ fontSize: '12px', padding: '0 4px' }}>
                        {warehouse.floor}
                    </Tag>
                </div>
            </div>

            <Table
                dataSource={warehouse.packingLists}
                columns={tableColumns}
                pagination={false}
                size="small"
                bordered
                scroll={{ x: 'max-content' }}
                style={{ width: '100%' }}
                className="compact-table"
                rowKey={(record) => record?.packListId}
                expandable={{
                    expandedRowRender: (record) => renderItem(record),
                    onExpand: handleExpand,
                    expandedRowKeys: expandedRowKeys,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                            <UpCircleFilled onClick={e => onExpand(record, e)} />
                        ) : (
                            <DownCircleFilled onClick={e => onExpand(record, e)} />
                        )
                }}
            />
        </Card>
    );
};