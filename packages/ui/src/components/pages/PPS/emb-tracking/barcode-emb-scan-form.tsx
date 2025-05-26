import { EmbBundleScanModel, EmbBundleScanRequest, ReportedEmbBundleScanModel } from "@xpparel/shared-models";
import { EmbTrackingService } from "@xpparel/shared-services";
import { Col, Input, Row } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useState } from "react";
import ReportedEmbBundleInfoGrid from "./reported-bundle-info-grid";
import { OperationDirectionEnum } from "./operation-direction.enum";

interface BarcodeScanProps {
    operation: string;
    shift: string
    operationDirection: OperationDirectionEnum;
}
const BarcodeEmblishmentScanForm = (props:BarcodeScanProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [reportedBundlInfo, setReportedBundlInfo] = useState<ReportedEmbBundleScanModel[]>([]);
    const embTrackService = new EmbTrackingService();

    const handleBarcodeScan = (e) => {
        console.log(e.target.value)
        const isReversal = props.operationDirection == OperationDirectionEnum.REVERSE;
        const req = new EmbBundleScanRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,e.target.value,props.operation,0,0, isReversal ,props.shift,true,[],true)

        // TODO: Not a correct way of putting api names
        let apiName = embTrackService.reportEmbBundle.name;
        if(isReversal) {
            apiName = embTrackService.reportEmbBundleReversal.name;
        }
        embTrackService[apiName](req).then((res)=> {
            if(res.status){
                console.log(res)
                reportedBundlInfo.push({...res.data[0],status:res.status,reason:res.internalMessage})
                setReportedBundlInfo([...reportedBundlInfo])
            }else{
                reportedBundlInfo.push({
                    barcode: e.target.value,
                    operationCode: '',
                    gQty: 0,
                    rQty: 0,
                    bundleQty: 0,
                    otherProps:undefined,
                    status: res.status, reason: res.internalMessage
                })
                setReportedBundlInfo([...reportedBundlInfo])
            }
        }).catch(()=> {

        })
    }
    return(
        <>
            <Row>
                <span style={{ marginLeft: '40%' }}>{`You are doing ${props.operationDirection} scanning`}</span>               
            </Row>
            <Row>
                <Col span={6}>
                <Input placeholder="Scan Barcode" onChange={handleBarcodeScan}/>
                </Col>
            </Row>
            {reportedBundlInfo.length > 0 ? 
            <>
                <br/>
                <ReportedEmbBundleInfoGrid {...{bundleResponse:reportedBundlInfo, scanType:'Barcode'}}/>
            </>
            : <></>}
        </>
    )
}
export default BarcodeEmblishmentScanForm