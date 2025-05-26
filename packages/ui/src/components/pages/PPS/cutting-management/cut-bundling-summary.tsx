import { CPS_C_BundlingConfirmationIdRequest, CPS_C_BundlingConfirmationRequest, CPS_ELGBUN_C_MainDocketRequest, CPS_R_ActualDocketsForBundlingModel, CPS_R_BundlingConfirmationModel, CPS_R_CutBundlingSummaryRequest, CPS_R_CutOrderConfirmedBundleModel, CPS_R_CutOrderConfirmedBundlesModel } from "@xpparel/shared-models";
import { CutBundlingService } from "@xpparel/shared-services";
import { Button, Modal, Space, Table, Tabs, Tag, Tooltip } from "antd";
import { ColumnType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";
import printJS from "print-js";
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';
import { CheckCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { BundlingTableRow } from "./cutting-main-panel";
// import { KnitInventryCreation } from "./knit-inventry-creation";

interface KnitBundlingSummaryProps {
    bundlingSummary: BundlingTableRow[]
    processingSerial: number;
    productCode: string;
    fgColor: string;
    productName: string;
    sizes: string[];
    activeTabKey: string;
    refreshComponent: () => void;
}


interface moveToInventoryTableData {
    docket: string;
    layNumber: number;
    totalPlanQty: number;
    totalCutRepQty: number;
    totalBundledQty: number;
}

interface inInventoryTableData {
    confirmationId: number;
    confirmedBy: string;
    mainDocket: string;
    totalBundles: number;
    totalBundledQty: number;
    closed: boolean;
    confirmedOn: string;
}

interface printLabelData {
    pCode: string;
    pName: string;
    pType: string;
    qty: number;
    confirmedQty: number;
    color: string;
    size: string;
    abNumber: string;
}

export const CuttBundlingSummary = ({ bundlingSummary, processingSerial, productCode, productName, fgColor, refreshComponent, sizes, activeTabKey }: KnitBundlingSummaryProps) => {
    console.log('sizes', sizes);
    const [activeTab, setActiveTab] = useState("mtoInv");
    const [moveToInventoryData, setMoveToInventoryData] = useState<CPS_R_ActualDocketsForBundlingModel[]>([])
    const [inInventoryData, setInInventoryData] = useState<CPS_R_BundlingConfirmationModel[]>();
    const [moveToInventoryTableData, setMoveToInventoryTableData] = useState<moveToInventoryTableData[]>([])
    const [inInventoryTableData, setinInventoryTableData] = useState<inInventoryTableData[]>([])
    const cutBundlingService = new CutBundlingService();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [labelData, setLabelData] = useState<printLabelData[]>([]);
    const printAreaRef = useRef<HTMLDivElement>(null);
    const [elegibleBundles, setEligibleBundlesData] = useState<CPS_R_CutOrderConfirmedBundleModel[]>([]);
    const [open, setOpen] = useState(false);



    const handleConfirmBundling = async (record) => {
        const req = new CPS_C_BundlingConfirmationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record?.docket, record?.layNumber, user?.userName);
        const res = await cutBundlingService.confirmBundlingForActualDocket(req)
        if (res.status) {
            AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
            AlertMessages.getErrorMessage(res.internalMessage);
        }
    };

    const viewPossibleBundles = async (record) => {
        const req = new CPS_ELGBUN_C_MainDocketRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record?.docket, record?.layNumber, true);
        const res = await cutBundlingService.getEligibleBundlesAgainstDocketForBundling(req)
        if (res.status) {
            setEligibleBundlesData(res.data);
            setOpen(true);
            // AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
            setEligibleBundlesData([]);
            AlertMessages.getErrorMessage(res.internalMessage);
        }
    };

    const possibleBundlesColumns = [
        { title: 'PSL ID', dataIndex: 'pslId', key: 'pslId' },
        { title: 'PB Number', dataIndex: 'pbNumber', key: 'pbNumber' },
        { title: 'AB Number', dataIndex: 'abNumber', key: 'abNumber' },
        { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
        { title: 'Confirmed Quantity', dataIndex: 'confirmedQty', key: 'confirmedQty' },
        { title: 'Color', dataIndex: 'color', key: 'color' },
        { title: 'Size', dataIndex: 'size', key: 'size' },
        { title: 'Shade', dataIndex: 'shade', key: 'shade' }
    ];


    useEffect(() => {
        if (activeTab === "mtoInv") {
            getActualDocketsFoBundlingForPoProdCodeAndColor();
        }
        if (activeTab === 'Invs') {
            getBundlingConfirmationsForPoProdColor();
        }
    }, [activeTab, activeTabKey]);

    const renderSizeColumn = (value: string) => {

        // Ensure value is a non-empty string
        if (typeof value !== 'string' || !value.includes(',')) {
            return (
                <Tag color="gray">
                    Invalid Data
                </Tag>
            );
        }

        const [doc, cut, order] = value.split(',').map(x => x.trim() || 'N/A');

        return (
            <Space>
                <Tooltip title="Document Generated Quantity">
                    <Tag color="#257d82">{doc}</Tag>
                </Tooltip>
                <Tooltip title="Cut Report Quantity">
                    <Tag color="#da8d00">{cut}</Tag>
                </Tooltip>
                <Tooltip title="Order Quantity">
                    <Tag color="#ff0000">{order}</Tag>
                </Tooltip>
            </Space>
        );
    };

    const Basecolumns = [
        {
            title: 'Item Code',
            dataIndex: 'itemCode',
            key: 'itemCode',
            align: 'center' as 'center',
            render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Components',
            dataIndex: 'components',
            key: 'components',
            align: 'center' as 'center',
        },
    ];

    const dynamicSizeColumns = sizes.map(size => ({
        title: size,
        dataIndex: size,
        key: size.toLowerCase(),
        align: 'center' as const,
        render: renderSizeColumn
    }));

    const columns = [...Basecolumns, ...dynamicSizeColumns];


    const MoveTpInvcolumns: ColumnType<any>[] = [
        {
            title: 'Docket',
            dataIndex: 'docket',
            key: 'docket',
            align: 'center',
            render: (text: string) => <Tag color="purple">{text}</Tag>
        },
        {
            title: 'Lay Number',
            dataIndex: 'layNumber',
            key: 'layNumber',
            align: 'center',
        },
        {
            title: 'Total Plan Qty',
            dataIndex: 'totalPlanQty',
            key: 'totalPlanQty',
            align: 'center',
        },
        {
            title: 'Total Cut Rep Qty',
            dataIndex: 'totalCutRepQty',
            key: 'totalCutRepQty',
            align: 'center',
        },
        {
            title: 'Total Bundled Qty',
            dataIndex: 'totalBundledQty',
            key: 'totalBundledQty',
            align: 'center',
        },
        {
            title: 'Bundling Status',
            dataIndex: 'bundlingStatus',
            key: 'bundlingStatus',
            align: 'center',
            render: (_, record) => {
                const isFull = record.totalCutRepQty === record.totalBundledQty;
                return isFull ? (
                    <Tag color="green">Full</Tag>
                ) : (
                    <Tag color="orange">Partial</Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                const isFull = record.totalCutRepQty === record.totalBundledQty;
                return (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleConfirmBundling(record)}
                        disabled={isFull}
                    >
                        Confirm Bundling
                    </Button>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                const isFull = record.totalCutRepQty === record.totalBundledQty;
                return (
                    <Button type="primary" onClick={() => viewPossibleBundles(record)} size="small" disabled={isFull}>
                        View Possible Bundles
                    </Button>
                );
            },
        },
    ];


    const InInvColumns: ColumnType<any>[] = [
        {
            title: 'Confirmation ID',
            dataIndex: 'confirmationId',
            key: 'confirmationId',
            align: 'center' as const,
            render: (text: string) => <Tag color="green">{text}</Tag>
        },
        {
            title: 'Confirmed By',
            dataIndex: 'confirmedBy',
            key: 'confirmedBy',
            align: 'center'
        },
        {
            title: 'Confirmed On',
            dataIndex: 'confirmedOn',
            key: 'confirmedOn',
            align: 'center'
        },
        {
            title: 'Ref Docket',
            dataIndex: 'mainDocket',
            key: 'refDocket',
            align: 'center'
        },
        {
            title: 'Total Actual Bundles',
            dataIndex: 'totalBundles',
            key: 'totalActualBundles',
            align: 'center'
        },
        {
            title: 'Total Bundled Qty',
            dataIndex: 'totalBundledQty',
            key: 'totalBundledQty',
            align: 'center'
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleActionViewBarcodes(record)}>
                    View Barcodes
                </Button>
            )
        }
    ];

    const getActualDocketsFoBundlingForPoProdCodeAndColor = async () => {
        const req = new CPS_R_CutBundlingSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, productName, fgColor, false, false)
        const res = await cutBundlingService.getActualDocketsFoBundlingForPoProdCodeAndColor(req);
        if (res.status) {
            setMoveToInventoryData(res.data);
            const data = mapToMoveToInventoryTableData(res.data);
            setMoveToInventoryTableData(data);
        } else {
            setMoveToInventoryData([])
            setMoveToInventoryTableData([])
        }
    }

    function mapToMoveToInventoryTableData(data: CPS_R_ActualDocketsForBundlingModel[]): moveToInventoryTableData[] {
        return data?.map(item => ({
            docket: item.docketNumber,
            layNumber: item.underDocLayNumber,
            totalPlanQty: item.totalDocQty,
            totalCutRepQty: item.totalCutRepQty,
            totalBundledQty: item.totalBundledQty
        }));
    }


    const getBundlingConfirmationsForPoProdColor = async () => {
        const req = new CPS_R_CutBundlingSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, productName, fgColor, false, false)
        const res = await cutBundlingService.getBundlingConfirmationsForPoProdColor(req);
        setInInventoryData(res.data);
        if (res.status) {
            setInInventoryData(res.data);
            const data = mapToInInventoryTableData(res.data)
            setinInventoryTableData(data);
        }
        else {
            setinInventoryTableData([])
            setInInventoryData(null);
        }
    }



    function mapToInInventoryTableData(data: CPS_R_BundlingConfirmationModel[]): inInventoryTableData[] {
        return data?.map(item => ({
            confirmationId: item?.confirmationId,
            confirmedBy: item?.confirmedBy,
            mainDocket: item?.mainDocket,
            totalBundles: item?.totalBundles,
            totalBundledQty: item?.totalBundledQty,
            closed: item?.closed,
            confirmedOn: item?.confirmedOn,

        }))
    }


    const handleActionViewBarcodes = async (record: any) => {
        const req = new CPS_C_BundlingConfirmationIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record?.confirmationId);
        const res = await cutBundlingService.getConfirmedBundlesForConfirmationId(req);
        if (res.status) {
            console.log('resssss', res.data);
            // handlePrint(res.data)
            const data = mapToPrintLabelData(res.data);
            setLabelData(data);
            setIsModalOpen(true);
        } else {

        }

    }

    function mapToPrintLabelData(data: CPS_R_CutOrderConfirmedBundlesModel[]): printLabelData[] {
        const result: printLabelData[] = [];
        data?.forEach(model => {
            model.prodWiseBundles?.forEach(product => {
                product.bundles?.forEach(bundle => {
                    result.push({
                        pCode: product.pCode,
                        pName: product.pName,
                        pType: product.pType,
                        qty: bundle.qty,
                        confirmedQty: bundle.confirmedQty,
                        color: bundle.color,
                        size: bundle.size,
                        abNumber: bundle.abNumber
                    });
                });
            });
        });
        return result;
    }



    function moveToInventory() {
        return <>
            <Table
                columns={MoveTpInvcolumns}
                dataSource={moveToInventoryTableData}
                size="small"
                pagination={false}
                bordered 
                scroll={{x: 'max-content'}}
            ></Table>
        </>
    }

    function inInventory() {
        return <>
            <Table
                columns={InInvColumns}
                dataSource={inInventoryTableData}
                size="small"
                pagination={false}
                bordered
                scroll={{x: 'max-content'}}
                onRow={(record) => ({
                    style: record.closed
                        ? {
                            backgroundColor: '#ffe6e6', 
                            color: '#a94442',         
                            pointerEvents: 'none',
                            opacity: 0.7,
                        }
                        : {},
                })}
            ></Table>
        </>
    }


    const handleOk = () => {
        setIsModalOpen(false);
        setOpen(false)

    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setLabelData([]);
        setEligibleBundlesData([])
        setOpen(false)
    };

    const printAllBarCodes = () => {
        const pageContent = document.getElementById("printArea");
        if (pageContent) {
            printJS({
                printable: pageContent,
                type: "html",
                showModal: true,
                modalMessage: "Loading...",
                targetStyles: ['*'],
                style: `
              @page { size: 384px 192px; margin: 0mm; }
              body { margin: 0; padding: 0; }
              #printArea { width: 384px; height: 220px; overflow: hidden; }
              #printArea > div { width: 100%; height: 100%; padding: 0; margin: 0; }
              .ant-modal-body { padding: 0 !important; }
            `
            });
            setIsModalOpen(false);
        } else {
            AlertMessages.getErrorMessage("Page content element not found.");
        }
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={bundlingSummary}
                size="small"
                bordered
                pagination={false}
                scroll={{x: 'max-content'}}
            />
            <div>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <Tabs.TabPane
                        tab={
                            <>
                                <InboxOutlined />
                                <strong>Move to Inventory</strong>
                            </>

                        }
                        key="mtoInv"
                    >
                        {moveToInventory()}
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab={
                            <>
                                <CheckCircleOutlined />
                                <strong>In Inventory</strong>
                            </>

                        }
                        key="Invs"
                    >
                        {inInventory()}
                    </Tabs.TabPane>


                </Tabs>
            </div>

            <Modal
                title={<Space>View Barcodes<Button type="primary" onClick={printAllBarCodes}>Print</Button></Space>}
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
                width={415}
                style={{ top: 20, height: '100%' }}
            >
                <div id="printArea" ref={printAreaRef} style={{ width: '384' }}>
                    {labelData.map((label, index) => (
                        <div
                            key={index}
                            className="label"
                            style={{ padding: '10px' }}
                        >
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div
                                    style={{ flex: '0 0 120px', maxWidth: '120px', minWidth: '120px' }}
                                >
                                    <QRCode
                                        value={label.abNumber}
                                        size={100}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                                <div
                                    style={{ flex: 1, minWidth: '200px', paddingLeft: '12px' }}
                                >
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>Product:</strong> {label.pName} - {label.pName}
                                    </p>
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>Product Code:</strong> {label.pCode} - {label.pName}
                                    </p>
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>Type:</strong> {label.pType}
                                    </p>
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>Color:</strong> {label.color}
                                    </p>
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>Size:</strong> {label.size}
                                    </p>
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>Qty:</strong> {label.qty} / <strong>Confirmed:</strong> {label.confirmedQty}
                                    </p>
                                    <div style={{ textAlign: 'center', marginBottom: 0 }}>
                                        <Barcode
                                            value={label.abNumber}
                                            fontSize={12}
                                            displayValue={true}
                                            width={1.2}
                                            height={35}
                                            format="CODE128"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </Modal>


            <Modal
                title="Possible Bundling Details"
                open={open}
                onCancel={handleCancel}
                footer={null}
                width={800}
                onOk={handleOk}
            >
                <Table
                    dataSource={elegibleBundles}
                    columns={possibleBundlesColumns}
                    rowKey={(record, index) => index}
                    pagination={false}
                    size="small"
                    scroll={{x: 'max-content'}}
                />
            </Modal>
        </>
    );
}




