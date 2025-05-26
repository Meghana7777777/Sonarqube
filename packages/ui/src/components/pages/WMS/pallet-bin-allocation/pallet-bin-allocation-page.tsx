import { CommentOutlined, CustomerServiceOutlined, ScanOutlined } from "@ant-design/icons";
import {  InspectionPalletRollsModel, PalletRollsUIModel, RollInfoUIModel, RackBinPalletsModel, CurrentPalletLocationEnum, CurrentPalletStateEnum, PackListIdRequest, BinDetailsModel } from "@xpparel/shared-models";
import { LocationAllocationService } from "@xpparel/shared-services";
import { Button, Card, Col, Descriptions, Divider, Drawer, Empty, FloatButton, Input, Modal, Row, Space, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import Bin from "./bin";
import { getCssFromComponent } from "../print-barcodes/print-barcode-css.util";
// import EmptyPalletBox from "./empty-pallet-box";
interface PalletBinProps {
    phId: number;
}
export const PalletBinAllocationPage = (props:PalletBinProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const phId = props?.phId;
    useEffect(() => {
        if (props.phId) {
            getBinsMappedForPackingList(props.phId);
        }
    }, [])
    const [bins,setBins] = useState<BinDetailsModel[]>([]);
    const [palletsBins, setPalletBins] = useState<RackBinPalletsModel[]>();
    const [insPalletsRolls, setInsPalletsRolls] = useState<PalletRollsUIModel[]>([]);
    const [warehPalletsRolls, setWarehPalletsRolls] = useState<PalletRollsUIModel[]>([]);
  
    const [selectedPalletId, setSelectedPalletId] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false);
    const locationService = new LocationAllocationService();
    const getBinsMappedForPackingList = (phId: number) => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
        locationService.getBinsMappedForPackingList(phIdReq).then((res => {
            if (res.status) {
                setBins(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setBins([]);
            }
        })).catch(error => {
            setBins([]);
            AlertMessages.getErrorMessage(error.message)
        })
    }

    /**
     * 
     * @param palletInfo 
     */

    
    const columns: ColumnsType<RollInfoUIModel> = [
        {
            title: 'Object No',
            dataIndex: 'rollNumber',
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
            title: 'Ext ',
            dataIndex: 'externalRollNumber',
        },
        {
            title: 'Type',
            dataIndex: 'objectType',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
        },
        {
            title: 'UOM',
            dataIndex: 'uom',
        },
        {
            title: 'Width',
            dataIndex: 'width',
        },
        {
            title: 'Length',
            dataIndex: 'length',
        },
        {
            title: 'Shade',
            dataIndex: 'shade',
        },
        {
            title: 'Shrinkage Width',
            dataIndex: 'skWidth',
        },
        {
            title: 'Shrinkage Length',
            dataIndex: 'skLength',
        },
        {
            title: 'Shrinkage Group',
            dataIndex: 'skGroup',
        },
        {
            title: 'GSM',
            dataIndex: 'gsm',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
        },
    ]
    const getTblData = (palletId: number) => {
        const insRolls = insPalletsRolls.find(palletObj => palletObj.palletId === palletId);
        if (insRolls) {
            return insRolls.rollsInfo;
        }
        const wareRolls = warehPalletsRolls.find(palletObj => palletObj.palletId === palletId);
        if (wareRolls) {
            return wareRolls.rollsInfo;
        }
        return [];
    }
    const clsoeModel = () => {
        setModalOpen(false);
        setSelectedPalletId(0);
    }
    const selectPallet = (palletId: number) => {
        setSelectedPalletId(palletId);
        setModalOpen(true)
    }
    const renderTitle = (palletId: number) => {
        let palletCode = '';
        let noOfrolls = 0;
        const insRolls = insPalletsRolls.find(palletObj => palletObj.palletId === palletId);
        if (insRolls) {
            palletCode = insRolls.palletCode;
            noOfrolls = insRolls.rollsInfo.length;
        }
        const wareRolls = warehPalletsRolls.find(palletObj => palletObj.palletId === palletId);
        if (wareRolls) {
            palletCode = wareRolls.palletCode;
            noOfrolls = wareRolls.rollsInfo.length;
        }
        return <Descriptions bordered size={'small'} title={<Space size='middle'><>Pallet Code : {palletCode} </>No Of Rolls : {noOfrolls} </Space>}
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

    return (<>
        <Card size="small" className="card-title-bg-cyan" title="System Suggested Bin Pallet Allocation" extra={<a href="#">Reload</a>} >
          
            {/* <Space direction="vertical" size="middle" style={{ width: '100%' }}> */}
            <Row gutter={24}>
             {
                bins.map((rack, index) => {
                    return <Bin binInfo={rack} phId={phId} />
                })
            }
            </Row>
            {/* </Space> */}
            {bins.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>
        <Divider />
      
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
                {renderTitle(selectedPalletId)}
                <Table columns={columns} pagination={false} scroll={{ x: true, }} bordered dataSource={getTblData(selectedPalletId)} size="small" />
            </div>
        </Modal>
     
       
        {/* <Switch onChange={onChange} checked={open} style={{ margin: 16 }} /> */}
    </>)
}
export default PalletBinAllocationPage;