import { Bar } from '@ant-design/plots';
import { QMS_DefectRatesModel } from '@xpparel/shared-models';
import { Card, Skeleton } from 'antd';

interface DefectiveRateBarChartProps {
    data: QMS_DefectRatesModel[];
    title:string;
    loading:boolean
}

export const DefectRateBarChart = (props: DefectiveRateBarChartProps) => {
    const { data,title,loading } = props

    if (loading) {
        return <Skeleton active />
    }
    const config = {
        data,
        xField: 'defectiveRate',
        yField: 'label',
        seriesField: 'label',
        colorField: 'label',
        barWidthRatio: 0.6,
        tooltip: {
            formatter: (datum) => ({
                name: 'Defect Rate (%)',
                value: `${datum.defectiveRate}%`,
            }),
        },
    };

    return <Card title={title}>
        <Bar {...config} />
    </Card>
};
