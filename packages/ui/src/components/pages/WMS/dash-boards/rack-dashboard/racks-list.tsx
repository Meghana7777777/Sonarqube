import { ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { Props } from "react-minimal-pie-chart/types/Chart/Chart";
import IconSlider from "./slider";
import { CalendarOutlined } from "@ant-design/icons";

interface racklistIprops {
    rackNo: string;
    // date: string;
    storagePercentage: number;
    checked: boolean;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const RackList = (Props: racklistIprops) => {

    return (
        <>
            <ScxRow>
                <ScxColumn span={6}>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>
                        <input type="checkbox" checked={Props.checked} onChange={Props.onCheckboxChange} />
                        Rack {Props.rackNo}
                    </label>
                </ScxColumn>
                <ScxColumn span={6}>
                    {/* <h1 >{Props.date}<CalendarOutlined style={{ fontSize: '15px', marginLeft: '15px', color: 'gray' }} /></h1> */}
                </ScxColumn>
                <ScxColumn span={10}>
                    <ScxRow>
                        <ScxColumn>
                            <h1>Used</h1>
                        </ScxColumn>
                        <ScxColumn style={{ marginLeft: '10px', marginTop: '16px' }}>
                            <IconSlider storagePercentage={Props.storagePercentage} />
                        </ScxColumn>
                    </ScxRow>
                </ScxColumn>
                <ScxColumn span={2}>
                    <h1>{Props.storagePercentage}%</h1>
                </ScxColumn>
            </ScxRow>
        </>
    );
}