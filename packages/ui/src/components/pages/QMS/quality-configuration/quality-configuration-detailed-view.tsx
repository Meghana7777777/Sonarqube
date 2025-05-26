import { Card, Table } from "antd";

export interface QualityConfigurationDetailedViewProps {
    rec: any;
}

const QualityConfigurationDetailedView = (props: QualityConfigurationDetailedViewProps) => {
    const data = props.rec
    console.log(data, 'oooooooooooo');

    const columns: any = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Quantity",
            dataIndex: "quantity"
        },
        {
            title: "Responsible User",
            dataIndex: "responsibleUser"
        },
        {
            title: "Level",
            dataIndex: "level"
        },
    ]
    return (
        <>
            <Card>
                <Table columns={columns} dataSource={data?.qualityEsclationsConfig} pagination={false} />
            </Card>
        </>
    )
}

export default QualityConfigurationDetailedView;