import React, { useState } from 'react';
import '../../WMS/print-barcodes/lable-4-2.css'; // Import the CSS for styling
import { Button, Modal, QRCode, Space } from 'antd';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../WMS';
import { BarcodeDetails } from '@xpparel/shared-models';

interface BarcodeProps {
    barcodesData: BarcodeDetails[];
    isModalOpen: boolean;
    onClose: () => void;
    printBarCodes: () => void;
}

const Barcode4X2 = (props: BarcodeProps) => {
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
                <div id="printArea" style={{ width: '384px' }}>
                    {props.barcodesData.map((barcode, index) => (
                        <div key={index} className="label">
                            <table>
                                <tbody>
                                    <tr>
                                        <td rowSpan={11}>
                                            <div className="qr-code">
                                                <QRCode
                                                    className="cell-QrCode"
                                                    value={`${barcode.bundleNo}`}
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
                                    <tr> <td>Plant Style Ref</td><td>: {barcode.plantStyleRef || "NA"}</td>  </tr>
                                    <tr> <td>Job No </td><td>: {barcode.jobNo || "NA"} </td></tr>
                                    <tr> <td>Bundle No </td> <td>: {barcode.bundleNo}  </td> </tr>
                                    <tr> <td>Color</td> <td>: {barcode.color || "NA"}</td>  </tr>
                                    <tr> <td>Size/Qty</td> <td>: {barcode.size || "NA"} / {barcode.qty || "NA"}</td>  </tr>
                                    {/* <tr> <td>Vendor</td> <td>: {barcode.vendor || "NA"}</td> </tr> */}
                                    <tr> <td>MO No/ MO Lines</td> <td>: {barcode.moNo || "NA"} / {(barcode.moLines).join(', ') || "NA"}</td> </tr>
                                    <tr> <td>Op Code</td> <td>: {barcode.opCode || "NA"}</td> </tr>
                                    <tr> <td>Garment PO</td> <td>: {barcode.garmentPO || "NA"}</td> </tr>
                                    <tr> <td>Job Group</td> <td>: {barcode.jobGroup || "NA"} </td> </tr>
                                    <tr> <td>Plan Production Date  </td> <td>  : {barcode.planProdDate} </td>  </tr>
                                    <tr> <td rowSpan={3} colSpan={2}>
                                        <Barcode
                                            value={`${barcode.bundleNo}`}
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
                </div>
            </Modal>
        </div>
    );
};

export default Barcode4X2;
