import React, { Dispatch, SetStateAction, useState } from 'react';
import '../../../WMS/print-barcodes/lable-4-2.css'; // Import the CSS for styling
import { ActualDocketBasicInfoModel, PoEmbHeaderModel, RollInfoModel } from '@xpparel/shared-models';
import { Button, Modal, QRCode, Space } from 'antd';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../../WMS';

interface BarcodeProps {
    docketsData: ActualDocketBasicInfoModel[];
    style: string;
    printBarCodes: () => void;
    setPrintBarFlag?: Dispatch<SetStateAction<boolean>>
}

const BundleTagBarcode4X2 = (props: BarcodeProps) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        props.setPrintBarFlag(false)
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
                title={<Space>
                    Print Barcodes
                    <Button type="primary" onClick={printAllBarCodes}>Print</Button>
                </Space>}
                open={isModalOpen}
                onOk={handleOk} footer={''}
                onCancel={handleCancel}
                width={415} >
                <div id='printArea' style={{ width: '384px' }}>
                    {props.docketsData.map(docObj => {
                        return docObj.adBundles.map(b => {
                            return <div className="label">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={6}>
                                                <div className='qr-code'>
                                                    <QRCode
                                                        className='cell-QrCode'
                                                        value={b.barcode}
                                                        size={110}
                                                    // bordered={false}
                                                    />
                                                </div>
                                                <img src='' style={{ display: 'block', padding: '5px', width: '100px' }} />
                                            </td>
                                            <td>Style</td>
                                            <td>: {props.style}</td>
                                        </tr>
                                        <tr><td>Plant Style Ref </td><td>: {docObj.plantRefStyle}</td></tr>
                                        <tr><td>Cut No / Bundle No</td><td>: {docObj.cutSubNumber} / {b.underLayBundleNo}</td></tr>
                                        <tr><td>Color</td><td>: {docObj.color.slice(0, 30)}</td></tr>
                                        <tr><td>Size/Qty/Shade</td><td>: {b.size} / {b.quantity} / {b.shade}</td></tr>
                                        <tr><td>MO No/ MO Lines</td><td>: {docObj.moNo} / {docObj.moLines.join()}</td></tr>
                                        <tr><td colSpan={3}>Components: {docObj.components.join().slice(0, 40)}</td></tr>
                                        <tr><td rowSpan={3}><Barcode
                                            value={b.barcode}
                                            fontSize={12}
                                            margin={4} 
                                            displayValue={true}
                                            width={1} height={20} format='CODE128'
                                        /></td>
                                        </tr>
                                        <tr><td>Garment PO / Item</td><td>: {docObj.garmentPo} /  {docObj.garmentPoItem}</td></tr>

                                    </tbody>
                                </table>
                            </div>
                        })

                    })}
                </div>
            </Modal>
        </div>
    );
};

export default BundleTagBarcode4X2;


