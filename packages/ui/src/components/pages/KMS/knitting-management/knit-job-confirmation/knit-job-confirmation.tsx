import { ProCard } from '@ant-design/pro-components'
import { KC_KnitGroupRatioModel, KC_KnitJobConfStatusEnum, KC_KnitJobConfStatusViewObj, KC_KnitJobGenStatusViewObj, KC_KnitOrderJobsModel, ProcessingOrderSerialRequest, ProcessingSerialProdCodeRequest, ProcessTypeEnum, ProductInfoModel, StyleCodeRequest, StyleProductCodeFgColor } from '@xpparel/shared-models';
import { KnitOrderService, KnittingJobsService, KnittingManagementService } from '@xpparel/shared-services';
import { Alert, Button, Card, Col, Flex, Form, Row, Select, Space, Table, Tag, Tooltip } from 'antd'
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { title } from 'process'
import React, { useEffect, useState } from 'react'

import { CheckCircleOutlined, CloseCircleOutlined, RightCircleOutlined, UndoOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
const { Item } = Form;
const { Option } = Select

interface KnitJobConfirmationProps {
    processingSerial: number;
    styleCode: string;
}



const ratioColumns: ColumnsType<KC_KnitGroupRatioModel> = [
    { title: "S.No", dataIndex: '', width: 50, align: 'center', fixed: 'left', render: (_: any, __: any, index: number) => index + 1 },
    { title: "Ratio Code", dataIndex: "ratioCode", key: "ratioCode", width: 100, align: 'center', fixed: 'left', },
    { title: "Knit Group", dataIndex: "knitGroup", key: "knitGroup", width: 100, align: 'center', fixed: 'left', },
    { title: "Component", dataIndex: "components", key: "components", width: 150, align: 'center', fixed: 'left', render: (components: string[]) => components.join(", ") },
    { title: "Item", dataIndex: "itemCodes", key: "itemCodes", width: 150, align: 'center', fixed: 'left', render: (itemCodes: string[]) => itemCodes.join(", ") },
    {
        title: 'Job Gen status',
        dataIndex: ['ratioStatus', 'jobsGenStatus'],
        align: "center",
        render: (v) => <Tag>{KC_KnitJobGenStatusViewObj[v]}</Tag>
    },
    {
        title: 'Job Confirm status',
        dataIndex: ['ratioStatus', 'jobConfStatus'],
        align: "center",
        render: (v) => <Tag>{KC_KnitJobConfStatusViewObj[v]}</Tag>
    },
];
/**
 * TO DO Not using Now
 * @param props 
 * @returns 
 */
export default function KnitJobConfirmation(props: KnitJobConfirmationProps) {
    const { processingSerial, styleCode } = props
    const [form] = Form.useForm()
    const [productInfo, setProductInfo] = useState<StyleProductCodeFgColor[]>()
    const [selectedProduct, setSelectedProduct] = useState<StyleProductCodeFgColor>();
    const [knitGroupRatioPoData, setKnitGroupratioPoData] = useState<KC_KnitGroupRatioModel[]>([]);
    const user = useAppSelector((state) => state.user.user.user);

    const knittingJobsService = new KnittingJobsService()
    const knitOrderService = new KnitOrderService();
    const kmsService = new KnittingManagementService();

    useEffect(() => {
        getStyleProductCodeFgColorForPo()
    }, [])



    const getKnitGroupRatioInfoForPo = async () => {
        try {
            const req = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, ProcessTypeEnum.KNIT, selectedProduct.productCode, selectedProduct.fgColor, true, true, true, true)
            const res = await kmsService.getKnitGroupRatioInfoForPo(req);
            if (res.status) {
                setKnitGroupratioPoData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // need to get product for style and processing serial
    const getStyleProductCodeFgColorForPo = () => {
        const styleCodeRequest = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [processingSerial], ProcessTypeEnum.KNIT)
        knitOrderService.getStyleProductCodeFgColorForPo(styleCodeRequest).then((res) => {
            if (res.status) {
                setProductInfo(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
                setProductInfo([])
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message)
            setProductInfo([])
        })
    }

    const confirmJobsForPoAndProduct = () => {
        const processingSerialProdCodeRequest = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, ProcessTypeEnum.KNIT, selectedProduct.productCode, selectedProduct.fgColor, false, false, false, false)
        knittingJobsService.confirmJobsForPoAndProduct(processingSerialProdCodeRequest).then((res) => {
            if (res.status) {
                getKnitGroupRatioInfoForPo()
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message)

        })
    }

    const unConfirmJobsForPoAndProduct = () => {
        const processingSerialProdCodeRequest = new ProcessingSerialProdCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, ProcessTypeEnum.KNIT, selectedProduct.productCode, selectedProduct.fgColor, false, false, false, false)
        knittingJobsService.unConfirmJobsForPoAndProduct(processingSerialProdCodeRequest).then((res) => {
            if (res.status) {
                getKnitGroupRatioInfoForPo()
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message)

        })
    }


    function onProductChange(v, e) {
        const val = new StyleProductCodeFgColor()
        val.fgColor = e.fgColor
        val.productCode = e.productCode
        val.styleCode = e.styleCode
        val.productName = e.productName
        val.productType = e.productType
        setSelectedProduct(val)
        // getKnitJobsByPoAndProductCode()
    }

    function onSubmit() {
        // getKnitJobsByPoAndProductCode();
        getKnitGroupRatioInfoForPo();
    }





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

    function renderKnitRatiosTabExtra() {
        return <Space>
            <Tag color="#257d82">Knit Ratio Qty</Tag>
            <Tag color="#da8d00">Job Qty</Tag>
            <Tag color="#5adb00">Logical bundle Qty</Tag>
        </Space>
    }
    return (
        <Card>
            <Form form={form}>
                <Row gutter={[24, 12]}>
                    <Col span={6}>
                        <Form.Item label="Product/Color" name={"product"}>
                            <Select onChange={onProductChange} placeholder='Select product name'>
                                {productInfo && productInfo.length &&
                                    productInfo.map((p) => <Option {...p} value={p.productCode+p.fgColor} key={p.productCode+p.fgColor}>{p.productName + "/" + p.fgColor}</Option>)
                                }

                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button onClick={onSubmit} type='primary'>Submit</Button>
                    </Col>
                    {knitGroupRatioPoData.length && knitGroupRatioPoData.some((v) => v.ratioStatus.jobConfStatus === KC_KnitJobConfStatusEnum.OPEN) ? <Col span={3}>
                        <Button onClick={confirmJobsForPoAndProduct} icon={<CheckCircleOutlined />} style={{ backgroundColor: 'green' }} type='primary'>Confirm jobs</Button>
                    </Col> : <></>}
                    {knitGroupRatioPoData.length && knitGroupRatioPoData.some((v) => v.ratioStatus.jobConfStatus === KC_KnitJobConfStatusEnum.COMPLETED) ? <Button onClick={unConfirmJobsForPoAndProduct} icon={<UndoOutlined />} danger type='primary'>Un confirm jobs</Button> : <></>}

                </Row>
                {
                    knitGroupRatioPoData.length ?
                        <>
                            {/* <ProCard boxShadow title={"Ratios"} extra={renderKnitRatiosTabExtra()}> */}
                            <Card size='small'>
                                <Flex justify='space-between'>
                                    <span>Ratios</span>
                                    <div>{renderKnitRatiosTabExtra()}</div>
                                </Flex>
                            </Card>
                            <Table dataSource={knitGroupRatioPoData} pagination={false} columns={[...ratioColumns, ...ratioSizeColumns]} rowKey="knitGroup" bordered size='small' scroll={{ x: 1200 }} />
                            {/* </ProCard> */}
                        </>
                        : <Alert message="No data found" type='info' showIcon closable banner />
                }

            </Form>

        </Card>
    )
}
