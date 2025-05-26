import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';


export class PieChartObj {
  type: string;
  value: number;
  constructor(type: string,
    value: number,) {
    this.type = type;
    this.value = value;
  }
}

export interface IPieChartProps {
  pieChartData: PieChartObj[]
}
export const PieChart = (props: IPieChartProps) => {
  const [data, setData] = useState([]);
  useEffect(() => { 
    setData(props.pieChartData);
  }, [props.pieChartData]);
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1.0,
    style: { height: '217px' },
    label: {
      //   content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};
