import { DocRollsModel, MrnIdStatusRequest, MrnRequestModel } from '@xpparel/shared-models'
import { MrnService } from '@xpparel/shared-services'
import { Table } from 'antd'
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import React, { useEffect, useState } from 'react'
import { ColumnProps } from 'antd/es/table';
interface IMrnRequestsSubTableProps {
    record: MrnRequestModel
}
export const MrnRequestsSubTable = (props: IMrnRequestsSubTableProps) => {
    const { record } = props;
    const [mrnSubRequestData, setMrnSubRequestData] = useState<DocRollsModel[]>([]);

    const user = useAppSelector((state) => state.user.user.user);

    const mrnService = new MrnService();

    useEffect(() => {
        getMrnRequestForMrnId(new MrnIdStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.mrnReqId, record.mrnReqNo, record.mrnStatus, ''))
    }, [record]);

    const getMrnRequestForMrnId = (req: MrnIdStatusRequest) => {
        mrnService.getMrnRequestForMrnId(req)
            .then((res) => {
                if (res.status) {
                    setMrnSubRequestData(res.data[0].rollsInfo);
                } else {
                    setMrnSubRequestData([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                setMrnSubRequestData([]);
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const columns: ColumnProps<DocRollsModel>[] = [
        {
            title: 'Roll Barcode',
            dataIndex: 'rollBarcode',
            key: 'rollBarcode',
        },
        {
            title: 'Roll Qty',
            dataIndex: 'rollQty',
            key: 'rollQty',
        },
        {
            title: 'Requested Qty',
            dataIndex: 'allocatedQuantity',
            key: 'allocatedQuantity',
        },
        {
            title: 'Actual Utilized Qty',
            dataIndex: 'actualUtilizedQty',
            key: 'actualUtilizedQty',
        },
        {
            title: 'Current Roll Location',
            dataIndex: 'currentRollLocation',
            key: 'currentRollLocation',
        },
    ];
    return (
        <Table
            columns={columns}
            dataSource={mrnSubRequestData}
            pagination={false}
            size='small'
        />
    )
}
