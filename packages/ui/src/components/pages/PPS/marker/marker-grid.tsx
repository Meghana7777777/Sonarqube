import { CutRmModel, MarkerInfoModel, PoProdTypeAndFabModel, PoProdutNameRequest, PoSerialRequest, PoSummaryModel } from "@xpparel/shared-models";
import { useEffect, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Divider, Popconfirm, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IMarkerInfo {
    productName: string;
    fgColor: string;
    markers: MarkerInfoModel[];
    itemCodes: CutRmModel[]
    deleteMarker: (markerId: number) => void;
    openMarkerForm: (productName: string, fgColor: string, itemCode: string) => void;
}

export const MarkerGrid = (props: IMarkerInfo) => {
    console.log('&&&&&&&&&&&&&&&&&&');
    console.log(props);
    console.log('&&&&&&&&&&')
    useEffect(() => {


    }, [])



    const [productMarkersInfo, setProductMarkersInfo] = useState<IMarkerInfo[]>([]);

    const constructTblData = (markersData: MarkerInfoModel[]) => {

    }
    const columns: ColumnsType<MarkerInfoModel> = [
        {
            title: 'Marker Name',
            dataIndex: 'markerName',
            align: 'center'
        },
        {
            title: 'Marker Version',
            dataIndex: 'markerVersion',
            align: 'center'
        },
        {
            title: 'Marker Type',
            dataIndex: 'markerType',
            align: 'center'
        },
        {
            title: 'Marker Length',
            dataIndex: 'mLength',
            align: 'center'
        },
        {
            title: 'Marker Width',
            dataIndex: 'mWidth',
            align: 'center'
        },
        {
            title: 'End Allowance',
            dataIndex: 'endAllowance',
            align: 'center'
        },
        {
            title: 'Perimeter',
            dataIndex: 'perimeter',
            align: 'center'
        },
        {
            title: 'Pattern Version',
            dataIndex: 'patVer',
            align: 'center'
        },
        {
            title: 'Cad Remarks',
            dataIndex: 'remarks1',
            align: 'center'
        },
        {
            title: 'Docket Remarks',
            dataIndex: 'remarks2',
            align: 'center'
        },
        {
            title: 'Action',
            align: 'center',
            render: (_, record) => {
                return <Popconfirm
                    title="Delete Marker"
                    description="Are you sure to delete this ?"
                    onConfirm={() => props.deleteMarker(record.id)}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                    <Button type="primary" danger size="small">Delete</Button>
                </Popconfirm>
            }
        },
    ];

    const renderTbls = (markers: MarkerInfoModel[], itemCodes: CutRmModel[]) => {
        const skuSet = new Set(markers.map(markerObj => markerObj.itemCode));
        const tbls = [];
        itemCodes.forEach((itemCodeObj, index) => {
            const dataSource = markers.filter(e => e.itemCode === itemCodeObj.iCode);
            tbls.push(<>
                <Divider key={`d${index}`} ><Space>SKU: {itemCodeObj.iCode} <Button size="small" className="btn-orange" type="primary" onClick={() => props.openMarkerForm(props.productName, props.fgColor, itemCodeObj.iCode)}>Create Marker</Button></Space> </Divider>
                <Table key={`tbl${index}`} size="small" bordered columns={columns} dataSource={dataSource} pagination={false} scroll={{x : 'max-content'}} />
            </>)
        });
        return tbls;
    }
    return (<>{renderTbls(props.markers, props.itemCodes)}</>);
}

export default MarkerGrid;