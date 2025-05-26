import { useState } from "react";
import { LoadedPallets } from "./loaded-pallet";

export const LoadedSquareBin = ({ onMouseEnter, onMouseLeave }) => {
    const [showLoadedCard, setShowLoadedCard] = useState(false)

    const handleMouseEnterLoadedCard = () => {
        setShowLoadedCard(true);
        onMouseEnter();
    };

    const handleMouseLeaveLoadedCard = () => {
        setShowLoadedCard(false);
        onMouseLeave();
    };

    return (
        <>
            <a
                className="loaded-square-bin"
                style={{
                    borderStyle: "solid",
                    borderWidth: "0px",
                    borderRadius: "5px",
                    backgroundColor: "#E4EA13",
                    height: "30px",
                    width: "30px",
                    marginLeft: "10px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
                onMouseEnter={handleMouseEnterLoadedCard}
                onMouseLeave={handleMouseLeaveLoadedCard}
            ></a>
            {showLoadedCard && (
                <LoadedPallets imgSrc={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdp2RBCuA87A4ShkLilzH_ec7ic8oIzgumw&usqp=CAU'}
                    label={'Loaded'} />
            )}
        </>
    );
};