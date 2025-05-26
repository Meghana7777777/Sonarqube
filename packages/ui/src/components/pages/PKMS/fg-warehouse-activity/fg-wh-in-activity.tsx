import {
  AppstoreOutlined,
  BarcodeOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import {
  FgWhInActivityActionsEnum,
  FgWhReqHeaderFilterReq,
  PkmsFgWhCurrStageEnum,
  PkmsFgWhReqTypeEnum,
} from "@xpparel/shared-models";
import { PKMSFgWarehouseService } from "@xpparel/shared-services";
import { Badge, Card, Steps } from "antd";
import React, { useEffect, useState } from "react";
import FGWAApprovedTab from "./fgwh-action-tabs/fgwa-approved-tab";
import FGWAFgInTab from "./fgwh-action-tabs/fgwa-fg-in-tab";
import FGWALocationMappingTab from "./fgwh-action-tabs/fgwa-location-mapping";
import FGWAOpenTab from "./fgwh-action-tabs/fgwa-open-tab";
import FGWAPalletSuggestionTab from "./fgwh-action-tabs/fgwa-pallet-suggestion-tab";
import FGWAPalletisationTab from "./fgwh-action-tabs/fgwa-palletisation-tab";
import FGWASecurityInTab from "./fgwh-action-tabs/fgwa-security-in-tab";
import { useAppSelector } from "packages/ui/src/common";

export default function FGWareHouseInActivity() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const fgWHService = new PKMSFgWarehouseService();
  const [countInfo, setCountInfo] = useState<any[]>([]);
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;

  useEffect(() => {
    getCountAgainstCurrentStage();
  }, []);

  const getCountAgainstCurrentStage = () => {
    const req = new FgWhReqHeaderFilterReq(
      userName,
      orgData.unitCode,
      orgData.companyCode,
      userId,
      PkmsFgWhReqTypeEnum.IN,
      null,
      null
    );
    fgWHService.getCountAgainstCurrentStage(req).then((res) => {
      if (res.status) {
        setCountInfo(res.data);
      } else {
        setCountInfo([]);
      }
    }).catch(err=>{
      console.log(err?.message)
    });
  };

  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const statusUpdate = () => {
    getCountAgainstCurrentStage();
  };

  const renderComponents = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FGWAOpenTab
            reqType={PkmsFgWhReqTypeEnum.IN}
            statusUpdate={statusUpdate}
          />
        );
      case 1:
        return (
          <FGWAApprovedTab
            reqType={PkmsFgWhReqTypeEnum.IN}
            statusUpdate={statusUpdate}
          />
        );
      case 2:
        return <FGWASecurityInTab statusUpdate={statusUpdate} />;
      case 3:
        return <FGWAFgInTab statusUpdate={statusUpdate} />;
      case 4:
        return <FGWAPalletSuggestionTab  />;
      case 5:
        return <FGWAPalletisationTab statusUpdate={statusUpdate}/>;
      case 6:
        return <FGWALocationMappingTab statusUpdate={statusUpdate}/>;

      default:
        return <h1>No Component</h1>;
    }
  };

  const counts: React.CSSProperties = {
    backgroundColor: "#52c41a",
    color: "#fff",
    minWidth: "20px",
    height: "20px",
    lineHeight: "20px",
    textAlign: "center",
    borderRadius: "50%",
    fontSize: "10px",
    fontWeight: "bold",
    marginLeft: 4,
  };

  return (
    <Card
      size="small"
      className="card-title-bg-cyan1 pad-0 grn-process"
      bodyStyle={{ padding: "0px" }}
    >
      <Steps
        size="small"
        type="navigation"
        //  direction="vertical"
        current={currentStep}
        onChange={(e) => onStepChange(e)}
        items={[
          {
            title: (
              <>
                {FgWhInActivityActionsEnum.OPEN} { } <></>
                <Badge
                  count={
                    countInfo.find(
                      (e) => e.currentStage === PkmsFgWhCurrStageEnum.OPEN
                    )?.count || 0
                  }
                  style={counts}
                />
              </>
            ),
            status: "finish",
            icon: <FileTextOutlined />,
          },
          {
            title: (
              <>
                {FgWhInActivityActionsEnum.APPROVED}
                <></>
                <Badge
                  count={
                    countInfo.find(
                      (e) => e.currentStage === PkmsFgWhCurrStageEnum.APPROVED
                    )?.count || 0
                  }
                  style={counts}
                />
              </>
            ),
            status: "finish",
            icon: <CheckCircleOutlined />,
          },

          {
            title: (
              <>
                {FgWhInActivityActionsEnum.SECURITY_IN}
                <></>
                <span>
                  <Badge
                    count={
                      countInfo.find(
                        (e) =>
                          e.currentStage === PkmsFgWhCurrStageEnum.SECURITY_IN
                      )?.count || 0
                    }
                    style={counts}
                  />
                </span>
              </>
            ),
            status: "process",
            icon: <SecurityScanOutlined />,
          },
          {
            title: (
              <>
                {FgWhInActivityActionsEnum.FG_IN}
                <></>
                <Badge
                  count={
                    countInfo.find(
                      (e) =>
                        e.currentStage ===
                        PkmsFgWhCurrStageEnum.FG_IN_PROGRESS ||
                        e.currentStage === PkmsFgWhCurrStageEnum.PRINT
                    )?.count || 0
                  }
                  style={counts}
                />
              </>
            ),
            status: "process",
            icon: <BarcodeOutlined />,
          },
          {
            title: (
              <>
                {FgWhInActivityActionsEnum.PALLET_SUGGESTION}
                <></>
                <Badge
                  count={
                    countInfo.find(
                      (e) =>
                        e.currentStage === PkmsFgWhCurrStageEnum.FG_IN_COMPLETE
                    )?.count || 0
                  }
                  style={counts}
                />
              </>
            ),

            status: "process",
            icon: <BulbOutlined />,
          },
          {
            title: (
              <>
                {FgWhInActivityActionsEnum.PALLETISATION}
                <></>
                <Badge
                  count={
                    countInfo.find(
                      (e) =>
                        e.currentStage === PkmsFgWhCurrStageEnum.FG_IN_COMPLETE || e.currentStage === PkmsFgWhCurrStageEnum.PALLET_MAP_PROGRESS
                    )?.count || 0
                  }
                  style={counts}
                />
              </>
            ),
            status: "process",
            icon: <AppstoreOutlined />,
          },
          {
            title: (
              <>
                {FgWhInActivityActionsEnum.LOCATION_MAPPING}
                <></>
                <Badge
                  count={
                    countInfo.find(
                      (e) =>
                         e.currentStage === PkmsFgWhCurrStageEnum.PALLET_MAP_COMPLETED || e.currentStage === PkmsFgWhCurrStageEnum.LOC_MAP_PROGRESS
                    )?.count || 0
                  }
                  style={counts}
                />
              </>
            ),
            status: "process",
            icon: <EnvironmentOutlined />,
          },
        ]}
      />
      {renderComponents(currentStep)}
    </Card>
  );
}
