
import { DocketNumberModel, JobGroupBundleGroupProcessTypeModel, ProcessTypeEnum, OpFormEnum, PoCutModel, PoProdTypeAndFabModel, PoProdutNameRequest, PoSerialRequest, PoSerialWithCutPrefRequest, PoSummaryModel, SewSerialRequest, SewingCreationOptionsEnum, SewingJobFeatureGroupReq, SewingJobSummaryFeatureGroupForMo, SewingOrderDetailsForGivenFeatureGroup } from "@xpparel/shared-models";
import { Button, Card, Checkbox, CheckboxProps, Collapse, Descriptions, Form, Popconfirm, Select, Space, TableColumnsType, Tag, Tooltip } from "antd";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { CutGenerationServices, DocketGenerationServices, OpVersionService, PoMaterialService, SewingJobGenActualService, SewingJobGenMOService } from "@xpparel/shared-services";
import Table, { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import moment from "moment";
import SewingFeatureWiseGrid from "./sewing-feature-wise-grid";
import { sewingCreationDisplayName } from "./support";
import SewingPlannedSummaryGrid from "./sew-job-summary.grid";

interface IProps {   
    // onStepChange: (step: number, po: PoSummaryModel) => void
    sewSerialObj: SewSerialRequest;
    jobGroupData: JobGroupBundleGroupProcessTypeModel;
}

const CheckboxGroup = Checkbox.Group;
// const plainOptions = ['Delivery Date', 'Destination', 'Plan Cut Date', 'Plan Production Date', 'Product Name', 'MO Line'];
const plainOptions = [
    { label: 'Delivery Date', value: SewingCreationOptionsEnum.DELIVERYDATE },
    { label: 'Destination', value: SewingCreationOptionsEnum.DESTINATION },
    // { label: 'Plan Cut Date', value: SewingCreationOptionsEnum.CUTDATE },
    { label: 'Plan Production Date', value: SewingCreationOptionsEnum.PRODUCTIONDATE },
    // { label: 'Product Name', value: SewingCreationOptionsEnum.PRODUCTNAME },
    // { label: 'MO Line', value: SewingCreationOptionsEnum.COLINE }
];
const defaultCheckedList = [];

const SewingJobGenerationForPlannedPage = (props: IProps) => {

    useEffect(() => {
        // if (props.poObj) {

        // }
    }, [])
    const sewJobNumber = props.sewSerialObj?.poSerial;
    const user = useAppSelector((state) => state.user.user.user);

    const sewingJobGenActualService = new SewingJobGenActualService();
    const sewingJobGenMOService = new SewingJobGenMOService();

    const [sewingOrderData, setSewingOrder] = useState<SewingJobSummaryFeatureGroupForMo[]>([]);
    const [checkedList, setCheckedList] = useState<SewingCreationOptionsEnum[]>(defaultCheckedList);
    const [stateKey, setStateKey] = useState<number>(0);
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

    const onChange = (list: SewingCreationOptionsEnum[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        setCheckedList(e.target.checked ? plainOptions.map(o => o.value) : []);
    };


    const getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures = () => {

        const req = new SewingJobFeatureGroupReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewJobNumber, checkedList.length < 1, checkedList, true, props?.jobGroupData?.bundleGroup);
        sewingJobGenMOService.getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures(req).then((res => {
            if (res.status) {
                setStateKey(preState => preState + 1);
                setSewingOrder(res.data);
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
            items={[{ key: '1', label: "Routing Order Summary ", children: <SewingPlannedSummaryGrid sewingOrderNo={props?.sewSerialObj?.poSerial} updateKey={stateKey} bundleGroupNo={props.jobGroupData.bundleGroup} /> }]}
        />
        <Card>

            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Check all
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
            <Button onClick={getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures} type="primary" >Search</Button>
        </Card>
        <br />
        {sewingOrderData.map(e => <><SewingFeatureWiseGrid updateKey={stateKey} sewingCutBasedData={e} getSewJobDetails={getSewingJobSummaryForSewingOrderAndBundleGroupAndFeatures} sewingOrderId={props.sewSerialObj.id} bundleGroupNumber={props?.jobGroupData?.bundleGroup} /> <br /></>)}

    </>
}

export default SewingJobGenerationForPlannedPage;