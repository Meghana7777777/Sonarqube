import { Button, Modal, QRCode, Space } from 'antd';
import { useState } from 'react';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../../WMS';
import { BundleBarcodesProps } from '../knit-bundle-po/knit-inventry-creation';
import { AlertMessages } from 'packages/ui/src/components/common';
import printJS from 'print-js';

interface IKnitJobBarcodesProps {
  isModalOpen: boolean
  barcodesData: BundleBarcodesProps[];
  printBarCodes: () => void;
  onClose: () => void;

}
export default function BundleBarcodes(props: IKnitJobBarcodesProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // const printAllBarCodes = () => {
  //   const pageContent = document.getElementById("printArea");
  //   if (pageContent) {
  //     printJS({
  //       printable: pageContent,
  //       type: "html",
  //       showModal: true,
  //       modalMessage: "Loading...",
  //       targetStyles: ['*'],
  //       style: `
  //           @page { size: 384px 192px; margin: 0mm; }
  //           body { margin: 0; padding: 0; }
  //           #printArea { width: 384px; height: 220px; overflow: hidden; }
  //           #printArea > div { width: 100%; height: 100%; padding: 0; margin: 0; }
  //           .ant-modal-body { padding: 0 !important; }
  //         `
  //     });
  //     setIsModalOpen(false);
  //   } else {
  //     AlertMessages.getErrorMessage("Page content element not found.");
  //   }
  // };

  const printAllBarCodes = () => {
  const pageContent = document.getElementById("printArea");

  if (pageContent) {
    // Convert all QR canvases to images before printing
    const labelElements = document.querySelectorAll(".label");

    labelElements.forEach((labelElement) => {
      const qrCodeCanvas = labelElement.querySelector(".qr-code canvas");
      const qrCode = labelElement.querySelector(".qr-code") as HTMLElement;

      if (qrCodeCanvas instanceof HTMLCanvasElement) {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");

        tempCanvas.width = qrCodeCanvas.width;
        tempCanvas.height = qrCodeCanvas.height;

        tempCtx?.drawImage(qrCodeCanvas, 0, 0);

        const imageDataURL = tempCanvas.toDataURL();
        const imgElement = labelElement.querySelector("img");

        if (imgElement) {
          qrCode.style.display = "none";
          imgElement.style.display = "block";
          imgElement.src = imageDataURL;
        }

        qrCodeCanvas.remove(); // Remove the canvas
      }
    });

    // Use printJS to print the content
    printJS({
      printable: "printArea",
      type: "html",
      showModal: true,
      modalMessage: "Loading...",
      targetStyles: ["*"],
      style: `
        @page { size: 384px 192px; margin: 0mm; }
        body { margin: 0; padding: 0; }
        #printArea { width: 384px; height: 220px; overflow: hidden; }
        #printArea > div { width: 100%; height: 100%; padding: 0; margin: 0; }
        .ant-modal-body { padding: 0 !important; }
      `
    });

    setIsModalOpen(false);
  } else {
    AlertMessages.getErrorMessage("Page content element not found.");
  }

  props.printBarCodes();
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
        open={props.isModalOpen}
        onOk={handleOk}
        footer={null}
        // onCancel={handleCancel}
        onCancel={props.onClose}
        width={415}
      >

        {props.isModalOpen ? <div id="printArea" style={{ width: '384px' }}>
          {props.barcodesData.map((barcode, index) => (
            <div key={index} className="label">
              <table>
                <tbody>
                  <tr>
                    <td rowSpan={11}>
                      <div className="qr-code">
                        <QRCode
                          className="cell-QrCode"
                          value={`${barcode.bundleNumber}`}
                          size={110}
                        />
                      </div>
                      <img src="" alt="QR Code" style={{ display: 'none', padding: '5px', width: '100px' }} />
                    </td>
                    {/* <td>Style</td>
                                         <td>: {barcode.style || ""
                                             //  props.style
                                         }</td> */}
                  </tr>
                  <tr> <td><strong> Style code </strong></td><td>: {barcode.barcodeInfo.features.styleCode || "NA"}</td>  </tr>
                  {/* <tr> <td>Job No </td><td>: {barcode.barcodeInfo.jobNumber || "NA"} </td></tr> */}
                  <tr> <td><strong> Color </strong></td> <td>: {barcode.barcodeInfo.color || "NA"}</td>  </tr>
                  <tr> <td><strong>Size/Qty</strong></td> <td>: {barcode.barcodeInfo.size || "NA"} / {barcode.barcodeInfo.qty || "NA"}</td>  </tr>
                  {/* <tr> <td>Vendor</td> <td>: {barcode.vendor || "NA"}</td> </tr> */}
                  <tr> <td><strong>MO No/ MO Lines</strong></td> <td>: {barcode.barcodeInfo.features.moNumber || "NA"} / {(barcode.barcodeInfo.features.moLineNumber).join(', ') || "NA"}</td> </tr>
                  {/* <tr> <td>Cusotmer Name</td> <td>: {barcode[0].features.customerName || "NA"}</td> </tr> */}
                  <tr> <td><strong>CO</strong></td> <td>: {barcode.barcodeInfo.features.coNumber || "NA"}</td> </tr>
                  <tr>
                    <td><strong>Ex-Factory Date</strong></td>
                    <td>: {new Date(barcode.barcodeInfo.features.exFactoryDate[0]).toLocaleDateString('en-GB')}</td>
                  </tr>

                  <tr> <td rowSpan={3} colSpan={2}>
                    <Barcode
                      value={`${barcode.bundleNumber}`}
                      fontSize={12}
                      margin={4}
                      displayValue={true}
                      width={1}
                      height={20}
                      format="CODE128"
                    />
                  </td>
                    {/* <td>Op Code</td> <td>: {barcode.opCode || "NA"}</td> */}
                  </tr>
                  {/* <tr> <td>Garment PO</td> <td>: {barcode.garmentPO || "NA"}</td>  </tr> */}
                </tbody>
              </table>
            </div>
          ))}
        </div> : <></>}
      </Modal>
    </div>
  );
}
