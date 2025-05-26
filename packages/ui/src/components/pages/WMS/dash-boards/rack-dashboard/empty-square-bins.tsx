import { useEffect, useState } from "react";
import { EmptyPallets } from "./empty-pallet";
import { BinsServices } from "@xpparel/shared-services";
import { GetBinsByRackIdReq } from "@xpparel/shared-models";
import { ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { LoadedPallets } from "./loaded-pallet";

interface IBinsProps {
    lRackId: number;
}
export const EmptySquareBin = (props: IBinsProps) => {
    const binService = new BinsServices();
    const [showBinData, setShowBinData] = useState<any>([]);
    const { lRackId } = props;
    const [showCard, setShowCard] = useState(false)

    const handleMouseEnterCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setShowCard(true);
        // onMouseEnter();
    };

    const handleMouseLeaveCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setShowCard(false);
        // onMouseLeave();
    };

    useEffect(() => {
        getAllBinsByRackId()
    }, [props.lRackId])


    const getAllBinsByRackId = () => {
        const req = new GetBinsByRackIdReq()
        req.lRackId = props.lRackId;
        binService.getAllBinsDataByRackId(req).then((res) => {
            if (res.status) {
                setShowBinData(res.binsData);
            }
        })
            .catch((err) => {
                console.log(err.message);
            });

    }
    return (
        <>
            {showBinData?.map(() => (
                <div
                    style={{
                        borderStyle: "solid",
                        borderWidth: "0px",
                        borderRadius: "5px",
                        backgroundColor: '#E4EA13',
                        height: "30px",
                        width: "30px",
                        marginLeft: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                        margin: '5px'
                        
                    }}
                    onMouseEnter={handleMouseEnterCard}
                    onMouseLeave={handleMouseLeaveCard}
                ></div>
            ))}
            {showCard && (
                <EmptyPallets  backgroundColor={'green'}                />
            )}

        </>
    );
};