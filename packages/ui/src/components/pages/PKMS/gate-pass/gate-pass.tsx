import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import './gate-pass.css'
import { GatePassServices } from '@xpparel/shared-services';
import { CommonRequestAttrs, GatePassReqDto } from '@xpparel/shared-models';
import { useAppSelector } from 'packages/ui/src/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Iprops {
    gatePassId?: number
}

export const GatePassPdf = (props: Iprops) => {
    const { gatePassId } = props
    const service = new GatePassServices()
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [daata, setData] = useState<any[]>()

    useEffect(() => {
        getGatePassData(gatePassId)
    }, [gatePassId])

    const getGatePassData = (gatePassId: number) => {
        const req = new GatePassReqDto(userName, orgData.unitCode, orgData.companyCode, userId, gatePassId)
        service.getGatePassData(req).then((res) => {
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        }).catch(err => console.log(err))
    }


    const printToPdf = () => {
        const input = document.getElementById('pdf-content');
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 190;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 10;
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('GatePass.pdf');
            });
        }
    };


    const Tabledata = [
        {
            slno: 1,
            articleName: 'Pack Complex Sweater',
            color: 'green',
            size: '1A',
            remarks: 'Exported By Sea',
            unit: 'PCS',
            qty: 2898,
        },
        {
            slno: 2,
            articleName: 'Pack Complex Sweater',
            color: 'green',
            size: '1A',
            remarks: 'Exported By Sea',
            unit: 'PCS',
            qty: 2898,
        },
        {
            slno: 3,
            articleName: 'Pack Complex Sweater',
            color: 'green',
            size: '1A',
            remarks: 'Exported By Sea',
            unit: 'PCS',
            qty: 2898,
        },
    ];

    const data = {
        from: 'SQCL-2 FINISHED GOODS STORE',
        to: 'Excel Freight',
        gatePass: 'D-CELSIUSFINISHEDGOODSS',
        createdDate: '12/5/2024 3:58:49PM',
        transferOutOfSystem: '',
        nonReturnable: '',
        remarks: 'Exported By Sea',
        createdBy: 'Factory Gate Pass SQCL',
        firstApproval: 'Ripon Miah(GM Operations SQ Celsius Ltd Unit2)',
        finalApproval: 'Ripon Miah(GM Operations SQ Celsius Ltd Unit2)',
        buyer: 'Express',
        style: '29600696',
        po: '717419',
        color: 'INK BLOT',
        vehicleNo: 'CM TA 11-0212',
        driverName: 'Mr.Raju',
        lcNo: '00001/CG-20466780',
        challanNo: '30814',
        lockNo: '137813',
        mo: ' 01812-426281',
        receivedBy: 'Mr.Raju'
    };
    const ttl = []
    const renderHtmlTable = () => {
        const totalQty = Tabledata.reduce((ttl, row) => ttl + (row.qty || 0), 0)
        ttl.push(totalQty)
        return (
            <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: 'lightgrey', padding: '8px', textAlign: 'left' }}>S.No</th>
                        <th style={{ backgroundColor: 'lightgrey', padding: '8px', textAlign: 'left' }}>Article Name</th>
                        <th style={{ backgroundColor: 'lightgrey', padding: '8px', textAlign: 'left' }}>Color</th>
                        <th style={{ backgroundColor: 'lightgrey', padding: '8px', textAlign: 'left' }}>Size</th>
                        <th style={{ backgroundColor: 'lightgrey', padding: '8px', textAlign: 'left' }}>Remarks</th>
                        <th style={{ backgroundColor: 'lightgrey', padding: '8px', textAlign: 'left' }}>Unit</th>
                        <th style={{ backgroundColor: 'lightgrey', padding: '8px', textAlign: 'left' }}>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {Tabledata.map((row, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px' }}>{row.slno}</td>
                            <td style={{ padding: '8px' }}>{row.articleName}</td>
                            <td style={{ padding: '8px' }}>{row.color}</td>
                            <td style={{ padding: '8px' }}>{row.size}</td>
                            <td style={{ padding: '8px' }}>{row.remarks}</td>
                            <td style={{ padding: '8px' }}>{row.unit}</td>
                            <td style={{ padding: '8px' }}>{row.qty}</td>
                        </tr>
                    ))}
                    <tr>
                        <td style={{ padding: '8px', fontWeight: 'bold', textAlign: 'right' }} colSpan={6}>Total Qty</td>
                        <td>{totalQty}</td>
                    </tr>
                </tbody>
            </table>
        )
    };

    return (
        <div>
            <Card
                extra={
                    <Button
                        type="default"
                        style={{ color: '#047595', backgroundColor: '#e8dbdb' }}
                        icon={<FilePdfOutlined style={{ color: 'red' }} />}
                        onClick={printToPdf}
                    >
                        Pdf Download
                    </Button>
                }
            >
                <div id="pdf-content">
                    {/* <div id={daata.id}>  */}
                    <h3 style={{ textAlign: 'center', margin: '20px 0' }}>
                        <strong><u>GATE PASS - CUSTOMER COPY</u></strong>
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '80px', marginBottom: '20px' }}>
                        <div style={{ marginLeft: '40px' }}>
                            <p>  FROM :  {data.from} </p>
                            <p>  TO :  {data.to} </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p>  Gate Pass :  {data.gatePass} </p>
                            <p>  Created Date :  {data.createdDate} </p>
                            <p>  Transfer Out Of System : {data.transferOutOfSystem} </p>
                            <p>  Non-Returnable :  {data.nonReturnable} </p>
                        </div>
                    </div>
                    {renderHtmlTable()}
                    <div style={{ marginLeft: '400px' }}>
                        <div>
                            <p><strong>Remarks</strong></p>
                        </div>
                        <div className='box'>
                            <div><strong style={{marginLeft:'20px'}}>Buyer#</strong> {data.buyer}<strong style={{marginLeft:'40px'}}>Style#</strong> {data.style}<strong style={{marginLeft:'50px'}}>PO#</strong> {data.po}
                                <strong style={{marginLeft:'40px'}}>Color#</strong> {data.color}<strong style={{marginLeft:'40px'}}>Challan No#</strong> {data.challanNo}<strong style={{marginLeft:'40px'}}>qty#</strong>{ttl}<br></br><strong style={{marginLeft:'20px'}}>Lock No#</strong> {data.lockNo} 
                                <strong style={{marginLeft:'20px'}}>Vehicle No#</strong> {data.vehicleNo}<strong style={{marginLeft:'20px'}}>LC No#</strong> {data.lcNo}<br></br><strong style={{marginLeft:'20px'}}>MO#</strong> {data.mo}
                                <strong style={{marginLeft:'20px'}}>Received By#</strong> {data.receivedBy}
                            </div>

                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                        <div style={{ marginLeft: '20px' }}>
                            <p>{data.createdBy}</p>
                            <strong><u>Created By</u></strong>
                        </div>
                        <div style={{ marginRight: '30px' }}>
                            <p>{data.firstApproval}</p>
                            <strong><u>First Approval</u></strong></div>
                        <div style={{ marginRight: '20px' }}>
                            <p>{data.finalApproval}</p>
                            <strong><u>Final Approval</u></strong></div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default GatePassPdf;
