import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PkDSetGetBarcodesRequest, PkDSetItemsBarcodesModel } from '@xpparel/shared-models';
import { Button, Modal, QRCode, Space } from 'antd';
import Barcode from 'react-barcode';
import { getCssFromComponent } from '../../../WMS';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useAppSelector } from 'packages/ui/src/common';
import { DispatchReadyService } from '@xpparel/shared-services';


interface BarcodeProps { 
    // style: string;
    // printBarCodes: () => void;
    setPrintBarFlag?: Dispatch<SetStateAction<boolean>>;
    cutInfo: {
        productName: string;
        dsetId: number;
        dSetItemId: number;
        dSetCode: string;
    }
    isShow : boolean;
}
interface IBagsData {
    moNumber: string;
    cutNo: string;
    bagBarcode: string;
    bagName: string;
}
const BagBarcode4X2 = (props: BarcodeProps) => {
    const [isModalOpen, setIsModalOpen] = useState(props.isShow);
    const user = useAppSelector((state) => state.user.user.user);
    const [bagsBarcodeData, setBagsBarcodeData] = useState<IBagsData[]>([]);
    const dispatchReadyService = new DispatchReadyService();
    useEffect(() => {
        if (props.cutInfo && props.isShow) {
            getBarcodeData(props.cutInfo.dsetId, props.cutInfo.dSetItemId);
        }
    }, [props.isShow]);

    const getBarcodeData = async (dsetId: number, dSetItemIds: number) => {
        try {
            const reqObj = new PkDSetGetBarcodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [dsetId], [dSetItemIds], false, false, false, false, true, false);

            const response = await dispatchReadyService.getDsetItemBarcodeInfo(reqObj);
            if (response.status) {
                if (response.data.length) {
                    const bagsData: IBagsData[] = [];
                    response.data.forEach(e => {
                        e?.containerWiseBarcodeMapping.forEach(c => {
                            const bagBarcodeObj: IBagsData = {
                                bagBarcode: c.containerBarcode,
                                bagName: c.containerName,
                                cutNo: e?.attrs?.l2,
                                moNumber: e?.attrs?.l1,
                            }
                            bagsData.push(bagBarcodeObj);
                        })
                    });
                    setBagsBarcodeData(bagsData);
                    setIsModalOpen(true);
                } else {
                    setBagsBarcodeData([]);
                    AlertMessages.getErrorMessage("No data found");
                }
            } else {
                props.setPrintBarFlag(false);
                setBagsBarcodeData([]);
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        } catch (error) {
            setBagsBarcodeData([]);
            props.setPrintBarFlag(false);
            AlertMessages.getErrorMessage(error.message);
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setBagsBarcodeData([]);
        props.setPrintBarFlag(false);

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
            handleCancel();
            // props.printBarCodes();
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
                    {bagsBarcodeData.map(bagObj => {                       
                            return <div className="label" key={bagObj.bagBarcode}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={6}>
                                                <div className='qr-code'>
                                                    <QRCode
                                                        className='cell-QrCode'
                                                        value={bagObj.bagBarcode}
                                                        size={110}
                                                    // bordered={false}
                                                    />
                                                </div>
                                                <img src='' style={{ display: 'block', padding: '5px', width: '100px' }} />
                                            </td>
                                            <td>Bag Name</td><td>: {bagObj.bagName}</td>
                                        </tr>
                                        <tr><td>Manufacturing Order No</td><td>: {bagObj.moNumber}</td></tr>
                                        <tr><td>Cut No</td><td>: {bagObj.cutNo}</td></tr>
                                        <tr><td>Product Name</td><td>: {props?.cutInfo?.productName.slice(0, 30)}</td></tr>
                                        <tr><td>Shippable Set Code</td><td>: {props?.cutInfo?.dSetCode}</td></tr>

                                        {/* <tr><td>MO No/ MO Lines</td><td>: {bagObj.moNo} / {bagObj.moLines.join()}</td></tr> */}
                                        <tr><td></td></tr>
                                        <tr><td rowSpan={1} colSpan={3}><Barcode
                                            value={bagObj.bagBarcode}
                                            fontSize={12}
                                            margin={4}
                                            displayValue={true}
                                            width={1} height={20} format='CODE128'
                                        /></td>
                                            {/* <td>Color</td><td>: {embLine.panelFormEmbProps.color.slice(0, 30)}</td> */}
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                        })

                    }
                </div>
            </Modal>
        </div>
    );
};

export default BagBarcode4X2;


