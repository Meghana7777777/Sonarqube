import { ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import loadedPallet from './icons/loaded-pallet.png';
import woodPallet from './icons/wood-pallet.jpg';



export const EmptyPallets = ({ backgroundColor }) => {
    return (
        <div
            style={{
                // position: "absolute",
                // top: "40px",
                // left: "10px",
                backgroundColor: 'green',
                padding: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                opacity: 0.7,
                margin: "0px",
                
            }}
        >
            <ScxRow>
                <ScxColumn span={12}>
                    <img
                        src={loadedPallet}
                        alt="Image"
                        style={{ width: "50px", height: "50px",marginRight:'2px' }}
                    />
                </ScxColumn>
                <ScxColumn span={12}>
                    {/* <p
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "white",
                            marginLeft: "3px",
                            marginRight: "0px",
                        }}
                    >
                        {label}
                    </p> */}
                    <img
                        src={woodPallet}
                        alt="Image"
                        style={{ width: "50px", height: "50px" }}
                    />
                </ScxColumn>
            </ScxRow>
        </div>
    );
};