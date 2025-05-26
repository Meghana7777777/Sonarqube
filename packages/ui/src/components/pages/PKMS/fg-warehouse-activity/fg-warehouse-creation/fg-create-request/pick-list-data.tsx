import { FgWhReqHeaderModel, FgWhSrIdPlIdsRequest, PkmsFgWhReqTypeEnum } from "@xpparel/shared-models";
import { PKMSFgWarehouseService } from "@xpparel/shared-services";
import { Button } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";

interface Props {
    plIds: number[];
    fgWhReqIds: number[]
}

export const PickListDataPrint = ({ plIds, fgWhReqIds }: Props) => {
    const user = useAppSelector((state) => state.user.user.user);
    const pKMSFgWarehouseService = new PKMSFgWarehouseService();
    const [data, setData] = useState<FgWhReqHeaderModel[] | null>(null);



    useEffect(() => {
        renderPrintDetails(plIds, fgWhReqIds);
    }, [plIds, fgWhReqIds]);


    const renderPrintDetails = async (plIds: number[], fgWhReqIds: number[]) => {
        const reqObj = new FgWhSrIdPlIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, plIds, 'Remarks go here', true, true,
            true, true, true, fgWhReqIds,[],[PkmsFgWhReqTypeEnum.IN]);
        try {
            const whInfoForGivenPackList = await pKMSFgWarehouseService.getFgWhInfoForGivenPackListIds(reqObj);
            if (whInfoForGivenPackList.status) {
                setData(whInfoForGivenPackList.data);
            } else {
                setData([])
                AlertMessages.getErrorMessage(whInfoForGivenPackList.internalMessage);
                console.error('Invalid response format:', whInfoForGivenPackList);
            }
        } catch (error) {
            console.error('Error fetching warehouse info:', error);
            throw error;
        }
    };


    const handlePrint = () => {
        const invoiceContent = document.getElementById("deliver-chalan");
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
                .delivery-challan, .gate-pass {
                  page-break-after: always;
                }
                .gate-pass:last-of-type {
                  page-break-after: auto;
                }
              }
            </style>
          </head>
          <body>${devContent}</body>
        </html>
      `);

            printWindow.document.close();
            setTimeout(function () {
                printWindow.print();
                printWindow.close();
            }, 1000);
        }
    };


    const getRemovedDuplicateItemValues = (key: string) => {
        return [...new Set(data.flatMap(item => item.whReqItems.flatMap(reqItem => reqItem?.whReqItemAttrs?.[key])))].toString()
    }

    const getRemovedDuplicateWhValues = (key: string) => {
        const result = data.flatMap(item => item.whReqItems.flatMap(reqItem => reqItem?.whAbrstarct));
        return [...new Set(result.map(rec => rec[key]))].toString()
    }

    return (
        <div>
            <Button style={{ marginLeft: '95%' }} type="primary" onClick={handlePrint}>Print</Button>
            <div id="deliver-chalan" style={{ fontFamily: "Arial, sans-serif", margin: "20px", padding: "10px" }}>
                {data && data.length > 0 && (
                    <div className="delivery-challan">
                        <h3 style={{ textAlign: "center", margin: "0" }}>SQ   {getRemovedDuplicateWhValues('whCode')} Ltd</h3>
                        <h3 style={{ textAlign: "center", margin: "0" }}>Jamirdia, Valuka, Mymensingh</h3>
                        <h3 style={{ textAlign: "center", margin: "0" }}>Delivery Challan</h3>

                        <div>
                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ border: "1px solid #000", padding: "10px", width: "50%" }}>
                                            <strong>To:{getRemovedDuplicateWhValues('address')}</strong><br />

                                        </td>
                                        <td style={{ border: "1px solid #000", padding: "10px", width: "50%" }}>
                                            {data.map((item, index) => (
                                                <div key={index}>
                                                    <pre style={{ margin: 0 }}>
                                                        <strong>Challan No</strong>        : {item.reqCode}
                                                    </pre>
                                                    <pre style={{ margin: 0 }}>
                                                        <strong>Date</strong>              : {item.createAt}
                                                    </pre>

                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: "1px solid #000", padding: "10px" }}>
                                            <>
                                                <pre style={{ margin: 0 }}>
                                                    <strong>Requested Date</strong>: {data[0]?.requestedDate || "N/A"}
                                                </pre>
                                            </>
                                        </td>


                                        <td style={{ border: "1px solid #000", padding: "10px" }}>

                                            <>
                                                <pre style={{ margin: 0 }}>
                                                    <strong>No Of Cartons</strong>            :{" "}

                                                    {data.flatMap(item =>
                                                        item.whReqItems.flatMap(reqItem =>
                                                            reqItem.cartonsAbstract.totalCartons
                                                        )
                                                    ).reduce((sum, ctn) => sum + ctn, 0)}
                                                </pre>
                                            </>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            {/* Items Table */}
                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                                <thead>
                                    <tr>
                                        <th colSpan={3} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Items: {getRemovedDuplicateItemValues('prodNames')}
                                        </th>
                                        <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Description of Goods</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={3} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>SAMPLE</th>
                                        <th colSpan={2} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Styles: {getRemovedDuplicateItemValues('styles')}
                                        </th>
                                        <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Delivery of Readymade Garments</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={3} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Buyer Names: {data[0]?.whReqItems[0]?.whReqItemAttrs?.buyers}</th>
                                        <th colSpan={2} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Quantity</th>
                                        <th rowSpan={3} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Remarks</th>
                                    </tr>
                                    <tr>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Order No</th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Product Name</th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Country</th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>PCS</th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>CTN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.flatMap((item) =>
                                        item.whReqItems.flatMap((reqItem) => {
                                            const products = reqItem.whReqItemAttrs.prodNames.join(', ');
                                            const moNo = reqItem.whReqItemAttrs.moNo;
                                            const country = reqItem.whReqItemAttrs.destinations || "N/A";
                                            let pcs = 0;
                                            reqItem.cartonsInfo.forEach(c => pcs += Number(c.ctnQty));
                                            // const pcs = reqItem.cartonsInfo[0]?.ctnQty || "N/A";
                                            return (
                                                <tr key={moNo}>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {moNo}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {products}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {Array.isArray(country) ? country.join(', ') : country}
                                                    </td>

                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {pcs}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {reqItem.cartonsAbstract?.totalCartons}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>N/A</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    <tr>
                                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center", fontWeight: "bold" }}>Grand Total</td>
                                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}></td>
                                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}></td>
                                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}></td>
                                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            {/* {data.flatMap(item =>
                                                item.whReqItems.flatMap(reqItem =>
                                                    reqItem.cartonsInfo.map(carton => carton.ctnQty || 0)
                                                )
                                            ).reduce((sum, ctn) => sum + ctn, 0)} */}
                                            {data.flatMap(item =>
                                                item.whReqItems.flatMap(reqItem =>
                                                    reqItem.cartonsAbstract.totalCartons
                                                )
                                            ).reduce((sum, ctn) => sum + ctn, 0)}                                        </td>
                                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}></td>
                                    </tr>
                                </tbody>
                            </table>



                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "80px" }}>
                                <div style={{ textAlign: "center" }}>
                                    <strong>Signature of Issuing Officer</strong>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <strong>Signature of Receiver</strong>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <strong>Signature of CFS Officer</strong>
                                </div>
                            </div>
                        </div>
                    </div>)}
            </div>
        </div>
    );
};

export default PickListDataPrint;














;
