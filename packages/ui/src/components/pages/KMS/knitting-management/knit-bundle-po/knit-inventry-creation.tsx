import { QrcodeOutlined } from "@ant-design/icons";
import {
    KC_KnitJobBarcodeModel,
    KMS_C_KnitOrderConfirmedBundleModel,
    KMS_R_KnitBundlingProductColorBundlingSummaryModel,
    KMS_R_KnitBundlingProductColorBundlingSummaryRequest,
    KMS_R_KnitOrderConfirmedBundleModel,
    KMS_R_KnitOrderProductWiseElgBundlesModel,
    ProcessTypeEnum,
    INV_C_PslIdsRequest
} from "@xpparel/shared-models";
import { InvIssuanceService, KnittingReportingService } from "@xpparel/shared-services";
import { Button, Checkbox, Col, Descriptions, Popover, Row, Spin, Tabs, Tag, Typography } from "antd";
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useRef, useState } from "react";
import BundleBarcodes from "../knit-job-summary/bundle-barcodes";

const { Title } = Typography;

export interface BundleBarcodesProps {
    bundleNumber: string;
    barcodeInfo: KC_KnitJobBarcodeModel;
}

export class TableData {
    styleCode: string;
    color: string;
    size: string;
    qty: number;
    moNo: string;
    moLines: string;
    co: string;
    exFactDate: string;
}

export class BarcodeTableData {
    barCode: string;
    tableData: TableData[];
}

interface KnitInventryCreationProps {
    processingSerial: number;
    productCode: string;
    fgColor: string;
    eligibleBundleData: KMS_R_KnitOrderProductWiseElgBundlesModel[];
    refreshComponent: () => void
}

