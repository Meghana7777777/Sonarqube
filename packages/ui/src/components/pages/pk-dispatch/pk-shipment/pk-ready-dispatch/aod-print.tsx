import { CarOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { FgWhReqHeaderModel, FgWhSrIdPlIdsRequest, PkAodAbstarctModel, PkDSetItemsAbstractModel } from "@xpparel/shared-models";
import { PkShippingRequestService } from "@xpparel/shared-services";
import { Button } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useState, useEffect } from "react";

interface IPkAodPrintProps {
    srItemsInfo: PkAodAbstarctModel[]
}
export const PkAodPrint = (props: IPkAodPrintProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const pKMSFgWarehouseService = new PkShippingRequestService();
    const [data, setData] = useState<FgWhReqHeaderModel[] | null>(null);



    let totalCartons = 0;
    let totalFgs = 0;
    let buyersSet = new Set<string>();
    let totalPackLists = new Set<string>();
    // s01 styl UK,AUS  

    // const aodItemsMap = new Map<string, Map<string, { dest: string; noOfCtns: number, vpo: string  }>>(); // so => style => 
    let aodItemsMap = new Map<string, Map<string, PkDSetItemsAbstractModel[]>>();

    // function constructData() {
    //     for (const obj of props.srItemsInfo[0].shippingItemsAbstractInfo) {
    //         for (const dabstract of obj.dSetItemsAbstract) {

    //             if (!aodItemsMap?.has(dabstract.soNo)){
    //                 const sodetailMap  = aodItemsMap.get(dabstract.soNo);
    //                 if(!sodetailMap?.has(dabstract.style)){
    //                     sodetailMap?.set(dabstract.style,{dest:dabstract.destinations?.join(","),noOfCtns:dabstract.dSetItems.length,vpo:dabstract.vpo?.join(",")})
    //                 }
    //                 aodItemsMap?.set(dabstract.soNo,sodetailMap)
    //             }else{
    //                 const styleMap = new Map<string, { dest: string; noOfCtns: number, vpo: string }>()
    //                 styleMap?.set(dabstract.style,{dest:dabstract.destinations?.join(","),noOfCtns:dabstract.dSetItems.length,vpo:dabstract.vpo?.join(",")})
    //                 aodItemsMap?.set(dabstract.soNo,styleMap)
    //             }
    //         }
    //     } 
    //     console.log("constucted dataaaa",aodItemsMap);

    // } 

    function constructData() {
        for (const obj of props.srItemsInfo[0].shippingItemsAbstractInfo) {
            for (const dabstract of obj.dSetItemsAbstract) {
                if (!aodItemsMap.has(dabstract.moNo)) {
                    aodItemsMap.set(dabstract.moNo, new Map<string, PkDSetItemsAbstractModel[]>());
                }
                if (!aodItemsMap.get(dabstract.moNo).has(dabstract.style)) {
                    aodItemsMap.get(dabstract.moNo).set(dabstract.style, []);
                }
                aodItemsMap.get(dabstract.moNo).get(dabstract.style).push(dabstract);

                totalCartons += Number(dabstract?.dSetItems?.length ?? 0);
                const ctnQty = dabstract?.dSetItems[0]?.quantity;
                totalFgs += ctnQty * totalCartons;

                dabstract.buyers.forEach(b => {
                    buyersSet.add(b);
                });
                totalPackLists.add(dabstract.packListId);
            }
        }
        console.log("Constructed data:", aodItemsMap);
    }




    constructData();

    const Vendoradddress = props.srItemsInfo[0].shippingInfo.vendorInfo;
    const vehicleInfo = props.srItemsInfo[0];
    const dataD = props.srItemsInfo[0].shippingItemsAbstractInfo[0];

    // props.srItemsInfo.shippingItemsAbstractInfo[0].dSetItemsAbstract[0].delDates

    // aodItemsMap.set

    //    console.log("props dataaaaa",props);

    //     const addresses: string[] = Vendoradddress.(req =>
    //         req.whReqItems.flatMap(item =>
    //             item.whAbrstarct.map(wh => wh.address)
    //         )
    //     );

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
                        page-bareak-after: always;
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

    // useEffect(() => {
    //     if (data === null) {
    //         renderPrintDetails([101, 102, 103]);
    //     }
    // }, [data]);

    return (
        <div>
            {/* <Button style={{ marginLeft: '95%' }} type="primary" onClick={handlePrint}>Print</Button> */}
            <div id="gate-pass" style={{ fontFamily: "Arial, sans-serif", margin: "20px", padding: "10px" }}>
                {/* {data && data.length > 0 && ( */}
                <div className="delivery-challan">
                    <h3 style={{ textAlign: "center", margin: "0" }}>{user?.orgData?.unitCode}</h3>
                    <h3 style={{ textAlign: "center", margin: "0" }}>Visakhapatnam,Andhra Pradesh</h3>
                    <h3 style={{ textAlign: "center", margin: "0" }}>Delivery Challan</h3>

                    <div>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                            <tbody>
                                <tr>
                                    <td style={{ border: "1px solid #000", padding: "10px", width: "50%" }}>
                                        <strong>To:</strong><br />
                                        {Vendoradddress.vName + ", " + Vendoradddress.vAddress + ", " + Vendoradddress.vPlace + ", " + Vendoradddress.vCountry}
                                    </td>
                                    <td style={{ border: "1px solid #000", padding: "10px", width: "50%" }}>
                                        {/* {data?.map((item, index) => ( */}
                                        <div key={1}>
                                            <pre style={{ margin: 0 }}>
                                                <strong>Challan No</strong>        : {dataD.sRequestId}
                                            </pre>
                                            <pre style={{ margin: 0 }}>
                                                <strong>Date</strong>              : 05-01-2025
                                            </pre>
                                            <pre style={{ margin: 0 }}>
                                                <strong>Lock No</strong>           : -
                                            </pre>
                                            <pre style={{ margin: 0 }}>
                                                <strong>Gate Pass No</strong>      : {dataD.gatePassRefNo}
                                            </pre>
                                        </div>
                                        {/* ))} */}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid #000", padding: "10px" }}>
                                        <>
                                            <pre style={{ margin: 0 }}>
                                                <strong>Requested Date</strong>       : 05-01-2025
                                            </pre>
                                            <pre style={{ margin: 0 }}>
                                                <strong>No Of Cartons</strong>        : {totalCartons}

                                            </pre>


                                            <pre style={{ margin: 0 }}>
                                                <strong>No of Packing List</strong>   :{" "}
                                                {totalPackLists.size}
                                            </pre>
                                        </>
                                    </td>


                                    <td style={{ border: "1px solid #000" }}>

                                        <>
                                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                                <tr>
                                                    <th style={{ border: "1px solid #000", }}>
                                                        <pre >
                                                            <strong>  <CarOutlined style={{ fontSize: "18px", marginRight: 10, color: "#faad14" }} /> Vehicle No</strong>
                                                        </pre>
                                                    </th>
                                                    <th style={{ border: "1px solid #000", }}>
                                                        <pre >
                                                            <strong><PhoneOutlined style={{ fontSize: "18px", marginRight: 10, color: "#52c41a" }} />  Mobile No</strong>
                                                        </pre>
                                                    </th>
                                                    <th style={{ border: "1px solid #000", }}>
                                                        <pre >
                                                            <strong> <UserOutlined style={{ fontSize: "18px", marginRight: 10, color: "#1890ff" }} /> Driver Name </strong>
                                                        </pre>
                                                    </th>
                                                </tr>
                                                {vehicleInfo.truckInfo.map((rec) => {
                                                    return <tr>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }}>{rec.truckNumber}</td>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }}>{rec.contact}</td>
                                                        <td style={{ border: "1px solid #000", padding: "10px" }}>{rec.dirverName}</td>
                                                    </tr>
                                                })}
                                            </table>

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
                                        {/* Items: {Array.from(aodItemsMap.entries()).flatMap(([soNo, styleMap]) =>Array.from(styleMap.entries()).map(([style]) => style).join(', '))} */}
                                    </th>
                                    <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Description of Goods</th>
                                </tr>
                                <tr>
                                    <th colSpan={3} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>SAMPLE</th>
                                    <th colSpan={4} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Delivery of Readymade Garments</th>
                                </tr>
                                <tr>
                                    <th colSpan={3} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Buyer Names: {Array.from(buyersSet)?.toString()}</th>
                                    <th colSpan={2} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Quantity</th>
                                    <th rowSpan={2} style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>Remarks</th>
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
                                {Array.from(aodItemsMap.entries()).flatMap(([moNo, styleMap]) =>
                                    Array.from(styleMap.entries()).map(([style, dSetItems]) => {
                                        // Calculate product names, destinations, and total cartons based on dSetItems
                                        const products = dSetItems.map(d => d.style).join(", ");
                                        let totalRowCartons = 0;
                                        let totalFgs = 0;
                                        const destinations = dSetItems
                                            .flatMap(d => d.destinations || [])
                                            .filter(Boolean)
                                            .join(", ") || "N/A";
                                        dSetItems.forEach(i => {
                                            totalRowCartons += Number(i.dSetItems?.length ?? 0);
                                            const perCtnQty = i.dSetItems[0]?.quantity ?? 0;
                                            totalFgs += totalRowCartons * perCtnQty;
                                        }); // Count the length of dSetItems array

                                        return (
                                            <tr key={`${moNo}-${style}`}>
                                                <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                    {moNo}
                                                </td>
                                                <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                    {style}
                                                </td>
                                                <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                    {destinations || "N/A"}
                                                </td>
                                                <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                    {totalFgs}
                                                </td>
                                                <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>
                                                    {totalRowCartons}
                                                </td>
                                                <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>N/A</td>
                                            </tr>
                                        );
                                    })
                                )}
                                <tr>
                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center", fontWeight: "bold" }}>
                                        Grand Total
                                    </td>
                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}></td>
                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}></td>
                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{totalFgs}</td>
                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{totalCartons}</td>
                                    <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "100px" }}>
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
                </div>
                {/* )} */}
            </div>
        </div>
    );
};

export default PkAodPrint;
