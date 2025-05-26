import { useState } from 'react';
import { Button, Modal, QRCode, Space } from 'antd';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../WMS';

interface CartonData {
  ctnNo: string;
  poNo: string;
  style: string;
  color: string;
  sizeRatio: { size: string; ratio: number }[];
  cartonQty: number;
  destination: string;
  exfactory: string;
}

interface BarcodeProps {
  cartonData: CartonData[];
  printBarCodes: () => void;
}

const PrintBarCodes = (props: BarcodeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      setIsModalOpen(false);
      props.printBarCodes();
    }
  };
  console.log(props.cartonData)

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
        open={isModalOpen}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
        width={415}
      >
        <div id="printArea" style={{ width: '384px' }}>
          {props.cartonData?.length && props.cartonData.map((carton, index) => (

            <div key={index} className="label">
              <table>
                <tbody>
                  <tr>
                    <td rowSpan={6}>
                      <div className='qr-code'>
                        <QRCode
                          className='cell-QrCode'
                          value={carton.ctnNo}
                          size={110}
                        />
                      </div>
                      <img src='' style={{ display: 'block', padding: '5px', width: '100px' }} />
                    </td>
                    <td>CTN NO.</td>
                    <td>: {carton.ctnNo}</td>
                  </tr>
                  <tr>
                    <td>Po NO.</td>
                    <td>: {carton.poNo}</td>
                  </tr>
                  <tr>
                    <td>STYLE NO.</td>
                    <td>: {carton.style}</td>
                  </tr>
                  <tr>
                    <td>COLOR/CODE</td>
                    <td>: {carton.color}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>SIZE RATIO SUMMARY:</td>
                  </tr>
                  {carton.sizeRatio.map((size, idx) => (
                    <tr key={idx}>
                      <td>Size {size.size}</td>
                      <td>: {size.ratio}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Total</td>
                    <td>: {carton.cartonQty}</td>
                  </tr>
                  <tr>
                    <td>Destination</td>
                    <td>: {carton.destination}</td>
                  </tr>
                  <tr>
                    <td>Exfactory</td>
                    <td>: {carton.exfactory}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Barcode
                        value={carton.ctnNo}
                        fontSize={12}
                        margin={4}
                        displayValue={true}
                        width={1}
                        height={20}
                        format="CODE128"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <QRCode value={carton.ctnNo} size={100} />
                      </div>
                    </td>
                  </tr>
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
