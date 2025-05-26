import { SI_SoNumberRequest } from "@xpparel/shared-models";
import { SaleOrderCreationService } from "@xpparel/shared-services";
import { Button, Card, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import SoPreview from "./so-preview";
import { useState } from "react";

interface IProps {
    soNumber: string;
    goToFirstStep: () => void;

}
const SaleorderPreview = (props: IProps) => {
    const saleOrderCreationService = new SaleOrderCreationService();
    const user = useAppSelector((state) => state.user.user.user);
    const [isSoConfirmed, setIsSoConfirmed] = useState<boolean>(false)

    const onConfirmSaleOrder = () => {
        const req = new SI_SoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.soNumber, null, false, false, false, false, false, false, false, null, null)
        saleOrderCreationService.confirmSaleOrder(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                setIsSoConfirmed(true);
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
                <Tooltip title={isSoConfirmed ? "This sale order has already been confirmed" : "Click to confirm the sale order"}>
                    <Button
                        disabled={isSoConfirmed}
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={onConfirmSaleOrder}
                    >
                        {isSoConfirmed ? 'Sale Order Confirmed' : 'Confirm Sale Order'}
                    </Button>
                </Tooltip>            </div>
            <SoPreview soNumber={props?.soNumber} confirmationStatus={setIsSoConfirmed} />
        </Card>
    )
}

export default SaleorderPreview;