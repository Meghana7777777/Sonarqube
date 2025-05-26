import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Gauge } from '@ant-design/plots';

export interface gaugeMeterPercentage {
  percentage: number;
}
export const GaugeMeter = (prop: gaugeMeterPercentage) => {
  const config: any = {
    percent: prop?.percentage,
    range: {
      color: '#30BF78',
    },
    style: {height: "155px", width: "200px"},
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    axis: {
      label: {
        formatter(v) {
          return Number(v) * 100;
        },
      },
      subTickLine: {
        count: 3,
      },
    },
    statistic: {
      content: {
        formatter: ({ percent }) => `TAT: ${(percent*100).toFixed(0)} Mins`,
        style: {
          color: 'rgba(0,0,0,0.65)',
          fontSize: 15,
        },
      },
    },
  };
  return <Gauge {...config} />;
};
