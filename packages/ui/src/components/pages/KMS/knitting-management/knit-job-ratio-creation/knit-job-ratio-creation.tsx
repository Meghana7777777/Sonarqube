import { KC_KnitGroupQtySummaryModel, KC_KnitGroupRatioModel, KC_KnitJobConfStatusEnum, KC_KnitJobConfStatusViewObj, KC_KnitJobGenStatusEnum, KC_KnitJobGenStatusViewObj, KC_KnitRatioPoSerialRequest, ProcessingOrderInfoModel, ProcessingOrderInfoRequest, ProcessingOrderSerialRequest, ProcessingSerialProdCodeRequest, ProcessTypeEnum, StyleProductCodeFgColor } from "@xpparel/shared-models";
import { KnitOrderService, KnittingJobsService, KnittingManagementService } from "@xpparel/shared-services";
import { Alert, Button, Card, Drawer, Empty, Modal, Popconfirm, Result, Space, Table, Tabs, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { ProCard } from "@ant-design/pro-components";
import KnitRatioCreationSummaryModal from "./knit-ratio-creation-modal";
import { AlertMessages } from "packages/ui/src/components/common";

const sampleProducts = [
    {
        productId: 1,
        productName: "Shirt-Red",
        productCode: 'PRD-1001',
        fgColor: 'Red'
    },
    {
        productId: 2,
        productName: "Shirt-Blue",
        productCode: 'PRD-1002',
        fgColor: 'Yellow'
    },
    {
        productId: 3,
        productName: "Shirt-Green",
        productCode: 'PRD-1003',
        fgColor: 'Green'
    }
]
const columns: ColumnsType<KC_KnitGroupQtySummaryModel> = [
    { title: "Knit Group", dataIndex: "knitGroup", key: "knitGroup", fixed: 'left', },
    { title: "Component", dataIndex: "components", key: "components", fixed: 'left', render: (components: string[]) => components?.join(", ") },
    { title: "Item", dataIndex: "itemCodes", key: "itemCodes", align: 'center', fixed: 'left', render: (itemCodes: string[]) => itemCodes?.join(", ") }
];

const ratioColumns: ColumnsType<KC_KnitGroupRatioModel> = [
    { title: "S.No", dataIndex: '',  align: 'center', fixed: 'left', render: (_: any, __: any, index: number) => index + 1 },
    { title: "Ratio Code", dataIndex: "ratioCode", key: "ratioCode", align: 'center', fixed: 'left', },
    { title: "Knit Group", dataIndex: "knitGroup", key: "knitGroup", align: 'center', },
    { title: "Component", dataIndex: "components", key: "components", align: 'center', render: (components: string[]) => components.join(", ") },
    { title: "Item", dataIndex: "itemCodes", key: "itemCodes", align: 'center', render: (itemCodes: string[]) => itemCodes.join(", ") }
];
const jobGenStatusColors = {
    [KC_KnitJobGenStatusEnum.COMPLETED]: '#87d068',
    [KC_KnitJobGenStatusEnum.IN_PROGRESS]: '#d1bf21',
    [KC_KnitJobGenStatusEnum.OPEN]: '',

}
const jobConfirmStatusColors = {
    [KC_KnitJobConfStatusEnum.COMPLETED]: '#87d068',
    [KC_KnitJobConfStatusEnum.IN_PROGRESS]: '#d1bf21',
    [KC_KnitJobConfStatusEnum.OPEN]: '',
}
interface KnitJobCreationProps {
    processingSerial: number
    styleCode: string
}
export default function KnitJobRatioCreation(props: KnitJobCreationProps) {
    const { processingSerial, styleCode } = props
    const [activeTabKey, setActiveTabKey] = useState<string>(sampleProducts[0]?.productId.toString());
    const kgsService = new KnittingJobsService();
    const kmsService = new KnittingManagementService()
    const KosService = new KnitOrderService()
    const user = useAppSelector((state) => state.user.user.user);
    const [knitGroupSummaryData, setKnitGroupSummaryData] = useState<KC_KnitGroupQtySummaryModel[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedKnitGroup, setSelectedKnitGroup] = useState<KC_KnitGroupQtySummaryModel | null>(null);
    const [knitOrderData, setKnitOrderData] = useState<ProcessingOrderInfoModel[]>()
    const [knitGroupRatioPoData, setKnitGroupratioPoData] = useState<KC_KnitGroupRatioModel[]>([]);
    const [productCodeData, setProductCodeData] = useState<StyleProductCodeFgColor[]>()
    const [activeProduct, setActiveProduct] = useState<StyleProductCodeFgColor | null>(null)


    useEffect(() => {
        getStyleProductCodeFgColorForPo()
        getProcessingOrderInfo()

    }, []);

    



    const getStyleProductCodeFgColorForPo = async () => {
        try {
            const req = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [processingSerial], ProcessTypeEnum.KNIT)
            await KosService.getStyleProductCodeFgColorForPo(req).then(res => {
                if (res.status) {
                    setProductCodeData(res.data)
                    setActiveProduct(res.data[0])
                    getKnitGroupQtySummaryForPo(res.data[0])
                    getKnitGroupRatioInfoForPo(res.data[0])
                }
            })
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)
        }
    }

    const getKnitGroupQtySummaryForPo = async (productInfo: StyleProductCodeFgColor) => {
        try {
            const req = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, ProcessTypeEnum.KNIT, productInfo.productCode, productInfo.fgColor, true, true, true, true);
            const res = await kmsService.getKnitGroupQtySummaryForPo(req);
            if (res.status) {
                setKnitGroupSummaryData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)
        }
    };


    const getProcessingOrderInfo = async () => {
        try {
            const req = new ProcessingOrderInfoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, ProcessTypeEnum.KNIT, true, true, true, true, true, true, true, true, true)
            KosService.getProcessingOrderInfo(req).then((res) => {
                if (res.status) {
                    setKnitOrderData(res.data)
                }
            })
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)
        }
    }


    const getKnitGroupRatioInfoForPo = async (productInfo: StyleProductCodeFgColor) => {
        try {
            const req = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, ProcessTypeEnum.KNIT, productInfo.productCode, productInfo.fgColor, true, true, true, true)
            const res = await kmsService.getKnitGroupRatioInfoForPo(req);
            if (res.status) {
                setKnitGroupratioPoData(res.data);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)
        }
    }

    const createJobsForKnitGroupRatio = async (rec: KC_KnitGroupRatioModel) => {
        try {
            const req = new KC_KnitRatioPoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rec.ratioId, rec.processingSerial, ProcessTypeEnum.KNIT)
            const res = await kgsService.createJobsForKnitGroupRatio(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getKnitGroupRatioInfoForPo(activeProduct)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            console.error(err);
            AlertMessages.getErrorMessage(err.message)

        }
    }

    const deleteJobsForKnitGroupRatio = async (record: KC_KnitGroupRatioModel) => {
        try {
            const req = new KC_KnitRatioPoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.ratioId, record.processingSerial, ProcessTypeEnum.KNIT)
            const res = await kgsService.deleteJobsForKnitGroupRatio(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getKnitGroupRatioInfoForPo(activeProduct)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)

        }
    }

    const deleteKnitGroupRatio = async (record: KC_KnitGroupRatioModel) => {
        try {
            const req = new KC_KnitRatioPoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.ratioId, record.processingSerial, ProcessTypeEnum.KNIT)
            const res = await kmsService.deleteKnitGroupRatio(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getKnitGroupRatioInfoForPo(activeProduct);
                getKnitGroupQtySummaryForPo(activeProduct)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)

        }
    }
    const confirmJobsForRatioId = async (record: KC_KnitGroupRatioModel) => {
        try {
            const req = new KC_KnitRatioPoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.ratioId, record.processingSerial, ProcessTypeEnum.KNIT)
            const res = await kgsService.confirmJobsForRatioId(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getKnitGroupRatioInfoForPo(activeProduct)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)

        }
    }
    const unConfirmJobsForForRatioId = async (record: KC_KnitGroupRatioModel) => {
        try {
            const req = new KC_KnitRatioPoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, record.ratioId, record.processingSerial, ProcessTypeEnum.KNIT)
            const res = await kgsService.unConfirmJobsForForRatioId(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                getKnitGroupRatioInfoForPo(activeProduct)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.message)

        }
    }

    const showModal = (record: KC_KnitGroupQtySummaryModel) => {
        setSelectedKnitGroup(record);
        setIsModalVisible(true);

    };

    const closeModal = (isReload: boolean = false) => {
        setIsModalVisible(false);
        if (isReload) {
            getKnitGroupQtySummaryForPo(activeProduct)
            getKnitGroupRatioInfoForPo(activeProduct)
            // setSelectedKnitGroup(null);
        }
    };




    const aggregateProductQuantities = (knitOrderData: ProcessingOrderInfoModel[] = []) => {
        const productMap = new Map<string, { quantity: number }>();

        knitOrderData?.forEach(order => {
            order?.prcOrdMoInfo?.forEach(soInfo => {
                soInfo?.prcOrdLineInfo?.forEach(lineInfo => {
                    lineInfo?.productInfo?.forEach(product => {
                        product?.prcOrdSubLineInfo?.forEach(subLine => {
                            const key = `${product.productCode}-${subLine.fgColor}-${subLine.size}`;

                            if (productMap.has(key)) {
                                productMap.get(key)!.quantity += subLine.quantity;
                            } else {
                                productMap.set(key, { quantity: subLine.quantity });
                            }
                        });
                    });
                });
            });
        });

        return productMap;
    };

    const productMap = aggregateProductQuantities(knitOrderData);

    const uniqueSizes: string[] = Array.from(new Set(knitGroupSummaryData.flatMap(item => item.sizeWiseKnitGroupInfo.map(sizeInfo => sizeInfo.size))));

    const sizeColumns: ColumnsType<KC_KnitGroupQtySummaryModel> = uniqueSizes.map(size => ({
        title: size,
        dataIndex: "sizeWiseKnitGroupInfo",
        key: size,
        // width: '',
        align: 'center',
        render: (sizeWiseKnitGroupInfo: { size: string; knitRatioQty: number }[], record: KC_KnitGroupQtySummaryModel) => {
            if (!activeProduct) return "-";
            // Construct key for lookup
            const productKey = `${activeProduct.productCode}-${activeProduct.fgColor}-${size}`;
            const orderQty = productMap.get(productKey)?.quantity || 0;

            // Find Ratio Qty from `sizeWiseKnitGroupInfo`
            const sizeData = sizeWiseKnitGroupInfo?.find(info => info.size === size);
            const ratioQty = sizeData ? sizeData.knitRatioQty : 0;

            const pendingQty = orderQty - ratioQty;
            const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
            return (
                <Space size={3} direction='horizontal'>
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Knit Order Qty">
                        <Tag style={{ minWidth: '45px' }} className='s-tag' color="#257d82">{orderQty || 0}</Tag>
                    </Tooltip>
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title="Knit Ratio Qty">
                        <Tag style={{ minWidth: '45px' }} className='s-tag' color="#da8d00">{ratioQty || 0}</Tag>
                    </Tooltip>
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={pendingQty > 0 ? "Pending Qty" : "Excess Qty"}>
                        <Tag style={{ minWidth: '45px' }} color={pQtyColor}>
                            {pendingQty}
                        </Tag>
                    </Tooltip>
                </Space>
            );
        }
    }));




    const ratioUniqueSizes: string[] = Array.from(new Set(
        (knitGroupRatioPoData || []).flatMap(item => item.sizeRatios?.map(sizeInfo => sizeInfo.size) || [])
    ));

    const ratioSizeColumns: ColumnsType<KC_KnitGroupRatioModel> = ratioUniqueSizes.map(size => ({
        title: size,
        dataIndex: "sizeRatios",
        key: size,
        align: 'center',
        render: (sizeRatios: { size: string; ratioQty: number; jobQty: number; logicalBundleQty: number }[]) => {
            const sizeData = sizeRatios.find(s => s.size === size);
            if (!sizeData) return "-";

            return (
                <Space size={3} direction='horizontal'>
                    <Tooltip title="Knit Ratio Qty">
                        <Tag className='s-tag' color="#257d82">{sizeData.ratioQty || 0}</Tag>
                    </Tooltip>
                    <Tooltip title="Job Qty">
                        <Tag className='s-tag' color="#da8d00">{sizeData.jobQty || 0}</Tag>
                    </Tooltip>
                    <Tooltip title="Logical Bundle Qty">
                        <Tag className='s-tag' color="#5adb00">{sizeData.logicalBundleQty || 0}</Tag>
                    </Tooltip>
                </Space>
            );
        }
    }));


    const actionColumn: ColumnsType<KC_KnitGroupQtySummaryModel>[0] = {
        title: "Action",
        key: "action",
        align: "center",
        fixed:'right',
        render: (_, record) => (
            <Button size="small" type='primary' onClick={() => showModal(record)}>
                Add Ratio
            </Button>
        )
    };

    const ratioActionColumn: ColumnsType<KC_KnitGroupRatioModel> = [
        {
            title: 'Job Gen Status',
            dataIndex: ['ratioStatus', 'jobsGenStatus'],
            align: "center",
            render: (v) => <Tag color={jobGenStatusColors[v]}>{KC_KnitJobGenStatusViewObj[v]}</Tag>
        },
        {
            title: 'Job Confirm Status',
            dataIndex: ['ratioStatus', 'jobConfStatus'],
            align: "center",
            render: (v) => <Tag color={jobConfirmStatusColors[v]}>{KC_KnitJobConfStatusViewObj[v]}</Tag>
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            width: '220px',
            fixed:'right',
            render: (_, record: KC_KnitGroupRatioModel) => (
                <>
                    <Space size={2} direction='horizontal'>
                        {record.ratioStatus.jobsGenStatus === KC_KnitJobGenStatusEnum.OPEN ? <Button size="small" type='primary' onClick={() => createJobsForKnitGroupRatio(record)}>
                            Generate Jobs
                        </Button> : <></>}
                        <Popconfirm title="Are you sure to delete this Ratio ?" onConfirm={() => deleteKnitGroupRatio(record)} okText="Yes" cancelText="No">

                            {record.ratioStatus.jobsGenStatus === KC_KnitJobGenStatusEnum.OPEN ? <Button danger size='small' type='primary'>
                                Delete Ratio
                            </Button> : <></>}
                        </Popconfirm>
                        {record.ratioStatus.jobsGenStatus === KC_KnitJobGenStatusEnum.COMPLETED && record.ratioStatus.jobConfStatus === KC_KnitJobConfStatusEnum.OPEN ? <Popconfirm title="Are you sure to delete  jobs ?" onConfirm={() => deleteJobsForKnitGroupRatio(record)} okText="Yes" cancelText="No"><Button danger size='small' type='primary' >
                            Delete Jobs
                        </Button> </Popconfirm> : <></>}

                        {record.ratioStatus.jobsGenStatus === KC_KnitJobGenStatusEnum.COMPLETED && record.ratioStatus.jobConfStatus === KC_KnitJobConfStatusEnum.OPEN ? <Popconfirm title="Are you sure to confirm the jobs ?" onConfirm={() => confirmJobsForRatioId(record)} okText="Yes" cancelText="No">
                            <Button className="btn-orange" size='small' type='primary' >
                                Confirm Jobs
                            </Button> </Popconfirm> : <></>}

                        {/* Un Confirm Jobs */}
                        {record.ratioStatus.jobsGenStatus === KC_KnitJobGenStatusEnum.COMPLETED && record.ratioStatus.jobConfStatus === KC_KnitJobConfStatusEnum.COMPLETED ? <Popconfirm title="Are you sure to un-confirm the jobs ?" onConfirm={() => unConfirmJobsForForRatioId(record)} okText="Yes" cancelText="No">
                            <Button danger size='small' type='primary' >
                               Un Confirm Jobs
                            </Button> </Popconfirm> : <></>}

                    </Space>
                </>
            )
        }];

    function renderProductTabItems(): any {
        if (productCodeData && productCodeData.length > 0) {
            return productCodeData.map((v) => ({
                key: v.productCode.toString() + v.fgColor,
                label: v.productCode + ' | ' + v.fgColor,
                children: <>{
                    knitGroupSummaryData.length ? <Table dataSource={knitGroupSummaryData} columns={[...columns, ...sizeColumns, actionColumn]} rowKey="knitGroup" bordered size='small' scroll={{ x: 'max-content' }} /> :
                        <Empty description="No Knit ratios" />
                }
                    < ProCard size="small" boxShadow title={"Ratios"} extra={renderKnitRatiosTabExtra()} >
                        <Table dataSource={knitGroupRatioPoData} columns={[...ratioColumns, ...ratioSizeColumns, ...ratioActionColumn]} rowKey="knitGroup" bordered size='small' scroll={{ x: 'max-content' }} />
                    </ProCard>
                </>
            }));
        }
        return []
    }

    function renderKnitgroupsTabextra() {
        return <Space>
            <Tag color="#257d82">Knit Order Qty</Tag>
            <Tag color="#da8d00">Knit Ratio Qty</Tag>
            <Tag color="#ff0000">Pending Qty</Tag>
            <Tag color="#001d24">Excess Qty</Tag>

        </Space>
    }

    function renderKnitRatiosTabExtra() {
        return <Space>
            <Tag color="#257d82">Knit Ratio Qty</Tag>
            <Tag color="#da8d00">Job Qty</Tag>
            <Tag color="#5adb00">Logical bundle Qty</Tag>
        </Space>
    }


    function onTabChange(key) {
        setActiveTabKey(key);
        const selectedProduct = productCodeData?.find(v => (v.productCode.toString() + v.fgColor) === key);
        setActiveProduct(selectedProduct || null);
        if (selectedProduct) {
            getKnitGroupQtySummaryForPo(selectedProduct)
            getKnitGroupRatioInfoForPo(selectedProduct)
        }
    }


    return (

        <Card>
            {knitGroupSummaryData && knitGroupSummaryData.length ? <Tabs size='small' className='knit-job-ratio-tabs' items={renderProductTabItems()} defaultActiveKey={activeTabKey} onChange={(key) => onTabChange(key)} tabBarExtraContent={renderKnitgroupsTabextra()} /> : <></>}

            <Drawer destroyOnClose title={<span >{`Knit Group: ${selectedKnitGroup?.knitGroup}`}</span>} open={isModalVisible} closable onClose={e => closeModal(false)} footer={null} width='95%' extra={<Button type='dashed' danger shape="round" onClick={e => closeModal(false)}>Close</Button>} placement="right" >
                <KnitRatioCreationSummaryModal processingSerial={processingSerial} selectedKnitGroup={selectedKnitGroup} isModalVisible={isModalVisible} closeModal={closeModal} columns={columns} activeProduct={activeProduct} productMap={productMap} />
            </Drawer>

        </Card>
    );
}
