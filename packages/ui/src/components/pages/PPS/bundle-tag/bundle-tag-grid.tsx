import { EyeOutlined, RedoOutlined } from "@ant-design/icons";
import { ActualDocketBasicInfoModel, CutStatusEnum, DocketBasicInfoModel, LayIdsRequest, PoCutModel, PoSummaryModel, cutStatusEnumDisplayValues } from "@xpparel/shared-models";
import { CutGenerationServices, LayReportingService, OrderManipulationServices, POService } from "@xpparel/shared-services";
import { Button, Card, Popover, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import BundleTagBarcode4X2 from "./bundle-4x2-barcode-print";
interface IDocketTblData {
    layId: number;
    docketNumber: string;
    itemCode: string;
    itemDesc: string;
    docketPlies: number;
    actualDocketPlies: number;
    isMainDoc: boolean;
    layNumber: number;
    cutStatus: CutStatusEnum;
    labelsPrintStatus: boolean;
    docketGroup: string;
}
interface IProps {
    poSerial: number;
    cutInfo: PoCutModel;
    style: string;
}
const BundleTagGrid = (props: IProps) => {
    const [actualDocketsInfo, setActualDocketsInfo] = useState<ActualDocketBasicInfoModel[]>([]);
    const [cutInfo, setCutInfo] = useState<PoCutModel>(undefined);
    const [tblData, setTblData] = useState<IDocketTblData[]>([])
    useEffect(() => {
        if (props.cutInfo) {
            setCutInfo(props.cutInfo)
            const acd = props.cutInfo.actualDockets.length > 0 ? props.cutInfo.actualDockets : [];
            setActualDocketsInfo(acd);
            constructTblData(props.cutInfo.dockets, acd)
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [selectedLayId, setSelectedLayId] = useState<number>(undefined);
    const [selectedDocketNumber, setSelectedLayDocketNumber] = useState<string>(undefined);
    const [actualDocketsForBundles, setActualDocketsForBundles] = useState<ActualDocketBasicInfoModel[]>([]);

    const [printBarFlag, setPrintBarFlag] = useState<boolean>(false);
    const [stateKey, setStateKey] = useState<number>(0);
    const layReportingService = new LayReportingService();

    const constructTblData = (dockets: DocketBasicInfoModel[], actualDockets: ActualDocketBasicInfoModel[]) => {
        const docketsTbl = [];
        dockets.forEach(d => {
            const actDocs = actualDockets.filter(a => a.docketNumber === d.docketNumber);
            actDocs.forEach(a => {
                const docObj: IDocketTblData = {
                    actualDocketPlies: a.actualDocketPlies,
                    cutStatus: a.cutStatus,
                    docketNumber: d.docketNumber,
                    docketPlies: d.plies,
                    isMainDoc: d.isMainDoc,
                    itemCode: d.itemCode,
                    itemDesc: d.itemDesc,
                    labelsPrintStatus: a.labelsPrintStatus,
                    layId: a.layId,
                    layNumber: a.layNumber,
                    docketGroup: d.docketGroup
                }
                docketsTbl.push(docObj);
            });
            if (actDocs.length < 1) {
                const docObj: IDocketTblData = {
                    actualDocketPlies: undefined,
                    cutStatus: undefined,
                    docketNumber: d.docketNumber,
                    docketPlies: d.plies,
                    isMainDoc: d.isMainDoc,
                    itemCode: d.itemCode,
                    itemDesc: d.itemDesc,
                    labelsPrintStatus: undefined,
                    layId: undefined,
                    layNumber: undefined,
                    docketGroup: d.docketGroup
                }
                docketsTbl.push(docObj);
            }
        });
        setTblData(docketsTbl);
    }

    const releaseBundleTagsPrintForLay = (layId: number, mainDocketNumber: string) => {
        const req = new LayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [layId], false, false, mainDocketNumber);
        layReportingService.releaseBundleTagsPrintForLay(req).then((res => {
            if (res.status) {
                getBundleTagsForLayIds(actualDocketsInfo.map(a => a.layNumber));
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getBundleTagsForLay = (layId: number, mainDocketNumber: string) => {
        setSelectedLayId(layId);
        setSelectedLayDocketNumber(mainDocketNumber);
        const req = new LayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [layId], false, true, mainDocketNumber);
        layReportingService.getActualDocketInfo(req).then((res => {
            if (res.status) {
                setActualDocketsForBundles(res.data);
                setPrintBarFlag(true);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getBundleTagsForLayIds = (layIds: number[]) => {
        const req = new LayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layIds, false, false, 'dev');
        layReportingService.getActualDocketInfo(req).then((res => {
            if (res.status) {
                setActualDocketsInfo(res.data);
                constructTblData(props.cutInfo.dockets, res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const printBundleTagsForLay = (layId: number, mainDocketNumber: string) => {
        const req = new LayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [layId], false, false, mainDocketNumber);
        layReportingService.printBundleTagsForLay(req).then((res => {
            if (res.status) {
                setSelectedLayId(undefined);
                setSelectedLayDocketNumber(undefined);
                setActualDocketsForBundles([]);
                setPrintBarFlag(false);
                setStateKey(preState => preState + 1);
                getBundleTagsForLayIds(actualDocketsInfo.map(a => a.layNumber));
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const columns: ColumnsType<IDocketTblData> = [
        {
            title: 'Docket No',
            dataIndex: 'docketGroup',
            align: 'center'
        },
        {
            title: 'Sub Docket',
            dataIndex: 'docketNumber',
            align: 'center'
        },
        {
            title: 'Main Docket',
            dataIndex: 'isMainDoc',
            align: 'center',
            render: (v) => { return v ? 'Yes' : 'No' }
        },
        {
            title: 'Item',
            dataIndex: 'itemCode',
            align: 'center',
            render:(v,r)=><Tooltip title={r.itemDesc} color={'cyan'} mouseEnterDelay={0} mouseLeaveDelay={0}>{v}</Tooltip>
        },
        // {
        //     title: 'Item Description',
        //     dataIndex: 'itemDesc',
        //     align: 'center'
        // },
        {
            title: 'Plies',
            dataIndex: 'docketPlies',
            align: 'center'
        },
        {
            title: 'Lay Number',
            dataIndex: 'layNumber',
            align: 'center'
        },
        {
            title: 'Layed Plies',
            dataIndex: 'actualDocketPlies',
            align: 'center'
        },
        {
            title: 'Cut Status',
            dataIndex: 'cutStatus',
            align: 'center',
            render: (v) => {
                return v == CutStatusEnum.OPEN ? <Tag color='orange'>{cutStatusEnumDisplayValues[v]}</Tag> : v == CutStatusEnum.COMPLETED ? <Tag color='green'>{cutStatusEnumDisplayValues[v]}</Tag> : <Tag color='orange'>{cutStatusEnumDisplayValues[CutStatusEnum.OPEN]}</Tag>
            }
        },
        {
            title: 'View',
            dataIndex: 'layId',
            align: 'center',
            render: (v, r) => <Button size="small" disabled={!r.isMainDoc || r.cutStatus != CutStatusEnum.COMPLETED || r.labelsPrintStatus} icon={<EyeOutlined />} type="primary" className="btn-blue" onClick={() => getBundleTagsForLay(v, r.docketNumber)}>View Bundle Tags</Button>
        },
        {
            title: 'Action',
            dataIndex: 'layId',
            align: 'center',
            render: (v, r) => <Button size="small" disabled={!r.labelsPrintStatus} icon={<RedoOutlined />} className="btn-orange" type="primary" onClick={() => releaseBundleTagsPrintForLay(v, r.docketNumber)}>Release Bundle Tags</Button>
        },
    ]
    return <>
        <Table size="small" columns={columns} pagination={false} bordered dataSource={tblData} scroll={{x: 'max-content'}}/>
        {printBarFlag && <BundleTagBarcode4X2 setPrintBarFlag={setPrintBarFlag} key={stateKey + 1} docketsData={actualDocketsForBundles} printBarCodes={() => printBundleTagsForLay(selectedLayId, selectedDocketNumber)} style={props.style} />}
    </>
}

export default BundleTagGrid;