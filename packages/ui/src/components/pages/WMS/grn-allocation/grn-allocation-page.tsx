import Icon, { BookOutlined, EyeOutlined, IdcardOutlined, PartitionOutlined, PrinterOutlined, ShoppingCartOutlined, SolutionOutlined, UngroupOutlined } from "@ant-design/icons";
import { PackingListSummaryModel, PackingSecurityMenuEnum, PalletRollsUIModel } from "@xpparel/shared-models";
import { Badge, Card, Divider, Steps } from "antd";
import { useEffect, useState } from "react";
import { useCallbackPrompt } from "../../../../common";
import { AlertMessages, RouterPrompt } from "../../../common";
import { GRNUnLoadingPage } from "../GRNTab2";
import { PalletBinMappingPage } from "../bin-pallet-mapping";
import { InspectionPreference } from "../inspection-preference";
import { PackListSummaryPage } from "../pack-list-summary";
import { PalletRollAllocationPage } from "../pallet-roll-allocation";
import { PrintBarCodes } from "../print-barcodes";
import { ReactComponent as TShirtWash } from './icons/wash-tshirt.svg';
import { PalletPage } from "../pallet-allocation";
import { PackListPreviewParent } from "../packing-list";
import { SwitchBarcodes } from "./swatch-barcodes";


interface PalletRollsTbl extends PalletRollsUIModel {
    key: React.Key;
}
export const GrnAllocationPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [phId, setPhId] = useState<number>();
    const [selectedSummeryRecord, setSelectedSummeryRecord] = useState<PackingListSummaryModel>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrompt, confirmNavigation, cancelNavigation] =
        useCallbackPrompt(showDialog)
    useEffect(() => {
        // if (state.defaultPlant) {
        //   if (locationData.state) {
        //     var { step, mpo, spo, plantCode } = locationData.state;
        //   }
        //   if (plantCode !== state.defaultPlant) { // if redirection plant not equal to current plant then set current step 0
        //     setCurrentStep(0);
        //   } else {
        //     setCurrentStep(Number(step));
        //     setMasterPo(mpo);
        //     setSubPo(spo);
        //   }
        // }
    }, []);



    const onStepChange = (step: number, selectedRecord: PackingListSummaryModel) => {
        if (step) {
            if (!selectedRecord) {
                AlertMessages.getErrorMessage("Please Select Packing List ");
                // return false;
            } else {
                setCurrentStep(step);
                setPhId(selectedRecord.id);
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
            case 0: return <PackListSummaryPage key={"securityCheck" + PackingSecurityMenuEnum.PACKINGLIST} packingSecurityMenuEnum={PackingSecurityMenuEnum.PACKINGLIST} onStepChange={onStepChange} />
            case 1: return <PackListPreviewParent summeryDataRecord={selectedSummeryRecord} />
            case 2: return <InspectionPreference summeryDataRecord={selectedSummeryRecord}/>

            // case 2: return <InspectionPreference summeryDataRecord={selectedSummeryRecord} />
            case 3: return <PrintBarCodes summeryDataRecord={selectedSummeryRecord} />
            // case 4: return <SwitchBarcodes />
            case 4: return <PalletPage phId={phId} />
            case 5: return <GRNUnLoadingPage summeryDataRecord={selectedSummeryRecord} />
            case 6: return <PalletRollAllocationPage phId={phId} summeryDataRecord={selectedSummeryRecord} />
            case 7: return <PalletBinMappingPage phId={phId} />
            default: return <></>
        }

    }
    return (<>
        <RouterPrompt type='question' showDialog={showPrompt} confirmNavigation={confirmNavigation} cancelNavigation={cancelNavigation} title="Are you sure you want to exit?" subText="GRN Process will be halted" />
        <Badge.Ribbon text={`${phId ? phId : ''} : ${selectedSummeryRecord ? selectedSummeryRecord.packingListCode : ''}`} color="#faad14">
            <Card size="small" className="card-title-bg-cyan1 pad-0 po-process" bodyStyle={{padding:'10px 10px 0'}}
            // title="Allocation Process" extra={<Button type='default' onClick={() => { onStepChange(0, selectedSummeryRecord) }}>back</Button>}
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
                            title: 'Packing List',
                            status: 'finish',
                            icon: <BookOutlined />,
                        },
                        {
                            title: 'Packing List View',
                            status: 'finish',
                            icon: <EyeOutlined />,
                        },
                        {
                            title: 'Inspection Perference',
                            status: 'process',
                            icon: <IdcardOutlined />,
                        },
                        {
                            title: 'Print Barcodes',
                            status: 'finish',
                            icon: <PrinterOutlined />,
                        },
                        // {
                        //     title: 'Swatch Barcodes',
                        //     status: 'finish',
                        //     icon: <PrinterOutlined />,
                        // },
                        {
                            title: 'Pallet Suggestion',
                            status: 'process',
                            icon: <PartitionOutlined />,
                        },
                        {
                            title: 'GRN Unloading',
                            status: 'finish',
                            icon: <SolutionOutlined />,
                        },
                        // {
                        //     title: 'Suggested Pallet & Rolls ',
                        //     status: 'process',
                        //     icon: <PartitionOutlined />,
                        // },
                        {
                            title: 'Object to Pallet Allocation ',
                            status: 'process',
                            icon: <UngroupOutlined />,
                        },
                        // {
                        //     title: 'Suggested Pallet & Bins ',
                        //     status: 'process',
                        //     icon: <CheckSquareOutlined />,
                        // },
                        {
                            title: 'Pallet to Bin Allocation ',
                            status: 'finish',
                            icon: <ShoppingCartOutlined />,
                        },
                    ]}
                />
                {/* <Divider style={{ margin: '5px 0' }} /> */}

            </Card>
            <br/>
            {renderComponents(currentStep)}

        </Badge.Ribbon>

    </>)
}
export default GrnAllocationPage;