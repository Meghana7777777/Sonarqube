import { FgWhReqSelectedCartons, PKMSCartonAttrsModel, PKMSPackListInfoModel } from '@xpparel/shared-models';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';


interface FgWhRenderCartons {
    packListDesc: string;
    packListId: number;
    packJobNo: string;
    packJobId: number;
    cartonId: number;
    barcode: string;
    isFgWhCartonId: boolean;
    cartonAttrColor: string;
    cartonAttrSize: string;
    cartonAttrPName: string;
    cartonAttrQty: string;
}
interface FgWhCartonsIProps {
    packList: PKMSPackListInfoModel;
    packListId: number;
    rowSelectionOnChangeHandler: (selectedRowKeys: any[], packListId: number) => void
    selectedCartons: Map<number, FgWhReqSelectedCartons>
};



const PKMSFgWhCartonsView = (props: FgWhCartonsIProps) => {
    const { packList, rowSelectionOnChangeHandler, packListId, selectedCartons } = props;

    const getCartonAttributes = (key: keyof PKMSCartonAttrsModel, attributes: PKMSCartonAttrsModel[]) => {
        return attributes.map((rec) => rec?.[key])?.toString()
    }
    const renderTableDataSourceData = (packListData: PKMSPackListInfoModel) => {
        return packListData.packJobs.flatMap((packJob => packJob.cartonsList.map((cartons) => {
            return {
                packListDesc: packListData.packListDesc,
                packListId: packListData.packListId,
                packJobNo: packJob.packJobNo,
                packJobId: packJob.packJobId,
                cartonId: cartons.cartonId,
                barcode: cartons.barcode,
                isFgWhCartonId: cartons.isFgWhCartonId,
                cartonAttrColor: getCartonAttributes('col', cartons.attrs),
                cartonAttrSize: getCartonAttributes('sz', cartons.attrs),
                cartonAttrPName: getCartonAttributes('pName', cartons.attrs),
                cartonAttrQty: getCartonAttributes('qty', cartons.attrs),
                style: cartons.style,
                netWeight: cartons.netWeight,
                grossWeight: cartons.grossWeight,
                qty: cartons.qty,
            }
        })));
    }

    const columns: ColumnsType<FgWhRenderCartons> = [
        {
            title: "Pack List",
            dataIndex: 'packListDesc'
        },
        {
            title: "Pack Job No",
            dataIndex: 'packJobNo'
        },
        {
            title: "Carton Barcode",
            dataIndex: 'barcode'
        },
        {
            title: "Style",
            dataIndex: 'style'
        },
        {
            title: "Net Weight",
            dataIndex: 'netWeight'
        },
        {
            title: "Gross Weight",
            dataIndex: 'grossWeight'
        },
        {
            title: "Carton Qty",
            dataIndex: 'qty'
        },
    ];





    return <>
        <Table
            dataSource={renderTableDataSourceData(packList)}
            columns={columns}
            size='small'
            bordered
            rowKey={(record) => record.cartonId}
            rowSelection={{
                getCheckboxProps: (record) => ({
                    disabled: record.isFgWhCartonId,
                    indeterminate: record?.isFgWhCartonId

                }),
                selectedRowKeys: selectedCartons.get(packListId)?.cartonIds,
                type: 'checkbox',
                columnTitle: <></>,
                onChange: (selectedRowKeys: React.Key[], selectedRows: FgWhRenderCartons[]) => rowSelectionOnChangeHandler(selectedRowKeys, packListId)
            }}
        >
        </Table>
    </>
}

export default PKMSFgWhCartonsView