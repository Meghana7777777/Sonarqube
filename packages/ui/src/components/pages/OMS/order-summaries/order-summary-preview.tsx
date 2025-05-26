import { SI_MoNumberRequest } from "@xpparel/shared-models";
import { MOConfigService } from "@xpparel/shared-services";
import { Button, Card, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import OrderReviewWithBOM from "./mo-summary-preview";
import { useState } from "react";

interface IProps {
    moNumber: string;
}
const OrderSummaryPreview = (props: IProps) => {
    const mOConfigService = new MOConfigService();
    const user = useAppSelector((state) => state.user.user.user);
    const [isMoProceeded, setIsMoProceeded] = useState<boolean>(false);

    const onConfirmProceed = () => {
        const req = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props?.moNumber, null, false, false, false, false, false, false, false, false, false, null, null)
        mOConfigService.confirmMoProceeding(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    }
    return (
        <Card>
            <div style={{ marginRight: '10px', marginLeft: '10px', float: 'right' }}>
                <Tooltip title={isMoProceeded ? "This MO  has already been Proceeded" : "Click to Proceed  the MO"}>
                    <Button style={{ backgroundColor: 'green', color: 'white' }} disabled={isMoProceeded} onClick={onConfirmProceed}>Confirm MO Proceeding</Button>
                </Tooltip>
            </div>
            <OrderReviewWithBOM moNumber={props?.moNumber} proceedingStatus={setIsMoProceeded} />
        </Card>
    )
}

export default OrderSummaryPreview;