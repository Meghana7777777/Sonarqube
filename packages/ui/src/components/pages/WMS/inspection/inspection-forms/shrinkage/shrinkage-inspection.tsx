import { FilePdfOutlined } from '@ant-design/icons';
import { Badge, Card, Descriptions, Progress, Tag } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ScxButton, ScxCard } from 'packages/ui/src/schemax-component-lib';

export const ShrinkageInspection = () => {
    const shrinkageInspId = 'shrinkageInspId';
    const generateAndDownloadPDF = async () => {
        const element = document.getElementById(shrinkageInspId);
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

    return (
        <div id="shrinkageInspId">
            <ScxCard
                extra={<ScxButton icon={<FilePdfOutlined style={{ fontSize: '15px' }} />} onClick={() => generateAndDownloadPDF()}>
                    Download PDF
                </ScxButton>}>
                <Descriptions bordered title="Four point inspection">
                    <Descriptions.Item label={<b>Style No</b>}>{ ''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Style Desc</b>}>{ ''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Customer Style</b>}>{ ''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Buyer</b>}>{'' }</Descriptions.Item>
                    <Descriptions.Item label={<b>Color</b>}>{ ''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Supplier</b>}>{'' }</Descriptions.Item>
                    <Descriptions.Item label={<b>Fabric Desc</b>}>{ ''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Invoice No</b>}>{'' }</Descriptions.Item>
                    <Descriptions.Item label={<b>Po No</b>}>{ ''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Packing List No</b>}>{ ''}</Descriptions.Item>
                </Descriptions>
                <br />
                <Badge.Ribbon text={<span style={{ textAlign: "left" }}>Inspection request id: { }</span>} color="red"  >
                    <ScxCard size='small' title={<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}><span style={{ width: "10%" }}>Header Info</span><span style={{ width: "10%" }}>Inspection type : <b>{ }</b></span><Progress style={{ width: "10%" }} percent={20} status="active" /></div>}>
                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Batch No</b>}>{'' }</Descriptions.Item>
                            <Descriptions.Item label={<b>Batch Qty</b>}>{ ''}</Descriptions.Item>
                            <Descriptions.Item label={<b>Total Batch Objects</b>}>{'' }</Descriptions.Item>
                            <Descriptions.Item label={<b>Inspection Percentage</b>}>{ ''}</Descriptions.Item>
                            <Descriptions.Item label={<b>Inspection Objects </b>}>{ ''}</Descriptions.Item>
                            <Descriptions.Item label={<b>Inspection Qty</b>}>{ ''}</Descriptions.Item>
                            <Descriptions.Item label={<b>Inspected Qty</b>}>{'' }</Descriptions.Item>
                            <Descriptions.Item label={<b>Total Inspected Objects</b>}>{ ''}</Descriptions.Item>
                            <Descriptions.Item label={<b>Request Creation Date</b>}>{ ''}</Descriptions.Item>
                            <Descriptions.Item label={<b>Request age</b>}>{'' }</Descriptions.Item>
                            <Descriptions.Item label={<b>Status</b>}><Tag color="#f783aa" style={{ height: '20px' }}>{'open'}</Tag></Descriptions.Item>
                        </Descriptions>
                    </ScxCard>
                </Badge.Ribbon>
                <Descriptions bordered>
                    <Descriptions.Item label={<b>Inspector</b>}>{ ''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Exp Completion date</b>}>{'' }</Descriptions.Item>
                    <Descriptions.Item label={<b>Area</b>}>{'' }</Descriptions.Item>
                    <Descriptions.Item label={<b>Start date</b>}>{''}</Descriptions.Item>
                    <Descriptions.Item label={<b>Completion date</b>}>{'' }</Descriptions.Item>
                    <Descriptions.Item label={<b>Status</b>}>{'' }</Descriptions.Item>
                </Descriptions>
                <br />
                <Card title='Object Level Inspection'>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <tr>
                            <th className='tble'>Object No</th>
                            <th className='tble'>Barcode</th>
                            <th className='tble'>Lot Number</th>
                            <th className='tble'>Object Qty</th>
                        </tr>
                        <tr>
                            <td className='tbledata'></td>
                        </tr>
                        <tr>
                            <td className='tbledata'></td>
                        </tr>
                        <tr>
                            <td className='tbledata'></td>
                        </tr>
                    </table>
                    <Descriptions bordered >
                        <Descriptions.Item label={<b>Inspection Result</b>}>{''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Final Inspection Result</b>}>{''}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </ScxCard>
        </div>
    )
}
