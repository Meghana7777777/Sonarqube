import { Card, Steps } from "antd";
import { useState } from "react";
import { useAppSelector } from "../../../../common";
import { WhReqByObjectEnum, WhReqByObjectStep, WhReqByObjectStepToEnum } from "@xpparel/shared-models";
import { ScissorOutlined, InboxOutlined, SkinOutlined, FileTextOutlined, FolderOpenOutlined, BookOutlined, EyeOutlined, PrinterOutlined, IdcardOutlined } from "@ant-design/icons";
import { MaterialIssuanceStepContent } from "./material-issuance-step-content";

export const MaterialIssuanceDashboard = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [activeMainTab, setActiveMainTab] = useState<WhReqByObjectEnum>(WhReqByObjectEnum.KNITTING);


    const onStepChange = (step: number) => {
        console.log('step', step,WhReqByObjectEnum[step]);
        
        if (step) {
            setActiveMainTab(WhReqByObjectStepToEnum[step]);
        } else {
            setActiveMainTab(WhReqByObjectEnum.KNITTING);
        }
    }

    const getMainTabIcon = (tab: WhReqByObjectEnum) => {
        switch (tab) {
            case WhReqByObjectEnum.KNITTING:
                return <ScissorOutlined />;
            case WhReqByObjectEnum.PACKING:
                return <InboxOutlined />;
            case WhReqByObjectEnum.SEWING:
                return <SkinOutlined />;
            case WhReqByObjectEnum.DOCKET:
                return <FileTextOutlined />;
            default:
                return <FolderOpenOutlined />;
        }
    };
    

    return <><Card size="small" bodyStyle={{ padding: '0px' }} className="card-title-bg-cyan1 pad-0" >
        <Steps
            size="small"
            type="navigation"
            current={WhReqByObjectStep[activeMainTab]}
            onChange={(e) => onStepChange(e)}
            items={Object.values(WhReqByObjectEnum).map((mainTab) => ({
                title: <> {mainTab} </>,
                status: 'finish',
                icon: getMainTabIcon(mainTab),
            }
            ))}
        />
    </Card>
        <br />
        <MaterialIssuanceStepContent activeMainTab={activeMainTab} key={activeMainTab}/>
    </>;
};

export default MaterialIssuanceDashboard;
