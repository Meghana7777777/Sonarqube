import { Card, Statistic } from 'antd';
import { ScxColumn, ScxRow } from 'packages/ui/src/schemax-component-lib';
import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

interface DonutChartProps {
    storagePercentage: number;
}

export const DeliveriesStatusDonutChart: React.FC<DonutChartProps> = ({ storagePercentage }) => {
    const data = [
        { value: storagePercentage, color: '#52c41a' },
        { value: 100 - storagePercentage, color: '#f0f0f0' },
    ];

    return (
        <Card headStyle={{ background: '#fccb9f' }}
            title={<span style={{ color: 'black', fontStyle: 'italic' }}>Deliveries Status Supplier Wise</span>}
            style={{
                background: 'white',
                borderRadius: '6px',
                height: '160px'
            }}
        >
            <ScxRow>
                <ScxColumn span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                        <PieChart
                            data={data}
                            lineWidth={15}
                            animate
                            animationDuration={3000}
                            animationEasing="ease-out"
                            style={{ width: '90%', height: '90%' }}
                        />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <h2 style={{ color: 'black', fontSize: '14px', fontWeight: '500', margin: '0' }}>{storagePercentage}%</h2>
                            <p style={{ color: 'black', fontSize: '10px', fontWeight: '500', margin: '0' }}>Within Time Limit</p>
                        </div>
                    </div>
                </ScxColumn>
                <ScxColumn span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h1 style={{ color: 'black', fontSize: '12px', fontWeight: '600', margin: '0' }}>Within Time Limit :</h1>
                        <Statistic value={57} valueStyle={{ color: 'black', fontSize: '14px', marginLeft: '8px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h1 style={{ color: 'black', fontSize: '12px', fontWeight: '600', margin: '0' }}>Out Of Time Limit :</h1>
                        <Statistic value={5} valueStyle={{ color: 'black', fontSize: '14px', marginLeft: '8px' }} />
                    </div>
                </ScxColumn>
            </ScxRow>
        </Card>
    );
};
