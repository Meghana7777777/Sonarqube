import { SearchOutlined } from "@ant-design/icons";
import {
    KMS_ELGBUN_C_KnitProcSerialRequest,
    KMS_R_KnitBundlingProductColorBundlingSummaryModel,
    KMS_R_KnitOrderProductWiseElgBundlesModel,
    ProcessTypeEnum,
} from "@xpparel/shared-models";
import { KnittingReportingService } from "@xpparel/shared-services";
import { Space, Table, TableColumnsType, TableProps, Tag, Tooltip } from "antd";
import { sortSizes, useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { KnitInventryCreation } from "./knit-inventry-creation";
import { AlertMessages } from "packages/ui/src/components/common";

interface KnitBundlingSummaryProps {
    bundlingSummary: KMS_R_KnitBundlingProductColorBundlingSummaryModel;
    processingSerial: number;
    productCode: string;
    fgColor: string;
    refreshComponent: () => void;
}

interface BundlingSummaryRow {
    key: string;
    knitGroup: string;
    components: string;
    itemsCodes: string;
    [size: string]: any;
}
const tblRowKeyValues = {
    total_plan_garm_bund: 'total_plan_garm_bund', // Total Planned Garment Bundles
    bundles_move_to_inv: 'bundles_move_to_inv', // Bundles Moved to Inventory
    bundles_elidible_for_bun: 'bundles_elidible_for_bun' // Bundles Eligible For Bundling
}
const bundleCountKey = 'bundleCnt';
export const KnitBundlingSummary = ({ bundlingSummary, processingSerial, productCode, fgColor, refreshComponent }: KnitBundlingSummaryProps) => {
    const [eligibleBundleData, setEligibleBundelData] = useState<KMS_R_KnitOrderProductWiseElgBundlesModel[]>([]);
    const knitRepostingService = new KnittingReportingService();
    const user = useAppSelector((state) => state.user.user.user);
    const [tblData, setTblData] = useState<BundlingSummaryRow[]>([]);
    const [tblColumns, setTblColumns] = useState<TableColumnsType<BundlingSummaryRow>>([]);
    useEffect(() => {
        getBundlingSummaryData(bundlingSummary);
        setEligibleBundelData([]);
    }, [bundlingSummary])

    const getEligibleBundlesForKnitOrder = async () => {
        try {
            const req = new KMS_ELGBUN_C_KnitProcSerialRequest(
                user?.userName,
                user?.orgData?.unitCode,
                user?.orgData?.companyCode,
                user?.userId,
                processingSerial,
                ProcessTypeEnum.KNIT,
                bundlingSummary.productCode,
                bundlingSummary.fgColor,
                true
            );
            const res = await knitRepostingService.getEligibleBundlesForKnitOrder(req);
            if (res.status) {
                setEligibleBundelData(res.data);
                updateEligibleBundleQty(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    };
    const updateEligibleBundleQty = (eBundleData: KMS_R_KnitOrderProductWiseElgBundlesModel[]) => {
        const eligibleBundleMap = new Map<string, number>();
        eBundleData?.forEach((eb) => {
            eb.elgBundles.forEach((ebl) => {
                eligibleBundleMap.set(ebl.size, (eligibleBundleMap.get(ebl.size) || 0) + ebl.quantity);
                const bundleSizeCountKey = `${bundleCountKey}-${ebl.size}`;
                eligibleBundleMap.set(bundleSizeCountKey, (eligibleBundleMap.get(bundleSizeCountKey) || 0) + 1);
            });
        });
        setTblData(prevData =>
            prevData.map(row => {
                if (row.key !== tblRowKeyValues.bundles_elidible_for_bun) return row;

                const updatedRow = { ...row };
                eligibleBundleMap.forEach((value, size) => {
                    updatedRow[size] = value;
                });

                return updatedRow;
            })
        );

    }
    console.log(tblData)
    const getBundleQty = (
        bundleQtyMapData: KMS_R_KnitBundlingProductColorBundlingSummaryModel
    ): Map<string, number> => {
        const bundelQtyMap = new Map<string, number>();
        bundleQtyMapData?.sizeWiseBundlesSummary.forEach((bundle) => {
            const key = `${bundle.size}`;
            const existingQty = bundelQtyMap.get(key) || 0;
            bundelQtyMap.set(key, existingQty + Number(bundle.qtyMovedToInv));
        });
        return bundelQtyMap;
    };



    // const bundleQtyMap = getBundleQty(bundlingSummary);

    const getBundlingSummaryData = (bundleData: KMS_R_KnitBundlingProductColorBundlingSummaryModel) => {
       if(!bundleData){
            setTblData([]);
            return
        }
        const uniqueSizes: string[] = Array.from(
            new Set(
                bundleData?.jobGenQtys
                    ?.map((item) => item.jobGenQtys.map((sizeItem) => sizeItem.size))
                    .flat()
            )
        );
        const data: BundlingSummaryRow[] = bundleData?.jobGenQtys.map((item) => {
            const sizeData: Record<string, number> = uniqueSizes.reduce((acc, size) => {
                const sizeItem = item.jobGenQtys.find((s) => s.size === size);
                acc[size] = sizeItem ? sizeItem.jobGenQty : 0;
                return acc;
            }, {} as Record<string, number>);

            return {
                key: item.knitGroup,
                knitGroup: item.knitGroup,
                components: item.components.join(", "),
                itemsCodes: item.itemCodes.join(", "),
                ...sizeData,
            };
        }) || [];


        const qtyMovedToInvMap = new Map<string, number>();

        const sizeObj: BundlingSummaryRow = { key: tblRowKeyValues.total_plan_garm_bund, knitGroup: "Total Planned Garment Bundles", components: undefined, itemsCodes: "" };

        const bundleObj: BundlingSummaryRow = { key: tblRowKeyValues.bundles_move_to_inv, knitGroup: "Bundles Moved To Inventory", components: undefined, itemsCodes: "" };

        bundleData?.sizeWiseBundlesSummary.forEach((bs) => {
            sizeObj[bs.size] = (sizeObj[bs.size] || 0) + bs.totalBundles;
            bundleObj[bs.size] = (bundleObj[bs.size] || 0) + bs.bundlesMovedToInv;
            const existingQty = qtyMovedToInvMap.get(bs.size) || 0;
            qtyMovedToInvMap.set(bs.size, existingQty + Number(bs.qtyMovedToInv));
        });
        data.push(sizeObj);
        data.push(bundleObj);

        const plannedBundles = new Map<string, number>();
        eligibleBundleData?.forEach((eb) => {
            eb.elgBundles.forEach((ebl) => {
                const bundleSizeCountKey = `${bundleCountKey}-${ebl.size}`;
                plannedBundles.set(ebl.size, (plannedBundles.get(ebl.size) || 0) + ebl.quantity);
                plannedBundles.set(bundleSizeCountKey, (plannedBundles.get(bundleSizeCountKey) || 0) + 1);
            });
        });

        const plannedObj: BundlingSummaryRow = { key: tblRowKeyValues.bundles_elidible_for_bun, knitGroup: "Bundles Eligible For Bundling", components: undefined, itemsCodes: "" };
        plannedBundles.forEach((value, key) => {
            plannedObj[key] = value;
        });
        data.push(plannedObj);

        setTblData(data);
        constructColumns(uniqueSizes, qtyMovedToInvMap);
    };

    console.log(tblData)
    const constructColumns = (uniqueSizes: string[], qtyMovedToInvMap: Map<string, number>) => {
        const columns: TableColumnsType<BundlingSummaryRow> = [
            {
                title: "Knit Group",
                dataIndex: "knitGroup",
                key: "knitGroup",
            },
            {
                title: "Componets",
                dataIndex: "components",
                key: "components",
            },
            {
                title: "Items Codes",
                dataIndex: "itemsCodes",
                key: "itemsCodes",
            },
            ...sortSizes(uniqueSizes).map((size) => ({
                title: size,
                dataIndex: size,
                key: size,
                width: "70px",
                align: "center" as const,
                render: (_: unknown, record: BundlingSummaryRow) => {
                    const orderQty = Number(record[size]) || 0;

                    if (record.components) {
                        const bundleKey = `${size}`;
                        const bundleQty = qtyMovedToInvMap.get(bundleKey) || 0;
                        const pendingQty = orderQty - bundleQty;
                        let pendingTag = null;

                        if (orderQty > 0) {
                            const pQtyColor = pendingQty > 0 ? "#ff0000" : pendingQty === 0 ? "#5adb00" : "#001d24";
                            const tooltipTitle = pendingQty > 0 ? "Pending Qty" : pendingQty === 0 ? "Balanced" : "Excess Qty";

                            pendingTag = (
                                <Tooltip title={tooltipTitle}>
                                    <Tag style={{ minWidth: "45px", textAlign: "center" }} color={pQtyColor}>
                                        {Math.abs(pendingQty)}
                                    </Tag>
                                </Tooltip>
                            );
                        } else {
                            pendingTag = (
                                <Tooltip title="Pending Qty">
                                    <Tag style={{ minWidth: "45px", textAlign: "center" }} color="#d9d9d9">
                                        -
                                    </Tag>
                                </Tooltip>
                            );
                        }

                        return (
                            <Space size={3} direction="horizontal">
                                <Tooltip title="Job Generated Qty">
                                    <Tag style={{ minWidth: "45px", textAlign: "center" }} color="#257d82">
                                        {orderQty}
                                    </Tag>
                                </Tooltip>

                                <Tooltip title="Qty Moved to Inventory">
                                    <Tag style={{ minWidth: "45px", textAlign: "center" }} color="#da8d00">
                                        {bundleQty || "-"}
                                    </Tag>
                                </Tooltip>

                                {pendingTag}
                            </Space>
                        );
                    } else {
                        if (record.key === tblRowKeyValues.bundles_elidible_for_bun) {
                            const bundleSizeCountKey = `${bundleCountKey}-${size}`;
                            return (
                                <Space size={3} direction="horizontal">
                                    <Tooltip title="Eligible Bundle Qty">
                                        <Tag style={{ minWidth: "45px", textAlign: "center" }} color="#4169E1">
                                            {record[size] || 0}
                                        </Tag>
                                    </Tooltip>
                                    <Tooltip title="Eligible Bundles Count">
                                        <Tag style={{ minWidth: "45px", textAlign: "center" }} color="#4169E1">
                                            {record[bundleSizeCountKey] || 0}
                                        </Tag>
                                    </Tooltip>
                                </Space>
                            );

                        }

                        if (record.key === tblRowKeyValues.bundles_move_to_inv) {
                            return (
                                <Tooltip title="Conformed Qty">
                                    <Tag style={{ minWidth: "45px", textAlign: "center" }} color="#4169E1">
                                        {orderQty}
                                    </Tag>
                                </Tooltip>
                            );
                        }


                        if (record.key === tblRowKeyValues.total_plan_garm_bund) {
                            return (
                                <Tooltip title="Total Bundles">
                                    <Tag style={{ minWidth: "45px", textAlign: "center" }} color="#4169E1">
                                        {orderQty}
                                    </Tag>
                                </Tooltip>
                            );
                        }
                        return null;
                    }

                },
            })),
            {
                title: "Action",
                dataIndex: "action",
                key: "action",
                align: "center" as const,
                width: "80px",
                fixed: "right" as const,
                render: (_: unknown, record: BundlingSummaryRow) => {
                    if (record.knitGroup === "Bundles Eligible For Bundling") {
                        return (
                            <Space size={3} direction="horizontal">
                                <Tooltip title="View Eligible Bundles">
                                    <Tag color="#1e90ff" onClick={getEligibleBundlesForKnitOrder} style={{ cursor: "pointer" }}>
                                        <SearchOutlined />
                                    </Tag>
                                </Tooltip>
                            </Space>
                        );
                    }
                    return null;
                },
            },
        ];
        setTblColumns(columns)
    }
    return (
        <div>
            {<Table<BundlingSummaryRow>
                dataSource={tblData}
                columns={tblColumns}
                bordered
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
                style={{ minWidth: '100%' }}
            />}
            <KnitInventryCreation
                processingSerial={processingSerial}
                productCode={productCode}
                fgColor={fgColor}
                eligibleBundleData={eligibleBundleData}
                refreshComponent={refreshComponent}
            />
        </div>
    );
};
