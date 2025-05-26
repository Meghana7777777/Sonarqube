import { BookOutlined, IdcardOutlined, PicLeftOutlined, SolutionOutlined } from '@ant-design/icons';
import { MOHeaderInfoModel, PackingListSummaryModel, ProcessTypeEnum, RawOrderHeaderInfoModel, SI_ManufacturingOrderInfoModel, SI_MoProductIdRequest, SewSerialRequest, StyleIdRequest } from '@xpparel/shared-models';
import { Badge, Card, Divider, StepProps, Steps } from 'antd';
import { useAppSelector, useCallbackPrompt } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages, RouterPrompt } from '../../../common';
import { OrderSummaryPage } from './manufacturing-order-summary-panel';
import ProductComponentMapping from '../product-prototype/product-component-mapping';
import { OrderCreationService, OrderManipulationServices, StyleSharedService } from '@xpparel/shared-services';
import OperationRoutingPage from './operation-routing/operation-routing';
import OpVersionBomSubProcessMapTab from '../order-management/bom-sp-mapping/bom-op-tab';
import FabConsumptionPage from '../fab-consumption-page';
import MoQuantityUpdate from '../order-management/manf-order-creation/mo-quantity-update';
import OrderSummaryPreview from './order-summary-preview';
import ManufacturingOrderHeaderView from '../order-management/manf-order-creation/mo-header-info';
import MOPlannedBunldesView from './mo-planned-bundles-view';


export const OrderSummaryStepper = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedSummeryRecord, setSelectedSummeryRecord] = useState<SI_ManufacturingOrderInfoModel>();
    const [rawOrderHeaderInfo, setRawOrderHeaderInfo] = useState<RawOrderHeaderInfoModel>();
    const [rawOrderHeaderInfoData, setRawOrderHeaderInfoData] = useState<MOHeaderInfoModel>();
    const [styleProcessType, setStyleProcessType] = useState<ProcessTypeEnum>(undefined);
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const omsManipulationService = new OrderManipulationServices();
    const orderCreationService = new OrderCreationService();
    const styleService = new StyleSharedService();

    useEffect(() => {
        if (selectedSummeryRecord?.moNumber) {
            getManufacturingOrderHeaderInfoData(selectedSummeryRecord?.moNumber);
        }
    }, [selectedSummeryRecord?.moNumber])




    const onStepChange = (step: number, selectedRecord: SI_ManufacturingOrderInfoModel) => {
        if (step) {
            if (!selectedRecord) {
                AlertMessages.getErrorMessage("Please Select Manufacturing order");
                // return false;
            } else {
                setCurrentStep(step);
                setShowDialog(true);
                setSelectedSummeryRecord(selectedRecord);
                getStyleInfoForStyleCode(selectedRecord.style)
            }
        } else {
            setCurrentStep(step);
            //   history.replace('/pps/poPlanning')

        }

    }
    const getStyleInfoForStyleCode = (style: string) => {
        const req = new StyleIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, style, style);
        styleService.getStyleByStyleCode(req).then((res => {
            if (res.status) {
                setStyleProcessType(res?.data?.[0]?.processType)
            } else {

                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            setRawOrderHeaderInfoData(undefined);
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getManufacturingOrderHeaderInfoData = (moNumber: string) => {
        const req = new SI_MoProductIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, moNumber, undefined, undefined, undefined, true, false, false, true,);
        orderCreationService.getMoInfoHeader(req).then((res => {
            if (res.status) {
                setRawOrderHeaderInfoData(res.data[0]);
            } else {
                setRawOrderHeaderInfoData(undefined);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            setRawOrderHeaderInfoData(undefined);
            AlertMessages.getErrorMessage(error.message)
        });
    }
    // const getManufacturingOrderHeaderInfo = (orderIdPk: number) => {

    //     const req = new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, orderIdPk, undefined, undefined, undefined, true, false, false, true, false);
    //     omsManipulationService.getRawOrderHeaderInfo(req).then((res => {
    //         if (res.status) {
    //             const data = res.data[0];
    //             setRawOrderHeaderInfo(data);
    //         } else {
    //             setRawOrderHeaderInfo(undefined);
    //             AlertMessages.getErrorMessage(res.internalMessage);
    //         }
    //     })).catch(error => {
    //         setRawOrderHeaderInfo(undefined);
    //         AlertMessages.getErrorMessage(error.message)
    //     });

    // }


    const isCutProcess = styleProcessType === ProcessTypeEnum.KNIT;
    const renderComponents = (step: number) => {
        const stepComponents = isCutProcess
            ? [
                <OrderSummaryPage onStepChange={onStepChange} />,
                <OpVersionBomSubProcessMapTab moNumber={selectedSummeryRecord?.moNumber} />,
                <FabConsumptionPage moNumber={selectedSummeryRecord?.moNumber} />,
                <MoQuantityUpdate moNumber={selectedSummeryRecord?.moNumber} />,
                <OrderSummaryPreview moNumber={selectedSummeryRecord?.moNumber} />,
                <MOPlannedBunldesView moNumber={selectedSummeryRecord?.moNumber} />,
            ]
            : [
                <OrderSummaryPage onStepChange={onStepChange} />,
                <OpVersionBomSubProcessMapTab moNumber={selectedSummeryRecord?.moNumber} />,
                <MoQuantityUpdate moNumber={selectedSummeryRecord?.moNumber} />,
                <OrderSummaryPreview moNumber={selectedSummeryRecord?.moNumber} />,
                <MOPlannedBunldesView moNumber={selectedSummeryRecord?.moNumber} />,
            ];

        return stepComponents[step] || null;

    }
    const items: StepProps[] = [
        {
            title: 'Orders Summary',
            status: 'finish' as const,
            icon: <BookOutlined />,
        },
        {
            title: 'BOM Mapping',
            status: 'finish' as const,
            icon: <SolutionOutlined style={{ color: rawOrderHeaderInfo?.moConfirmed ? '#1acb00' : '#d6ad06' }} />,
        },
        ...(isCutProcess ? [{
            title: 'Consumption',
            status: 'process' as const,
            icon: <IdcardOutlined style={{ color: rawOrderHeaderInfo?.productConfirmed ? '#1acb00' : rawOrderHeaderInfo?.moConfirmed ? '#d6ad06' : '#818181' }} />,
        }] : []),
        {
            title: 'Order Qty Update',
            status: 'process' as const,
            icon: <PicLeftOutlined />,
        },
        {
            title: 'MO Confirmation',
            status: 'process' as const,
            icon: <PicLeftOutlined />,
        },
        {
            title: 'MO Planned Bunldes',
            status: 'process' as const,
            icon: <PicLeftOutlined />,
        },
    ]

    return (<>
        <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="OMS Process will be halted" />
        {/* <Badge.Ribbon text={selectedSummeryRecord ?` Manufacturing Order No: ${selectedSummeryRecord?.moNumber}` : ''} color="#faad14"> */}
        <Card size="small" className="card-title-bg-cyan1 pad-0 grn-process" bodyStyle={{ padding: '0px' }}>
            <Steps
                size="small"
                type="navigation"
                //  direction="vertical"
                current={currentStep}
                responsive
                onChange={(e) => onStepChange(e, selectedSummeryRecord)}
                items={items}
            />

        </Card>
        {currentStep != 0 && rawOrderHeaderInfoData && <><br /><ManufacturingOrderHeaderView moInfo={rawOrderHeaderInfoData} moNum={selectedSummeryRecord?.moNumber} /></>}
        {renderComponents(currentStep)}

        {/* </Badge.Ribbon> */}

    </>)
}

export default OrderSummaryStepper;