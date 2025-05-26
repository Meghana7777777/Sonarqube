import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const monthWiseData = [
    { month: 'Jan', onTimeDeliveriesCount: 15 },
    { month: 'Feb', onTimeDeliveriesCount: 10 },
    { month: 'March', onTimeDeliveriesCount: 15 },
    { month: 'April', onTimeDeliveriesCount: 20 },
    { month: 'May', onTimeDeliveriesCount: 18 },
    { month: 'June', onTimeDeliveriesCount: 20 },
    { month: 'July', onTimeDeliveriesCount: 25 },
    { month: 'Aug', onTimeDeliveriesCount: 25 },
    { month: 'Sep', onTimeDeliveriesCount: 10},
    { month: 'Oct', onTimeDeliveriesCount: 5 },
    { month: 'Nov', onTimeDeliveriesCount: 30 },
    { month: 'Dec', onTimeDeliveriesCount: 25 },

];

export const MonthWiseDeliveriesCountBarCharts = () => {
    const categories = monthWiseData.map((data) => data.month);
    const onTimeDeliveriesCount = monthWiseData.map((data) => data.onTimeDeliveriesCount);

    const colors = [
        "#058DC7",
        "#50B432",
        "#FFC000",
        "#7798BF",
        "#aaeeee",
        "#ff0066",
        "#eeaaee",
        "#FFC000",
        "#7798BF",
        "#aaeeee",
        "#ff0066",
        "#eeaaee",
    ];

    const seriesData = onTimeDeliveriesCount.map((count, index) => ({
        y: count,
        color: colors[index % colors.length], // Use modulo to repeat colors if there are more data points than colors.
    }));

    const config = {
        chart: {
            type: "column",
            backgroundColor: "white",
        },
        title: {
            text: "Month Wise Deliveries Count",
            style: {
                color: "var(--text-color,#000)", // Set the title color to dark (black)
                fontSize: "15px",
                fontWeight: "bold",
            },
        },
        xAxis: {
            categories: categories,
            labels: {
                style: {
                    color: "var(--text-color,#000)", // Set the category labels color to dark (black)
                },
            },
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            enabled: true,
            style: {
                color: "var(--text-color,#000)", // Set the data labels color to dark (black)
                fontSize: "1.15rem",
                lineHeight: "1.4",
                marginBottom: "0",
                overflow: "hidden",
                paddingTop: "calc(2px*var(--scale-factor, 1))",
                position: "relative",
                textOverFlow: "ellipsis",
                whiteSpace: "nowrap",
                zIndex: "5",
                fontFamily: "visuelt-bold-pro,Arial,sans-serif,Font Awesome 5 Pro",
            },
            labels: {
                style: {
                    color: "var(--text-color,#000)", // Set the data labels color to dark (black)
                },
            },
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "top",
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
            shadow: true,
            itemStyle: {
                color: "var(--text-color,#000)", // Set the legend item color to dark (black)
            },
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                },
            },
        },
        series: [
            {
                name: "On Time Deliveries Count",
                data: seriesData,
            },
        ],
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={config} />
        </div>
    );
};