export const KnitInventryCreation = (props: KnitInventryCreationProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const knitReportingService = new KnittingReportingService();
    const invIssuanceService = new InvIssuanceService();
    const [bundleSummary, setBundleSummary] = useState<KMS_R_KnitBundlingProductColorBundlingSummaryModel>();
    const sdata=useRef<KMS_R_KnitBundlingProductColorBundlingSummaryModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState("bundles");
    const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
    const barcodeDataRef = useRef<KC_KnitJobBarcodeModel[]>([]);
    const [showBarcodeModal, setShowBarcodeModal] = useState<boolean>(false);
    const [fData, setFdata] = useState<BundleBarcodesProps[]>([]);
    const [tableData, setTableData] = useState<BarcodeTableData[]>([]);

    useEffect(() => {
        if (activeTab === "bundles" && props.productCode) {
            getKnitOrderBundlingSummaryForProductCodeAndColor();
        }
    }, [activeTab, props.productCode, props.fgColor]);

    const getKnitOrderBundlingSummaryForProductCodeAndColor = async () => {
        try {

            setLoading(true);
            const req = new KMS_R_KnitBundlingProductColorBundlingSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.processingSerial, props?.productCode, props?.fgColor, false, false, true);

            const res = await knitReportingService.getKnitOrderBundlingSummaryForProductCodeAndColor(req);
            if (res.status) {
                setBundleSummary(res.data);
                sdata.current=res.data;
                
                const distinctPslIds = [...new Set(res.data?.bundlesMovedToInv?.map(bundle => bundle.pslId))];
                getBundlesBarcodeDetails(distinctPslIds);

            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInventory = async () => {
        try {
            const confirmedBundles: KMS_C_KnitOrderConfirmedBundleModel[] = [];

            props.eligibleBundleData.forEach(product => {
                product.elgBundles.forEach(bundle => {
                    if (selectedBundles.includes(bundle.bundleNumber)) {
                        confirmedBundles.push({
                            bundleNo: bundle.bundleNumber,
                            confirmedQty: bundle.quantity
                        });
                    }
                });
            });

            const req = {
                username: user?.userName, unitCode: user?.orgData?.unitCode, companyCode: user?.orgData?.companyCode, userId: user?.userId,
                procSerial: props.processingSerial,
                processType: ProcessTypeEnum.KNIT,
                productCode: props.productCode,
                fgColor: props.fgColor,
                bundles: confirmedBundles,
                confirmedUser: user?.userName,
                confirmedDate: moment().format("YYYY-MM-DD HH:mm:ss")
            };

            const res = await knitReportingService.confirmProductBundlesForBundling(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                props.refreshComponent();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
            setSelectedBundles([]);
        } catch (err) {
            AlertMessages.getErrorMessage(err.message);
        }
    };

    const handleSelectBundle = (bundleNo: string) => {
        setSelectedBundles(prev =>
            prev.includes(bundleNo)
                ? prev.filter(b => b !== bundleNo)
                : [...prev, bundleNo]
        );
    };


    const onViewBArcodeData = async (size: string) => {
        setShowBarcodeModal(true);
        const data = await createBundleBarcodes(barcodeDataRef.current, size);
        setFdata(data)
        // getBundlesBarcodeDetails(size);
    }

    const getBundlesBarcodeDetails = async (distinctPslIds: number[]) => {
        const req = new INV_C_PslIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, distinctPslIds.map(String));
        const res = await invIssuanceService.getBundlesBarcodeDetails(req);
        if (res.status) {
            barcodeDataRef.current = res.barcodeInfo;
            const data =await getBarcodeTableDataFromBundles(res.barcodeInfo);
            setTableData(data);
        }
    }

    const createBundleBarcodes = async (barcodeData: KC_KnitJobBarcodeModel[], size: string): Promise<BundleBarcodesProps[]> => {
        let filteredBundles: KMS_R_KnitOrderConfirmedBundleModel[];
        if (size != '' && size) {
            filteredBundles = bundleSummary?.bundlesMovedToInv
                ?.filter(bundle => bundle.size === size) || [];
        } else {
            filteredBundles = bundleSummary?.bundlesMovedToInv;
        }
        if (!filteredBundles) return [];
        return filteredBundles?.map(bundle => {
            // Find the appropriate PSL ID data
            const pslData = barcodeData?.find(rec => rec.pslId?.toString() === bundle.pslId?.toString());
            if (!pslData) {
                console.error(`No PSL data found for pslId: ${bundle?.pslId}`);
                // Instead of throwing error, return a default structure or skip
                return {
                    bundleNumber: bundle.pbNumber,
                    barcodeInfo: {
                        jobNumber: "",
                        barcode: "",
                        color: bundle.color,
                        size: bundle.size,
                        qty: bundle.qty,
                        bcdNumber: "",
                        features: {
                            moNumber: [],
                            moLineNumber: [],
                            moOrderSubLineNumber: [],
                            coNumber: [],
                            styleName: "",
                            styleDescription: "",
                            exFactoryDate: [],
                            schedule: [],
                            zFeature: [],
                            styleCode: [],
                            customerName: []
                        },
                        pslId: bundle.pslId?.toString(),
                    }
                };
            }

            // Create the barcodeInfo by combining bundle data with PSL data
            const barcodeInfo: KC_KnitJobBarcodeModel = {
                ...pslData,
                color: bundle.color,
                size: bundle.size,
                qty: bundle.qty,
                pslId: bundle.pslId?.toString(),
            };

            return {
                bundleNumber: bundle.pbNumber,
                barcodeInfo
            };
        }) || [];
    }

    const  getBarcodeTableDataFromBundles= async (bundleData: KC_KnitJobBarcodeModel[]):Promise<BarcodeTableData[]> =>{
        const data = sdata.current?.bundlesMovedToInv;
        

        return data?.map(item => {
            const pslData = bundleData?.filter(rec => rec.pslId?.toString() === item.pslId?.toString());
            const tableData: TableData[] = pslData.map(record => ({
                styleCode: record.features.styleCode?.[0] ?? '',
                color: item.color ?? '',
                size: item.size ?? '',
                qty: item.qty ?? 0,
                moNo: record.features.moNumber?.[0] ?? '',
                moLines: record.features.moLineNumber?.[0] ?? '',
                co: record.features.coNumber?.[0] ?? '',
                exFactDate: record.features.exFactoryDate?.[0] ?? '',
            }));

            return {
                barCode: item.pbNumber,
                tableData,
            };
        }) ?? [];
    }

    const renderBundles = () => {
        if (loading) return <Spin />;
        if (!bundleSummary) return null;
        const sizeMap: Record<string, any[]> = {};
        bundleSummary.bundlesMovedToInv.forEach((bundle) => {
            if (!sizeMap[bundle.size]) {
                sizeMap[bundle.size] = [];
            }
            sizeMap[bundle.size].push(bundle);
        });



        return (
            <>
                <div style={{ padding: "0.5rem", marginTop: '0px' }}>
                    {Object.keys(sizeMap).map((size) => (
                        <div key={size}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Title level={5} style={{ marginTop: '0px', marginBottom: '0px' }}>{size}</Title>
                                </Col>
                                <Col>
                                    <Button
                                        icon={<QrcodeOutlined style={{ fontSize: '14px' }} />}
                                        type="primary"
                                        shape="round"
                                        onClick={() => onViewBArcodeData(size)}
                                        style={{
                                            padding: '0 10px',
                                            height: '34px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: '#1890ff',
                                            color: '#fff',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        View Barcodes
                                    </Button>
                                </Col>

                            </Row>
                            <Row gutter={16}>
                                {sizeMap[size].map((bundle, index) => {

                                    return (
                                        <div key={index} style={{ display: 'inline-block', margin: '4px' }}>
                                            <Popover
                                                placement="top"
                                                trigger="hover"
                                                overlayInnerStyle={{ padding: 0 }}
                                                content={
                                                    (() => {
                                                        const data = tableData?.find(row => row.barCode === bundle.bundleNumber)?.tableData?.[0];

                                                        return data ? (
                                                            <Descriptions
                                                                column={2}
                                                                size="small"
                                                                bordered
                                                                style={{ backgroundColor: 'white', padding: '8px' }}
                                                            >
                                                                <Descriptions.Item label="Style Code">{data.styleCode}</Descriptions.Item>
                                                                <Descriptions.Item label="Color">{data.color}</Descriptions.Item>
                                                                <Descriptions.Item label="Size/Qty">{`${data.size} / ${data.qty}`}</Descriptions.Item>
                                                                <Descriptions.Item label="MO No / MO Lines">{`${data.moNo} / ${data.moLines}`}</Descriptions.Item>
                                                                <Descriptions.Item label="CO">{data.co}</Descriptions.Item>
                                                                <Descriptions.Item label="Ex-Factory Date">
                                                                    {new Date(data.exFactDate).toLocaleDateString('en-GB')}
                                                                </Descriptions.Item>
                                                                <Descriptions.Item label="BarCode">{bundle.bundleNumber}</Descriptions.Item>
                                                            </Descriptions>
                                                        ) : null;
                                                    })()
                                                }
                                            >
                                                <Tag style={{ minWidth: '45px', textAlign: 'center' }} color="#257d82">
                                                    {bundle.bundleNumber}
                                                </Tag>
                                            </Popover>
                                        </div>


                                    );
                                })}
                            </Row>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const renderMoveToInventory = () => {
        const sizeMap: Record<string, any[]> = {};
        if (props?.eligibleBundleData?.length) {
            props.eligibleBundleData.forEach(product => {
                product?.elgBundles?.forEach(bundle => {
                    if (!sizeMap[bundle.size]) sizeMap[bundle.size] = [];
                    sizeMap[bundle.size].push({ ...bundle, productCode: product.productCode });
                });
            });
        }

        const allBundles = Object.values(sizeMap).flat();
        const allBundleNumbers = allBundles.map(b => b.bundleNumber);
        const allSelected = allBundleNumbers.length > 0 && allBundleNumbers.every(b => selectedBundles.includes(b));

        return (
            <div style={{ padding: "0.5rem", marginTop: '0px' }}>
                {allBundles.length > 0 ? (
                    <>
                        <div style={{ marginBottom: "0.3rem" }}>
                            <Checkbox
                                checked={allSelected}
                                onChange={() => {
                                    if (allSelected) {
                                        setSelectedBundles([]);
                                    } else {
                                        setSelectedBundles(allBundleNumbers);
                                    }
                                }}
                            >
                                Select All Bundles
                            </Checkbox>
                        </div>

                        {Object.keys(sizeMap).map((size) => {
                            const bundles = sizeMap[size];

                            return (
                                <div key={size}>
                                    <Title level={5} style={{ marginTop: '0px' }}>{size}</Title>
                                    <Row gutter={16}>
                                        {bundles.map((bundle, index) => (
                                            <Col key={index}>
                                                <Checkbox
                                                    checked={selectedBundles.includes(bundle.bundleNumber)}
                                                    onChange={() => handleSelectBundle(bundle.bundleNumber)}
                                                >
                                                    <Tag
                                                        style={{ minWidth: '60px', textAlign: 'center' }}
                                                        color={selectedBundles.includes(bundle.bundleNumber) ? "#257d82" : "default"}
                                                    >
                                                        {bundle.bundleNumber}
                                                    </Tag>
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            );
                        })}

                        <Button type="primary" style={{ marginTop: '0.3rem' }} onClick={handleCreateInventory} disabled={selectedBundles.length === 0} >
                            Create Inventory
                        </Button>
                    </>
                ) : (
                    <div>No bundles available</div>
                )}
            </div>
        );
    };

    return (
        <>
            <div>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <Tabs.TabPane tab="Bundles in Inventory" key="bundles">
                        {renderBundles()}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Move to Inventory" key="move">
                        {renderMoveToInventory()}
                    </Tabs.TabPane>
                </Tabs>
            </div>

            <BundleBarcodes barcodesData={fData} onClose={() => setShowBarcodeModal(false)} isModalOpen={showBarcodeModal} printBarCodes={() => { }} />
        </>
    );
};
