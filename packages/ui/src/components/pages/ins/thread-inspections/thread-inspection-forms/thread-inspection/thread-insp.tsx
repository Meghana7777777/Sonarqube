import { FilePdfOutlined } from '@ant-design/icons';
import { InsFabricInspectionRequestCategoryEnum, InsInspectionFinalInSpectionStatusEnum, InsIrIdRequest, InsRollBarcodeInspCategoryReq, InsSpoolBarcodeInspCategoryReq, ThreadInsBasicInspectionRequest, ThreadTypeEnum, ThreadTypeEnumDisplayValue } from '@xpparel/shared-models';
import { FabricInspectionInfoService, ThreadInspectionInfoService } from '@xpparel/shared-services';
import { Badge, Descriptions, Progress, Table, Tag } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { defaultDateFormat } from 'packages/ui/src/components/common/data-picker/date-picker';
import { ScxButton, ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useState } from 'react';
import { CommonInfoService } from '../../../common-info.service';

interface InspProps {
    inspReqId: number
}
const InspectionTable = (props: InspProps) => {
    const fourPointInspectionId = 'fourPointInspectionId';
    const { inspReqId } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const inspectionInfoService = new FabricInspectionInfoService();
    const [fourPointInspectionDetails, setFourPointInspectionDetails] = useState<ThreadInsBasicInspectionRequest>(null);
    const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [stateCounter, setStateCounter] = useState<number>(0);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    const threadInspectionInfoService = new ThreadInspectionInfoService();

    useEffect(() => {
        inspReqId ? getFourPointInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, inspReqId, null) : null
        return (() => {
            setFourPointInspectionDetails(null);
        })
    }, [stateCounter]);

    const getFourPointInspectionDetailsForRoll = (e) => {
        console.log(e);
        const rollBarcode = e;
        setBarcodeVal(rollBarcode);
        return getFourPointInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
    }

    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        getFourPointInspectionDetailsForRoll(val.trim());
    }

    const getFourPointInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
        if (inspReqId) {
            console.log('coming here');
            const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId);
            threadInspectionInfoService.getThreadInspectionDetailsForRequestId(reqObj, true).then((res) => {
                if (res.status) {
                    modifyAndSetInspectionData(res.data.basicInsInfo);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            });
        } else if (rollBarcode) {
            const reqObj = new InsSpoolBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, ThreadTypeEnum.THREADINS);
            threadInspectionInfoService.getInspectionDetailForSpoolIdAndInspCategory(reqObj, true).then((res) => {
                if (res.status) {
                    setBarcodeVal('');
                    setManualBarcodeVal('');
                    modifyAndSetInspectionData(res.data.basicInsInfo);
                } else {
                    setBarcodeVal('');
                    setManualBarcodeVal('');
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            });
        }
    }

    const modifyAndSetInspectionData = (inspDetails: ThreadInsBasicInspectionRequest) => {
        const inspectedDate: any = moment(inspDetails?.inspectionHeader?.inspectedDate);
        inspDetails.inspectionHeader.inspectedDate = inspDetails?.inspectionHeader?.inspectedDate ? inspectedDate : null;

        const expCompletedDate: any = moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt);
        inspDetails.inspectionHeader.expInspectionCompleteAt = inspDetails?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

        const startDate: any = moment(inspDetails?.inspectionHeader?.inspectionStart);
        inspDetails.inspectionHeader.inspectionStart = inspDetails?.inspectionHeader?.inspectionStart ? startDate : null;

        const completedDate: any = moment(inspDetails?.inspectionHeader?.inspectionCompleteAt);
        inspDetails.inspectionHeader.inspectionCompleteAt = inspDetails?.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

        inspDetails.inspectionHeader.inspector = inspDetails.inspectionHeader.inspector ? inspDetails.inspectionHeader.inspector : user?.userName;
        setFourPointInspectionDetails(old => inspDetails);
        inspDetails?.inspectionHeader?.expInspectionCompleteAt ? setDaysRemaining(calculateDateDifference(new Date(), new Date(moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt).format(defaultDateFormat)))) : null;

        const totalNoOfRolls = inspDetails.inspectionRollDetails.length;
        const totalInspOpenRolls = inspDetails.inspectionRollDetails.filter(eachRoll => eachRoll.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN);
        const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
        const percentage = Math.ceil((totalInspRolls / totalNoOfRolls) * 100);
        setInspCompPercentage(percentage);
    }

    const calculateDateDifference = (date1, date2) => {
        const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        // Convert input dates to Date objects if they are not already
        const startDate: any = new Date(date1);
        const endDate: any = new Date(date2);
        // Calculate the difference in days
        const timeDifference = endDate - startDate;
        const daysDifference = Math.round(timeDifference / oneDay);
        return daysDifference;
    }

    const generateAndDownloadPDF = async () => {
        const element = document.getElementById(fourPointInspectionId);
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');
        let imgWidth = 210;
        let pageHeight = 295;
        const pdf = new jsPDF('p', 'mm');
        let position = 0;
        const imgProperties = pdf.getImageProperties(data);
        const pdfHeight = (imgProperties.height * imgWidth) / imgProperties.width;
        let heightLeft = pdfHeight;
        pdf.addImage(data, 'PNG', 0, position, imgWidth, pdfHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(data, 'PNG', 0, position, imgWidth, pdfHeight);
            heightLeft -= pageHeight;
        }
        pdf.save('Thread inspection.pdf');
    };


    const columns = [
        {
            title: 'At Meter',
            dataIndex: 'atMeter',
            key: 'atMeter',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Four Points',
            dataIndex: 'points',
            key: 'points',
        },
        {
            title: 'Final Points',
            dataIndex: 'points',
            key: 'points',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
    ];

   
    return (
        <div id="fourPointInspectionId">
            <ScxCard
                extra={<ScxButton icon={<FilePdfOutlined style={{ fontSize: '15px' }} />} onClick={() => generateAndDownloadPDF()}>
                    Download PDF
                </ScxButton>}>
                <Descriptions bordered title='Thread inspection '>
                    {fourPointInspectionDetails?.inspectionHeader?.headerAttributes.map((data, index) => (
                        <Descriptions.Item key={index} label={<b>{data.attributeName}</b>}>
                            {data.attributeValue}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
                <br />
                <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection Request Id:{fourPointInspectionDetails?.inspectionHeader?.inspectionReqId}</span>} color="red"  >
                    <ScxCard size='small' title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>Header Info</span><span style={{ width: "10%" }}>Inspection type :<b>{ThreadTypeEnumDisplayValue[fourPointInspectionDetails?.inspectionHeader?.inspRequestCategory]}</b></span><Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" /></div>}>
                        <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>

                            <Descriptions.Item label={<b>{'Batch No'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.batchNo}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Batch Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.batchQty} Mts.</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Total Batch Spools'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.totalNoOfBatchRolls}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspection Percentage'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.inspectionPercentage}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspection Spools'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.totalNoOfRequestRolls}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspection Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.inspectionQty}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspected Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.inspectedQty}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Total Inspected Spools'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.totalNoOfInspectedRolls}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Request Creation Date'}</b>}><span>{fourPointInspectionDetails?.inspectionHeader?.inspectedDate ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.inspectedDate)).format(defaultDateFormat) : null}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Request age'}</b>}><span>{CommonInfoService.getRequestAge(new Date(moment(fourPointInspectionDetails?.inspectionHeader?.inspectedDate).format(defaultDateFormat)).toString())}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Status'}</b>}><Tag color={'deeppink'}>
                                {fourPointInspectionDetails?.inspectionHeader?.inspectionStatus}
                            </Tag></Descriptions.Item>
                        </Descriptions>
                    </ScxCard>
                </Badge.Ribbon>
                <Descriptions bordered>
                    <Descriptions.Item label={<b>Inspector</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspector}</Descriptions.Item>
                    <Descriptions.Item label={<b>Exp Completion Date</b>}>{fourPointInspectionDetails?.inspectionHeader?.expInspectionCompleteAt ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.expInspectionCompleteAt)).format(defaultDateFormat) : null}</Descriptions.Item>
                    <Descriptions.Item label={<b>Area</b>}>{''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Start Date</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspectedDate ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.inspectedDate)).format(defaultDateFormat) : null}</Descriptions.Item>
                    <Descriptions.Item label={<b>Completion Date</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspectionCompleteAt ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.inspectionCompleteAt)).format(defaultDateFormat) : null}</Descriptions.Item>
                    <Descriptions.Item label={<b>Status</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspectionStatus}</Descriptions.Item>
                </Descriptions>
                <br />
                <div>
                    {fourPointInspectionDetails?.inspectionRollDetails.map((data, index) => (
                        <div key={index}>
                            <Descriptions bordered>
                                <Descriptions.Item label={<b>Roll No</b>}>{data.externalRollNo}</Descriptions.Item>
                                <Descriptions.Item label={<b>Roll Barcode</b>}>{data.barcode}</Descriptions.Item>
                                <Descriptions.Item label={<b>Shade</b>}>{data.sShade}</Descriptions.Item>
                                <Descriptions.Item label="Roll length(yard)">{100}</Descriptions.Item>
                                <Descriptions.Item label="Roll width(inch)">{100}</Descriptions.Item>
                                <Descriptions.Item label="Roll length(mtr)">{data.rollQty}</Descriptions.Item>
                                <Descriptions.Item label="Roll width(cm)">{data.measuredRollWidth}</Descriptions.Item>
                                <Descriptions.Item label="Result">{''}</Descriptions.Item>
                                <Descriptions.Item label="Suggestion">{''}</Descriptions.Item>
                                <Descriptions.Item label={<b>Inspection Result</b>}>{data.rollInsResult}</Descriptions.Item>
                                <Descriptions.Item label={<b>Final Inspection Result</b>}>{data.rollFinalInsResult}</Descriptions.Item>
                            </Descriptions>
                            <br />
                            <Table
                                columns={columns}
                                dataSource={data.fourPointInspection}
                                pagination={false}
                                size="middle"
                            />
                        </div>
                    ))}
                </div>
            </ScxCard>
        </div>
    )
}
export default InspectionTable;
