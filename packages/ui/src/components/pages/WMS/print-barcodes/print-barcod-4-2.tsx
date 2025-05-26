import React, { useState } from 'react';
import './lable-4-2.css'; // Import the CSS for styling
import { RollInfoModel } from '@xpparel/shared-models';
import { Button, Modal, QRCode, Space } from 'antd';
import Barcode from 'react-barcode';
import printJS from 'print-js';
import * as htmlToImage from "html-to-image";
import { getCssFromComponent } from './print-barcode-css.util';


// interface RollBarcode4By2{
//   rollNo: string;
//   rollBarcode: string;
//   rollQrCode: string;
//   objectType:string;
//   packingListNo:string;
//   poNumber:string;
//   poLineItem:string;
//   supplierLength: string;
//   supplierLengthUom: string;
//   supplierWidth : string;
//   supplierWidthUom : string;
//   internalLength: string;
//   internalLengthUom: string;
//   internalWidth: string;
//   internalWidthUom: string;
//   itemCode: string;
//   itemDesc : string;
//   supplierCode: string;
//   supplierName: string;
//   lotNo: string;  
// }

interface BarcodeProps {
  rollBarcodeData: RollInfoModel[];
  printBarCodes: () => void
}

const RollBarcode4By2 = (props: BarcodeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

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

    // let pageContent = document.getElementById("printArea");
    // printJS({
    //   printable: pageContent,
    //   type: "html",
    //   targetStyles: ['*'],
    //   base64: true,
    //   showModal: true,
    //   font_size: '10px',
    //   modalMessage: "Loading...",
    // });
    // setIsModalOpen(false);
    // props.printBarCodes();
    // if (pageContent) {
    //   htmlToImage.toPng(pageContent, { quality: 100 }).then(function (dataUrl) {
    //     printJS({
    //       printable: dataUrl,
    //       type: "image",
    //       base64: true,
    //       showModal: true,
    //       modalMessage: "Loading...",
    //     });
    //     setIsModalOpen(false);
    //   });
    // } else {
    //   console.error("Page content element not found.");
    // }
  };

  const handlePrint = () => {
    setIsModalOpen(true);

  };
  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>

      <Modal title={<Space>
        Print Barcodes
        <Button type="primary" onClick={printAllBarCodes}>Print</Button>
      </Space>}
        open={isModalOpen}
        onOk={handleOk} footer={''}
        onCancel={handleCancel}
        width={415} >
        <div id='printArea' style={{ width: '384px' }}>
          {props.rollBarcodeData.map(rollInfo => {
            return <div className="label">
              <table>
                <tbody>
                  <tr>
                    <td rowSpan={6}>
                      <div className='qr-code'>
                        <QRCode
                          className='cell-QrCode'
                          value={rollInfo?.barcode}
                          size={110}
                        // bordered={false}
                        />
                      </div>
                      <img src='' style={{ display: 'block', padding: '5px', width: '100px' }} />
                    </td>
                    <td>Object No</td>
                    <td>: {rollInfo?.externalRollNumber}/{rollInfo?.objectType}</td>
                  </tr>
                  <tr><td>PL No</td><td>: {rollInfo?.packListCode.slice(0, 30)}</td></tr>
                  <tr><td>PO - PO Item</td><td>: {rollInfo?.poNumber}-{rollInfo?.poLineItemNo}</td></tr>
                  <tr>
                    <td>PL Object Qty/Wid</td><td>: {rollInfo?.inputLength} {rollInfo?.inputLengthUom}{(Number(rollInfo?.inputWidth) !== 0.00 && rollInfo?.inputWidth) ? ` | ${rollInfo.inputWidth} ${rollInfo.inputWidthUom}`: ''}
                    </td>
                  </tr>
                  {/* <tr><td>RL Len/Wid</td><td>: {rollInfo?.supplierLength} M | {rollInfo?.supplierWidth} CM</td></tr> */}
                  <tr><td>Item Code</td><td>: {rollInfo?.materialItemCode}</td></tr>
                  <tr><td colSpan={3}>Item Desc: {rollInfo?.materialItemDesc?.slice(0, 40)}</td></tr>
                  <tr><td rowSpan={3}><Barcode
                    value={rollInfo?.barcode}
                    fontSize={12}
                    margin={4}
                    displayValue={true}
                    width={1} height={20} format='CODE128'
                  /></td><td>Color</td><td>: {rollInfo?.itemColor}</td></tr>
                  <tr><td>Supplier</td><td>: {rollInfo?.supplierCode} - {rollInfo?.supplierName?.slice(0, 25)}</td></tr>
                  <tr><td>Lot No</td><td>: {rollInfo?.lotNumber}</td></tr>
                </tbody>
              </table>
            </div>
          })}
        </div>
      </Modal>
    </div>
  );
};

export default RollBarcode4By2;


