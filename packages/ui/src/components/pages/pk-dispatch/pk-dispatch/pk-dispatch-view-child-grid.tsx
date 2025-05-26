import { CutDispatchStatusEnum, CutDispatchStatusRequest, CutDispatchRequestModel, ICutDipatchCutWiseQtyHelperModel, CutDispatchIdStatusRequest, CutDispatchLineModel, IPoHelperModel } from "@xpparel/shared-models";
import { CutDispatchService } from "@xpparel/shared-services";
import { Button, Space, Table, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";

import React from "react";

import { ColumnsType } from "antd/es/table";
import moment from "moment";

interface IProps {
    dispatchId: number
}
const PkDispatchViewChildGrid = (props: IProps) => {
    useEffect(() => {
        getCutDispatchRequestsByStatus(props.dispatchId)
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [dispatchInfo, setDispatchInfo] = useState<CutDispatchLineModel[]>([]);
    const [poInfo, setPoInfo] = useState<IPoHelperModel>();
    const cutDispatchService = new CutDispatchService();

    /**
     * Get manufacturing Orders
     */
    const getCutDispatchRequestsByStatus = (dispatchId: number) => {
        const req = new CutDispatchIdStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, dispatchId, undefined);
        cutDispatchService.getCutDispatchRequestsByCutDrId(req).then((res => {
            if (res.status) {
                setDispatchInfo(res.data[0].dispatchLines);
                setPoInfo(res.data[0].prodOrderInfo[0]);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const columns: ColumnsType<CutDispatchLineModel> = [
        {
            title: 'Cut No',
            dataIndex: 'cutNumber',
            align: 'center',
        },
        {
            title: 'PO Description',
            align: 'center',
            render:()=>poInfo?.poDesc
        },
        {
            title: 'Cut Qty',
            dataIndex: 'cutQty',
            align: 'center',
        },
        {
            title: 'Dockets',
            dataIndex: 'dockets',
            align: 'center',
            render: (v) => v.join()

        },
        {
            title: 'Bag No\'s',
            dataIndex: 'bagNumber',
            align: 'center',
        },
        {
            title: 'Total Shade Bundles',
            dataIndex: 'totalShadeBundles',
            align: 'center',
        }
    ]


    return <>
        <Table size="small" rowKey={r => r.cutNumber} bordered pagination={false} columns={columns}
            dataSource={dispatchInfo}
        />
    </>
}

export default PkDispatchViewChildGrid;
