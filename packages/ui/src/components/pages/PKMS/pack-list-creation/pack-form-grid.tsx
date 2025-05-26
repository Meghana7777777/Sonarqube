import { CartonSpecModel, PLSubLineQtyModel } from "@xpparel/shared-models";
import { Card, Form, FormInstance, InputNumber, Table, Tabs } from "antd";
import { ColumnsType } from "antd/es/table";
import { IPlLineInfoColumns } from "./pack-list-creation";

interface IPackFormGrid {
    tblData: IPlLineInfoColumns[]
    formRef: FormInstance<any>;
    subLineToIdMap: Map<string, Map<String, PLSubLineQtyModel>>
    uniqueSizes: string[];
    cartonSpecData: CartonSpecModel;
    plRatioMaxMap: Map<string, Map<String, number>>
    polyBagRatioOnChange: (ratioVal: number, lineId: string, size: string, polyBagId: number) => void;
}

export const PackFormGrid = (props: IPackFormGrid) => {
    const { tblData, formRef, subLineToIdMap, plRatioMaxMap, uniqueSizes, cartonSpecData, polyBagRatioOnChange, } = props;



    const getTableColumns = (polyBagId: number) => {
        const columns: ColumnsType<IPlLineInfoColumns> = [
            {
                title: 'Mo Line',
                dataIndex: 'line',
                key: 'line',
                width: 150,
                align: 'center',
                fixed: 'left'
            },
            {
                title: 'Color',
                dataIndex: 'fgColor',
                key: 'fgColor',
                width: 150,
                align: 'center',
                fixed: 'left'
            },
            {
                title: 'Product Name',
                dataIndex: 'productName',
                key: 'productName',
                width: 150,
                align: 'center',
                fixed: 'left'
            },
            {
                title: 'Product Type',
                dataIndex: 'productType',
                key: 'productType',
                width: 150,
                align: 'center',
                fixed: 'left'
            },
        ];
        uniqueSizes.forEach(size => {
            columns.push(
                {
                    title: size,
                    dataIndex: size,
                    key: size,
                    align: 'center',
                    render: (val, record: IPlLineInfoColumns) => {
                        const lineKey = `${record.lineId}&$&${record.productRef}&$&${record.fgColor}`;
                        return <Form.Item name={`${lineKey}$@$${size}$@$${polyBagId}`}>
                            <InputNumber
                                min={0}
                                max={plRatioMaxMap?.get(lineKey)?.get(size)}
                                onChange={(ratioVal) => {
                                    polyBagRatioOnChange(ratioVal, lineKey, size, polyBagId);
                                }}
                                disabled={!plRatioMaxMap?.get(lineKey)?.get(size)}
                            />
                        </Form.Item>
                    },
                }
            )
        })
        return columns
    }


    return <Card title='Items per Polybag'>
        <Tabs
            centered
            items={cartonSpecData?.polyBags?.length ? cartonSpecData?.polyBags?.map(polyBag => {
                return {
                    label: polyBag.itemCode,
                    key: `${polyBag.id}`,
                    children: <>
                        <Table
                            dataSource={tblData}
                            columns={getTableColumns(polyBag.id)}
                            size='small'
                            bordered
                            scroll={{ x: true }}
                            // rowKey={record => record.lineDesc + record.lineId}
                            pagination={false}
                            rowClassName={record => record['isHavingPendingQty'] ? 'i-red' : 'i-green'}
                        // summary={getSummary}
                        />
                    </>,
                }
            }) : [

            ]}

        />

    </Card>;
};

export default PackFormGrid;
