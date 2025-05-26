import { PJ_ProcessingSerialRequest, PJ_ProcessingTypesResponse, PJ_ProcessingTypesResponseModel } from "@xpparel/shared-models";
import { ProcessingJobsService } from "@xpparel/shared-services";
import { Card, Tabs } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import SPSProcessJobGenerationPage from "./process-job-generation-for-planned-page";
import ViewSewingJobs from "../../components/view-sewing-jobs";

interface SpsProcessingOrderProps {
  processingSerial: number;
  actionType: 'CREATE' | 'VIEW';
}

export default function PrcessJobGeneration(props: SpsProcessingOrderProps) {

  useEffect(() => {
    if (props?.processingSerial) {
      getProcessingTypesByProcessingSerial();
    }
  }, [])
  const user = useAppSelector((state) => state.user.user.user);

  const processService = new ProcessingJobsService();
  const [processJobGroupsData, setProcessJobGroupData] = useState<PJ_ProcessingTypesResponseModel[]>([]);
  const [stateKey, setStateKey] = useState<number>(0);

  const getProcessingTypesByProcessingSerial = () => {

    const req = new PJ_ProcessingSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.processingSerial)
    processService.getProcessingTypesByProcessingSerial(req).then((res => {
      if (res.status) {
        setStateKey(preState => preState + 1);
        setProcessJobGroupData(res.data);
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
        items={processJobGroupsData.map((j, i) => ({
          label: `${j.processType}  ${props.actionType == 'CREATE' ? 'Creation' : ''}`,
          key: `${i + 1}`,
          children: props.actionType == 'CREATE' ? <SPSProcessJobGenerationPage processingSerial={props.processingSerial} processJobGroupData={j} />
            : <ViewSewingJobs poSerial={props.processingSerial} processJobGroupData={j}  />
        }))
        }
      />
    </Card>
  </>
}
