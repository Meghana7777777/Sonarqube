import { Card, Table, Tag } from "antd";
import { IMoLineInfo, IProductFgColorInfo } from "./interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import moment from "moment";
import { defaultDateFormat } from "packages/ui/src/components/common/data-picker/date-picker";

interface IProps {
    productColorSizeData: IProductFgColorInfo;
    uniqueSizes: string[]
}

const columns: ColumnsType<IMoLineInfo> = [
    { title: "S.No", dataIndex: "sno", key: "sno", align: 'center', render: (v, _, i) => i + 1 },
    { title: "MO Line", dataIndex: "moLine", key: "moLine", align: 'center' },
    { title: "Delivery", dataIndex: "deliveryDate", key: "delivery", align: 'center', render: (v: string[]) => v?.map(e => <Tag>{moment(new Date(e)).format(defaultDateFormat)}</Tag>) },
    { title: "Destination", dataIndex: "destination", key: "destination", align: 'center', render: (v: string[]) => v?.map(e => <Tag color="#87d068">{e}</Tag>) },
    { title: "Color", dataIndex: "color", key: "color", align: 'center', },
];
const ProductColorSizeGrid = (props: IProps) => {
    const { productName, fgColor, moLineProducts } = props.productColorSizeData;
    const [tblColumns, setTblColumns] = useState<ColumnsType<IMoLineInfo>>([])
    useEffect(() => {
        if (props) {
            const sizeColumns = constructSizes(props.uniqueSizes);
            setTblColumns([...columns, ...sizeColumns])
        }
        console.log(props.productColorSizeData)
    }, []);

    const constructSizes = (sizes: string[]) => {
        return sizes.map(size => {
            return { title: size, dataIndex: size }
        });
    }

    return (
        <>
            {props.productColorSizeData && (
                <>
                    <div style={{ marginTop: '10px' }}>
                        <Card
                            size="small"
                            title={
                                <div style={{ display: "flex", alignItems: "center", whiteSpace: 'nowrap' }}>
                                    <div style={{ display: "flex", alignItems: "center", paddingRight: '20px' }}>
                                        <span style={{ marginRight: "6px" }}>Product Name:</span>
                                        <Tag style={{ fontSize: '15px' }} color="#ebac17">{productName}</Tag>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "6px" }}>FG Color:</span>
                                        <Tag style={{ fontSize: '15px' }} color="#2db7f5">{fgColor}</Tag>
                                    </div>
                                </div>
                            }
                            style={{ marginBottom: '16px', background: '#fff', padding: '0 10px' }}
                        >

                            <Table
                                size="small"
                                columns={tblColumns}
                                dataSource={moLineProducts}
                                bordered
                                pagination={false}
                                scroll={{ x: 'max-content' }}
                                style={{ minWidth: '100%' }}
                            />
                        </Card>
                    </div>
                </>
            )}
        </>
    );

}
export default ProductColorSizeGrid;