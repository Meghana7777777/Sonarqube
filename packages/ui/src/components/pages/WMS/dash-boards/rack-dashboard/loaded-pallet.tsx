import { ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";

export const LoadedPallets = ({ imgSrc, label }) => {
    return (
        <div
            className="loaded-pallet-card"
            style={{
                // position: "absolute",
                // top: "20px",
                // left: "0px",
                backgroundColor: "green",
                padding: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                opacity: 0.7,
                margin: "0px",
                // marginTop: "40px",
            }}
        >
            <ScxRow>
                <ScxColumn span={12}>
                    <img
                        src={imgSrc}
                        alt="Image"
                        style={{ width: "50px", height: "50px" }}
                    />
                </ScxColumn>
                <ScxColumn span={12}>
                    <p
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "white",
                            marginLeft: "3px",
                            marginRight: "0px",
                        }}
                    >
                        {label}
                    </p>
                </ScxColumn>
            </ScxRow>
        </div>
    );
};
