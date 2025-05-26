
import { DocketNumberModel, ProcessTypeEnum, OpFormEnum, PoCutModel, PoProdTypeAndFabModel, PoProdutNameRequest, PoSerialRequest, PoSerialWithCutPrefRequest, PoSummaryModel, SewSerialRequest, SewingCreationOptionsEnum, SewingJobFeatureGroupReq, SewingOrderDetailsForGivenFeatureGroup } from "@xpparel/shared-models";
import { Button, Card, Checkbox, CheckboxProps, Collapse, Descriptions, Form, Popconfirm, Select, Space, TableColumnsType, Tag, Tooltip } from "antd";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { CutGenerationServices, DocketGenerationServices, OpVersionService, PoMaterialService, SewingJobGenActualService } from "@xpparel/shared-services";
import Table, { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import moment from "moment";
import SewingActualCutBasedGrid from "./sewing-actual-cut-base-grid";
import { sewingCreationDisplayName } from "./support";
import SewingActualCutSummaryGrid from "./sew-job-summary.grid";

interface IProps {
    // poObj: PoSummaryModel;
    // onStepChange: (step: number, po: PoSummaryModel) => void
    sewSerialObj: SewSerialRequest;
}

const CheckboxGroup = Checkbox.Group;
// const plainOptions = ['Delivery Date', 'Destination', 'Plan Cut Date', 'Plan Production Date', 'Product Name', 'SO Line'];
const plainOptions = [
    { label: 'Delivery Date', value: SewingCreationOptionsEnum.DELIVERYDATE },
    { label: 'Destination', value: SewingCreationOptionsEnum.DESTINATION },
    // { label: 'Plan Cut Date', value: SewingCreationOptionsEnum.CUTDATE },
    { label: 'Plan Production Date', value: SewingCreationOptionsEnum.PRODUCTIONDATE },
    // { label: 'Product Name', value: SewingCreationOptionsEnum.PRODUCTNAME },
    // { label: 'MO Line', value: SewingCreationOptionsEnum.COLINE }
];
const defaultCheckedList = [];

const SewingJobGenerationPage = (props: IProps) => {

    useEffect(() => {
        // if (props.poObj) {

        // }
    }, [])
    const sewJobNumber = props.sewSerialObj?.poSerial;
    const user = useAppSelector((state) => state.user.user.user);

    const sewingJobGenActualService = new SewingJobGenActualService();

    const [sewingOrderData, setSewingOrder] = useState<SewingOrderDetailsForGivenFeatureGroup>(undefined);
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


    const getSewingCutDocketInfoForJobFeatures = () => {

        const req = new SewingJobFeatureGroupReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewJobNumber, checkedList.length < 1, checkedList, true, 0);
        sewingJobGenActualService.getSewingOrderDetailsForFeatureGroup(req).then((res => {
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
            items={[{ key: '1', label: "Routing Order Summary", children: <SewingActualCutSummaryGrid sewingOrderId={props?.sewSerialObj?.id} updateKey={stateKey} /> }]}
        />
        <Card>

            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Check all
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
            <Button onClick={getSewingCutDocketInfoForJobFeatures} type="primary" >Search</Button>
        </Card>
        <br />
        {sewingOrderData?.featureGroupDetails.map(e => <><SewingActualCutBasedGrid updateKey={stateKey} sewingCutBasedData={e} getSewJobDetails={getSewingCutDocketInfoForJobFeatures} sewingOrderId={sewingOrderData?.sewingOrderId} /> <br /></>)}

    </>
}

export default SewingJobGenerationPage;