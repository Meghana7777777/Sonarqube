// import React, { useState } from 'react';
// import { Modal, Tag, Col } from 'antd';
// import { QrcodeOutlined } from '@ant-design/icons';
// import Barcode from 'react-barcode';

// const BarcodeScannerModal: React.FC = () => {

//     const handleScan = (err: any, result: any) => {
//         if (result) {
//             setScannedValue(result.text); 
//             setIsBarCodeModalOpen(false); 
//         }
//         if (err) {
//             console.error('Scan Error:', err);
//         }
//     };

//     return (
//         <Col xs={{ span: 22 }} sm={{ span: 22 }} md={{ span: 22 }} lg={{ span: 6 }} xl={{ span: 4 }}>
//             <Barcode
//                 width={500}
//                 height={300}
//                 onUpdate={handleScan}
//             />
//         </Col>
//     );
// };

// export default BarcodeScannerModal;
