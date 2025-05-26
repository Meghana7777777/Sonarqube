import { FilePdfOutlined } from '@ant-design/icons'
import { Badge, Descriptions, Progress, Tag } from 'antd'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ScxButton, ScxCard } from 'packages/ui/src/schemax-component-lib'

export const RelaxationInspection = () => {
    const labInspection = 'labInspection';

    const generateAndDownloadPDF = async () => {
        const element = document.getElementById(labInspection);
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
        pdf.save('Relaxation inspection.pdf');
    };

    return (
        <div>
            <ScxCard
                extra={<ScxButton icon={<FilePdfOutlined style={{ fontSize: '15px' }} />} onClick={() => generateAndDownloadPDF()}>
                    Download PDF
                </ScxButton>}
            >
                <div id="labInspection">
                    <Descriptions bordered title="Lab inspection">
                        <Descriptions.Item label={<b>Style No</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Style Desc</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Customer Style</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Buyer</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Color</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Supplier</b>}>{'' }</Descriptions.Item>
                        <Descriptions.Item label={<b>Fabric Desc</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Invoice No</b>}>{'' }</Descriptions.Item>
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
                                    <Descriptions.Item label={<b>Batch No</b>}>{'' }</Descriptions.Item>
                                    <Descriptions.Item label={<b>Batch Qty</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Total Batch Objects</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspection Percentage</b>}>{'' }</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspection Objects </b>}>{'' }</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspection Qty</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Inspected Qty</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Total Inspected Objects</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Request Creation Date</b>}>{ ''}</Descriptions.Item>
                                    <Descriptions.Item label={<b>Request age</b>}>{'' }</Descriptions.Item>
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
                        <Descriptions.Item label={<b>Inspector</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Exp Completion date</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Area</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Start date</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Completion date</b>}>{ ''}</Descriptions.Item>
                        <Descriptions.Item label={<b>Status</b>}>{ ''}</Descriptions.Item>
                    </Descriptions>
                    <br />
                    <ScxCard title="Object level inspection">
                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <tr>
                                <th className='tble'>Object Id</th>
                                <th className='tble'>Object No</th>
                                <th className='tble'>Bar Code </th>
                                <th className='tble'>Lot Number</th>
                                <th className='tble'>Object Qty</th>
                                <th className='tble'>Supplier length</th>
                                <th className='tble'>Actual length</th>
                                <th className='tble'>No Of joins</th>
                                <th className='tble'>Supplier width </th>
                                <th className='tble'>Start width</th>
                                <th className='tble'>Min width</th>
                                <th className='tble'>End width</th>
                                <th className='tble'>Min width</th>
                                <th className='tble'>Inspection result</th>
                                <th className='tble'>Final inspection result</th>
                                <th className='tble'>Remarks</th>
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
                    </ScxCard>
                </div>
            </ScxCard>
        </div>
    )
}
