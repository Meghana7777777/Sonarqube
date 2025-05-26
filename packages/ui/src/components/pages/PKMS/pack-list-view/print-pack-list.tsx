import { useState } from 'react';
import { Button, Modal, QRCode, Space, Tag } from 'antd';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../WMS';
import { CartonPrintModel } from '@xpparel/shared-models';

interface CartonData {
  ctnNo: string;
  poNo: string;
  style: string;
  color: string;
  sizeRatio: { size: string; ratio: number }[];
  cartonQty: number;
  destination: string;
  exfactory: string;
  packJobNo: string;
}

interface BarcodeProps {
  cartonData: CartonPrintModel[];
  printBarCodes: () => void;
  isPrintModalVisible: boolean;
  setIsPrintModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const PrintBarCodes = (props: BarcodeProps) => {
  const { cartonData, printBarCodes, isPrintModalVisible, setIsPrintModalVisible } = props

  const handleOk = () => {
    setIsPrintModalVisible(false);
  };

  const handleCancel = () => {
    setIsPrintModalVisible(false);
  };

  const printAllBarCodes = () => {
    const pageContent = document.getElementById('printArea');
    if (pageContent) {
      const divContents = pageContent.innerHTML;
      // Get all elements with the class name "label"
      const labelElements = document.querySelectorAll('.label');

      // Loop through each "label" element
      labelElements.forEach(labelElement => {
        // Find the QR code canvas element within the "label"
        const qrCodeCanvas = labelElement.querySelector('.qr-code canvas');
        const qrCode = labelElement.querySelector('.qr-code') as HTMLElement;

        // Check if a canvas element was found
        if (qrCodeCanvas instanceof HTMLCanvasElement) {
          // Create a new temporary canvas element
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');

          // Set the dimensions of the temporary canvas
          tempCanvas.width = qrCodeCanvas.width;
          tempCanvas.height = qrCodeCanvas.height;

          // Copy the content of the QR code canvas to the temporary canvas
          tempCtx.drawImage(qrCodeCanvas, 0, 0);

          // Convert the temporary canvas to an image (data URL)
          const imageDataURL = tempCanvas.toDataURL();

          // Find the img element within the "label"
          const imgElement = labelElement.querySelector('img');
          qrCode.style.display = 'none';

          // Show the image
          imgElement.style.display = 'block';
          // Set the img element's src attribute to the image data URL
          imgElement.src = imageDataURL;

          // Optionally, you can remove the canvas element if needed
          qrCodeCanvas.parentNode.removeChild(qrCodeCanvas);
        }
      });
    }
    const afterPage = document.getElementById('printArea');
    if (afterPage) {
      const divContents = afterPage.innerHTML;
      const element = window.open('', '', 'height=700, width=1024');
      if (element) {
        setTimeout(() => {

          element.document.write(divContents);
          getCssFromComponent(document, element.document);
          element.document.close();
          element.print();
          element.close()
        }, 1000); // Adjust the timeout as needed
      }
      setIsPrintModalVisible(false);
      printBarCodes();
    }
  };

  return (
    <div>
      <Modal
        title={
          <Space>
            Print Barcodes
            <Button type="primary" onClick={printAllBarCodes}>
              Print
            </Button>
          </Space>
        }
        open={isPrintModalVisible}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
        width={415}
      >
        <div id="printArea" style={{ width: '384px' }}>
          {cartonData?.length && cartonData.map((carton, index) => (
            <div key={index} className="label" style={{height:200}}>

              <table >
                <tbody>
                  <tr>
                    <td rowSpan={6}>
                      <div className='qr-code'>
                        <QRCode
                          className='cell-QrCode'
                          value={carton?.ctnNo}
                          size={110}
                        // bordered={false}
                        />
                      </div>
                      <img src='' style={{ display: 'block', padding: '5px', width: '100px' }} />
                    </td>
                    <td>CTN NO </td>
                    <td>: {carton?.ctnNo}</td>
                  </tr>
                  <tr><td>PACK LIST No</td><td>: {carton?.packListNo}</td></tr>
                  <tr><td>MO No</td><td>: {carton?.moNo}</td></tr>
                  <tr><td>STYLE</td><td>: {carton?.style}</td></tr>
                  <tr><td>COLOR</td><td>: {carton?.color}</td></tr>
                  <tr><td>exfactory</td><td>: {carton?.exFactory} </td></tr>
                  <tr><td colSpan={3} className='pkms-sizes' style={{ wordWrap: 'break-word',width: '180px',whiteSpace: 'pre-wrap' }}>Sizes:  {carton?.sizeRatio?.map((rec) => rec.size + "-" + rec.ratio).join(',')}</td></tr>
                  <tr><td rowSpan={3}><Barcode
                    value={carton?.ctnNo}
                    fontSize={12}
                    margin={4}
                    displayValue={true}
                    width={1} height={20} format='CODE128'
                  />
                  </td>
                  </tr>
                  <tr><td>Buyer</td><td>: {carton?.destination}</td></tr>
                  <tr><td>CTN Qty</td><td>: {carton?.cartonQty}</td></tr>
                </tbody>
              </table>

            </div>

          ))}
        </div>
      </Modal>
    </div>
  );
};

export default PrintBarCodes;