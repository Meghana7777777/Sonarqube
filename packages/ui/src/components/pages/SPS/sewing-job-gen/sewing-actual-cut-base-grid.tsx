import { CheckSquareFilled, MinusSquareFilled } from "@ant-design/icons";
import { FeatureGroupDetails, SewJobGenReqForActualAndFeatureGroup, SewingCreationOptionsEnum, SewingJobConfirmedReqInfoForActualGenFeatureGroup, SewingJobPreviewForActualGenFeatureGroup } from "@xpparel/shared-models";
import { SewingJobGenActualService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Drawer, Form, InputNumber, Popover, Space, Table, TableColumnsType, Tag, Tooltip } from "antd"
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import SewJobConfirmGrid from "./sew-job-confirm-grid";
import { sewingCreationDisplayName } from "./support";
import './sew-job-gen.css';
import CountdownTimer from "../../../common/timer/timer-component";
interface IGridProps {
    sewingOrderId: number;
    sewingCutBasedData: FeatureGroupDetails;
    getSewJobDetails: () => void;
    updateKey: number;
}

const columns: TableColumnsType<IDocketTableDataType> = [
    {
        title: 'Mo Line', dataIndex: 'moLine', width: 150, align: 'center', fixed: 'left', key: 'moLine',

        onCell: (r,) => ({
            colSpan: r.isTotalRow ? 5 : 1,
        }),
    },
    {
        title: 'Product Name', dataIndex: 'productName', width: 150, align: 'center', fixed: 'left', key: 'productName', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        }),
        render: (v) => <Tag className='s-tag' color="green"> {v}</Tag>
    },
    {
        title: 'Product Type', dataIndex: 'productType', width: 150, align: 'center', fixed: 'left', key: 'productType', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        })
    },
    {
        title: 'Delivery date', dataIndex: 'deliveryDate', width: 150, align: 'center', fixed: 'left', key: 'deliveryDate', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        })
    },
    {
        title: 'Destination', dataIndex: 'destination', width: 150, align: 'center', fixed: 'left', key: 'destination', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        })
    },
    {
        title: 'Color', dataIndex: 'address', width: 150, align: 'center', fixed: 'left', key: 'color', onCell: (r,) => ({
            // colSpan: r.isTotalRow ? 0 : 1,
        })
    },
    {
        title: 'CG Name', dataIndex: 'cgName', width: 150, align: 'center', fixed: 'left', key: 'cgName', render: (v, r) => {
            return v && <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} color="gold" title={r.isMainCg ? 'Main Component Group' : 'Sub Component Group'}><Space>{v}
                <span > {r.isMainCg ? <CheckSquareFilled style={{ color: 'green', fontSize: '1.2rem' }} /> : <MinusSquareFilled style={{ fontSize: '1.2rem' }} />}</span></Space></Tooltip>
        }
    },
    { title: 'Cut No', dataIndex: 'cutNumber', width: 150, align: 'center', fixed: 'left', key: 'cutNumber' },
    {
        title: 'Docket No', dataIndex: 'docketNumber', width: 150, align: 'center', fixed: 'left', key: 'docketNumber', render: (v, r) => {
            return v && <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={r.isPending ? 'Pending Qty' : 'No Pending Qty'}><Space>{v} <span className={`${r.isPending ? '' : 'i-green'} color-circle`}></span></Space></Tooltip>
        }
    },

];

const bundleColumns: TableColumnsType<IBundleDataType> = [
    { title: 'Bundle Number', dataIndex: 'bundleNumber', key: 'bundleNumber' }
];
const totalKey = 'Total';
interface IDocketTableDataType {
    productName: string;
    productType: string;
    moLine: string;
    deliveryDate: string;
    destination: string;
    planProductionDate: string;
    planCutDate: string;
    color: string
    cutNumber: number;
    docketNumber: string;
    cgName: string;
    isMainCg: boolean;
    bundleData: IBundleDataType[];
    [key: string]: ISizeDataType | any;
    isExpandable: boolean;
    isTotalRow?: boolean;
    isPending: boolean;
}
interface IBundleDataType {
    bundleNumber: string;
    [key: string]: ISizeDataType | any;
}
interface ISizeDataType {
    orgQty: number;
    sewGenQty: number;
    pendingQty: number;
}



