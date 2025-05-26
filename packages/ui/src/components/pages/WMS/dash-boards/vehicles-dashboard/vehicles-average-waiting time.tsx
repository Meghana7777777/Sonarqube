import { Card, Select, Button, DatePicker } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";

const { Option } = Select;

export const AverageWaitingTime = () => {
  const [waitingTimeData, setWaitingTimeData] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("All Day");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleFilterChange = (value) => {
    setSelectedOption(value);
  };
  const handleDateChange = (dates) => {
    setFromDate(dates[0]);
    setToDate(dates[1]);
  };

  useEffect(() => {
    getWaitingTimeData();
  }, [selectedOption]);

  const getWaitingTimeData = () => {
    const thisWeekData = [
      { date: "2023-08-01", waitingTime: 640, vehicleNumber: "ABC123" },
      { date: "2023-08-02", waitingTime: 865, vehicleNumber: "XYZ456" },
      { date: "2023-08-03", waitingTime: 720, vehicleNumber: "LMN789" },
      { date: "2023-08-03", waitingTime: 600, vehicleNumber: "LMN786" },
      { date: "2023-08-01", waitingTime: 540, vehicleNumber: "ABC125" },
    ];
    const thisMonthData = [
      { date: "2023-08-01", waitingTime: 540, vehicleNumber: "ABC123" },
      { date: "2023-08-02", waitingTime: 720, vehicleNumber: "XYZ456" },
      { date: "2023-08-03", waitingTime: 600, vehicleNumber: "LMN789" },
      { date: "2023-08-02", waitingTime: 720, vehicleNumber: "XYZ457" },
      { date: "2023-08-01", waitingTime: 640, vehicleNumber: "ABC124" },
    ];
    const overallData = [
      { date: "2023-07-01", waitingTime: 540, vehicleNumber: "ABC123" },
      { date: "2023-07-02", waitingTime: 660, vehicleNumber: "XYZ456" },
      { date: "2023-07-03", waitingTime: 780, vehicleNumber: "LMN789" },
      { date: "2023-08-02", waitingTime: 720, vehicleNumber: "XYZ454" },
      { date: "2023-08-03", waitingTime: 600, vehicleNumber: "LMN7891" },
    ];

    let filteredData = [];
    switch (selectedOption) {
      case "All Day":
        filteredData = thisWeekData;
        break;
      case "Week":
        filteredData = thisWeekData;
        break;
      case "Month":
        filteredData = thisMonthData;
        break;
      case "Overall":
        filteredData = overallData;
        break;
      default:
        filteredData = [];
    }

    const vehicleData = {};
    filteredData.forEach((item) => {
      if (!vehicleData[item.vehicleNumber]) {
        vehicleData[item.vehicleNumber] = { total: item.waitingTime, count: 1 };
      } else {
        vehicleData[item.vehicleNumber].total += item.waitingTime;
        vehicleData[item.vehicleNumber].count++;
      }
    });

    const avgWaitingTime = Object.keys(vehicleData).map((vehicleNumber) => ({
      vehicleNumber,
      avgWaitingTime: vehicleData[vehicleNumber].total / vehicleData[vehicleNumber].count,
    }));

    setWaitingTimeData(avgWaitingTime);
  };

  const periods = waitingTimeData.map((i) => i.vehicleNumber);
  const avgWaitingTime = waitingTimeData.map((i) => i.avgWaitingTime);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const options = {
    title: {
      text: "Average Waiting Time For A Vehicle To Get Through The Gate",
      style: {
        color: "var(--text-color,black)",
        fontSize: "15px",
        lineHeight: "1.4",
        marginBottom: "0",
        overflow: "hidden",
        paddingTop: "calc(2px*var(--scale-factor, 1))",
        position: "relative",
        textOverFlow: "ellipsis",
        whiteSpace: "nowrap",
        zIndex: "5",
        fontFamily: "visuelt-bold-pro,Arial,sans-serif,Font Awesome\ 5 Pro",
      },
    },
    xAxis: {
      categories: periods,
      labels: {
        style: {
          color: "var(--text-color,black)",
        },
      },
    },
    yAxis: {
      title: {
        text: "Average Waiting Time",
      },
      labels: {
        formatter: function () {
          return formatTime(this.value);
        },
        style: {
          color: "var(--text-color,black)",
        },
      },
    },
    series: [
      {
        name: "Average Waiting Time",
        data: avgWaitingTime,
        colorByPoint: true,
        colors: [
          '#DAA520',
          '#696969',
          '#8B4513',
          '#A0522D',
          '#778899',
          '#808080'
        ],
      },
    ],
  };

  return (
    <Card>
      <div style={{ maxWidth: "600px", padding: "16px", margin: "8px", backgroundColor: "#F0FFFF" }}>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
          <Button onClick={() => handleFilterChange("All Day")} style={{ marginRight: "8px", backgroundColor: 'grey' }}>
            Day
          </Button>
          <Button onClick={() => handleFilterChange("Week")} style={{ marginRight: "8px", backgroundColor: 'grey' }}>
            Week
          </Button>
          <Button onClick={() => handleFilterChange("Month")} style={{ marginRight: "8px", backgroundColor: 'grey' }}>
            Month
          </Button>
          <Button onClick={() => handleFilterChange("Overall")} style={{ marginRight: "8px", backgroundColor: 'grey' }}>Overall</Button>
          {/* <DatePicker.RangePicker onChange={handleDateChange} style={{ marginLeft: "16px" }} /> */}
        </div>
        <div>
          <HighchartsReact highcharts={Highcharts} options={options} style={{ backgroundColor: "#F0FFFF" }} />
        </div>
      </div>
    </Card>
  );
};