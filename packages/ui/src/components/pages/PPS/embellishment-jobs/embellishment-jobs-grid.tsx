import { EyeOutlined, RedoOutlined } from "@ant-design/icons";
import { EmbBarcodePrintRequest, EmbJobNumberRequest, PfEmbLinePropsModel, PoEmbHeaderModel, PoEmbLineModel, VendorModel } from "@xpparel/shared-models";
import { EmbRequestHandlingService } from "@xpparel/shared-services";
import { Button, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import VendorSelectionPage from "./vendor-selection-page";
import EmbBarcode4X2 from "./emb-4x2-barcode-print";
interface IProps {
    poSerial: number;
    embJobNumber: string;
    embJobLines: PoEmbLineModel[];
    venderInfo: VendorModel[];
    style : string;
}
interface ITableData {
    lineId: number; // PK of the emb line entity
    embJobNumber: string;
    barcodePrintStatus: boolean
    docketNumber: string;
    itemCode: string;
    itemDesc: string;
    component: string;
    plies: number;
    layNumber: number;
    layedPlies: number;
    color: string;
}
const EmbellishmentJobsGrid = (props: IProps) => {
    useEffect(() => {
        if (props.embJobLines) {
            constructTableData(props.embJobLines)
        }
    }, []);
    const { venderInfo } = props;
    const user = useAppSelector((state) => state.user.user.user);

    const embRequestHandlingService = new EmbRequestHandlingService();
    const [selectedLineId, setSelectedLineId] = useState<number>(undefined);
    const [embInfo, setEmbInfo] = useState<PoEmbHeaderModel[]>([]);
    const [tblData, setTblData] = useState<ITableData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<VendorModel>(undefined);
    const [printBarFlag, setPrintBarFlag] = useState<boolean>(false);
    const [stateKey, setStateKey] = useState<number>(0);

    const constructTableData = (embLinesData: PoEmbLineModel[]) => {
        const dataSource: ITableData[] = [];
        embLinesData.forEach(eL => {
            const dockProps: PfEmbLinePropsModel = eL.panelFormEmbProps;
            const embLineObj: ITableData = {
                barcodePrintStatus: eL.barcodePrintStatus,
                color: dockProps.color,
                component: dockProps.components.join(),
                docketNumber: dockProps.docketNumber,
                embJobNumber: eL.embJobNumber,
                itemCode: dockProps.itemCode,
                itemDesc: dockProps.itemDesc,
                layedPlies: dockProps.layedPlies,
                layNumber: dockProps.layNumber,
                lineId: eL.lineId,
                plies: dockProps.docketPlies
            }
            dataSource.push(embLineObj);
        });
        setTblData(dataSource);
    }

    const releaseBarcodesPrintForEmbJob = (lineId: number, embJobNumber: string) => {
        const req = new EmbBarcodePrintRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, embJobNumber, [lineId], undefined);
        embRequestHandlingService.releaseBarcodesPrintForEmbJob(req).then((res => {
            if (res.status) {
                getEmbJobsForEmbJobNumber(embJobNumber);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getBundleTagsForEmb = (lineId: number, embJobNumber: string) => {
        setSelectedLineId(lineId);
        const req = new EmbJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, embJobNumber, undefined, [lineId], true, true, true);
        embRequestHandlingService.getEmbJobsForEmbJobNumber(req).then((res => {
            if (res.status) {
                setIsModalOpen(true);
                setEmbInfo(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getEmbJobsForEmbJobNumber = (embJobNumber: string) => {
        const req = new EmbJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, embJobNumber, undefined, undefined, true, true, false);
        embRequestHandlingService.getEmbJobsForEmbJobNumber(req).then((res => {
            if (res.status) {
                constructTableData(res.data[0].embLines);
                setEmbInfo(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const printBarcodesForEmbJob = (lineId: number, embJobNumber: string) => {
        const req = new EmbBarcodePrintRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, embJobNumber, [lineId], selectedVendor.id);
        embRequestHandlingService.printBarcodesForEmbJob(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                setSelectedLineId(undefined);
                setIsModalOpen(false);
                setEmbInfo([]);
                getEmbJobsForEmbJobNumber(embJobNumber);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const updateVendorDetails = (vendorInfo: VendorModel) => {
        setSelectedVendor(vendorInfo);
        setPrintBarFlag(true);
        setStateKey(preState => preState + 1);
    }
    
    const columns: ColumnsType<ITableData> = [
        {
            title: 'Sub Docket',
            dataIndex: 'docketNumber',
            align: 'center'
        },
        {
            title: 'Item',
            dataIndex: 'itemCode',
            align: 'center'
        },
        {
            title: 'Item Description',
            dataIndex: 'itemDesc',
            align: 'center'
        },
        {
            title: 'Plies',
            dataIndex: 'plies',
            align: 'center'
        },
        {
            title: 'Lay Number',
            dataIndex: 'layNumber',
            align: 'center'
        },
        {
            title: 'Layed Plies',
            dataIndex: 'layedPlies',
            align: 'center'
        },
        {
            title: 'View',
            dataIndex: 'lineId',
            align: 'center',
            render: (v, r) => <Button size="small" disabled={r.barcodePrintStatus} icon={<EyeOutlined />} type="primary" className="btn-blue" onClick={() => getBundleTagsForEmb(v, r.embJobNumber)}>View Bundle Tags</Button>
        },
        {
            title: 'Action',
            dataIndex: 'lineId',
            align: 'center',
            render: (v, r) => <Button size="small" disabled={!r.barcodePrintStatus} icon={<RedoOutlined />} className="btn-orange" type="primary" onClick={() => releaseBarcodesPrintForEmbJob(v, r.embJobNumber)}>Release Bundle Tags</Button>
        },
    ]

    return <>
        <Table size="small" columns={columns} pagination={false} bordered dataSource={tblData} scroll={{x: 'max-content'}}/>
        <Modal title="Vendor" open={isModalOpen} onOk={handleCancel} onCancel={handleCancel} footer={''}>
            <VendorSelectionPage venderInfo={venderInfo} updateVendorDetails={updateVendorDetails} />
        </Modal>
        {printBarFlag && <EmbBarcode4X2 key={stateKey + 1} embBarcodesData={embInfo} venderName={selectedVendor ? selectedVendor.vName : ''} printBarCodes={() => printBarcodesForEmbJob(selectedLineId, embInfo.length > 0 ? embInfo[0].embJobNumber : undefined)} style={props.style} />}
    </>
}

export default EmbellishmentJobsGrid;