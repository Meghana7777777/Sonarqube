import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_heatmap from 'highcharts/modules/heatmap';
import HC_exporting from 'highcharts/modules/exporting';
import { Card, Empty, Skeleton } from 'antd';
import { QMS_LocVsQualitytypeDefectsModel } from '@xpparel/shared-models';

HC_heatmap(Highcharts);
HC_exporting(Highcharts);

interface Props {
    data: QMS_LocVsQualitytypeDefectsModel[]
    loading: boolean
}

export function LocVsQTHeatMapChart(props: Props) {
    const { data, loading } = props
    if (loading) {
        return <Skeleton active />
    }
    if (data.length === 0) {
        return <Empty />
    }
    const operations = data.map((v) => v.qualityType);
    const workstations = data.map((v) => v.location);



    const constructedData = data.map(d => [
        workstations.indexOf(d.location),
        operations.indexOf(d.qualityType),
        d.defectQty,
    ]);

    const options = {
        chart: {
            type: 'heatmap',
            plotBorderWidth: 1,
        },
        title: {
            text: 'Quality type wise Defect Heatmap by Location',
        },
        xAxis: {
            categories: workstations,
            title: { text: 'Location' },
        },
        yAxis: {
            categories: operations,
            title: { text: 'Quality type' },
            reversed: true,
        },
        colorAxis: {
            min: 0,
            stops: [
                [0, '#b3e5fc'],
                [0.5, '#29b6f6'],
                [1, '#01579b'],
            ],
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280,
        },
        tooltip: {
            formatter: function () {
                return (
                    `<b>Quality type:</b> ${operations[this.point.y]}<br/>` +
                    `<b>Location:</b> ${workstations[this.point.x]}<br/>` +
                    `<b>Defects:</b> ${this.point.value}`
                );
            },
        },
        series: [
            {
                name: 'Defect Count',
                borderWidth: 1,
                data: constructedData,
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                },
            },
        ],
    };


    return <Card>
        <HighchartsReact highcharts={Highcharts} options={options} />;
    </Card>
};

export default LocVsQTHeatMapChart