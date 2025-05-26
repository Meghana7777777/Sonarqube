import { CutDispatchStatusEnum, EmbDispacthLineModel, EmbDispatchIdStatusRequest, EmbDispatchStatusEnum } from "@xpparel/shared-models";
import { EmbDispatchService } from "@xpparel/shared-services";
import { Table, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

interface IProps {
    dispatchId: number;
    status: EmbDispatchStatusEnum
}
const EmbDispatchLinesGrid = (props:IProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const embDispatchReqService = new EmbDispatchService()
    const [dispatchLinesData, setDispatchLinesData] = useState<EmbDispacthLineModel[]>([]);
    useEffect(()=> {
        if(props.dispatchId > 0){
            const req = new EmbDispatchIdStatusRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,props.dispatchId,props.status)
        embDispatchReqService.getEmbDispatchRequestForDrId(req).then((res) => {
            if(res.status){
                setDispatchLinesData(res.data[0].dispatchLines)
            }else{
                setDispatchLinesData([])
            }
        }).catch(()=>{
            
        })
        }
    },[])

    const dispatchLinesColumns:any[] = [
        {
            key: 'embJobNo',
            title: 'Emb Job',
            align: 'center',
            dataIndex: "embJobNo",
        },
        {
            key: 'docketGroup',
            title: 'Docket Number',
            align: 'center',
            dataIndex: "docketGroup",
        },
        {
            key: 'cutSubNumber',
            title: 'Cut Number',
            align: 'center',
            dataIndex: "cutSubNumber",
        },
        {
            key: 'layNumber',
            title: 'Lay Number',
            align: 'center',
            dataIndex: "layNumber",
        },
        {
            key: 'components',
            title: 'Components',
            align: 'center',
            dataIndex: "components",
            render:(value)=>{
                return <Tag color="blue">{value.toString()}</Tag>
            }
        },
        {
            key: 'totalBundles',
            title: 'Total Bundles',
            align: 'center',
            dataIndex: "totalBundles",
        },
        {
            key: 'quantity',
            title: 'Total Quantity',
            align: 'center',
            dataIndex: "quantity",
        },
        
    ]

    return <>
    {dispatchLinesData.length > 0?<Table
        rowKey={(record,index)=>index}
        columns={dispatchLinesColumns}
        dataSource={dispatchLinesData}
        bordered
        pagination={false}
        size='small'
        style={{ fontSize: '12px' }}
        />:<></>}
    </>
}
export default EmbDispatchLinesGrid