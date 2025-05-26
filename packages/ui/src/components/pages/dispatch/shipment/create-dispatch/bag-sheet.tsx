import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PkDSetGetBarcodesRequest, PkDSetItemsBarcodesModel } from '@xpparel/shared-models';
import { Button, Descriptions, Flex, Modal, QRCode, Row, Space, Table, Tag } from 'antd';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../../WMS';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useAppSelector } from 'packages/ui/src/common';
import { DispatchReadyService } from '@xpparel/shared-services';
import { TableProps } from 'antd/lib';
import { ColumnProps } from 'antd/es/table';

interface BagSheetProps {
    cutInfo: {
        productName: string;
        dsetId: number;
        dSetItemId: number;
        dSetCode: string;
        cutNumber: string;
        moNum: string;
        bags: number;
        bundles: number;
    }
    isShow: boolean;
    updateModalState:Dispatch<SetStateAction<boolean>>;
}

interface IBagsSheetData {
    moNumber: string;
    cutNo: string;
    bagBarcode: string;
    bagName: string;
    bundleBarcode: string;
    quantity: number;
    totalMappedBundlesForBag: number;
    rowSpan?: number;
    size?: string;
}

interface ICutBagSheetInfo {
    totalMappedBundles: number;
    bagsData: IBagsSheetData[];
}

const defaultData: ICutBagSheetInfo = {
    bagsData: [],
    totalMappedBundles: 0
};

const columns: ColumnProps<IBagsSheetData>[] = [
    {
        title: 'Bag Name',
        dataIndex: 'bagName',
        align: 'center',
        onCell: (record) => ({
            rowSpan: record.rowSpan,
        }),
    },
    {
        title: 'Total Mapped Bundles for Bag',
        dataIndex: 'totalMappedBundlesForBag',
        key: 'totalMappedBundlesForBag',
        align: 'center',
        render: (text: number) => <span>{text}</span>,
        onCell: (record) => ({
            rowSpan: record.rowSpan,
        }),
    },
    {
        title: 'Size',
        dataIndex: 'size',
        align: 'center',
    },
    {
        title: 'Bundle Barcode',
        dataIndex: 'bundleBarcode',
        align: 'center',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        align: 'center',
        render: (text: number) => <span>{text}</span>,
    },
];
const BagSheetTable = (props: BagSheetProps) => {
    const {cutInfo} = props;
    const [isModalOpen, setIsModalOpen] = useState(props.isShow);
    const user = useAppSelector((state) => state.user.user.user);
    const [bagsBarcodeData, setBagsBarcodeData] = useState<ICutBagSheetInfo>(defaultData);
    const dispatchReadyService = new DispatchReadyService();

    useEffect(() => {
        if (props.cutInfo && props.isShow) {
            getBarcodeData(props.cutInfo.dsetId, props.cutInfo.dSetItemId);
        }
    }, [props.isShow]);

    const getBarcodeData = async (dsetId: number, dSetItemIds: number) => {
        try {
            const reqObj = new PkDSetGetBarcodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [dsetId], [dSetItemIds], true, true, true, true, true, true);

            const response = await dispatchReadyService.getDsetItemBarcodeInfo(reqObj);
            if (response.status) {
                if (response.data.length) {
                    const bagsData: IBagsSheetData[] = [];
                    let totalMappedBundles = 0;
                    response.data.forEach(e => {
                        // Sort containerWiseBarcodeMapping by containerName in ascending order
                        const sortedContainerMappings = e?.containerWiseBarcodeMapping.sort((a, b) => {
                            return a.containerName.localeCompare(b.containerName);
                        });

                        sortedContainerMappings.forEach(c => { // Bag obj
                            totalMappedBundles += c.containerBarcodes.length;

                            // Sort containerBarcodes by barcode in ascending order
                            const sortedContainerBarcodes = c.containerBarcodes.sort((a, b) => {
                                return a.barcode.localeCompare(b.barcode);
                            });
                            sortedContainerBarcodes.forEach((bB, i) => { // bundle barcode
                                const bagSheetObj: IBagsSheetData = {
                                    bagBarcode: c.containerBarcode,
                                    bagName: c.containerName,
                                    cutNo: e?.attrs?.l2,
                                    moNumber: e?.attrs?.l1,
                                    bundleBarcode: bB.barcode,
                                    quantity: bB.quantity,
                                    totalMappedBundlesForBag: c.containerBarcodes.length,
                                    rowSpan: i === 0 ? c.containerBarcodes.length : 0,
                                    size: bB?.detailedInfo.size,
                                };

                                bagsData.push(bagSheetObj);
                            });
                        });
                    });
                    setBagsBarcodeData({ bagsData, totalMappedBundles });
                    setIsModalOpen(true);
                } else {
                    setBagsBarcodeData(defaultData);
                    AlertMessages.getErrorMessage("No data found");
                }
            } else {
                setBagsBarcodeData(defaultData);
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (error) {
            setBagsBarcodeData(undefined);
            AlertMessages.getErrorMessage(error.message);
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setBagsBarcodeData(defaultData);
        props.updateModalState(false);
    };

    const printBagSheet = () => {
        const divContents = document.getElementById('printArea').innerHTML;
        const element = window.open('', '', 'height=700, width=1024');
        element.document.write(divContents);
        getCssFromComponent(document, element.document);
        element.document.close();
        // Loading image lazy
        setTimeout(() => {
            element.print();
            element.close();
        }, 1000);
    }


    return (
        <div>
            <Modal
                title={<Flex justify='space-between'>Bags Info <Button style={{marginRight:'50px'}} type='primary'onClick={printBagSheet} >Print</Button></Flex>}
                open={isModalOpen}
                onOk={handleOk}
                footer={''}
                style={{ top: 0 }}
                onCancel={handleCancel}
                width={'100%'}
            >
                <div id='printArea'>
                <Row>
                    <Descriptions bordered size="small">
                        <Descriptions.Item label={<strong>Manufacturing Order</strong>}>{cutInfo?.moNum}</Descriptions.Item>
                        <Descriptions.Item label={<strong>Product Name</strong>}><Tag style={{ fontSize: '14px' }} color="#d46b08">{cutInfo?.productName}</Tag></Descriptions.Item>
                        <Descriptions.Item label={<strong>Cut No</strong>}>{cutInfo?.cutNumber}</Descriptions.Item>
                        <Descriptions.Item label={<strong>No of Bags</strong>}>{cutInfo?.bags}</Descriptions.Item>
                        <Descriptions.Item label={<strong>Total Bundles</strong>}><Tag style={{ fontSize: '14px' }} color="green">{cutInfo?.bundles}</Tag></Descriptions.Item>
                        <Descriptions.Item label={<strong>Pending Bundles</strong>} style={{ flex: '1 0 100%' }}>
                        <Tag style={{ fontSize: '14px' }} color="red">  {cutInfo?.bundles - bagsBarcodeData.totalMappedBundles} </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Row>
                <br/>
                <Table
                    dataSource={bagsBarcodeData.bagsData}
                    size='small'
                    rowKey={r => r.bundleBarcode}
                    columns={columns}
                    bordered
                    pagination={false}
                />
                </div>
            </Modal>
        </div>
    );
};

export default BagSheetTable;
