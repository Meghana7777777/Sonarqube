
import { FgLocationModel, LocationContainerMappingRequest, WarehouseContainerCartonsModel } from "@xpparel/shared-models";
import { Card } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { DraggableLocationBlock } from "./draggable-location-block";
import { FGLocationAllocationService } from "@xpparel/shared-services";
import { AlertMessages } from "../../../common";
interface RackBlockProps {
    rackId: number;
    rackLevel: number;
    column: number;
    locationInfo: FgLocationModel;
    filterVal: string;
    draggable: boolean;
    droppable: boolean;
    refreshBoth: () => void
}
export const FGDraggableRackBlock = (props: RackBlockProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const { rackId, rackLevel, column, locationInfo, filterVal, draggable, droppable } = props;

    const locationService = new FGLocationAllocationService();
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const whContainer: WarehouseContainerCartonsModel = JSON.parse(event.dataTransfer.getData('whContainer'));

        const phIdReq = new LocationContainerMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, locationInfo.locationId, true, [{ containerId: whContainer.containerId, barcode: '' }]);
        locationService.confirmContainersToLocation(phIdReq).then((res => {
            if (res.status) {
                props.refreshBoth();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
            // setScanUpdateKey(preState => preState + 1);
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    };
    const dropProps: any = props.droppable ? {
        'onDragOver': handleDragOver,
        'onDrop': handleDrop
    } : {}

    return (
        <Card size="small" title={`Level-${rackLevel} | Column-${column} `} id={`${rackLevel}-${column}`} headStyle={{ minHeight: 0, background: '#ded18a', color: '#165790', textAlign: 'center' }} bodyStyle={{ padding: 0, minHeight: '138px' }}  {...dropProps} >
            {locationInfo && <DraggableLocationBlock rackId={rackId} rackLevel={rackLevel} column={column} locationInfo={locationInfo} filterVal={filterVal} draggable={draggable} droppable={droppable} refreshBoth={props.refreshBoth} />}
        </Card>
    )
}

export default FGDraggableRackBlock;