const SewingActualCutBasedGrid = (props: IGridProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [sewCutTableData, setSewCutTableData] = useState<IDocketTableDataType[]>([]);
    const [mainTblColumns, setMainTblColumns] = useState<TableColumnsType<IDocketTableDataType>>(columns);
    const [childTblColumns, setChildTblColumns] = useState<TableColumnsType<IBundleDataType>>(bundleColumns);
    const [showPopOver, setShowPopOver] = useState(false);
    const [stateKey, setStateKey] = useState<number>(0);
    const [openSewJobDrawer, setOpenSewJobDrawer] = useState<boolean>(false);
    const sewingJobGenActualService = new SewingJobGenActualService();
    const [sewJobPreviewData, setSewJobPreviewData] = useState<SewingJobPreviewForActualGenFeatureGroup>(undefined);
    const [formValues, setFormValues] = useState<Object>();
    // Initialize the form instance
    const [form] = Form.useForm();
    useEffect(() => {
        if (props.sewingCutBasedData) {
            constructTableData(props.sewingCutBasedData);
        }
    }, [props.updateKey]);

    const constructTableData = (sewingCutBasedData: FeatureGroupDetails) => {
        // Unique Sizes
        const uniqueSizes = new Set<string>();
        // Table Data
        const tblData: IDocketTableDataType[] = [];
        const totalRow: IDocketTableDataType = {
            bundleData: [], cgName: '', color: '', cutNumber: undefined, deliveryDate: '', destination: '', docketNumber: '', isExpandable: false,
            isMainCg: false, planCutDate: '', planProductionDate: '', productName: '', productType: '', moLine: 'Main Component Total', isTotalRow: true,
            isPending: false
        }
        totalRow[totalKey] = {
            orgQty: 0,
            pendingQty: 0,
            sewGenQty: 0
        }
        sewingCutBasedData.cutInfo.forEach(cutInfo => {
            cutInfo.cutDetails.forEach(cutDetails => {
                cutDetails.cgDetails.forEach(cgInfo => {
                    cgInfo.docketDetails.forEach(docInfo => {
                        const row: IDocketTableDataType = {
                            bundleData: [],
                            color: docInfo.color,
                            cutNumber: cutDetails.cutNumber,
                            deliveryDate: cutDetails.deliveryDate,
                            destination: cutDetails.destination,
                            docketNumber: docInfo.docketNumber,
                            isMainCg: cgInfo.isMainCg,
                            cgName: cgInfo.cgName,
                            planCutDate: cutDetails.planCutDate,
                            planProductionDate: cutDetails.planProductionDate,
                            productName: cutDetails.productName,
                            productType: cutDetails.productName,
                            moLine: cutDetails.moLine,
                            isExpandable: true,
                            isPending: false
                        }
                        let docketTotalOrderQty = 0;
                        let docketTotalSewGenQty = 0;
                        let docketTotalPendingQty = 0;
                        // Size wise quantities
                        docInfo.sizeQtyDetails.forEach(sizeQtyInfo => {
                            //Add to unique size
                            uniqueSizes.add(sizeQtyInfo.size);
                            docketTotalOrderQty += Number(sizeQtyInfo.originalQty);
                            docketTotalPendingQty += Number(sizeQtyInfo.pendingQty);
                            docketTotalSewGenQty += Number(sizeQtyInfo.sewGeneratedQty);
                            const sizeQtyObj: ISizeDataType = {
                                orgQty: sizeQtyInfo.originalQty,
                                pendingQty: sizeQtyInfo.pendingQty,
                                sewGenQty: sizeQtyInfo.sewGeneratedQty
                            }
                            row[sizeQtyInfo.size] = sizeQtyObj;
                            //For total Row 
                            if (cgInfo.isMainCg) {
                                if (!totalRow[sizeQtyInfo.size]) {
                                    totalRow[sizeQtyInfo.size] = { orgQty: 0, pendingQty: 0, sewGenQty: 0 }
                                }
                                {
                                    totalRow[sizeQtyInfo.size].orgQty += Number(sizeQtyInfo.originalQty);
                                    totalRow[sizeQtyInfo.size].pendingQty += Number(sizeQtyInfo.pendingQty);
                                    totalRow[sizeQtyInfo.size].sewGenQty += Number(sizeQtyInfo.sewGeneratedQty);
                                }


                                totalRow[totalKey].orgQty += Number(sizeQtyInfo.originalQty);
                                totalRow[totalKey].pendingQty += Number(sizeQtyInfo.pendingQty);
                                totalRow[totalKey].sewGenQty += Number(sizeQtyInfo.sewGeneratedQty);

                            }
                        });
                        row.isPending = docketTotalPendingQty > 0;
                        row[totalKey] = {
                            orgQty: docketTotalOrderQty,
                            pendingQty: docketTotalPendingQty,
                            sewGenQty: docketTotalSewGenQty
                        }

                        // Bundle Data
                        docInfo.docketBundleInfo.forEach(docBundleInfo => {
                            let bundleTotalOrderQty = 0;
                            let bundleTotalSewGenQty = 0;
                            let bundleTotalPendingQty = 0;
                            const bundleRow: IBundleDataType = {
                                bundleNumber: docBundleInfo.bundleNumber
                            }
                            // Bundle Size wise data
                            const sizeQtyObj: ISizeDataType = {
                                orgQty: docBundleInfo.sizeQtyDetails.originalQty,
                                pendingQty: docBundleInfo.sizeQtyDetails.pendingQty,
                                sewGenQty: docBundleInfo.sizeQtyDetails.sewGeneratedQty
                            }
                            bundleRow[docBundleInfo.sizeQtyDetails.size] = sizeQtyObj;
                            // Sum bundle size wise total
                            bundleTotalOrderQty += Number(docBundleInfo.sizeQtyDetails.originalQty);
                            bundleTotalSewGenQty += Number(docBundleInfo.sizeQtyDetails.sewGeneratedQty);
                            bundleTotalPendingQty += Number(docBundleInfo.sizeQtyDetails.pendingQty);
                            // Add total bundle qty
                            bundleRow[totalKey] = {
                                orgQty: bundleTotalOrderQty,
                                pendingQty: bundleTotalPendingQty,
                                sewGenQty: bundleTotalSewGenQty
                            }
                            // Push bundle data to table row
                            row.bundleData.push(bundleRow);
                        });
                        tblData.push(row);
                    });
                });
            });
        });
        tblData.push(totalRow);

        setSewCutTableData(tblData);
        constructSizeColumns(uniqueSizes);
    }
    const constructSizeColumns = (uniqueSize: Set<string>) => {
        const sizeColumns: TableColumnsType<any> = [];
        uniqueSize.forEach(size => {
            sizeColumns.push({
                title: size, dataIndex: size,
                render: (sizeQtyObj: ISizeDataType) => {
                    if (!sizeQtyObj) {
                        return "-";
                    }
                    const orderQty = sizeQtyObj ? sizeQtyObj.orgQty : 0;
                    const sewJobGenQty = sizeQtyObj ? sizeQtyObj.sewGenQty : 0;
                    const pendingQty = sizeQtyObj ? sizeQtyObj.pendingQty : 0;
                    const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
                    return <>
                        <Space size={0}>
                            {/* <Space size={2} direction='vertical'> */}
                            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty}</Tag></Tooltip>
                            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Routing Job Generated Qty'><Tag className='s-tag' color="#da8d00">{sewJobGenQty}</Tag></Tooltip>
                            {/* </Space> */}
                            <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} className='s-tag' title={'Pending Qty'}><Tag
                                // style={{ height: '48px', paddingTop: '11px' }}
                                color={pQtyColor}>{Math.abs(pendingQty)}</Tag></Tooltip>
                        </Space>
                    </>
                },
            });
        });
        sizeColumns.push({
            title: totalKey, dataIndex: totalKey,
            render: (sizeQtyObj: ISizeDataType) => {
                if (!sizeQtyObj) {
                    return "-";
                }
                const orderQty = sizeQtyObj ? sizeQtyObj.orgQty : 0;
                const sewJobGenQty = sizeQtyObj ? sizeQtyObj.sewGenQty : 0;
                const pendingQty = sizeQtyObj ? sizeQtyObj.pendingQty : 0;
                const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
                return <>
                    <Space size={0}>
                        {/* <Space size={2} direction='vertical'> */}
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty}</Tag></Tooltip>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Sewing Job Generated Qty'><Tag className='s-tag' color="#da8d00">{sewJobGenQty}</Tag></Tooltip>
                        {/* </Space> */}
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} className='s-tag' title={'Pending Qty'}><Tag
                            // style={{ height: '48px', paddingTop: '11px' }}
                            color={pQtyColor}>{Math.abs(pendingQty)}</Tag></Tooltip>
                    </Space>
                </>
            },
        });
        setMainTblColumns([...columns, ...sizeColumns]);
        setChildTblColumns([...bundleColumns, ...sizeColumns]);
    }

    const renderTitle = (sewingCutBasedData: FeatureGroupDetails) => {
        const enumKeys = Object.values(SewingCreationOptionsEnum);
        let isColor = false;
        return <Space wrap>{
            Object.keys(sewingCutBasedData.groupInfo).map((k:any) => {
                if (enumKeys.includes(k)) {
                    isColor = !isColor;
                    return <span className="f-600"> <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={isColor ? '#ff5500' : '#b10d7a'}> {sewingCreationDisplayName[k]} : {sewingCutBasedData.groupInfo[k]}</Tag></span>
                } else {
                    return <></>;
                }
            })}
        </Space>
    }

    const closeSewJobGenDrawer = () => {
        setOpenSewJobDrawer(false);
        setStateKey(preState => preState + 1);
        // getCumRatioQtyFabricWiseForPo(props.poObj.poSerial);
    };
    const generateSewingJobs = (values: any) => {
        setFormValues(values);
        const { sewingOrderId, sewingCutBasedData } = props;
        const req = new SewJobGenReqForActualAndFeatureGroup(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewingOrderId, sewingCutBasedData.groupInfo, values.multiColor, values.multiSize, values.sewingJobQty, values.logicalBundleQty);
        sewingJobGenActualService.getSewingJobPreviewForActualGenFeatureGroup(req).then((res => {
            if (res.status) {
                setSewJobPreviewData(res.data);
                setShowPopOver(false);
                setOpenSewJobDrawer(true);
                setStateKey(preState => preState + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const confirmSewingJobs = () => {        
        const { sewingOrderId, sewingCutBasedData } = props;
        const req = new SewingJobConfirmedReqInfoForActualGenFeatureGroup(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, sewingOrderId, sewJobPreviewData.groupInfo, sewJobPreviewData.sewingJobInfo, sewJobPreviewData.sewingJobQty, sewJobPreviewData.logicalBundleQty, formValues['multiColor'], formValues['multiSize']);
        sewingJobGenActualService.confirmAndSubmitSewingJob(req).then((res => {
            if (res.status) {
                // setSewJobPreviewData(res.data);
                setOpenSewJobDrawer(false);
                setShowPopOver(false);
                setFormValues(undefined);
                setStateKey(preState => preState + 1);
                props.getSewJobDetails();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const renderSewingJenOptionForm = () => {
        return (
            <Form
                form={form}
                onFinish={generateSewingJobs}
                layout="inline" // To make the form inline
                initialValues={{
                    multiSize: false,
                    multiColor: false,
                    sewingJobQty: null, // Initial value for sewingJobQty
                    logicalBundleQty: null, // Initial value for logicalBundleQty
                }}
            >
                <Form.Item name="multiSize" valuePropName="checked">
                    <Checkbox>Multi Size</Checkbox>
                </Form.Item>

                <Form.Item name="multiColor" valuePropName="checked">
                    <Checkbox>Multi Color</Checkbox>
                </Form.Item>
                <Form.Item name="sewingJobQty" label="Routing Job Qty" valuePropName="checked">
                    <InputNumber min={1} placeholder="Enter Routing Job Qty" />
                </Form.Item>
                <Form.Item name="logicalBundleQty" label="Logical Bundle Qty" >
                    <InputNumber min={1} placeholder="Enter Logical Bundle Qty" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className="btn-green" htmlType="submit">
                        Generate
                    </Button>
                </Form.Item>
            </Form>
        );

    }
    const changePopOver = (open: boolean) => {
        setShowPopOver(open);
    };
    const timerUpHandler = () => {
        setShowPopOver(false);
        setOpenSewJobDrawer(false);
    }
    return <>
        <Card title={renderTitle(props.sewingCutBasedData)} extra={
            <>
                <Popover content={renderSewingJenOptionForm} overlayInnerStyle={{ padding: '50px' }} placement="left" color='#7bd9ff' open={showPopOver} title="Routing Job Generation Criteria" trigger="click" onOpenChange={changePopOver}>
                    <Button type="primary" className="btn-blue" >Generate Routing Jobs</Button>
                </Popover>
            </>
        }>
            <Table<IDocketTableDataType>
                size='small'
                columns={mainTblColumns}
                pagination={false}
                rowKey={r => r.docketNumber}
                bordered
                scroll={{ x: true }}
                expandable={{
                    expandedRowRender: (record) => <Table size="small" columns={childTblColumns} bordered pagination={false} dataSource={record.bundleData} />,
                    rowExpandable: (record) => record.isExpandable,
                }}
                dataSource={sewCutTableData}
            />
        </Card>
        <Drawer
            styles={{ header: { padding: '0px' } }}
            title={<Space><span>Routing Job Preview</span>
                <div className="small-card"> <span className="small-card-title">Routing Job Qty</span>  <span className="small-card-content"> {sewJobPreviewData?.sewingJobQty}</span> </div>
                <div className="small-card bg-lyellow"> <span className="small-card-title">Logical Bundle Qty</span>  <span className="small-card-content"> {sewJobPreviewData?.logicalBundleQty}</span> </div>
                <span>Session Closes With IN<CountdownTimer  timer={360} timerUpHandler={timerUpHandler} /></span>
                {/* <div>Logical Bundle Qty:  {sewJobPreviewData?.logicalBundleQty}</div>  */}
            </Space>}
            placement="right"
            size={'large'}
            onClose={closeSewJobGenDrawer}
            open={openSewJobDrawer}
            width='100%'
            extra={
                <Space>
                    <Button type="primary" className="btn-green" onClick={confirmSewingJobs}>
                        Confirm
                    </Button>
                    <Button type="link" onClick={closeSewJobGenDrawer}>
                        Close
                    </Button>
                </Space>
            }
        >
            <>
                <SewJobConfirmGrid sewJobPreviewData={sewJobPreviewData} componentUpdateKey={stateKey} />
            </>

        </Drawer>
    </>
}

export default SewingActualCutBasedGrid;