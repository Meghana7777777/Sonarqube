import React, { useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Card } from 'antd';

const yearWiseData = [
    { year: '2021', onTimeDeliveriesCount: 150 },
    { year: '2022', onTimeDeliveriesCount: 180 },
    { year: '2023', onTimeDeliveriesCount: 220 },
];

const dayWiseData = {
    '2021': [
        { day: 'Sunday', onTimeDeliveriesCount: 15 },
        { day: 'Monday', onTimeDeliveriesCount: 10 },
        { day: 'Tuesday', onTimeDeliveriesCount: 15 },
        { day: 'Wednesday', onTimeDeliveriesCount: 20 },
        { day: 'Thursday', onTimeDeliveriesCount: 18 },
        { day: 'Friday', onTimeDeliveriesCount: 20 },
        { day: 'Saturday', onTimeDeliveriesCount: 80 },
    ],
    '2022': [
        { day: 'Sunday', onTimeDeliveriesCount: 20 },
        { day: 'Monday', onTimeDeliveriesCount: 15 },
    ],
};

const monthWiseData = {
    '2021': [
        { month: 'Jan', onTimeDeliveriesCount: 15 },
        { month: 'Feb', onTimeDeliveriesCount: 10 },
        { month: 'March', onTimeDeliveriesCount: 15 },
        { month: 'April', onTimeDeliveriesCount: 20 },
        { month: 'May', onTimeDeliveriesCount: 18 },
        { month: 'June', onTimeDeliveriesCount: 20 },
        { month: 'July', onTimeDeliveriesCount: 25 },
        { month: 'Aug', onTimeDeliveriesCount: 25 },
        { month: 'Sep', onTimeDeliveriesCount: 10 },
        { month: 'Oct', onTimeDeliveriesCount: 5 },
        { month: 'Nov', onTimeDeliveriesCount: 30 },
        { month: 'Dec', onTimeDeliveriesCount: 25 },
    ],
    '2022': [
        { month: 'Jan', onTimeDeliveriesCount: 20 },
        { month: 'Feb', onTimeDeliveriesCount: 18 },
    ],
};

export const DayMnthYearWiseDeliveriesLineCharts = () => {
    const [selectedYear, setSelectedYear] = useState(yearWiseData[0].year);
    const [selectedDataType, setSelectedDataType] = useState('day');

    const years = yearWiseData.map((data) => data.year);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleDataTypeChange = (event) => {
        setSelectedDataType(event.target.value);
    };

    const getSelectedData = () => {
        if (selectedDataType === 'day') {
            return dayWiseData[selectedYear] || [];
        } else if (selectedDataType === 'month') {
            return monthWiseData[selectedYear] || [];
        } else {
            return [];
        }
    };

    const selectedData = getSelectedData();
    const xAxisCategories = selectedData.map((data) => {
        return selectedDataType === 'day' ? data.day : data.month;
    });
    const selectedDataCounts = selectedData.map((data) => data.onTimeDeliveriesCount);

    const yearCounts = yearWiseData.map((data) => data.onTimeDeliveriesCount);

    const config = {
        chart: {
            type: "line",
            backgroundColor: "white",
        },
        title: {
            text: "Day Month Year Wise Deliveries Count",
            style: {
                color: "var(--text-color,#000)",
                fontSize: "15px",
                fontWeight: "bold",
            },
        },
        xAxis: {
            categories: xAxisCategories,
            labels: {
                style: {
                    color: "var(--text-color,#000)",
                },
            },
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            enabled: true,
            style: {
                color: "var(--text-color,#000)",
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
                    color: "var(--text-color,#000)",
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
                color: "var(--text-color,#000)",
            },
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                },
            },
        },
        series: [
            {
                name: selectedYear + " " + selectedDataType + " Wise Deliveries Count",
                data: selectedDataCounts,
                color: selectedDataType === 'day' ? "#058DC7" : "#50B432",
                marker: {
                    symbol: selectedDataType === 'day' ? 'circle' : 'square',
                },
            },
            {
                name: "Yearly Deliveries Count",
                data: yearCounts,
                color: "#FFC000",
                marker: {
                    symbol: 'diamond',
                },
            },
        ],
    };

    return (
        <Card
            style={{
                background: 'white',
                borderRadius: '4px',
            }}
        >
            <div
                style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#fccb9f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                }}
            >
                <label>Select Year:</label>
                <select value={selectedYear} onChange={handleYearChange}>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <label>Select Data Type:</label>
                <select value={selectedDataType} onChange={handleDataTypeChange}>
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                </select>
            </div>

            <br />
            <div
                style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}>
                <HighchartsReact highcharts={Highcharts} options={config} />
            </div>
        </Card>
    );
};
