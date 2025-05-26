import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const dayWiseData = [
    { day: 'Sunday', onTimeDeliveriesCount: 15 },
    { day: 'Monday', onTimeDeliveriesCount: 10 },
    { day: 'Tuesday', onTimeDeliveriesCount: 15 },
    { day: 'Wednesday', onTimeDeliveriesCount: 20 },
    { day: 'Thursday', onTimeDeliveriesCount: 18 },
    { day: 'Friday', onTimeDeliveriesCount: 20 },
    { day: 'Saturday', onTimeDeliveriesCount: 80 },
];

export const DayWiseDeliveriesCountBarCharts = () => {
    const categories = dayWiseData.map((data) => data.day);
    const onTimeDeliveriesCount = dayWiseData.map((data) => data.onTimeDeliveriesCount);

    const colors = [
        "#058DC7",
        "#50B432",
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
            chart: {
                type: "column",
              //  backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ88ZHM-7r_s90UBwRIBzKoCLeAW7pZprR0Fg&usqp=CAU)`
            },
        },
        title: {
            text: "Day Wise Deliveries Count",
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
