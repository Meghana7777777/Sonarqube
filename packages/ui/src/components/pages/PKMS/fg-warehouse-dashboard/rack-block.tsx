
import { FgLocationModel } from "@xpparel/shared-models";
import { Card } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import LocationBlock from "./location-block";
interface RackBlockProps {
    rackId: number;
    rackLevel: number;
    column: number;
    locationInfo: FgLocationModel;
    filterVal: string;
    containerInputFocus: () => void;
}
const FGRackBlock = (props: RackBlockProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const { rackId, rackLevel, column, locationInfo, filterVal, containerInputFocus } = props;


    return (
        <Card size="small" title={`Level-${rackLevel} | Column-${column} `} id={`${rackLevel}-${column}`} headStyle={{ minHeight: 0, background: '#ded18a', color: '#165790', textAlign: 'center' }} bodyStyle={{ padding: 0, minHeight: '138px' }}  >
            {locationInfo && <LocationBlock
                containerInputFocus={containerInputFocus}
                rackId={rackId}
                rackLevel={rackLevel}
                column={column}
                locationInfo={locationInfo}
                filterVal={filterVal}
                
            />}
        </Card>
    )
}

export default FGRackBlock;