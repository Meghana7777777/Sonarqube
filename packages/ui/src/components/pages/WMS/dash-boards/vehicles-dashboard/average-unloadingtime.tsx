import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { GrnServices } from '@xpparel/shared-services';

export const AverageUnloadingTime = () => {
  const [vehicleData, setVehicleData] = useState<any[]>([]);
  const service = new GrnServices();

  useEffect(() => {
    getVehicleData();
  }, []);

  const getVehicleData = () => {
    service.getAvgVehicleUnloadingTime()
      .then((res) => {
        if (res.status) {
          setVehicleData(res.data);
        } else {
          throw new Error(res.internalMessage);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };


  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const totalUnloadingTime = vehicleData.reduce((sum, vehicle) => sum + vehicle.unloadingTime, 0);
  const averageUnloadingTimeInSeconds = totalUnloadingTime / vehicleData.length;

  const averageUnloadingTimeFormatted = formatTime(averageUnloadingTimeInSeconds);

  const chartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: `Average Unloading Time`,
    },
    xAxis: {
      categories: vehicleData.map((data) => data.vehicleNumber),
    },
    yAxis: {
      title: {
        text: 'Time (hours, minutes, seconds)',
      },
      labels: {
        formatter: function () {
          return formatTime(this.value);
        },
      },
    },
    series: [
      {
        name: 'Unloading Time',
        data: vehicleData.map((data) => data.unloadingTime),
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};





