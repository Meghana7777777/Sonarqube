import { FgWhReqHeaderDetailsModel, FgWhReqHeaderModel, FgWhReqItemModel, FgWhReqSubItemModel, FgWhSrIdPlIdsRequest, PackListCartoonIDs, PkmsFgWhReqTypeEnum } from "@xpparel/shared-models";
import { PKMSFgWarehouseService } from "@xpparel/shared-services";
import { Button } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { title } from "process";
import { useState, useEffect } from "react";

interface CheckListIProps {
    plIds: number[];
    userFromModal?: any;
    title?: string
    packListCartoonIds: PackListCartoonIDs[];
    whReqIds?: number[];
    reqTyp: PkmsFgWhReqTypeEnum;
}

export const CheckListReport = (props: CheckListIProps) => {
    const { plIds, userFromModal, title, packListCartoonIds, whReqIds, reqTyp } = props;
    const user = userFromModal ? userFromModal : useAppSelector((state) => state.user.user.user);
    const pKMSFgWarehouseService = new PKMSFgWarehouseService();
    const [data, setData] = useState<FgWhReqHeaderModel[] | null>(null);

    useEffect(() => {
        if (data === null) {
            renderPrintDetails(plIds, packListCartoonIds);
        }
    }, [data]);



    const renderPrintDetails = async (plIds: number[], packListCartoonIds: PackListCartoonIDs[]) => {
        const cartoonId: PackListCartoonIDs[] = []
        const cartoonIdsAsNumbers = packListCartoonIds?.forEach(rec => cartoonId.push(rec))
        const reqObj = new FgWhSrIdPlIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, plIds, ' go here', true, true,
            true, true, true, whReqIds, cartoonId, [reqTyp]);

        try {
            const whInfoForGivenPackList = await pKMSFgWarehouseService.getFgWhInfoForGivenPackListIds(reqObj);
            if (!whInfoForGivenPackList.status) {
                AlertMessages.getErrorMessage(whInfoForGivenPackList.internalMessage);
                return;
            }
            if (whInfoForGivenPackList && whInfoForGivenPackList.data) {
                setData(whInfoForGivenPackList.data);
            } else {
                console.error('Invalid response format:', whInfoForGivenPackList);
            }
        } catch (error) {
            console.error('Error fetching warehouse info:', error);
            throw error;
        }
    };



    const getPoLocationSet = (req: FgWhReqItemModel[]) => {
        const poLocationMap = new Map<string, FgWhReqSubItemModel[]>();
        for (const eachSet of req) {
            for (const eachCarton of eachSet.cartonsInfo) {
                const location = eachCarton.location ? eachCarton.location : "On Floor";
                const key = `${eachSet.whReqItemAttrs.poNo}-${location}`
                if (!poLocationMap.has(key)) {
                    poLocationMap.set(key, [])
                }
                poLocationMap.get(key).push(eachCarton);
            }
        }
        const allRows = [];
        for (const [key, cartonInfo] of poLocationMap) {

            const poNumber = key.split('-')[0];
            const location = key.split('-')[1];
            const ctnQty = cartonInfo.reduce((pre, curr) => {
                return Number(curr.ctnQty) + pre;
            }, 0)
            const htmlResp =
                <tr key={key}>
                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                        {poNumber}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                        {location}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                        {cartonInfo.length}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                            {cartonInfo.map(carton => (
                                <span
                                    key={carton.barcode}
                                    style={{
                                        display: "inline-block",
                                        padding: "5px 10px",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "4px",
                                        background: "#f5f5f5",
                                        fontSize: "12px",
                                        textAlign: "center",
                                    }}
                                >
                                    {carton.barcode}
                                </span>
                            ))}
                        </div>
                    </td>
                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                        {ctnQty}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                        N/A
                    </td>
                </tr>;
            allRows.push(htmlResp);
        }
        return allRows
    }

    const handlePrint = () => {
        const invoiceContent = document.getElementById("gate-pass");
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

    const removeDuplicatesFromAttributes = (attributeKey: string) => {
        const duplicateRemover = new Set();
        data.flatMap(item => item.whReqItems.flatMap(reqItem => reqItem?.whReqItemAttrs?.[attributeKey]?.map(rec => duplicateRemover.add(rec))))
        return [...duplicateRemover]?.join(',')
    }

    return (
        <div>
            <Button style={{ marginLeft: '95%' }} type="primary" onClick={handlePrint}>Print</Button>
            <div id="gate-pass" style={{ fontFamily: "Arial, sans-serif", margin: "20px", padding: "10px" }}>
                {data && data.length > 0 && (
                    <div className="delivery-challan">
                        <h3 style={{ textAlign: "center", margin: "0" }}>{title ? title : "Inspection Pick List"}</h3>

                        <div>
                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ paddingLeft: '120px' }}></td>
                                        <td style={{ paddingLeft: '120px' }}></td>
                                        <td style={{ paddingLeft: '120px' }}></td>
                                        <td style={{ paddingLeft: '120px' }}></td>
                                        <td style={{ padding: "10px" }}>
                                            <div style={{ paddingRight: '10px' }}>
                                                <pre>
                                                    <strong>Date</strong> : {data[0]?.createAt || 'N/A'}
                                                </pre>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: "1px solid #000", padding: "10px" }}>
                                            <>
                                                <pre style={{ margin: 0 }}>
                                                    <strong>No Of Cartons</strong>            :{" "}
                                                    {data.flatMap(item =>
                                                        item.whReqItems.flatMap(reqItem =>
                                                            reqItem.cartonsInfo.map(carton => carton.ctnQty || 0)
                                                        )
                                                    ).reduce((sum, ctn) => sum + ctn, 0)}
                                                </pre>
                                                <pre style={{ margin: 0 }}>
                                                    <strong>No of Packing List</strong>       :{" "}
                                                    {data.flatMap(item =>
                                                        item.whReqItems.flatMap(reqItem =>
                                                            reqItem.cartonsInfo.map(carton => (carton.ctnQty ? 1 : 0))
                                                        )
                                                    ).reduce((sum, ctn) => sum + ctn, 0)}
                                                </pre>
                                            </>
                                        </td>
                                        <td></td>
                                    </tr>

                                </tbody>
                            </table>

                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                                <thead>
                                    <tr>
                                        <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Items: {removeDuplicatesFromAttributes('prodNames')}
                                        </th>
                                        <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Description of Goods
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Sample
                                        </th>
                                        <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Delivery of Readymade Garments
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Buyer Names: {removeDuplicatesFromAttributes('buyers')}
                                        </th>
                                        <th colSpan={2} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Styles: {removeDuplicatesFromAttributes('styles')}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            PO Number
                                        </th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Locations
                                        </th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Carton Count
                                        </th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Cartons
                                        </th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Carton Qty
                                        </th>
                                        <th style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getPoLocationSet(data[0]?.whReqItems)}
                                    {/* {data.flatMap(item =>
                                        item.whReqItems.map(reqItem => {
                                            // Aggregate data by SO number
                                            const locations = reqItem.cartonsInfo.map(carton => carton.location?carton.location:"NL").join(', ');
                                            const barcodeCount = reqItem.cartonsInfo.reduce((count, carton) => count + carton.barcode.split(',').length, 0);
                                            const ctnQty = reqItem.cartonsInfo.reduce((total, carton) => total + carton.ctnQty, 0);

                                            return (
                                                <tr key={reqItem.packListId}>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {reqItem.whReqItemAttrs.poNo[0]}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {new Set(...locations.split(','))}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {barcodeCount}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                                                            {reqItem.cartonsInfo.map(carton => (
                                                                <span
                                                                    key={carton.barcode}
                                                                    style={{
                                                                        display: "inline-block",
                                                                        padding: "5px 10px",
                                                                        border: "1px solid #d9d9d9",
                                                                        borderRadius: "4px",
                                                                        background: "#f5f5f5",
                                                                        fontSize: "12px",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {carton.barcode}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        {ctnQty}
                                                    </td>
                                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                        N/A
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )} */}
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

export default CheckListReport;
