import { BinModel, RackAndBinModel } from "@xpparel/shared-models";
// import { RackDashboardService } from "@xpparel/shared-services"; // TODO:CUT
import { Card } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import BinBlock from "./bin-block";
interface RackBlockProps {
    rackId: number;
    rackLevel: number;
    column: number;
    binInfo: BinModel;
    filterVal: string;
}
const RackBlock = (props: RackBlockProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const { rackId, rackLevel, column, binInfo, filterVal } = props;
    useEffect(() => {
        // getBinsData(rackId, rackLevel, column);
    }, []);

    // const rackDashboardServices = new RackDashboardService(); // TODO:CUT
    const [binsData, setBinsData] = useState<RackAndBinModel[]>([]);


    // const getBinsData = (rId: number, rLevel: number, rColumn: number) => {
    //     const rackIdReq = new RackIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rId, rLevel, rColumn);
    //     rackDashboardServices.getBinsForRackLevelAndColumn(rackIdReq).then(res => {
    //         if (res.status) {
    //             setBinsData(res.data);
    //         } else {
    //             AlertMessages.getErrorMessage(res.internalMessage)
    //         }
    //     }).catch(err => {
    //         AlertMessages.getErrorMessage(err.message)
    //     })
    // }



    return (
        <Card size="small" title={`Level-${rackLevel} | Column-${column} `} id={`${rackLevel}-${column}`} headStyle={{ minHeight: 0, background: '#ded18a', color: '#165790', textAlign: 'center' }} bodyStyle={{ padding: 0, minHeight: '138px' }}  >
            {/* {binsData[0]?.binData?.map(binObj => {
                return <BinBlock rackId={rackId} rackLevel={rackLevel} column={column} binInfo={binObj} />
            })} */}

            {binInfo && <BinBlock rackId={rackId} rackLevel={rackLevel} column={column} binInfo={binInfo} filterVal={filterVal} />}

        </Card>
    )
}

export default RackBlock;