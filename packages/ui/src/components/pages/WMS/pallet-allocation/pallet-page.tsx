import { ReloadOutlined } from "@ant-design/icons";
import { PackListIdRequest, PalletGroupTypeEnum, PalletRollsUIModel, PgRollsModel, RollInfoUIModel } from "@xpparel/shared-models";
import { LocationAllocationService } from "@xpparel/shared-services";
import { Button, Card, Descriptions, Divider, Drawer, Empty, Modal, Select, Space, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import PalletRollNameBox from "./pallet-roll-name";
import { getCssFromComponent } from "../print-barcodes/print-barcode-css.util";

interface PalletProps {
    phId: number;
}
export const PalletPage = (props: PalletProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const phId = props?.phId;
    const [selectedPalletInfo, setSelectedPalletInfo] = useState<PalletRollsUIModel>();
    const [selectedPalletId, setSelectedPalletId] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setOpen] = useState(false);
    const [changedPalletId, setChangedPalletId] = useState<string>('');
    const [palletsHead, setPalletHead] = useState<PgRollsModel[]>([])
    const locationService = new LocationAllocationService();
    const [reloadKey, setReloadKey] = useState<number>(0);
    useEffect(() => {
        if (props.phId) {
            getPalletsForPackingPallets(props.phId);
        }
    }, [reloadKey])

    const getPalletsForPackingPallets = (phId: number) => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
        locationService.getPgIdsForPackListId(phIdReq).then((res => {
            if (res.status) {
                setPalletHead(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setPalletHead([]);// Sekhar
            }
        })).catch(error => {
            setPalletHead([]);// Sekhar
            AlertMessages.getErrorMessage(error.message)
        })
    }


    const clsoeModel = () => {
        setModalOpen(false);
        setSelectedPalletId(0);
    }
    const selectPallet = (palletInfo: PalletRollsUIModel) => {
        setSelectedPalletId(palletInfo?.palletId);
        setSelectedPalletInfo(palletInfo);
        setModalOpen(true)
    }
    const renderTitle = (palletInfoParam: PalletRollsUIModel) => {
        let palletGroup = palletInfoParam.pgName;
        let noOfrolls = palletInfoParam.rollsInfo.length;
        return <Descriptions bordered size={'small'} title={<Space size='middle'><>Pallet Group : {palletGroup} </>No Of Rolls : {noOfrolls} </Space>}
        // extra={<Button type="primary">Print</Button>}
        >
            {/* <Descriptions.Item label="Pallet Code">{palletCode}</Descriptions.Item>
            <Descriptions.Item label="No Of Rolls">{noOfrolls}</Descriptions.Item> */}
        </Descriptions>
    }

    const print = () => {
        const printAreaElement = document.getElementById('printArea') as HTMLElement | null;
        const divContents = printAreaElement?.innerHTML ?? '';
        const element = window.open('', '', 'height=700, width=1024');
        element?.document.write(divContents);
        getCssFromComponent(document, element?.document);
        element?.document.close();
        // Loading image lazy
        setTimeout(() => {
            element?.print();
            element?.close()
        }, 1000);
        // clsoeModel();
    }
    const closeDrawer = () => {
        setOpen(false);
    };
    const showLargeDrawer = (palletId: number) => {
        setSelectedPalletId(palletId);
        setOpen(true);
    };
    const changePalletName = (palletId: string) => {
        setChangedPalletId(palletId);
    }
    const columns: ColumnsType<RollInfoUIModel> = [

        {
            title: 'Object No',
            dataIndex: 'externalRollNumber',
        },
        {
            title: 'Object Barcode ',
            dataIndex: 'barcode',
        },
        {
            title: 'Object Type',
            dataIndex: 'objectType',
            key: 'objectType',
        },
        {
            title: 'Lot No',
            dataIndex: 'lotNo',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNo',
        },
        // {
        //     title: 'Type',
        //     dataIndex: 'objectType',
        // },
        {
            title: 'Object Qty',
            dataIndex: 'supplierQuantity',
            key: 'supplierLength',
        },
        // {
        //     title: 'PL Length',
        //     dataIndex: 'inputLength',
        //     key: 'inputLength',
        //     render: (text, record) => { return text + '(' + record.inputLengthUom + ')' }
        // },
        {
            title: 'Object Width',
            dataIndex: 'supplierWidth',
            key: 'supplierWidth',
        },
        // {
        //     title: 'PL Width',
        //     dataIndex: 'inputWidth',
        //     key: 'inputWidth',
        //     render: (text, record) => { return text + '(' + record.inputWidthUom + ')' }
        // },
        {
            title: 'Shade',
            dataIndex: 'shade',
            key: 'shade',
        }
        // {
        //     title: 'Shrinkage Width',
        //     dataIndex: 'skWidth',
        // },
        // {
        //     title: 'Shrinkage Length',
        //     dataIndex: 'skLength',
        // },
        // {
        //     title: 'Shrinkage Group',
        //     dataIndex: 'skGroup',
        // },
        // {
        //     title: 'GSM',
        //     dataIndex: 'gsm',
        // },
        // {
        //     title: 'Remarks',
        //     dataIndex: 'remarks',
        // },
    ]
    const reload = () => {
        setReloadKey(preState => preState + 1)
    }


    const getPalletsCount = (pgs: PgRollsModel[], type: PalletGroupTypeEnum) => {
        let count = 0;
        pgs.forEach(pallet => {
            if (pallet.pgType == type) {
                count++;
            }
        });
        return count;
    }

    return (<>
        <Card size="small" className="card-title-bg-cyan" title="System Suggested Pallet Roll Allocation For Inspection"
            extra={
                <>
                    <Tag color="magenta">
                        Total Pallets : <b>{palletsHead ? getPalletsCount(palletsHead, PalletGroupTypeEnum.INSPECTION) : 0}</b>
                    </Tag>
                    <Tooltip title='Refresh' placement='topRight'>
                        <Button onClick={reload} icon={<ReloadOutlined />} />
                    </Tooltip>
                </>
            }
        >

            {palletsHead.filter(pallet => pallet.pgType == PalletGroupTypeEnum.INSPECTION).map((palletObj, index) => {
                return <><PalletRollNameBox key={`ins-${index}`} selectPallet={selectPallet} selectPalletToUpdate={showLargeDrawer} phId={phId} pgObj={palletObj} /></>
            })}
            {palletsHead.filter(pallet => pallet.pgType == PalletGroupTypeEnum.INSPECTION).length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>
        <Divider />
        <Card size="small" className="card-title-bg-cyan" title="System Suggested Pallet Roll Allocation For Warehouse"
            extra={
                <>
                    <Tag color="magenta">
                        Total Pallets : <b>{palletsHead ? getPalletsCount(palletsHead, PalletGroupTypeEnum.WAREHOUSE) : 0}</b>
                    </Tag>
                    <Tooltip title='Refresh' placement='topRight'>
                        <Button onClick={reload} icon={<ReloadOutlined />} />
                    </Tooltip>
                </>
            }

        >
            {palletsHead.filter(pallet => pallet.pgType == PalletGroupTypeEnum.WAREHOUSE).map((palletObj, index) => {
                return <><PalletRollNameBox key={`ins-${index}`} selectPallet={selectPallet} selectPalletToUpdate={showLargeDrawer} phId={phId} pgObj={palletObj} /></>
            })}
            {palletsHead.filter(pallet => pallet.pgType == PalletGroupTypeEnum.WAREHOUSE).length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>
        <Modal
            // title={<Button type="primary">Print</Button>}
            style={{ top: 20 }}
            width={'100%'}
            open={modalOpen}
            onOk={clsoeModel}
            onCancel={clsoeModel}
            footer={[<Button key="back" type="primary" onClick={print}>Print</Button>, <Button onClick={clsoeModel} >Close</Button>]}
        >
            <div id='printArea'>
                {selectedPalletInfo && renderTitle(selectedPalletInfo)}
                <Table columns={columns} pagination={false} scroll={{ x: true, }} bordered dataSource={selectedPalletInfo ? selectedPalletInfo.rollsInfo : []} size="small" />
            </div>
        </Modal>
        <Drawer
            title={`Update Pallet for`}
            placement="right"
            size={'large'}
            onClose={closeDrawer}
            open={drawerOpen}
            // width='70%'
            extra={

                <Space>
                    <Button onClick={closeDrawer}>Cancel</Button>
                    <Button type="primary" onClick={closeDrawer}>
                        OK
                    </Button>
                </Space>
            }
        >

            <>
                {selectedPalletInfo && renderTitle(selectedPalletInfo)}
                <br />
                <Space size={'large'}>
                    <Select
                        showSearch
                        placeholder="Select a Pallet"
                        optionFilterProp="children"
                        style={{ width: '300px' }}
                        onChange={changePalletName}
                        value={`${selectedPalletId}`}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: '20',
                                label: 'Pallet 1',
                            },
                            {
                                value: '2',
                                label: 'Pallet 2',
                            },
                            {
                                value: '3',
                                label: 'Pallet 3',
                            },
                        ]}
                    />
                    <Button type="primary" onClick={closeDrawer}>Update</Button>
                </Space>
            </>
        </Drawer>
    </>)
}
export default PalletPage;