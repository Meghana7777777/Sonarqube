import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

export class StackColumnChartObj {
  xAxisValue: string;
  yAxisValue: number;
  type: string;
}

export interface IStackedColumnChartProps {
  chartValues: StackColumnChartObj[]
}

export const StackedColumnChart = (props: IStackedColumnChartProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    
    setData(props.chartValues);
  }, [props.chartValues]);
  const config: any = {
    data,
    color: ['#0c97cf', '#FF7F7F'],
    isStack: true,
    xField: 'xAxisValue',
    yField: 'yAxisValue',
    seriesField: 'type',
    style: {
        height: "250px"
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  };

  return <Column {...config} />;
};
