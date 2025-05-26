import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card } from "antd";


export const VehiclesInEachGate = () => {
    const gateData = [
        { gateNumber: "Gate 1", vehicles: 5 },
        { gateNumber: "Gate 2", vehicles: 8 },
        { gateNumber: "Gate 3", vehicles: 3 },
        { gateNumber: "Gate 4", vehicles: 10 },
        { gateNumber: "Gate 5", vehicles: 6 },
        { gateNumber: "Gate 6", vehicles: 2 },
        { gateNumber: "Gate 7", vehicles: 7 },
    ];


    const getCurrentTime = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    };
    const yAxisTickPositions = [Date.now()];


    const chartOptions = {
        chart: {
            type: "column",
        },
        title: {
            text: "Vehicles at Each Gate",
            style: {
                color: 'black',
                fontSize: '14px',
            },
        },
        xAxis: {
            categories: gateData.map((data) => data.gateNumber),
        },
        yAxis: [
            {
                title: {
                    text: "Time (hh:mm)",
                },
                labels: {
                    formatter: function () {
                        return getCurrentTime();
                    },
                },
                tickInterval: 60 * 1000,
                tickPositioner: function () {
                    return yAxisTickPositions;
                },
            },
            {
                title: {
                    text: "Number of Vehicles",
                },
            },
        ],
        plotOptions: {
            column: {
                pointWidth: 20,
                dataLabels: {
                    enabled: true,
                    format: "{y}", 
                },
            },
        },

        series: [
            {
                name: "Vehicles In Each Gate",
                type: "column",
                data: gateData.map((data) => data.vehicles),
                colorByPoint: true,
                colors: [
                    '#DAA520',
                    '#696969',
                    '#8B4513',
                    '#A0522D',
                    '#778899',
                    '#808080'
                ],
                yAxis: 1,
            },
        ],
    };

    return (
        <Card>
            <div style={{ width: '100%', height: '400px' }}>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </div>
        </Card>
    );
};


