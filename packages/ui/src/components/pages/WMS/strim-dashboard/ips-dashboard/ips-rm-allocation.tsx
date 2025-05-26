import { FileSearchOutlined, PrinterOutlined } from '@ant-design/icons';
import { INV_R_InvOutAllocationBundleModel, ProcessTypeEnum, Rm_C_OutExtRefIdToGetAllocationsRequest } from '@xpparel/shared-models';
import { WmsSpsTrimRequestService } from '@xpparel/shared-services';
import { Button, Card, message, Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import printJS from 'print-js';
import QRCode from 'qrcode.react';
import React, { useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../print-barcodes';
import SpsJobBundleSheet from './sps-job-sheet';
import moment from 'moment';

interface BundleModel {
    itemSku: string;
    bunBarcode: string;
    pslId: number;
    aQty: number;
    rQty: number;
    iQty: number;
}

interface AllocationModel {
    allocationId: number;
    allocatedBy: string;
    allocatedDate: string;
    issued: boolean;
    bundles: BundleModel[];
}

interface LabelData {
    qrCodeValue: string;
    itemSku: string;
    aQty: number;
    rQty: number;
    iQty: number;
    allocatedBy: string;
    allocatedDate: string;
    issuedBy: string;
    issuedDate: string;
}

interface Props {
    jobNumber: string;
    processType: ProcessTypeEnum;
    refreshKey: number;
    allocations: AllocationModel[];
    requestDeatils: any[];
}

const IPSRMAllocationsTablePage: React.FC<Props> = ({ jobNumber, processType, refreshKey, allocations, requestDeatils }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [labelData, setLabelData] = useState<any[]>([]);
    const user = useAppSelector((state) => state.user.user?.user);
    const printAreaRef = useRef<HTMLDivElement>(null);
    const [isBundleModelOpen, setIsBundleModelOpen] = useState(false);
    const rmService = new WmsSpsTrimRequestService();
    const [iNeedInventory, setINeedInventory] = useState(true);


    const handlePrintBundles = async () => {
        try {
            const reqModel = new Rm_C_OutExtRefIdToGetAllocationsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, requestDeatils[0].requestId);
            const response = await rmService.getRmAllocatedMaterialForRequestRefId(reqModel);
            if (response.data && response.data.length > 0) {
                const bundlesWithDetails = response.data[0]?.bundles.map((bundle: INV_R_InvOutAllocationBundleModel, index) => ({
                    qrCodeValue: bundle.bunBarcode,
                    itemSku: bundle.itemSku,
                    aQty: bundle.aQty,
                    rQty: bundle.rQty,
                    iQty: bundle.iQty,
                    allocatedBy: response.data[0].allocatedBy,
                    allocatedDate: response.data[0].allocatedDate,
                    issuedBy: response.data[0].issuedBy,
                    issuedDate: response.data[0].issuedDate,
                }));
                setLabelData(bundlesWithDetails);
                setIsModalOpen(true);
            } else {
                message.warning('No Rm Allocations found to print.');
            }
        } catch (error) {
            message.error('Failed to print bundles');
        }
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
                style: `@page { size: 384px 192px; margin: 0mm; } body { margin: 0; padding: 0; } #printArea { width: 384px; height: 220px; overflow: hidden; } #printArea > div { width: 100%; height: 100%; padding: 0; margin: 0; } .ant-modal-body { padding: 0 !important; }`
            });
            setIsModalOpen(false);
        } else {
            AlertMessages.getErrorMessage("Page content element not found.");
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setIsBundleModelOpen(false)
    };

    const handleBundleSheetModal = () => {
        setIsBundleModelOpen(true)
        setINeedInventory(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setLabelData([]);
    };

    const handleCancelBundleSheet = () => {
        setIsBundleModelOpen(false)
        setINeedInventory(true)
    }

    const getMergedData = () => {
        return requestDeatils?.map((request) => {
            return {
                key: request.requestId,
                requestId: request.requestId,
                requestCode: request.requestCode || '-',
                status: request.status,
                allocationId: request.allocationId || null,
                allocatedBy: request.allocatedBy || '-',
                allocatedDate: request.allocatedDate || '-',
                issued: request.issued || false,
                bundles: request.bundles || [],
            };
        }) || [];
    };

    const columns: ColumnsType<any> = [
        {
            title: 'Request Code',
            dataIndex: 'requestCode',
            key: 'requestCode',
            width: 120,
            render: (code) => code || '-',
        },
        {
            title: 'Allocated By',
            dataIndex: 'allocatedBy',
            align: 'center',
            width: 120,
            render: (allocatedBy) => allocatedBy || '-',
        },
        {
            title: 'Allocated On',
            dataIndex: 'allocatedDate',
            align: 'center',
            width: 120,
            render: (date) => date ? moment(date, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY hh:mm A") : '-'
        },
        {
            title: 'Request Status',
            dataIndex: 'status',
            align: 'center',
            width: 90,
            render: (status: number) => {
                let color = 'orange';
                let text = 'Open';
                if (status === 1) {
                    color = 'blue';
                    text = 'Requested';
                } else if (status === 2) {
                    color = 'green';
                    text = 'Received';
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'WH Status',
            dataIndex: 'issued',
            align: 'center',
            width: 90,
            render: (issued: boolean, record: any) => {
                let color = 'orange';
                let text = 'Open';

                if (issued === true) {
                    color = 'blue';
                    text = 'Issued';
                } else if (issued === false) {
                    color = 'green';
                    text = 'Open';
                }
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <Tag color={color}>{text}</Tag>
                        {issued === false && (
                            '-'
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Print',
            key: 'print',
            width: 150,
            align: 'center',
            render: (_, record) => {
                const isOpen = record.status === 0 || record.status === 'OPEN';
                return (
                    <Space wrap size={[8, 8]}>
                        <Button type="primary" icon={<PrinterOutlined />} className="btn-yellow" onClick={() => handlePrintBundles()} disabled={isOpen} size="small">
                            Print Bundles
                        </Button>
                        <Button
                            type="primary"
                            danger
                            icon={<FileSearchOutlined />}
                            onClick={() => handleBundleSheetModal()}
                            size="small"
                        >
                            Bundle Sheet
                        </Button>
                    </Space>
                );
            }
        }
    ];

    const printBundleSheet = () => {
        const divContents = document.getElementById('bundlePrint').innerHTML;
        const element = window.open('', '', 'height=700, width=1024');
        element.document.write(divContents);
        getCssFromComponent(document, element.document);
        element.document.close();
        setTimeout(() => {
            element.print();
            element.close();
        }, 1000);
    };

    return (
        <Card size='small' title={<span style={{ display: 'flex', justifyContent: 'center' }}>RM Allocation</span>} bordered>
            <Table columns={columns} dataSource={getMergedData()} rowKey="key" loading={loading} pagination={false} bordered size="small" scroll={{ x: 'max-content' }} locale={{ emptyText: 'No Rm allocations found' }} />
            <Modal title={<Space>Print Labels <Button type="primary" onClick={printAllBarCodes}>Print</Button></Space>} open={isModalOpen} onOk={handleOk} footer={null} onCancel={handleCancel} width={415} style={{ top: 20 }}>
                <div id="printArea" ref={printAreaRef} style={{ width: '384' }}>
                    {labelData.map((label, index) => (
                        <div
                            key={index}
                            className="label" style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: '0 0 120px', maxWidth: '120px', minWidth: '120px' }}>
                                    <QRCode value={label.qrCodeValue} size={100} style={{ width: '100%', height: 'auto' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px', paddingLeft: '12px' }}>
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>Item SKU:</strong> {label.itemSku.slice(0, 30)}
                                    </p>
                                    <p style={{ margin: '0 0 10px' }}>
                                        <strong>Issued By:</strong> {label.issuedBy}
                                    </p>
                                    <div style={{ textAlign: 'center', marginBottom: 0 }}>
                                        <Barcode
                                            value={label.qrCodeValue}
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
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>Bundle Sheet</div>
                        <Button type="primary" size='small' onClick={printBundleSheet} style={{ marginRight: '10px' }}>Print</Button>
                    </div>
                }
                open={isBundleModelOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancelBundleSheet}
                width='100%'
            >
                <SpsJobBundleSheet jobNumber={jobNumber} refreshKey={refreshKey} iNeedInventory={iNeedInventory} />
            </Modal>
        </Card>
    );
};

export default IPSRMAllocationsTablePage;
