import { ScxRow } from "packages/ui/src/schemax-component-lib";
import { useEffect, useState } from "react";
import { EmptySquareBin } from "./empty-square-bins";
import { LoadedSquareBin } from "./loaded-square-bins";
import { BinsServices } from "@xpparel/shared-services";
import { GetBinsByRackIdReq } from "@xpparel/shared-models";
export const PalletsAlignment = ({ lRackId }) => {
    // const [showCard, setShowCard] = useState(false);
    // const [showLoadedCard, setShowLoadedCard] = useState(false)

    // const handleMouseEnterSquare = () => {
    //     setShowCard(true)
    // };

    // const handleMouseLeaveSquare = () => {
    //     setShowCard(false)
    // };

    // const handleMouseEnterLoadedCard = () => {
    //     setShowLoadedCard(true)
    // };

    // const handleMouseLeaveLoadedCard = () => {
    //     setShowLoadedCard(false)
    // };

    return (
        <div>
            <ScxRow>
                <EmptySquareBin lRackId={0} />
                {/* <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <EmptySquareBin onMouseEnter={handleMouseEnterSquare} onMouseLeave={handleMouseLeaveSquare} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} />
                <LoadedSquareBin onMouseEnter={handleMouseEnterLoadedCard} onMouseLeave={handleMouseLeaveLoadedCard} /> */}
            </ScxRow>
        </div>
    );
};
