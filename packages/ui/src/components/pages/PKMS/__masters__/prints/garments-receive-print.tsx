import { Button } from "antd";

interface GarmentItem {
    size: string;
    qty: number;
    cartons: number;
}

interface GarmentsReport {
    floor: string;
    date: string;
    buyer: string;
    poCountry: string;
    style: string;
    color: string;
    data: GarmentItem[];
}

const garmentsData: GarmentItem[] = [
    { size: "XS", qty: 60, cartons: 50 },
    { size: "S", qty: 56, cartons: 50 },
    { size: "M", qty: 50, cartons: 50 },
    { size: "L", qty: 96, cartons: 50 },
    { size: "XL", qty: 9, cartons: 50 },
];

const garmentsReport: GarmentsReport = {
    floor: "DAWN",
    date: "12/12/2024",
    buyer: "H&M",
    poCountry: "216947",
    style: "COLISTA",
    color: "Navy",
    data: garmentsData,
};

export const GarmentsReportPrint = () => {
    const handlePrint = () => {
        const invoiceContent = document.getElementById("garments-report");
        if (invoiceContent) {
            const devContent = invoiceContent.innerHTML;
            const printWindow = window.open("", "PRINT", "height=900,width=1600");

            printWindow.document.write(`
                <html>
                    <head>
                        <style>
                            @page {
                                size: legal;
                                margin: 20px;
                            }
                            body {
                                margin: 0;
                                transform: scale(1);
                                transform-origin: top center;
                                width: 100%;
                            }
                            @media print {
                                .delivery-challan, .garments-report {
                                    page-break-after: always;
                                }
                                .garments-report:last-of-type {
                                    page-break-after: auto;
                                }
                            }
                        </style>
                    </head>
                    <body>${devContent}</body>
                </html>
            `);

            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000);
        }
    };

    const totalQty = garmentsData.reduce((sum, item) => sum + item.qty, 0);
    const totalCartons = garmentsData.reduce((sum, item) => sum + item.cartons, 0);

    return (
        <div>
            <Button
                style={{ marginLeft: "95%" }}
                type="primary"
                onClick={handlePrint}
            >
                Print
            </Button>
            <div
                id="garments-report"
                style={{
                    fontFamily: "Arial, sans-serif",
                    margin: "20px",
                    padding: "10px",
                }}
            >
                <h3 style={{ textAlign: "center", margin: "0" }}>
                    GARMENTS RECEIVE NOTE- CARTONS/ HANGING
                </h3>
                <h3 style={{ textAlign: "center", margin: "0" }}>
                    SQ CELSIUS LTD - UNITS 2
                </h3>
                <div style={{ padding: "20px" }}>
                    {/* Information Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold", width: "50%" }}>
                                    Floor:
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {garmentsReport.floor}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold", width: "50%" }}>
                                    Date:
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {garmentsReport.date}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>
                                    Buyer:
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {garmentsReport.buyer}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>
                                    PO / Country:
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {garmentsReport.poCountry}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>
                                    Style:
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {garmentsReport.style}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>
                                    Color:
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {garmentsReport.color}
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", backgroundColor: "#f2f2f2" }}>
                                    SIZE
                                </th>
                                {garmentsReport.data.map((item, index) => (
                                    <th key={index} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", backgroundColor: "#f2f2f2" }}>
                                        {item.size}
                                    </th>
                                ))}
                                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", backgroundColor: "#f2f2f2" }}>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    Qty (pcs)
                                </td>
                                {garmentsReport.data.map((item, index) => (
                                    <td key={index} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        {item.qty}
                                    </td>
                                ))}
                                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", backgroundColor: "#f2f2f2" }}>
                                    {totalQty}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    No of Cartons
                                </td>
                                {garmentsReport.data.map((item, index) => (
                                    <td key={index} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        {item.cartons}
                                    </td>
                                ))}
                                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", backgroundColor: "#f2f2f2" }}>
                                    {totalCartons}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "80px" }}>
                        <div style={{ textAlign: "center" }}>
                            <strong>Delivered by: Incharge / Supervisor - Packing</strong>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <strong>Received by: Officer - Finished Goods Warehouse</strong>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <strong>Checked by: Security</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GarmentsReportPrint;
