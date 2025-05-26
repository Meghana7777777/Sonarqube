import { KJ_MaterialStatusEnum, kjMaterialStatusEnumDisplayValues, PackJobItems, PackMatReqStatusDisplayValue, PackMatReqStatusEnum } from "@xpparel/shared-models";
import { Button, TableColumnsType, Tag } from "antd";

const materialStatusColor = {
    [KJ_MaterialStatusEnum.COMPLETELY_ISSUED]: 'Green',
    [KJ_MaterialStatusEnum.OPEN]: 'red',
    [KJ_MaterialStatusEnum.PARTIAL_ISSUED]: 'orange',
    [KJ_MaterialStatusEnum.REQUESTED]: 'yellow',
}

const getClassName = (materialStatus: PackMatReqStatusEnum) => {
    switch (materialStatus) {
        case PackMatReqStatusEnum.OPEN: return 'w-gray';
        case PackMatReqStatusEnum.PREPARING_MATERIAL: return 'w-yellow';
        case PackMatReqStatusEnum.MATERIAL_NOT_AVL: return 'w-red';
        case PackMatReqStatusEnum.MATERIAL_READY: return 'w-ready';
        case PackMatReqStatusEnum.MATERIAL_ON_TROLLEY: return 'w-tro';
        case PackMatReqStatusEnum.MATERIAL_IN_TRANSIT: return 'w-tran';
        case PackMatReqStatusEnum.REACHED_DESITNATION: return 'w-lgreen';
        case PackMatReqStatusEnum.MATERIAL_ISSUED: return 'w-green';
        default: return 'w-dark-pink'
    }
}


export const PKMaterialJobsColumns: TableColumnsType<PackJobItems> = [
    {
        title: "S.No", dataIndex: "sno", key: "select",
        render: (text: string, record: any, index: number) => index + 1
    },
    {
        title: "PackJob Number",
        dataIndex: "packJobNo",
    },
    {
        title: "No Of Cartons",
        dataIndex: "cartonsCount",
    },
    {
        title: "Material Req No",
        dataIndex: 'materialNo'
    },
    {
        title: "Material Status",
        dataIndex: "materialStatus",
        render: (text: PackMatReqStatusEnum, record: any) => {
            return text ? <Button style={{ minWidth: '180px' }} className={getClassName(text)} type="primary" >{PackMatReqStatusDisplayValue[text]} </Button> : ' '

        }
    },
    {
        title: "No Of Cartons",
        dataIndex: "cartonsCount",
        key: "cartonsCount"
    }
]

