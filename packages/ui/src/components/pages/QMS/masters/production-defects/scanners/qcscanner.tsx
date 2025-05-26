import { Col, Row } from 'antd';
import React from 'react';
import QrReader from 'react-qr-scanner';

export interface QrScannerProps {
  handleScan: (value: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ handleScan }) => {
  const handleErrorWebCam = (error) => {
    console.error('Error with webcam:', error);
  };

  const handleScanWebCam = (result) => {
    if (result) {
      console.log('Scanned Result:', result);
      handleScan(result.text);
    } else {
      console.log('No QR code detected yet.');
    }
  };

  return (
    <Row>
      <Col>
        <QrReader
          // delay={300}
          style={{ top: 30 }}  
          bodyStyle={{ height: 'calc(50vh - 70%)' }}  
          onError={handleErrorWebCam}
          onScan={handleScanWebCam}
        />
      </Col>
    </Row>
  );
};

export default QrScanner;
