import { FilePdfOutlined } from '@ant-design/icons';
import { InsFabricInspectionRequestCategoryEnum, InsIrIdRequest, InsLabInspectionRequest, InsRollBarcodeInspCategoryReq } from '@xpparel/shared-models';
import { FabricInspectionInfoService } from '@xpparel/shared-services';
import { Badge, Descriptions, Progress, Table, Tag } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { ScxButton, ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../../common';
import { defaultDateFormat } from '../../../../common/data-picker/date-picker';

interface ILabInspectionProps {
    inspReqId: number
}
export const LabInspection = (props: ILabInspectionProps) => {
    const labInspectionId = 'labInspectionId';
    const { inspReqId } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const inspectionInfoService = new FabricInspectionInfoService();
    const [labInspDetails, setLabInspectionDetails] = useState<InsLabInspectionRequest>(null);
    const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [stateCounter, setStateCounter] = useState<number>(0);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    const data = labInspDetails?.inspectionRollDetails || [];

    useEffect(() => {
        console.log(inspReqId);
        inspReqId ? getLabInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, inspReqId, null) : null
    }, [stateCounter]);

    const getLabInspDetailsByRollBarcode = (e) => {
        console.log(e);
        const rollBarcode = e;
        return getLabInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
    }

    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        getLabInspDetailsByRollBarcode(val.trim());
    }

    const getLabInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
        if (inspReqId) {
            const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId);
            inspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
                if (res.status) {
                    setLabInspDetails(res.data.labInsInfo)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            });
        }
        if (rollBarcode) {
            const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION);
            inspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
                if (res.status) {
                    setBarcodeVal('');
                    setManualBarcodeVal('');
                    setLabInspDetails(res.data.labInsInfo)
                } else {
                    setBarcodeVal('');
                    setManualBarcodeVal('');
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            });
        }

    }

    const setLabInspDetails = (inspDetails: InsLabInspectionRequest) => {
        const inspectedDate: any = moment(inspDetails?.inspectionHeader?.inspectedDate);
        inspDetails.inspectionHeader.inspectedDate = inspDetails?.inspectionHeader?.inspectedDate ? inspectedDate : null;

        const expCompletedDate: any = moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt);
        inspDetails.inspectionHeader.expInspectionCompleteAt = inspDetails?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

        const startDate: any = moment(inspDetails?.inspectionHeader?.inspectionStart);
        inspDetails.inspectionHeader.inspectionStart = inspDetails?.inspectionHeader?.inspectionStart ? startDate : null;

        const completedDate: any = moment(inspDetails?.inspectionHeader?.inspectionCompleteAt);
        inspDetails.inspectionHeader.inspectionCompleteAt = inspDetails?.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

        inspDetails.inspectionHeader.inspector = inspDetails.inspectionHeader.inspector ? inspDetails.inspectionHeader.inspector : user?.userName;

        setLabInspectionDetails(inspDetails);

        inspDetails?.inspectionHeader?.expInspectionCompleteAt ? setDaysRemaining(calculateDateDifference(new Date(), new Date(moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt).format(defaultDateFormat)))) : null;
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
        const element = document.getElementById(labInspectionId);
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
        pdf.save('Lab inspection.pdf');
    };

    const columns = [
        { title: 'Object Id', dataIndex: 'rollId', key: 'rollId' },
        { title: 'Object No', dataIndex: 'externalRollNo', key: 'externalRollNo' },
        { title: 'Bar Code', dataIndex: 'barcode', key: 'barcode' },
        { title: 'Lot Number', dataIndex: 'lotNumber', key: 'lotNumber' },
        { title: 'Object Qty', dataIndex: 'rollQty', key: 'rollQty' },
        { title: 'Supplier GSM', dataIndex: 'sGsm', key: 'supplierGSM' },
        { title: 'Actual GSM', dataIndex: 'gsm', key: 'actualGSM' },
        { title: 'Variance Value', dataIndex: 'varianceValue', key: 'varianceValue' },
        { title: 'Tolerence from', dataIndex: 'toleranceFrom', key: 'tolerenceFrom' },
        { title: 'Tolerence to', dataIndex: 'toleranceTo', key: 'tolerenceTo' },
        { title: 'Inspection result', dataIndex: 'rollInsResult', key: 'inspectionResult' },
        { title: 'Final inspection Result', dataIndex: 'rollFinalInsResult', key: 'rollFinalInsResult' },
        { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
    ];
    console.log(inspReqId, 'inspReqId')
    return (
        <div>
            <ScxCard
                extra={<ScxButton icon={<FilePdfOutlined style={{ fontSize: '15px' }} />} onClick={() => generateAndDownloadPDF()}>
                    Download PDF
                </ScxButton>}
            >
                <div id="labInspectionId">
                    <Descriptions bordered title="Lab inspection">
                        <Descriptions.Item label={<b>Style No</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Style Desc</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Customer Style</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Buyer</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Color</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Supplier</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Fabric Desc</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Invoice No</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Po No</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Packing List No</b>}>{ ''}</Descriptions.Item>
                    </Descriptions>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection request id: { }</span>} color="red">
                            <ScxCard style={{ width: '800px' }} title={
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                                    <span style={{ width: "10%" }}>Header Info</span>
                                    <span style={{ width: "10%" }}>Inspection type : <b>{ }</b></span>
                                    <Progress style={{ width: "10%" }} percent={20} status="active" />
                                </div>
                            }>
                                <Descriptions bordered>
                                    <Descriptions.Item label={<b>Batch No</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Batch Qty</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Total Batch Objects</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspection Percentage</b>}>{'' }</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspection Objects </b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspection Qty</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspected Qty</b>}>{'' }</Descriptions.Item>
                                    <Descriptions.Item label={<b>Total Inspected Objects</b>}>{'' }</Descriptions.Item>
                                    <Descriptions.Item label={<b>Request Creation Date</b>}>{'' }</Descriptions.Item>
                                    <Descriptions.Item label={<b>Request age</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Status</b>}><Tag color="#f783aa" style={{ height: '20px' }}>{'open'}</Tag></Descriptions.Item>
                                </Descriptions>
                            </ScxCard>
                        </Badge.Ribbon>
                        <ScxCard title="Inspection result level abstract"
                            style={{ width: '300px' }}
                        >
                            <table style={{ borderCollapse: 'collapse', width: '100%' }} >
                                <tr>
                                    <th className='tble'>Inspection result</th>
                                    <th className='tble'>No Of rolls</th>
                                    <th className='tble'>Remarks</th>
                                </tr>
                            </table>
                        </ScxCard>
                    </div>
                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Inspector</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Exp Completion date</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Area</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Start date</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Completion date</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Status</b>}>{'' }</Descriptions.Item>
                    </Descriptions>
                    <br />
                    <ScxCard title="Object level inspection">
                        {data.map((data, index) => (
                            <div key={index}>
                                <Table
                                    columns={columns}
                                    dataSource={[data]}
                                    pagination={false}
                                    size="middle"
                                />
                            </div>
                        ))}
                    </ScxCard>
                </div>
            </ScxCard>
        </div>
    )
}
