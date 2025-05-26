import { BinIdRequest, BinModel, PalletRollsUIModel, RackBinPalletsModel, RollInfoUIModel } from "@xpparel/shared-models";
import { LocationAllocationService } from "@xpparel/shared-services";
import { Button, Card, Descriptions, Modal, Space, Table } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
// import { AlertMessages } from "../../../../common";

import { ColumnsType } from "antd/es/table";
// import { getCssFromComponent } from "../../print-barcodes";
import PalletBox from "./pallet-box";
import { AlertMessages } from "../../../common";
import { getCssFromComponent } from "../print-barcodes";
interface RackBlockProps {
    rackId: number;
    rackLevel: number;
    column: number;
    binInfo: BinModel;
    filterVal: string;
}
const BinBlock = (props: RackBlockProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const { rackId, rackLevel, column, binInfo, filterVal } = props;
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (binInfo) {
            getBinPalletsWithoutRolls(binInfo);
        }
    }, []);

    const locationService = new LocationAllocationService();
    const [binPalletInfo, setBinPalletInfo] = useState<RackBinPalletsModel>();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPalletInfo, setSelectedPalletInfo] = useState<PalletRollsUIModel>();
    const getBinPalletsWithoutRolls = (binObj: BinModel) => {
        setLoading(true);
        const binReq = new BinIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, binObj.binId, binObj.binCode);
        locationService.getBinPalletsWithoutRolls(binReq).then((res => {
            if (res.status) {
                setBinPalletInfo(res.data[0]);
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
                setBinPalletInfo(undefined);
            }
            setLoading(false);
        })).catch(error => {
            setLoading(false);
            setBinPalletInfo(undefined);
            AlertMessages.getErrorMessage(error.message)
        })
    }

    const closeModel = () => {
        setModalOpen(false);
        setSelectedPalletInfo(undefined);
    }
    const selectPallet = (palletInfo: PalletRollsUIModel) => {
        if (palletInfo) {
            setSelectedPalletInfo(palletInfo);
            setModalOpen(true);
        }
    }
    const renderTitle = (palletInfoParam: PalletRollsUIModel) => {
        let palletCode = palletInfoParam.palletCode;
        let noOfrolls = palletInfoParam.rollsInfo.length;
        return <Descriptions bordered size={'small'} title={<Space size='middle'><>Pallet Code : {palletCode} </>No Of Rolls : {noOfrolls} </Space>}
        // extra={<Button type="primary">Print</Button>}
        >

        </Descriptions>
    }
    const columns: ColumnsType<RollInfoUIModel> = [
        {
            title: 'Roll No',
            dataIndex: 'externalRollNumber',
        },
        {
            title: 'Barcode ',
            dataIndex: 'barcode',
        },
        {
            title: 'Lot No',
            dataIndex: 'lotNo',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNo',
        },

        {
            title: 'Qty',
            dataIndex: 'supplierQuantity',
        },

        {
            title: 'Width',
            dataIndex: 'supplierWidth',
        },
        {
            title: 'Length',
            dataIndex: 'supplierLength',
        },
        {
            title: 'Shade',
            dataIndex: 'shade',
        }
    ]
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
    return (
        <>
            <Card  loading={loading} size="small" bordered={false} title={`${binInfo?.binCode}`} style={{ boxShadow: 'none' }} headStyle={{ minHeight: 0, background: 'cadetblue', textAlign: 'center', color: '#f2f2f2' }} bodyStyle={{ padding: 0, width: '134px' }}  >
                {binPalletInfo ?
                    <>
                        {binPalletInfo.binInfo.map((bin) => {
                            return bin.palletsInfo.map((palletObj, index) => {
                                return <PalletBox key={`ware-${'ref' + bin.binCode + '-' + index}`} selectPallet={selectPallet} palletObj={palletObj} filterVal={filterVal} />
                            })
                        })}
                    </> : ''}
            </Card>
            <Modal
                // title={<Button type="primary">Print</Button>}
                style={{ top: 20 }}
                width={'100%'}
                open={modalOpen}
                onOk={closeModel}
                onCancel={closeModel}
                footer={[<Button key="back" type="primary" onClick={print}>Print</Button>, <Button onClick={closeModel} >Close</Button>]}
            >
                <div id='printArea'>
                    {selectedPalletInfo && renderTitle(selectedPalletInfo)}
                    <Table columns={columns} pagination={false} scroll={{ x: true, }} bordered dataSource={selectedPalletInfo ? selectedPalletInfo.rollsInfo : []} size="small" />
                </div>
            </Modal>
        </>
    )
}

export default BinBlock;