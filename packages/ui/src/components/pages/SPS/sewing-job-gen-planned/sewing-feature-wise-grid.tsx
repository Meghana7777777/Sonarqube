import { CheckSquareFilled, MinusSquareFilled } from "@ant-design/icons";
import { FeatureGroupDetails, SewJobGenReqForActualAndFeatureGroup, SewJobGenReqForBgMOAndFeatureGroup, SewingCreationOptionsEnum, SewingJobConfirmedReqInfoForActualGenFeatureGroup, SewingJobPreviewForActualGenFeatureGroup, SewingJobPreviewHeaderInfo, SewingJobSummaryFeatureGroupForMo, SewingJobSummaryForSewingOrder } from "@xpparel/shared-models";
import { SewingJobGenActualService, SewingJobGenMOService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Drawer, Form, InputNumber, Popover, Space, Table, TableColumnsType, Tag, Tooltip } from "antd"
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";

import { sewingCreationDisplayName } from "./support";
import './sew-job-gen.css';
import CountdownTimer from "../../../common/timer/timer-component";
import SewingPlannedSummaryGrid from "./sew-job-summary.grid";
import SewingJobGenerationPreview from "./sewing-jog-gen-for-mo-preview";
interface IGridProps {
    sewingOrderId: number;
    sewingCutBasedData: SewingJobSummaryFeatureGroupForMo;
    getSewJobDetails: () => void;
    updateKey: number;
    bundleGroupNumber: number;
}

