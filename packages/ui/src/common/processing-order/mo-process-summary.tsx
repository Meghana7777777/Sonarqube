import { CommonRequestAttrs, MoDataForSoSummaryModel, MoNumberDropdownModel, MoPslIdsRequest, MoPslQtyInfoModel, MoPslQtyInfoResponse, ProcessTypeEnum, ProcessTypeSizeWiseRequest, ProcessTypeWiseSizeModel, SoSummaryRequest, StyleCodeRequest, StyleCodesDropdownModel, StyleModel } from "@xpparel/shared-models";
import { KnitOrderService, OrderCreationService, OrderManagementService, PreIntegrationServicePKMS, SewingProcessingOrderService, StyleSharedService } from "@xpparel/shared-services";
import { Button, Card, Col, Empty, Form, Row, Select, Space, Spin, Table, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../components/common";
import { useAppSelector } from "../hooks";
import { ColumnsType } from "antd/lib/table";

const { Item } = Form
const { Option } = Select

export type ISizeQty = {
    [K in keyof typeof ProcessTypeEnum as `${typeof ProcessTypeEnum[K]}_QTY`]: number;
} & {
    moQty: number;
};

interface MergedData {
    key: string | number;
    moNumber: string;
    soNumber: string;
    moLine: string;
    soLine: string;
    productName: string;
    moSlQty: number;
    sizeData: {
        [key: string]: ISizeQty;

    }
}

interface IColorMap {
    qtyType: string;
    color: string;
    key: keyof ISizeQty;
}

const getColorMapArray = (): IColorMap[] => {
    const processTypes = Object.values(ProcessTypeEnum);
    const colors = [
        '#d1bf21', '#87d068', '#108ee9', '#f50', '#2db7f5', '#f5222d',
        '#52c41a', '#722ed1', '#13c2c2', '#eb2f96', '#fa541c', '#a0d911',
        '#fa8c16', '#b37feb'
    ]; // More colors as needed

    return processTypes.map((process, index) => {
        const titleCase = process.charAt(0) + process.slice(1).toLowerCase();
        const key = `${process}_QTY` as keyof ISizeQty;
        return {
            qtyType: `${titleCase} PO Qty`,
            color: colors[index % colors.length],
            key
        };
    });
};

const colorMapArr: IColorMap[] = getColorMapArray();



export default function MOProcessSummary() {
    const [form] = Form.useForm();
    const orderManagementService = new OrderManagementService();
    const ordercreationService = new OrderCreationService();
    const [styleCodeDropdownData, setStyleCodeDropdownData] = useState<StyleModel[]>([]);
    const [moNumberDropdownData, setMoNumberDropdownData] = useState<MoNumberDropdownModel[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const [soAndMoData, setMoAndSoData] = useState<MoDataForSoSummaryModel[]>([])
    const [mergedData, setMergedData] = useState<MergedData[]>([])
    const [expanded, setExpanded] = useState(false)

    const knitPOService = new KnitOrderService()
    const sewOrderService = new SewingProcessingOrderService()
    const packOrderService = new PreIntegrationServicePKMS()
    const stylesService = new StyleSharedService();

    useEffect(() => {
        getStyleCodeDropdownData();
    }, []);


    const getStyleCodeDropdownData = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        stylesService.getAllStyles(reqObj).then((res) => {
            if (res.status) {
                setStyleCodeDropdownData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setStyleCodeDropdownData([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setStyleCodeDropdownData([]);
            });
    };

    const getMoNumberDropdownData = () => {
        const styleCode = form.getFieldValue('styleCode');
        const styleCodeReq = new StyleCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, styleCode)
        ordercreationService.getMoNumbersForStyleCode(styleCodeReq).then((res) => {
            if (res.status) {
                setMoNumberDropdownData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setStyleCodeDropdownData([]);
            }
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setMoNumberDropdownData([]);
            });
    }

    const onStyleCodeChange = () => {
        setMoNumberDropdownData([])
        setMoAndSoData([])
        setMergedData([])
        form.resetFields(['moNumber'])
        getMoNumberDropdownData();
    }

    const onMONumberChange = () => {
        getMoDataBySoForSoSummary()
    }

    const getMoDataBySoForSoSummary = async () => {
        try {
            const moNumber = form.getFieldValue('moNumber');

            const req = new SoSummaryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, moNumber);
            const res = await orderManagementService.getMoDataBySoForSoSummary(req);
            if (res?.status && res.data) {
                setMoAndSoData(res.data);
                constructReportData(res.data)
            } else {
                AlertMessages.getErrorMessage(res?.internalMessage || "Failed to fetch data.");
                setMoAndSoData([]);
            }
        } catch (err: any) {
            AlertMessages.getErrorMessage(err.message || "An unexpected error occurred.");
            setMoAndSoData([]);
        }
    };

    async function constructReportData(data: MoDataForSoSummaryModel[]) {
        if (!Array.isArray(data) || data.length < 1) return;

        try {
            const mergedDataMap = new Map<string, MergedData>();

            const promises = data.map(async (eachRec) => {
                const [knitRes, spsRes, packRes] = await fetchPoQtys(eachRec.moPslId);
                const key = `${eachRec.moLineId}-${eachRec.productName}-${eachRec.moNumber}`;

                // flatten all process‐type entries into single variable
                const allProcessTypesData = [
                    ...(knitRes?.data || []),
                    ...(spsRes?.data || []),
                    ...(packRes?.data || []),
                ];

                const poQtys: ISizeQty = Object.keys(ProcessTypeEnum).reduce((acc, key) => {
                    const enumValue = ProcessTypeEnum[key];
                    return {
                        ...acc,
                        [`${enumValue}_QTY`]: 0
                    };
                }, {} as ISizeQty);

                // Add moQty manually
                poQtys.moQty = 0;

                allProcessTypesData.forEach(({ processingType, quantity }) => {
                    const qtyKey = `${processingType}_QTY`;       // e.g. "KNIT_QTY"
                    poQtys[qtyKey] = (poQtys[qtyKey] || 0) + quantity;
                });

                if (mergedDataMap.has(key)) {
                    mergedDataMap.get(key)!.sizeData[eachRec.size] = { ...poQtys, moQty: eachRec.moSlQty };
                } else {
                    mergedDataMap.set(key, {
                        key,
                        moNumber: eachRec.moNumber,
                        soNumber: eachRec.soNumber,
                        moLine: eachRec.moLine,
                        soLine: eachRec.soLine,
                        productName: eachRec.productName,
                        moSlQty: eachRec.moSlQty,
                        sizeData: {
                            [eachRec.size]: { ...poQtys, moQty: eachRec.moSlQty }
                        }
                    });
                }
            });

            await Promise.all(promises);

            setMergedData(Array.from(mergedDataMap.values()));
        } catch (error) {
            console.error(error);
            throw new Error(`Error constructing report data: ${error}`);
        }
    }





    const fetchPoQtys = async (moPslIds: number[]) => {
        const req = new MoPslIdsRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            [...moPslIds]
        );

        const fallbackResponse: MoPslQtyInfoResponse = {
            status: false,
            data: [],
            errorCode: 0,
            internalMessage: ''
        };

        const results = await Promise.allSettled([
            knitPOService.getPoQtysInfoForMoPSLIds(req),
            sewOrderService.getPoQtysInfoForMoPSLIds(req),
            packOrderService.getPoQtysInfoForMoPSLIds(req)
        ]);

        return results.map(result =>
            result.status === 'fulfilled' ? result.value : fallbackResponse
        );
    };


    function constructColumns() {
        const uniqueSizes = [...new Set(soAndMoData?.map((item) => item.size))].filter(Boolean) as string[]
        const soSummaryColumns: ColumnsType<MergedData> = [
            { title: "MO Number", dataIndex: "moNumber", key: "moNumber", fixed: 'left' },
            { title: "SO Number", dataIndex: "soNumber", key: "soNumber", fixed: 'left' },
            { title: "MO Line", dataIndex: "moLine", key: "moLine", fixed: 'left' },
            { title: "SO Line", dataIndex: "soLine", key: "soLine", fixed: 'left' },
            { title: "Product Name", dataIndex: "productName", key: "productName", fixed: 'left' },
        ];
        const sizeWiseColumns: ColumnsType<MergedData> = uniqueSizes.map((size) => ({
            title: size,
            dataIndex: 'moSlQty',
            key: size,
            align: 'center',
            render: (_v, record: MergedData) => {
                const qtysForSize = record.sizeData[size] || {};

                // only keep process‐types with qty > 0
                const nonZero = colorMapArr.filter(colorObj =>
                    (qtysForSize[colorObj.key] ?? 0) > 0
                );

                return (
                    <Space size={2}>
                        <Tooltip title={'MO Qty'}>
                            <Tag color={'#257d82'}>
                                {qtysForSize['moQty']}
                            </Tag>
                        </Tooltip>
                        {nonZero.map(colorObj => (
                            <Tooltip key={`${size}-${colorObj.key}`} title={colorObj.qtyType}>
                                <Tag color={colorObj.color}>
                                    {qtysForSize[colorObj.key]}
                                </Tag>
                            </Tooltip>
                        ))}


                        {nonZero.length === 0 && <span style={{ color: '#999' }}>—</span>}
                    </Space>
                );
            }
        }));

        return [...soSummaryColumns, ...sizeWiseColumns]
    }




    function renderColorLegends() {
        const MAX_VISIBLE = 4

        // decide which subset to render
        const toShow = expanded
            ? colorMapArr
            : colorMapArr.slice(0, MAX_VISIBLE)

        return (
            <>
                <Row gutter={[16, 12]} >
                    {toShow.map((colorObj) => (
                        <Col span={6} key={colorObj.key}>
                            <Tag color={colorObj.color}>{colorObj.qtyType}</Tag>
                        </Col>
                    ))}
                </Row>

                {colorMapArr.length > MAX_VISIBLE && (
                    <Button
                        type="link"
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        style={{ padding: 0 }}
                    >
                        {expanded ? 'Show Less ▲' : `Show All (${colorMapArr.length}) ▼`}
                    </Button>
                )}
            </>
        )
    }

    return (
        <div >
            <Card title={<span style={{ display: 'flex', justifyContent: 'left' }} >MO Process Summary</span>} size='small' >
                <Form onFinish={onMONumberChange} form={form} layout='horizontal'>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Item name={'styleCode'} label="Style : " required rules={[{ required: true, message: "Please select style code" }]} >
                                <Select onChange={onStyleCodeChange} placeholder="Select style code">
                                    {
                                        styleCodeDropdownData.length && styleCodeDropdownData.map((v) => (<Option value={v.styleCode} key={v.styleCode}>{v.styleCode}</Option>))
                                    }
                                </Select>
                            </Item>
                        </Col>
                        <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                            <Item name={'moNumber'} label="MO Number : " required rules={[{ required: true, message: "Please select MO Number" }]}>
                                <Select placeholder={"Select MO Number"} showSearch allowClear >
                                    {
                                        moNumberDropdownData.length && moNumberDropdownData.map((v) => (<Option value={v.moNumber}>{v.moNumber}</Option>))
                                    }
                                </Select>
                            </Item>
                        </Col>
                        <Col span={8}>
                            <Button type='primary' htmlType="submit">Submit</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card style={{ marginTop: '20px' }}>
                <Row style={{marginBottom: '20px'}} justify={'end'}>
                    {renderColorLegends()}
                </Row>

                {<Table
                    size="small"

                    rowKey={(v) => v.key}
                    columns={constructColumns()}
                    bordered
                    dataSource={mergedData}
                    scroll={{ x: 'max-content' }}
                // ... other table props
                />}
            </Card>
        </div>
    )
}
