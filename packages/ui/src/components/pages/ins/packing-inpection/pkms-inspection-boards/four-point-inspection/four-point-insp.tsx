import { FilePdfOutlined } from '@ant-design/icons';
import { InsBasicInspectionRequest } from '@xpparel/shared-models';
import { Badge, Descriptions, Progress, Table, Tag } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { defaultDateFormat } from 'packages/ui/src/components/common/data-picker/date-picker';
import { ScxButton, ScxCard } from 'packages/ui/src/schemax-component-lib';
import { useEffect, useRef, useState } from 'react';
import { CommonInfoService } from '../../../common-info.service';

interface InspProps {
    inspReqId: number
}
const PKMSInspectionTable = (props: InspProps) => {
    const fourPointInspectionId = 'fourPointInspectionId';
    const { inspReqId } = props;
      const user = useAppSelector((state) => state.user.user.user);
    const [fourPointInspectionDetails, setFourPointInspectionDetails] = useState<InsBasicInspectionRequest>(null);
    const [inspCompPercentage, setInspCompPercentage] = useState<number>(0);
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [stateCounter, setStateCounter] = useState<number>(0);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();

 

  
 
  
 

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
        pdf.save('Four point inspection.pdf');
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
                <Descriptions bordered title='Four point inspection '>
                    {fourPointInspectionDetails?.inspectionHeader?.headerAttributes.map((data, index) => (
                        <Descriptions.Item key={index} label={<b>{data.attributeName}</b>}>
                            {data.attributeValue}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
                <br />
                <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection request id:{fourPointInspectionDetails?.inspectionHeader?.inspectionReqId}</span>} color="red"  >
                    <ScxCard size='small' title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>Header Info</span><span style={{ width: "10%" }}>Inspection type :<b>{fourPointInspectionDetails?.inspectionHeader?.inspRequestCategory}</b></span><Progress style={{ width: "10%" }} percent={inspCompPercentage} status="active" /></div>}>
                        <Descriptions size='small' bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>

                            <Descriptions.Item label={<b>{'Batch no'}</b>} className='inspection-info1'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.batchNo}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Batch Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.batchQty} Mts.</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Total Batch Cartons'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.totalNoOfBatchRolls}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspection Percentage'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.inspectionPercentage}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspection rolls'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.totalNoOfRequestRolls}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspection Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.inspectionQty}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Inspected Qty'}</b>} className='inspection-info1-qty'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.inspectedQty}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Total inspected rolls'}</b>} className='inspection-info1-no'><span style={{ color: "black" }}>{fourPointInspectionDetails?.inspectionHeader?.totalNoOfInspectedRolls}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Request creation date'}</b>}><span>{fourPointInspectionDetails?.inspectionHeader?.inspectedDate ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.inspectedDate)).format(defaultDateFormat) : null}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Request age'}</b>}><span>{CommonInfoService.getRequestAge(new Date(moment(fourPointInspectionDetails?.inspectionHeader?.inspectedDate).format(defaultDateFormat)).toString())}</span></Descriptions.Item>

                            <Descriptions.Item label={<b>{'Status'}</b>}><Tag color={'deeppink'}>
                                {fourPointInspectionDetails?.inspectionHeader?.inspectionStatus}
                            </Tag></Descriptions.Item>
                        </Descriptions>
                    </ScxCard>
                </Badge.Ribbon>
                <Descriptions bordered>
                    <Descriptions.Item label={<b>Inspector</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspector}</Descriptions.Item>
                    <Descriptions.Item label={<b>Exp Completion date</b>}>{fourPointInspectionDetails?.inspectionHeader?.expInspectionCompleteAt ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.expInspectionCompleteAt)).format(defaultDateFormat) : null}</Descriptions.Item>
                    {/* todo: */}
                    {/* <Descriptions.Item label={<b>Area</b>}>{ }</Descriptions.Item> */}
                    <Descriptions.Item label={<b>Start date</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspectedDate ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.inspectedDate)).format(defaultDateFormat) : null}</Descriptions.Item>
                    <Descriptions.Item label={<b>Completion date</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspectionCompleteAt ? moment(new Date(fourPointInspectionDetails?.inspectionHeader?.inspectionCompleteAt)).format(defaultDateFormat) : null}</Descriptions.Item>
                    <Descriptions.Item label={<b>Status</b>}>{fourPointInspectionDetails?.inspectionHeader?.inspectionStatus}</Descriptions.Item>
                </Descriptions>
                <br />
                <div>
                    {fourPointInspectionDetails?.inspectionRollDetails.map((data, index) => (
                        <div key={index}>
                            <Descriptions bordered>
                                <Descriptions.Item label={<b>Carton No</b>}>{data.externalRollNo}</Descriptions.Item>
                                <Descriptions.Item label={<b>Carton Barcode</b>}>{data.barcode}</Descriptions.Item>
                                <Descriptions.Item label={<b>Shade</b>}>{data.sShade}</Descriptions.Item>
                                <Descriptions.Item label="Carton length(yard)">{100}</Descriptions.Item>
                                <Descriptions.Item label="Carton width(inch)">{100}</Descriptions.Item>
                                <Descriptions.Item label="Carton length(mtr)">{data.rollQty}</Descriptions.Item>
                                <Descriptions.Item label="Carton width(cm)">{data.measuredRollWidth}</Descriptions.Item>
                                {/* todo: */}
                                {/* <Descriptions.Item label="Result">{ }</Descriptions.Item> */}
                                {/* <Descriptions.Item label="Suggestion">{ }</Descriptions.Item> */}
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
export default PKMSInspectionTable;
