import { SewingJobSizeWiseSummaryModel, SewSerialRequest } from "@xpparel/shared-models";
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
}

interface ProductData {
    color: string;
    productType: string;
    productName: string;
    [size: string]: SizeQty | string;
}

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

        sewingJobGenMOService
            .getSewingJobSizeWiseSummaryData(req)
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

    const processData = (sewSizeWiseSummaryData: SewingJobSizeWiseSummaryModel[]) => {
        const tblData: ProductData[] = [];

        sewSizeWiseSummaryData.forEach((sewingOrder) => {
            sewingOrder.sewingOrderLineInfo.forEach((item) => {
                const { productType, productName, fgColor, sizeQtyDetails } = item;
                let product = tblData.find(
                    (product) => product.productType === productType && product.productName === productName
                );

                if (!product) {
                    product = { color: fgColor, productType, productName };
                    tblData.push(product);
                }

                sizeQtyDetails.forEach((sizeDetail) => {
                    const { size, originalQty, inputReportedQty, completionQty } = sizeDetail;

                    if (!product[size]) {
                        product[size] = {
                            originalQty: 0,
                            inputReportedQty: 0,
                            outputReportedQty: 0,
                            completionPercent: 0,
                        };
                    }
                    const sizeObj = product[size] as SizeQty;
                    sizeObj.originalQty += originalQty;
                    sizeObj.inputReportedQty += inputReportedQty;
                    sizeObj.outputReportedQty += completionQty;
                    sizeObj.completionPercent = Math.round(
                        (sizeObj.outputReportedQty / sizeObj.originalQty) * 100
                    ) || 0;
                });
            });
        });

        setSewCutTableData(tblData);
    };

    return (
        <div style={{ background: "#dadada", borderRadius: "15px", padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "center", margin: "0px 0px 10px" }}>
                <Space direction="horizontal" size="small">
                    <Tooltip title="Order Quantity">
                        <Tag color="#257d82">Order Qty</Tag>
                    </Tooltip>
                    <Tooltip title="Input Reported Quantity">
                        <Tag color="#001d24">Input Reported Qty</Tag>
                    </Tooltip>
                    <Tooltip title="Output Reported Quantity">
                        <Tag color="#4fc000">Output Reported Qty</Tag>
                    </Tooltip>
                    <Tooltip title="Completion Percentage">
                        <Tag color="#d35400">Completion %</Tag>
                    </Tooltip>
                </Space>
            </div>

            <div>
                {sewCutTableData.map((product, index) => (
                    <div
                        key={index}
                        style={{ background: "#f3f3f3", borderRadius: "23px", padding: "16px", margin: "0 auto", width: "69%", marginBottom: "15px" }}
                    >
                        <div
                            style={{ display: "flex", justifyContent: "space-around", alignItems: "center", gap: "50px", marginBottom: "15px" }}
                        >
                            <div style={{ display: "flex", justifyContent: "start", gap: "10px" }}>
                                <div style={{ background: "#dadada", padding: "5px 10px", borderRadius: "12px" }}>
                                    Product Name: <strong>{product.productName}</strong>
                                </div>
                                <div style={{ background: "#dadada", padding: "5px 10px", borderRadius: "12px" }}>
                                    Product Type: <strong>{product.productType}</strong>
                                </div>
                                <div style={{ background: "#dadada", padding: "5px 10px", borderRadius: "12px" }}>
                                    FG Color: <strong>{product.color}</strong>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                            {Object.keys(product)
                                .filter((key) => !["color", "productType", "productName"].includes(key))
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
                                            <Space direction="horizontal" size={4}>
                                                <Tooltip title="Order Qty">
                                                    <Tag color="#257d82">{sizeQty.originalQty}</Tag>
                                                </Tooltip>
                                                <Tooltip title="Input Reported Qty">
                                                    <Tag color="#001d24">{sizeQty.inputReportedQty}</Tag>
                                                </Tooltip>
                                                <Tooltip title="Output Reported Qty">
                                                    <Tag color="#4fc000">{sizeQty.outputReportedQty}</Tag>
                                                </Tooltip>
                                                <Tooltip title="Completion Percent">
                                                    <Tag color="#d35400">{sizeQty.completionPercent}%</Tag>
                                                </Tooltip>
                                            </Space>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductWiseSummary;
