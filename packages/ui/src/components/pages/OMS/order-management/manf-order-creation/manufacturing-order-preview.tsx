import { SI_MoNumberRequest } from "@xpparel/shared-models";
import { OrderCreationService } from "@xpparel/shared-services";
import { Button, Card, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import MOPreview from "./mo-preview";
import { useState } from "react";

interface IProps {
    moNumber: string;
    goToFirstStep: () => void;

}
const ManufacturingorderPreview = (props: IProps) => {
    const manufacturingOrderCreationService = new OrderCreationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [isMoConfirmed, setIsMoConfirmed] = useState<boolean>(false);

    const onConfirmManufacturingOrder = () => {
        const req = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props?.moNumber, null, false, false, false, false, false, false, false, false, false, null, null)
        manufacturingOrderCreationService.confirmManufacturingOrder(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.goToFirstStep();
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
                <Tooltip title={isMoConfirmed ? "This MO has already been confirmed" : "Click to confirm the MO"}>
                    <Button disabled={isMoConfirmed} style={{ backgroundColor: 'green', color: 'white' }} onClick={onConfirmManufacturingOrder}>Confirm Manufacturing Order</Button>
                </Tooltip>
            </div>
            <MOPreview moNumber={props?.moNumber} confirmationStatus={setIsMoConfirmed}></MOPreview>
        </Card>
    )
}

export default ManufacturingorderPreview;