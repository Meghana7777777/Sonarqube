
import { DocketNumberModel, JobGroupBundleGroupProcessTypeModel, ProcessTypeEnum, OpFormEnum, PoCutModel, PoProdTypeAndFabModel, PoProdutNameRequest, PoSerialRequest, PoSerialWithCutPrefRequest, PoSummaryModel, SewSerialRequest, SewingCreationOptionsEnum, SewingJobFeatureGroupReq, SewingOrderDetailsForGivenFeatureGroup } from "@xpparel/shared-models";
import { Button, Card, Checkbox, CheckboxProps, Collapse, Descriptions, Form, Popconfirm, Select, Space, TableColumnsType, Tabs, Tag, Tooltip } from "antd";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { CutGenerationServices, DocketGenerationServices, OpVersionService, PoMaterialService, SewingJobGenActualService, SewingMappingService } from "@xpparel/shared-services";
import Table, { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import moment from "moment";
import SewingFeatureWiseGrid from "./sewing-feature-wise-grid";
import { sewingCreationDisplayName } from "./support";
import SewingPlannedSummaryGrid from "./sew-job-summary.grid";
import SewingJobGenerationForPlannedPage from "./sew-job-gen-for-plan-page";

interface IProps { 
    // onStepChange: (step: number, po: PoSummaryModel) => void
    sewSerialObj: SewSerialRequest;    
}

const SewingJobGroupPlannedPage = (props: IProps) => {

    useEffect(() => {
        if (props.sewSerialObj) {
            getGroupAndProcessTypeInfoBySewSerial();
        }
    }, [])
    const sewJobNumber = props.sewSerialObj?.poSerial;
    const sewOrderId = props.sewSerialObj?.id;
    const user = useAppSelector((state) => state.user.user.user);

    const sewingJobGenActualService = new SewingJobGenActualService();
    const sewingMappingService = new SewingMappingService();
    const [sewJobGroupsData, setSewJobGroupData] = useState<JobGroupBundleGroupProcessTypeModel[]>([]);
    const [stateKey, setStateKey] = useState<number>(0);


    const getGroupAndProcessTypeInfoBySewSerial = () => {

        const req = new SewSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewJobNumber, sewOrderId, true, false);
        sewingMappingService.getGroupAndProcessTypeInfoBySewSerial(req).then((res => {
            if (res.status) {
                setStateKey(preState => preState + 1);
                setSewJobGroupData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }


    return <>
    <Card size="small">
        <Tabs
            defaultActiveKey="1"
            items={sewJobGroupsData.map((j, i) => ({
                label: `${j.processType}  JOB CREATION`,
                key: `${i + 1}`,
                children: <SewingJobGenerationForPlannedPage sewSerialObj={props.sewSerialObj} jobGroupData={j}/>,
            }))
            }
        />
    </Card>
    </>
}

export default SewingJobGroupPlannedPage;