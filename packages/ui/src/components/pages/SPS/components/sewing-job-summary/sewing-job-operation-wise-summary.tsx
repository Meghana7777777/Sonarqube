import { SewingJobOperationWiseSummaryModel, SewSerialRequest } from "@xpparel/shared-models";
import { Space, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { SewingJobGenMOService } from "@xpparel/shared-services";
import { AlertMessages } from "packages/ui/src/components/common";

interface iProps {
    onStepChange: (step: number, selectedRecord: SewSerialRequest) => void;
    poObj: SewSerialRequest;
}

interface SizeQty {
    originalQty: number;
    inputReportedQty: number;
    outputReportedQty: number;
    completionPercent?: number;
    operations: { name: string; completionQty: number }[];
}

type ProductData = {
    color: string;
    productType: string;
    productName: string;
    [size: string]: SizeQty | string;
};

const ProductWiseSummary = ({ onStepChange, poObj }: iProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [sewCutTableData, setSewCutTableData] = useState<ProductData[]>([]);
    const sewingJobGenMOService = new SewingJobGenMOService();
    useEffect(() => {
        getSewingJobSizeWiseSummaryData();
    }, []);

    const getSewingJobSizeWiseSummaryData = () => {
        const req = new SewSerialRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            poObj.poSerial,
            poObj.id,
            true,
            true
        );

        sewingJobGenMOService.getSewingJobOperationWiseSummaryData(req)
            .then((res) => {
                if (res.status) {
                    processData(res.data);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((error) => {
                AlertMessages.getErrorMessage(error.message);
            });
    };

    const processData = (sewOperationWiseSummaryData: SewingJobOperationWiseSummaryModel[]) => {
        const tblData: ProductData[] = [];

        sewOperationWiseSummaryData.forEach((sewingOrder) => {
            sewingOrder.sewingOrderLineInfo.forEach((item) => {
                const { productType, productName, sizeQtyDetails, fgColor } = item;

                let product = tblData.find(
                    (product) => product.productType === productType && product.productName === productName
                );

                if (!product) {
                    product = { color: fgColor || "", productType, productName };
                    tblData.push(product);
                }

                sizeQtyDetails.forEach((sizeDetail) => {
                    const { size, completionQty, operation } = sizeDetail;

                    if (!product[size]) {
                        const details = sizeQtyDetails.filter((d) => d.size === size);

                        product[size] = {
                            originalQty: details[0]?.originalQty || 0,
                            inputReportedQty: details[0]?.completionQty || 0,
                            outputReportedQty: details[details.length - 1]?.completionQty || 0,
                            completionPercent: 0,
                            operations: [],
                        };
                    }

                    const sizeObj = product[size] as SizeQty;
                    sizeObj.completionPercent = Math.round(
                        (sizeObj.outputReportedQty / sizeObj.originalQty) * 100
                    ) || 0;
                    sizeObj.operations.push({ name: operation, completionQty });
                });
            });
        });

        setSewCutTableData(tblData);
    };

    return (
        <>
            <div style={{ background: "#dadada", borderRadius: "15px", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "center", margin: "0px 0px 10px" }}>
                    <Space direction="horizontal" size="small">
                        <Tooltip title="Order Quantity"><Tag color="#257d82">Order Qty</Tag></Tooltip>
                        <Tooltip title="Input Reported Quantity"><Tag color="#001d24">Input Reported Qty</Tag></Tooltip>
                        <Tooltip title="Output Reported Quantity"><Tag color="#4fc000">Output Reported Qty</Tag></Tooltip>
                        <Tooltip title="Completion Percentage"><Tag color="#d35400">Completion %</Tag></Tooltip>
                    </Space>
                </div>

                <div>
                    {sewCutTableData.map((product, index) => (
                        <div
                            key={index}
                            style={{ background: "#f3f3f3", borderRadius: "23px", padding: "16px", margin: "0 auto", width: "69%", marginBottom: "15px" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", gap: "50px", marginBottom: "15px" }}>
                                <div style={{ display: "flex", justifyContent: "start", gap: "10px" }}>
                                    <div style={{ display: "flex", background: "#dadada", borderRadius: "12px", gap: "5px", padding: "5px 10px" }}>
                                        Product Name: <strong> {product.productName} </strong>
                                    </div>
                                    <div style={{ display: "flex", background: "#dadada", borderRadius: "12px", gap: "5px", padding: "5px 10px" }}>
                                        Product Type: <strong> {product.productType} </strong>
                                    </div>
                                    <div style={{ display: "flex", background: "#dadada", borderRadius: "12px", gap: "5px", padding: "5px 10px" }}>
                                        FG Color: <strong> {product.color} </strong>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                                {Object.keys(product)
                                    .filter((key) => key !== "color" && key !== "productType" && key !== "productName")
                                    .map((size, idx) => {
                                        const sizeQty = product[size] as SizeQty;
                                        return (
                                            <div
                                                key={idx}
                                                style={{ backgroundColor: "#dadada", borderRadius: "15px", padding: "10px", minWidth: "120px", textAlign: "center" }}
                                            >
                                                <p style={{ backgroundColor: "#f3f3f3", margin: 0, fontWeight: "bold", borderRadius: "13px", padding: "2px", marginBottom: "9px" }}>
                                                    {size}
                                                </p>
                                                {sizeQty ? (
                                                    <>
                                                        <Space direction="horizontal" size={4}>
                                                            <Tooltip title="Order Qty"  mouseEnterDelay={0} mouseLeaveDelay={0}>
                                                                <Tag color="#257d82">{sizeQty.originalQty}</Tag>
                                                            </Tooltip>
                                                            <Tooltip title="Input Reported Qty"  mouseEnterDelay={0} mouseLeaveDelay={0}>
                                                                <Tag color="#001d24">{sizeQty.inputReportedQty}</Tag>
                                                            </Tooltip>
                                                            <Tooltip title="Output Reported Qty">
                                                                <Tag color="#4fc000">{sizeQty.outputReportedQty}</Tag>
                                                            </Tooltip>
                                                            <Tooltip title="Completion Percent">
                                                                <Tag color="#d35400">{sizeQty.completionPercent}%</Tag>
                                                            </Tooltip>
                                                        </Space>
                                                        <div style={{ marginTop: "8px", textAlign: "left" }}>
                                                            <strong style={{ display: "flex", justifyContent: "center" }}>Operations</strong>
                                                            <div style={{ marginLeft:'25px' }}>
                                                                {sizeQty.operations.map((op, opIdx) => (
                                                                    <div key={opIdx} style={{ fontSize: "12px", marginBottom: "5px" }}>
                                                                        <Tag color="blue" style={{ cursor: "pointer" }} title={`Operation Code: ${op.name}`}>
                                                                            {op.name}
                                                                        </Tag> - 
                                                                        <Tag color="green" style={{ cursor: "pointer", marginLeft:'9px' }} title={`Completion Qty: ${op.completionQty}`}>
                                                                            {op.completionQty}
                                                                        </Tag>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProductWiseSummary;
