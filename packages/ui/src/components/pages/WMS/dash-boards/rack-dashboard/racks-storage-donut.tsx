import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

interface DonutChartProps {
    storagePercentage: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ storagePercentage }) => {
    const data = [
        { value: storagePercentage, color: '#52c41a' }, 
        { value: 100 - storagePercentage, color: '#f0f0f0' }, 
    ];

    return (
        <div style={{ textAlign: 'center' }}>
            <PieChart
                data={data}
                lineWidth={30}
                animate
                animationDuration={2000}
                animationEasing="ease-out"
                style={{ width: '200px', height: '200px' }}
            />
            <div style={{ position: 'absolute', top: '39%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <h2 style={{ marginTop: '5px', color: 'white', fontSize: '14px', fontWeight: '500' }}>{storagePercentage}%</h2>
                <p style={{ marginTop: '5pxs', color: 'white', fontSize: '14px', fontWeight: '500' }}>Location Used</p>
            </div>
        </div>
    );
};

export default DonutChart;
