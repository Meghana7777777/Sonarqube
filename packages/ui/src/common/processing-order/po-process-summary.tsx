import { OrderTypeEnum, PoDataSummaryResponse, PoSizeDetailsModel, PoSummaryDataModel, ProcessingOrderInfoModel, ProcessingOrderInfoRequest, ProcessingOrderInfoResponse, ProcessingOrderSerialRequest, ProcessTypeEnum } from "@xpparel/shared-models";
import { KnitOrderService } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Row, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
const { Option } = Select;


interface FlattenedSize {
    size: string;
    quantity: number;
}

interface FlattenedPoSummary {
    quantityType: string;
    productCode: string;
    color: string;
    sizes: FlattenedSize[];
}



const getRowSpan = (data: any[], index: number, key: string) => {
    if (index === 0 || data[index - 1][key] !== data[index][key]) {
        const count = data.filter((item) => item[key] === data[index][key]).length;
        return count > 1 ? count : 1;
    }
    return 0;
};




interface IPoSummaryProps {
    poSerialsApi: (prcOrdInfoReq: ProcessingOrderInfoRequest) => Promise<ProcessingOrderInfoResponse>
    poSummaryApi: (req: ProcessingOrderSerialRequest) => Promise<PoDataSummaryResponse>
    processType: ProcessTypeEnum
}
export default function POProcessSummary(props: IPoSummaryProps) {
    const { poSerialsApi, poSummaryApi, processType } = props
    const user = useAppSelector((state) => state.user.user.user);
    const [poSummaryData, setPoSummaryData] = useState<FlattenedPoSummary[]>()
    const [poSerials, setPoSerials] = useState<ProcessingOrderInfoModel[]>([])
    const [selectedPoSerial, setSelectedPoSerial] = useState<number>(null)

    useEffect(() => {
        getPoSerials()
    }, [])


    const getPoSummary = async () => {
        try {
            const req = new ProcessingOrderSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [selectedPoSerial], processType)
            const res = await poSummaryApi(req)
            if (res.status) {
                const flattenData = flattenPoSumaryData(res.data)
                setPoSummaryData(flattenData)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getPoSerials = async () => {
        try {
            const req = new ProcessingOrderInfoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, ProcessTypeEnum.KNIT, false, false, false, false, false, false, false, false, false)
            const res = await poSerialsApi(req)
            if (res.status) {
                setPoSerials(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    function flattenPoSumaryData(data: PoSummaryDataModel[]): FlattenedPoSummary[] {
        if (data.length === 0) {
            return []
        }
        return data.flatMap((summary) =>
            summary.productCodeDetails.flatMap((product) =>
                product.colorDetails.map((color) => ({
                    quantityType: summary.quantityType,
                    productCode: product.productCode,
                    color: color.color,
                    sizes: color.poSizeDetails.map((size) => ({
                        size: size.size,
                        quantity: size.quantity,
                    })),
                }))
            )
        );
    }

    function onPoSerialChange(val: number) {
        setSelectedPoSerial(val)
    }


    function onSubmit() {
        getPoSummary()
    }



    function constructColumns() {

        const columns: ColumnsType<any> = [
            {
                title: "Quantity Type",
                dataIndex: "quantityType",
                key: "quantityType",
                fixed: 'left',
                align: 'center',
                render: (value, row, index) => ({
                    children: value,
                    props: { rowSpan: getRowSpan(poSummaryData, index, "quantityType") },
                }),
            },
            {
                title: "Product Type",
                dataIndex: "productCode",
                key: "productCode",
                fixed: 'left',
                align: 'center',
            },
            {
                title: "Color",
                dataIndex: "color",
                key: "color",
                fixed: 'left',
                align: 'center',
            },
        ];

        const uniqueSizes = Array.from(new Set(poSummaryData.flatMap(summary => summary.sizes.map(size => size.size))));



        uniqueSizes.forEach((size) => {
            columns.push({
                title: size,
                dataIndex: 'sizes',
                key: size,
                align: 'center',
                render: (v, record) => {
                    const sizeData = v.find((s) => s.size === size);
                    return sizeData ? (
                        <Tooltip title="Quantity">
                            <Tag color="#da8d00">{sizeData.quantity}</Tag>
                        </Tooltip>
                    ) : ('');
                },
            });
        });
        columns.push({
            title: "Total Quantity",
            key: "totalQuantity",
            width: 100,
            align: 'center',
            render: (_, record) => {
                console.log(record)
                const totalQuantity = record.sizes.reduce((sum, size) => sum + size.quantity, 0)
                return <Tooltip title="Total Quantity">
                    <Tag color="#257d82">{totalQuantity}</Tag>
                </Tooltip>

            },
        });
        return columns
    }



    return (
        <Card title={<span style={{ display: 'flex', justifyContent: 'left' }}>PO Summary</span>} size="small">
            <Form>
                <Row gutter={[16, 16]}> 
                    <Col xs={24} sm={24} md={9} lg={7} xl={6}>
                        <Form.Item label="Po Number" name="poNumber">
                            <Select onChange={onPoSerialChange} placeholder="Select PO Number">
                                {poSerials.map((po) => (
                                    <Option key={po.processingSerial} value={po.processingSerial}>
                                        {po.processingSerial + "-" + po.prcOrdDescription}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" onClick={onSubmit}>Submit</Button>
                    </Col>
                </Row>
            </Form>
            {poSummaryData && poSummaryData.length > 0 && <Table
                columns={constructColumns()}
                dataSource={poSummaryData}
                pagination={false}
                bordered
                rowKey={(record) => `${record.quantityType}-${record.productCode}-${record.color}`}
                scroll={{ x: 'max-content' }}
                style={{marginTop: '15px'}}
                size="small"
            />}
        </Card>
    );
}
