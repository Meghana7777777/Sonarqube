import { BookOutlined, IdcardOutlined } from "@ant-design/icons";
import { PackFabricInspectionRequestCategoryEnum } from "@xpparel/shared-models";
import { Badge, Steps } from "antd";
import { useState } from "react";
import { useAppSelector } from "../../../../../common";
import { PKMSInspectionSpecificDashboard } from "./inspection-specific-dashboard";


export const PackInspectionBoard = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [inspectionType, setInspectionType] = useState<PackFabricInspectionRequestCategoryEnum>(PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION);


    return <>
        <Steps
            size="small"
            type="navigation"
            onChange={(e) => {
                setCurrentStep(e);
                if (e === 0) {
                    setInspectionType(PackFabricInspectionRequestCategoryEnum.PRE_INSPECTION)
                } else if(e=== 1) {
                    setInspectionType(PackFabricInspectionRequestCategoryEnum.POST_INSPECTION)
                }
                else 
                {
                    setInspectionType(PackFabricInspectionRequestCategoryEnum.FCA)
                }

            }}
            current={currentStep}
            items={[
                {
                    title: 'Initial Inspection',
                    icon: <BookOutlined />,
                    status: "finish"
                },
                {
                    title: 'Post Inspection',
                    icon: <IdcardOutlined />,
                    status: "finish"
                },
                {
                    title: 'FCA',
                    icon: <IdcardOutlined />,
                    status: "finish"
                },
            ]}
        >
        </Steps>
        <Badge.Ribbon color="#faad14">
            <PKMSInspectionSpecificDashboard
                key={currentStep}
                typeOfInspection={inspectionType}
            />
        </Badge.Ribbon>
    </>
}
export default PackInspectionBoard;

















