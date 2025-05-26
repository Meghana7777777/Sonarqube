import { PJ_ProcessingJobBatchDetails, PJ_ProcessingJobPreviewHeaderInfo, PJ_ProcessingJobPreviewModelResp, PJ_ProcessingJobSummaryForFeatureGroupModel, PJ_ProcessingJobsGenRequest, PJ_ProcessingSerialRequest, PJ_ProcessingSerialTypeAndFeatureGroupReq, PJ_ProcessingTypesResponseModel, ProcessTypeEnum, SewJobGenReqForBgMOAndFeatureGroup, SewingCreationOptionsEnum, SewingJobPreviewHeaderInfo, SewingJobSummaryFeatureGroupForMo, SewingJobSummaryForSewingOrder } from "@xpparel/shared-models";
import { ProcessingJobsService, SewingJobGenActualService, SewingJobGenMOService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Drawer, Form, InputNumber, Popover, Select, Space, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "packages/ui/src/components/common";
import SPSProcessPlannedSummaryGrid from "./sps-process-planned-summary-grid";
import SPSProcessJobPreview from "./sps-process-job-generation-preview";
import { sewingCreationDisplayName } from "../../sewing-job-gen/support";
import CountdownTimer from "packages/ui/src/components/common/timer/timer-component";
import { POQtyRecommendationUtil } from "packages/ui/src/common/utils/qty-recommendations";
interface IGridProps {
    processingSerial: number;
    processCutBasedData: PJ_ProcessingJobSummaryForFeatureGroupModel;
    getProcessJobDetails: () => void;
    updateKey: number;
    processType: ProcessTypeEnum;
}

const SPSProcessFeatureWiseGrid = (props: IGridProps) => {
    const { processingSerial, processCutBasedData } = props
    const user = useAppSelector((state) => state.user.user.user);
    const [showPopOver, setShowPopOver] = useState(false);
    const [stateKey, setStateKey] = useState<number>(0);
    const [openProcessJobDrawer, setOpenProcessJobDrawer] = useState<boolean>(false);
    const processService = new ProcessingJobsService();
    const [processJobPreviewData, setProcessJobPreviewData] = useState<PJ_ProcessingJobPreviewHeaderInfo>(undefined);
    const [formValues, setFormValues] = useState<Object>();
    const [isDisplayButton, setIsDisplayButton] = useState<boolean>(false);
    const [anotherOptions, setAnotherOptions] = useState<any[]>([]);
    const [routingJobQtys, setRoutingJobQtys] = useState<Record<string, number>>({})


    const poQtyRecommendationUtil = new POQtyRecommendationUtil()
    const uniqueKey = `${processingSerial}-${processCutBasedData.groupInfo.product_code}`
    // Initialize the form instance
    const [form] = Form.useForm();
    useEffect(() => {
        if (props.processCutBasedData) {
            processData(props?.processCutBasedData);
        }
    }, [props.updateKey]);

    const processData = (sewCutOrderData: PJ_ProcessingJobSummaryForFeatureGroupModel) => {
        let totalPendingQty = 0;
        // Accumulate quantities and gather all unique sizes
        sewCutOrderData.productFgQtyInfo.forEach((item) => {
            item.sizeQtyInfo.forEach((size) => {
                totalPendingQty += size.pendingQty;
            });

        });
        setIsDisplayButton(totalPendingQty > 0);
    };


    const renderTitle = (processCutBasedData: PJ_ProcessingJobSummaryForFeatureGroupModel) => {
        const enumKeys = Object.values(SewingCreationOptionsEnum);
        let isColor = false;
        return <Space wrap>{
            Object.keys(processCutBasedData.groupInfo).map((k: any) => {
                if (enumKeys.includes(k)) {
                    isColor = !isColor;
                    return <span className="f-600"> <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={isColor ? '#ff5500' : '#b10d7a'}> {sewingCreationDisplayName[k]} : {processCutBasedData.groupInfo[k]}</Tag></span>
                } else {
                    return <></>;
                }
            })}
        </Space>
    }

    const closeSewJobGenDrawer = () => {
        setOpenProcessJobDrawer(false);
        setStateKey(preState => preState + 1);
        // getCumRatioQtyFabricWiseForPo(props.poObj.poSerial);
    };
    const confirmSewingJobs = (values: any) => {
        const req = new PJ_ProcessingJobsGenRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.processingSerial, props.processType, values.multiColor, values.multiSize, values.sewingJobQty, props.processCutBasedData.groupInfo);
        processService.confirmProcessingJobsForProcessTypeAndFeatureGroup(req).then((res => {
            if (res.status) {
                setOpenProcessJobDrawer(false);
                setShowPopOver(false);
                setFormValues(undefined);
                setStateKey(preState => preState + 1);
                props.getProcessJobDetails();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getVirtualProcessingJobsForProcessTypeAndFeatureGroup = (values: any) => {
        console.log(values)
        setFormValues(values);
        const req = new PJ_ProcessingJobsGenRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.processingSerial, props.processType, values.multiColor, values.multiSize, values.sewingJobQty, props.processCutBasedData.groupInfo);
        processService.getVirtualProcessingJobsForProcessTypeAndFeatureGroup(req).then((res => {
            if (res.status) {
                setProcessJobPreviewData(res.data);
                setShowPopOver(false);
                setOpenProcessJobDrawer(true);
                setStateKey(preState => preState + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    console.log(routingJobQtys)
    console.log(form.getFieldsValue())
    const renderSewingJenOptionForm = () => {
        return (
            <Form
                form={form}
                onFinish={getVirtualProcessingJobsForProcessTypeAndFeatureGroup}
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
                <Form.Item name="sewingJobQty" label="Routing Job Qty">
                    <Select
                        key={uniqueKey}
                        showSearch
                        value={routingJobQtys[uniqueKey]?.toString()}
                        options={anotherOptions[uniqueKey] || constructDefaultOptions(processCutBasedData)}
                        style={{ width: 200 }}
                        onSearch={(text) => handleQtySearch(text, processCutBasedData, uniqueKey)}
                        onChange={(value) => handleMoQtyChange(value, processCutBasedData)}
                        placeholder="Select PO Qty"
                        filterOption={false}
                        notFoundContent={<div style={{ padding: 8 }}>No matching quantities found</div>}
                    />
                </Form.Item>
                {/* <Form.Item name="logicalBundleQty" label="Logical Bundle Qty" >
                    <InputNumber min={1} placeholder="Enter Logical Bundle Qty" />
                </Form.Item> */}
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
        setOpenProcessJobDrawer(false);
    }

    const constructDefaultOptions = (record: PJ_ProcessingJobSummaryForFeatureGroupModel) => {
        return poQtyRecommendationUtil
            .getPossibleQuantities(record.possibleBundleQtyInfo)
            .quantities.map(qty => ({
                key: qty.toString(),
                value: qty.toString(),
                label: `${qty}`,
                style: { backgroundColor: '#e6f4ff' }
            }));
    };

    const handleQtySearch = (
        searchText: string,
        record: PJ_ProcessingJobSummaryForFeatureGroupModel,
        key: string
    ) => {
        const numericInput = parseInt(searchText);

        if (!searchText) {
            // When empty, show all valid quantities
            setAnotherOptions(prev => ({
                ...prev,
                [key]: constructDefaultOptions(record)
            }));
            return;
        }

        if (isNaN(numericInput)) {
            setAnotherOptions(prev => ({ ...prev, [key]: [] }));
            return;
        }

        // Generate recommendations based on input
        const recommendations = poQtyRecommendationUtil
            .getRecommendedQuantities(record.possibleBundleQtyInfo, numericInput)
            .map(qty => ({
                key: qty.toString(),
                value: qty.toString(),
                label: `${qty}`,
                style: { backgroundColor: '#fff7e6' }
            }));

        // Include valid quantities that match input
        const matchingValids = poQtyRecommendationUtil
            .getPossibleQuantities(record.possibleBundleQtyInfo)
            .quantities
            .filter(qty => qty.toString().includes(searchText))
            .map(qty => ({
                key: qty.toString(),
                value: qty.toString(),
                label: `${qty}`,
                style: { backgroundColor: '#e6f4ff' }
            }));

        setAnotherOptions(prev => ({
            ...prev,
            [key]: [...recommendations, ...matchingValids]
        }));
    };

    const handleMoQtyChange = (value: string | null, record: PJ_ProcessingJobSummaryForFeatureGroupModel) => {
        ;
        if (!value) {
            setRoutingJobQtys(prev => ({ ...prev, [uniqueKey]: null }));
            return;
        }
        const numericValue = Number(value);
        setRoutingJobQtys(prev => ({ ...prev, [uniqueKey]: numericValue }));
        form.setFieldValue('sewingJobQty', numericValue)
    };

    return <>
        <Card title={renderTitle(props.processCutBasedData)} extra={
            <>
                {/* <Popover content={renderSewingJenOptionForm} overlayInnerStyle={{ padding: '50px' }} placement="left" color='#7bd9ff' open={showPopOver} title="Sewing Job Generation Criteria" trigger="click" onOpenChange={changePopOver}>
                    <Button type="primary" className="btn-blue" >Generate Sewing Jobs</Button>
                </Popover> */}
            </>
        }>
            <SPSProcessPlannedSummaryGrid processingSerial={props.processingSerial} isMakeApiCall={false} updateKey={stateKey + props.updateKey} processJobSummaryData={props?.processCutBasedData} />
            <br />
            {isDisplayButton ? renderSewingJenOptionForm() : null}

        </Card>
        <Drawer
            styles={{ header: { padding: '0px' } }}
            title={<Space><span>Processing Jobs Preview</span>
                <div style={{ width: "100px" }}></div>
                <div className="small-card"> <span className="small-card-title">Processing Job Qty</span>  <span className="small-card-content"> {processJobPreviewData?.totalJobQuantity}</span> </div>
                <div className="small-card bg-lyellow"> <span className="small-card-title">Bundle Count</span>  <span className="small-card-content"> {processJobPreviewData?.totalBundlesCount}</span> </div>
                {/* <span>Session Closes With IN<CountdownTimer timer={360} timerUpHandler={timerUpHandler} /></span> */}
                {/* <div>Total No Of Jobs:  {processJobPreviewData?.totalNoOfJobs}</div>  */}
            </Space>}
            placement="right"
            size={'large'}
            onClose={closeSewJobGenDrawer}
            open={openProcessJobDrawer}
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
                <SPSProcessJobPreview processJobPreviewData={processJobPreviewData} componentUpdateKey={stateKey} />
            </>

        </Drawer>
    </>
}

export default SPSProcessFeatureWiseGrid;