import { BookOutlined, CheckSquareOutlined, FormOutlined, IdcardOutlined, InsertRowBelowOutlined, OneToOneOutlined, OrderedListOutlined, PicLeftOutlined, ScissorOutlined, SolutionOutlined, TableOutlined } from '@ant-design/icons';
import { KnitHeaderInfoModel, PackMethodEnum, PO_PoSerialRequest, PoSummaryModel } from '@xpparel/shared-models';
import { Badge, Card, Divider, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { setSelectedPO, useAppDispatch, useAppSelector, useCallbackPrompt } from '../../../../common';
import { AlertMessages, RouterPrompt } from '../../../common';
import { PoCreation } from './po-creation';
import OQUpdate from '../oq-update/oq-update';
import { RatioCreation } from '../ratios';
import RatioSummaryPage from '../ratios/summary/ratio-summary-page';
import DocketGenerationPage from '../docket-gen/docket-generation-page';
import DocketConfirmationPage from '../docket-gen/docket-confirmation-page';
import { MarkerPage } from '../marker';
import FabricProprietiesPage from '../fabric-proprieties/fabric-proprieties-page';
import OperationVersionPage from '../operation-version/operation-version-page';
import BundleTagPage from '../bundle-tag/bundle-tag-page';
import EmbellishmentJobsPage from '../embellishment-jobs/embellishment-jobs-page';
import CutGenerationPage from '../cut-generation/cut-generation-page';
import PoHeaderView from './po-header-view';
import OESMainPanel from '../../OES/oes-processing-order/oes-main-pannel';
import OESProcessingOrder from '../../OES/oes-processing-order/processing-order/oes-processing-order';
import { CutOrderService } from '@xpparel/shared-services';
import PPSHeaderInfo from './pps-header-view';
import { CutBundlePoPage } from '../cutting-management/cutting-main-panel';

export interface POInfoCommonProps {
    processingSerial: number;
    styleCode: string;

}

export const ProductionOrderStepper = () => {
    const dispatch = useAppDispatch();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedSummeryRecord, setSelectedSummeryRecord] = useState<PoSummaryModel>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
    const [selectedPoInfo, setSelectedPoInfo] = useState<POInfoCommonProps>();
    const [procSerial, setProcSerial] = useState<number>();
    const user = useAppSelector((state) => state.user.user.user);
    const cutOrderService = new CutOrderService();
    const [headerInfo, setHeaderInfo] = useState<KnitHeaderInfoModel>();



    useEffect(() => {
        getOesHeaderInfo(selectedPoInfo?.processingSerial)
        setProcSerial(selectedPoInfo?.processingSerial)
    }, [selectedPoInfo])

    const getOesHeaderInfo = (procesSerNum: number) => {
        try {
            const req = new PO_PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, procesSerNum, undefined)
            cutOrderService.getCutHeaderInfoForProcSerial(req).then(res => {
                if (res.status) {
                    setHeaderInfo(res.data)
                }
            }).catch(err=> {
                AlertMessages.getErrorMessage(err.message);
            }) 
        } catch (err) {
           AlertMessages.getErrorMessage(err.message);
        }
    }


    const onStepChange = (step: number, selectedRecord: PoSummaryModel) => {
        if (step) {
            if (!selectedRecord) {
                AlertMessages.getErrorMessage("Please Select Cut Order and Proceed.");
                // return false;
            } else {
                dispatch(setSelectedPO(selectedRecord));
                setCurrentStep(step);
                setShowDialog(true)
                setSelectedSummeryRecord(selectedRecord);
            }
        } else {
            setCurrentStep(step);
            //   history.replace('/pps/poPlanning')

        }

    }



    const renderComponents = (step: number) => {
        switch (step) {
            case 0: return <OESProcessingOrder setPrcSerialAndStyleCode={setSelectedPoInfo} onStepChange={onStepChange} />
            // case 1: return <OQUpdate selectedRecord={selectedSummeryRecord} onStepChange={onStepChange} />
            case 1: return <FabricProprietiesPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 2: return <OperationVersionPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 3: return <RatioSummaryPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 4: return <MarkerPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 5: return <DocketGenerationPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 6: return <DocketConfirmationPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 7: return <CutGenerationPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            case 8: return <CutBundlePoPage poObj={selectedSummeryRecord} onStepChange={onStepChange} />
            default: return <></>
        }
    }
    return (<>
        <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="PPS Process will be halted" />
        {/* <Badge.Ribbon text={`TO DO`} color="#faad14"> */}
        <Card size="small" className="card-title-bg-cyan1 pad-0 po-process"
            bodyStyle={{ padding: '0px 10px' }}
        >
            <Steps
                size="small"
                type="navigation"
                //  direction="vertical"
                current={currentStep}
                onChange={(e) => onStepChange(e, selectedSummeryRecord)}
                items={[
                    {
                        // title: <>Packing List <Badge count={phId} color='#faad14' /></>,
                        title: 'Cut Order Creation',
                        status: 'finish',
                        icon: <BookOutlined />,
                    },
                    // {
                    //     title: <>Order Quantity<br></br> Changes</>,
                    //     status: 'finish',
                    //     icon: <SolutionOutlined />,
                    // },
                    {
                        title: 'Fabric Properties',
                        status: 'process',
                        icon: <FormOutlined />,
                    },
                    {
                        title: 'Operation Version',
                        status: 'process',
                        icon: <OrderedListOutlined />
                    },
                    {
                        title: 'Ratios',
                        status: 'process',
                        icon: <PicLeftOutlined />,
                    },
                    {
                        title: 'Markers',
                        status: 'process',
                        icon: <InsertRowBelowOutlined />
                    },
                    {
                        title: 'Docket Generation',
                        status: 'process',
                        icon: <OneToOneOutlined />
                    },
                    {
                        title: 'Docket Confirmation',
                        status: 'process',
                        icon: <CheckSquareOutlined />
                    },
                    {
                        title: 'Cut Generation',
                        status: 'process',
                        icon: <OneToOneOutlined />
                    },
                    {
                        title: 'Cut Bundling',
                        status: 'process',
                        icon: <ScissorOutlined />
                    }
                ]}
            />
            {/* <Divider style={{ margin: '5px 0' }} /> */}

        </Card>
        {/* <br /> */}
        {(selectedSummeryRecord && currentStep > 0) ? <PPSHeaderInfo procSerial={procSerial} moInfo={headerInfo ? headerInfo : null} /> : <br />}
        {/* <br /> */}
        {renderComponents(currentStep)}

        {/* </Badge.Ribbon> */}

    </>)
}

export default ProductionOrderStepper;