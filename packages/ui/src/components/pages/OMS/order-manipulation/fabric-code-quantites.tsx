import React from 'react';
import { Col, Tooltip } from 'antd';

interface FabricCodeQuantitiesProps {
    fabricDataResults: Array<{
        itemCode: string;
        totalGRNQuantity: string;
        allocatedNotIssued: string;
        inWarehouse: string;
        pendingArrival: string;
    }>;
}

const FabricCodeQuantities: React.FC<FabricCodeQuantitiesProps> = ({ fabricDataResults }) => {
    return (
        <></>
        // <Col span={24}>
        //     <h1 style={{ fontSize: '16px', fontWeight: '500' }}>Item Code Quantities</h1>
        //     {fabricDataResults.map((fabCode, index) => (
        //         <div key={index}>
        //             <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
        //                 <div style={{ flex: '0.08' }}>
        //                     <span style={{ display: 'flex', flexDirection: 'column' }}>
        //                         <strong>{fabCode.itemCode}</strong>
        //                     </span>
        //                 </div>
        //                 <div style={{ display: 'flex', height: '30px', width: '100%', borderRadius: '6px', overflow: 'hidden', flex: '0.92' }}>
        //                     <Tooltip title="Total GRN Quantity" placement="top">
        //                         <div
        //                             style={{
        //                                 flexGrow: 1,
        //                                 backgroundColor: '#66a543',
        //                                 color: 'white',
        //                                 fontWeight: '500',
        //                                 fontSize: '15px',
        //                                 textAlign: 'center',
        //                                 lineHeight:'30px'
        //                             }}
        //                         >
        //                             {fabCode.totalGRNQuantity}
        //                             <span style={{ fontSize: '11px' }}> Lbs</span>
        //                         </div>
        //                     </Tooltip>
        //                     <Tooltip title="Allocated Not Issued" placement="top">
        //                         <div
        //                             style={{
        //                                 flexGrow: 1,
        //                                 backgroundColor: '#f5c142',
        //                                 color: 'white',
        //                                 fontWeight: '500',
        //                                 fontSize: '15px',
        //                                 textAlign: 'center',
        //                                 lineHeight:'30px'
        //                             }}
        //                         >
        //                             {Math.max(Number(fabCode.allocatedNotIssued), 0)}
        //                             <span style={{ fontSize: '11px' }}> Lbs</span>
        //                         </div>
        //                     </Tooltip>
        //                     <Tooltip title="In Warehouse" placement="top">
        //                         <div
        //                             style={{
        //                                 flexGrow: 1,
        //                                 backgroundColor: '#66a9cf',
        //                                 color: 'white',
        //                                 fontWeight: '500',
        //                                 fontSize: '15px',
        //                                 textAlign: 'center',
        //                                 lineHeight:'30px'
        //                             }}
        //                         >
        //                             {fabCode.inWarehouse}
        //                             <span style={{ fontSize: '11px' }}> Lbs</span>
        //                         </div>
        //                     </Tooltip>
        //                     <Tooltip title="Pending Arrival" placement="top">
        //                         <div
        //                             style={{
        //                                 flexGrow: 1,
        //                                 backgroundColor: '#e83323',
        //                                 color: 'white',
        //                                 fontWeight: '500',
        //                                 fontSize: '15px',
        //                                 textAlign: 'center',
        //                                 lineHeight:'30px'
        //                             }}
        //                         >
        //                             {fabCode.pendingArrival}
        //                             <span style={{ fontSize: '11px' }}> Lbs</span>
        //                         </div>
        //                     </Tooltip>
        //                 </div>
        //             </div>
        //         </div>
        //     ))}
        // </Col>
    );
};

export default FabricCodeQuantities;