const SewingFeatureWiseGrid = (props: IGridProps) => {
    const user = useAppSelector((state) => state.user.user.user);

    const [showPopOver, setShowPopOver] = useState(false);
    const [stateKey, setStateKey] = useState<number>(0);
    const [openSewJobDrawer, setOpenSewJobDrawer] = useState<boolean>(false);
    const sewingJobGenActualService = new SewingJobGenActualService();
    const sewingJobGenMOService = new SewingJobGenMOService();
    const [sewJobPreviewData, setSewJobPreviewData] = useState<SewingJobPreviewHeaderInfo>(undefined);
    const [formValues, setFormValues] = useState<Object>();
    const [isDisplayButton, setIsDisplayButton] = useState<boolean>(false);
    // Initialize the form instance
    const [form] = Form.useForm();
    useEffect(() => {
        if (props.sewingCutBasedData) {
            // constructTableData(props.sewingCutBasedData);
            processData(props?.sewingCutBasedData?.sewingJobSummary);
        }
    }, [props.updateKey]);

    const processData = (sewCutOrderData: SewingJobSummaryForSewingOrder) => {
        let totalPendingQty = 0;
        // Accumulate quantities and gather all unique sizes
        sewCutOrderData.sewingOrderLineInfo.forEach((item) => {
            const { sizeQtyDetails } = item;
            sizeQtyDetails.forEach((sizeDetail) => {
                const { pendingQty } = sizeDetail;
                totalPendingQty += pendingQty;
                //for total row

            });
        });
        setIsDisplayButton(totalPendingQty > 0);
    };


    const renderTitle = (sewingCutBasedData: SewingJobSummaryFeatureGroupForMo) => {
        const enumKeys = Object.values(SewingCreationOptionsEnum);
        let isColor = false;
        return <Space wrap>{
            Object.keys(sewingCutBasedData.groupInfo).map((k: any) => {
                if (enumKeys.includes(k)) {
                    isColor = !isColor;
                    return <span className="f-600"> <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={isColor ? '#ff5500' : '#b10d7a'}> {sewingCreationDisplayName[k]} : {sewingCutBasedData.groupInfo[k]}</Tag></span>
                } else {
                    return <></>;
                }
            })}
        </Space>
    }

    const closeSewJobGenDrawer = () => {
        setOpenSewJobDrawer(false);
        setStateKey(preState => preState + 1);
        // getCumRatioQtyFabricWiseForPo(props.poObj.poSerial);
    };
    const confirmSewingJobs = (values: any) => {

        const { sewingOrderId, sewingCutBasedData } = props;
        const req = new SewJobGenReqForBgMOAndFeatureGroup(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewingOrderId, sewingCutBasedData.groupInfo, values.multiColor, values.multiSize, values.sewingJobQty, values.logicalBundleQty, props.bundleGroupNumber);
        sewingJobGenMOService.generateSewingJobsForBGAndFeatureGroup(req).then((res => {
            if (res.status) {
                setOpenSewJobDrawer(false);
                setShowPopOver(false);
                setFormValues(undefined);
                setStateKey(preState => preState + 1);
                props.getSewJobDetails();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getSewingJobsPreviewForBGAndFeatureGroup = (values: any) => {
        setFormValues(values);
        const { sewingOrderId, sewingCutBasedData } = props;
        const req = new SewJobGenReqForBgMOAndFeatureGroup(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewingOrderId, sewingCutBasedData.groupInfo, values.multiColor, values.multiSize, values.sewingJobQty, values.logicalBundleQty, props.bundleGroupNumber);
        sewingJobGenMOService.getSewingJobsPreviewForBGAndFeatureGroup(req).then((res => {
            if (res.status) {
                setSewJobPreviewData(res.data);
                setShowPopOver(false);
                setOpenSewJobDrawer(true);
                setStateKey(preState => preState + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }


    const renderSewingJenOptionForm = () => {
        return (
            <Form
                form={form}
                onFinish={getSewingJobsPreviewForBGAndFeatureGroup}
                layout="inline" // To make the form inline
                initialValues={{
                    multiSize: false,
                    multiColor: false,
                    sewingJobQty: null, // Initial value for sewingJobQty
                    logicalBundleQty: null, // Initial value for logicalBundleQty
                }}
            >
                <Form.Item name="multiSize" valuePropName="checked">
                    <Checkbox>Multi Size</Checkbox>
                </Form.Item>

                <Form.Item name="multiColor" valuePropName="checked">
                    <Checkbox>Multi Color</Checkbox>
                </Form.Item>
                <Form.Item name="sewingJobQty" label="Routing Job Qty" valuePropName="checked">
                    <InputNumber min={1} placeholder="Enter Routing Job Qty" />
                </Form.Item>
                <Form.Item name="logicalBundleQty" label="Logical Bundle Qty" >
                    <InputNumber min={1} placeholder="Enter Logical Bundle Qty" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className="btn-green" htmlType="submit">
                        Generate
                    </Button>
                </Form.Item>
            </Form>
        );

    }
    const changePopOver = (open: boolean) => {
        setShowPopOver(open);
    };
    const timerUpHandler = () => {
        setShowPopOver(false);
        setOpenSewJobDrawer(false);
    }
    console.log(props?.sewingCutBasedData?.sewingJobSummary)
    return <>
        <Card title={renderTitle(props.sewingCutBasedData)} extra={
            <>
                {/* <Popover content={renderSewingJenOptionForm} overlayInnerStyle={{ padding: '50px' }} placement="left" color='#7bd9ff' open={showPopOver} title="Sewing Job Generation Criteria" trigger="click" onOpenChange={changePopOver}>
                    <Button type="primary" className="btn-blue" >Generate Sewing Jobs</Button>
                </Popover> */}
            </>
        }>
            <SewingPlannedSummaryGrid updateKey={stateKey + props.updateKey} sewJobSummaryData={props?.sewingCutBasedData?.sewingJobSummary} />
            <br />
            {isDisplayButton ? renderSewingJenOptionForm() : null}

        </Card>
        <Drawer
            styles={{ header: { padding: '0px' } }}
            title={<Space><span>Routing Job Preview</span>
                <div style={{ width: "100px" }}></div>
                {/* <div className="small-card"> <span className="small-card-title">Sewing Job Qty</span>  <span className="small-card-content"> {sewJobPreviewData?.sewingJobQty}</span> </div>
                <div className="small-card bg-lyellow"> <span className="small-card-title">Logical Bundle Qty</span>  <span className="small-card-content"> {sewJobPreviewData?.logicalBundleQty}</span> </div> */}
                {/* <span>Session Closes With IN<CountdownTimer timer={360} timerUpHandler={timerUpHandler} /></span> */}
                {/* <div>Logical Bundle Qty:  {sewJobPreviewData?.logicalBundleQty}</div>  */}
            </Space>}
            placement="right"
            size={'large'}
            onClose={closeSewJobGenDrawer}
            open={openSewJobDrawer}
            width='100%'
            extra={
                <Space>
                    <Button type="primary" className="btn-green" onClick={() => confirmSewingJobs(formValues)}>
                        Confirm
                    </Button>
                    <Button type="link" onClick={closeSewJobGenDrawer}>
                        Close
                    </Button>
                </Space>
            }
        >
            <>
                <SewingJobGenerationPreview sewJobPreviewData={sewJobPreviewData} componentUpdateKey={stateKey} />
            </>

        </Drawer>
    </>
}

export default SewingFeatureWiseGrid;