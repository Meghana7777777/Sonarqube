
import { JobGroupBundleGroupProcessTypeModel, PJ_ProcessingJobSummaryForFeatureGroupModel, PJ_ProcessingSerialTypeAndFeatureGroupReq, PJ_ProcessingTypesResponseModel, SewSerialRequest, SewingCreationOptionsEnum, SewingJobFeatureGroupReq, SewingJobSummaryFeatureGroupForMo } from "@xpparel/shared-models";
import { ProcessingJobsService, SewingJobGenActualService, SewingJobGenMOService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, CheckboxProps, Collapse } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import SPSProcessPlannedSummaryGrid from "./sps-process-planned-summary-grid";
import SPSProcessFeatureWiseGrid from "./sps-process-feature-wise-grid";
interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}
interface IProps {
    processingSerial: number;
    processJobGroupData: PJ_ProcessingTypesResponseModel
}

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
    { label: 'Delivery Date', value: SewingCreationOptionsEnum.DELIVERYDATE },
    { label: 'Destination', value: SewingCreationOptionsEnum.DESTINATION },
    // { label: 'Plan Cut Date', value: SewingCreationOptionsEnum.CUTDATE },
    { label: 'Plan Production Date', value: SewingCreationOptionsEnum.PRODUCTIONDATE },
    { label: 'Product Code', value: SewingCreationOptionsEnum.PRODUCTCODE, disabled: true },
    // { label: 'MO Line', value: SewingCreationOptionsEnum.COLINE }
];
const defaultCheckedList = [SewingCreationOptionsEnum.PRODUCTCODE];

const SPSProcessJobGenerationPage = (props: IProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const processService = new ProcessingJobsService();
    const [processOrderData, setProcessOrderData] = useState<PJ_ProcessingJobSummaryForFeatureGroupModel[]>([]);
    const [checkedList, setCheckedList] = useState<SewingCreationOptionsEnum[]>(defaultCheckedList);
    const [stateKey, setStateKey] = useState<number>(0);
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
    useEffect(() => {

    }, [])
    const onChange = (list: SewingCreationOptionsEnum[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        let checkedValued = plainOptions.map(o => o.value)
        if (!e.target.checked) {
            checkedValued = defaultCheckedList;
        }
        setCheckedList(checkedValued);
    };

    const getProcessingJobSummaryForProcessTypeAndFeatureGroup = (isUpdateState: boolean = true) => {
        const req = new PJ_ProcessingSerialTypeAndFeatureGroupReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.processingSerial, props.processJobGroupData.processType, checkedList);
        processService.getProcessingJobSummaryForProcessTypeAndFeatureGroup(req).then((res => {
            if (res.status) {
                if (isUpdateState) {
                    setStateKey(preState => preState + 1);
                }
                setProcessOrderData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    return <>
        <Collapse
            style={{ margin: '10px 0' }}
            size="small"
            className="header-collapse"
            items={[{ key: '1', label: "Processing Order Summary ", children: <SPSProcessPlannedSummaryGrid isMakeApiCall={true} processingSerial={props?.processingSerial} updateKey={stateKey + 1} processType={props.processJobGroupData.processType} /> }]}
        />
        <Card>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Check all
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
            <Button onClick={e => getProcessingJobSummaryForProcessTypeAndFeatureGroup(false)} type="primary" >Search</Button>
        </Card>
        <br />
        {processOrderData.map(e => <><SPSProcessFeatureWiseGrid updateKey={stateKey} processCutBasedData={e} getProcessJobDetails={getProcessingJobSummaryForProcessTypeAndFeatureGroup} processingSerial={props.processingSerial} processType={props?.processJobGroupData.processType} /> <br /></>)}

    </>
}

export default SPSProcessJobGenerationPage;