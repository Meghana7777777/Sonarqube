import { ClockCircleOutlined, ExportOutlined, InboxOutlined } from "@ant-design/icons";
import { ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib"



interface LoadListIprops {
    tabName: string;
    palletNo: string;
    status: string;
}
export const LoadStatusInRack = (props: LoadListIprops) => {

    return (
        <>
            <div>
                <ScxRow>
                    <ScxColumn span={6} style={{ borderWidth: '0px', borderStyle: 'solid', borderRadius: '7px', height: '60px', width: '60px', marginLeft: '20px', backgroundColor: '#F7D53C', textAlign: 'center',marginBottom:'10px' }}>
                        {props.tabName === 'received' && <span style={{ color: 'white', fontSize: '35px',   }}><InboxOutlined /></span>}
                        {props.tabName === 'sent' && <span style={{ color: 'white', fontSize: '35px',   }}><ExportOutlined /></span>}
                        {props.tabName === 'expected' && <span style={{ color: 'white', fontSize: '35px',   }}><ClockCircleOutlined /></span>}
                    </ScxColumn>
                    <ScxColumn >
                        <h1 style={{ fontSize: '12px', marginLeft: '30px',marginTop:'0px' }}>Pallet No: {props.palletNo}</h1>
                        <h1 style={{ fontSize: '12px', marginLeft: '30px',marginTop:'0px' }}> {props.status}</h1>
                    </ScxColumn>
                </ScxRow>
            </div>
        </>
    )
}