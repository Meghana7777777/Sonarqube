import React, { useEffect, useRef, useState } from 'react';
import './print-barcodes.css';
import Barcode from 'react-barcode';
import { Descriptions, Tag, Button, Modal } from 'antd';
import ReactDOM from 'react-dom';
import { BarcodeColumnsDto, BarcodeHeadersDto } from '@xpparel/shared-models';
import QRCode from 'qrcode.react';
import { ScxColumn, ScxRow, ScxTag } from '../../../../schemax-component-lib';
import { getCssFromComponent } from './print-barcode-css.util';
import * as htmlToImage from "html-to-image";
import printJS from "print-js";


export interface IBarcodePrintProps {
    barcodeInfo: BarcodeHeadersDto[];
    columns: BarcodeColumnsDto[];
    barcodeWidth?: number;
    barcodeHeight?: number;
    newWindow: boolean;
    className?: string;
    closeBarcodePopUp?: () => void;
    printBarCodes?: () => void;
    withOutModal?: boolean;
    showBarcodePopUp?: boolean;
}

export const BarcodePrint = (props: IBarcodePrintProps) => {
    const [showBarcodePopUp, setShowBarcodePopUp] = useState<boolean>(true);
    let printPreviewDiv = useRef();
    let externalWindow: any;
    let containerEl: any;

    // Open in new Window
    if (props.newWindow) {
        externalWindow = window.open('', '', 'width=600,height=700,left=200,top=50');
        containerEl = externalWindow.document.createElement('div');
        externalWindow.document.body.appendChild(containerEl);
        externalWindow.document.title = 'Barcodes';
        getCssFromComponent(document, externalWindow.document);
    }


    const printBarCodes = () => {
        let pageContent = document.getElementById('printArea');

        htmlToImage.toPng(pageContent, { quality: 3 }).then(function (dataUrl) {
            printJS({
                printable: dataUrl,
                type: "image",
                base64: true,
                showModal: true,
                modalMessage: "Loading..."
            });
            setShowBarcodePopUp(false);
            if (props.printBarCodes) {
                props.printBarCodes();
            }
        }).catch(err => console.log(err.message));


        // const qrEle = document.getElementById('qr-code') as HTMLCanvasElement;
        // const imsgUrl = qrEle?.toDataURL();
        // if (pageContent) {
        //     let img: any = document.createElement('img');
        //     img.src = imsgUrl;
        //     (document.getElementById('qr') as HTMLElement).innerHTML = img;
        //     pageContent.appendChild(img);
        //     const divContents = pageContent.innerHTML;
        //     const element = window.open('', '', 'height=700, width=1024');
        //     if (element) {
        //         element.document.write(divContents);
        //         getCssFromComponent(document, element.document);
        //         element.document.close();
        //         setTimeout(() => {
        //             element.print();
        //             element.close();
        //         }, 1000)

        //     }
        //     setShowBarcodePopUp(false);
        //     if (props.printBarCodes) {
        //         props.printBarCodes();
        //     }
        // }
    };

    const hideModal = () => {
        setShowBarcodePopUp(false);
        if (props.closeBarcodePopUp) {
            props.closeBarcodePopUp();
        }
    };

    const renderContent = () => {
        try {
            const acsOrderCoulmns = props.columns.sort((a, b) => (a.lineNumber < b.lineNumber ? -1 : 1));


            let keyCounter = 0;
            const rows: JSX.Element[] = [];

            props.barcodeInfo.forEach((record, index) => {
                const showQRCodeColumn: JSX.Element[] = [];
                const otherDataColumn: JSX.Element[] = [];

                acsOrderCoulmns.forEach((barcodeDetails) => {
                    const className = barcodeDetails.className ? barcodeDetails.className : '';
                    const width = (barcodeDetails.span / 4) * 100; // Assuming columnCount is always 4

                    if (barcodeDetails.showBarcode) {
                        showQRCodeColumn.push(
                            <Descriptions.Item
                                key={'descitembar' + keyCounter++}
                                className={`barcode-lines barcode-column-width-${width} ${className}`}
                                span={barcodeDetails.span}
                                label={barcodeDetails.showLabel ? barcodeDetails.title : undefined}
                            >
                                <div className="barcode">
                                    <Barcode
                                        value={record[barcodeDetails.dataIndex]}
                                        displayValue={true}
                                        font={'12px'}
                                        width={1}
                                        height={20}
                                        format="CODE128"
                                    />
                                </div>
                            </Descriptions.Item>
                        );
                    } else if (barcodeDetails.showQRCode) {
                        showQRCodeColumn.push(
                            <Descriptions.Item
                                key={'descitemqrcode' + keyCounter++}
                                className={`barcode-lines barcode-column-width-${width} ${className}`}
                                span={barcodeDetails.span}
                                label={barcodeDetails.showLabel ? barcodeDetails.title : undefined}
                            >
                                <div id='qr'>
                                    <QRCode className='qr-code' id='qr-code' value={record[barcodeDetails.dataIndex]}
                                    />
                                </div>
                            </Descriptions.Item>
                        );
                    } else {
                        otherDataColumn.push(
                            <Descriptions.Item
                                key={'descitem' + keyCounter++}
                                className={`barcode-column-width-${width} ${className}`}
                                label={barcodeDetails.showLabel ? barcodeDetails.title : undefined}
                                span={barcodeDetails.span}
                            >
                                {record[barcodeDetails.dataIndex]}
                            </Descriptions.Item>
                        );
                    }
                });

                rows.push(
                    <ScxRow key={'desc' + keyCounter++} className="barcode-label">
                        <ScxColumn span={11}>
                            <Descriptions column={1}>{showQRCodeColumn}</Descriptions>
                        </ScxColumn>
                        <ScxColumn span={13}>
                            <Descriptions column={1}>{otherDataColumn}</Descriptions>
                        </ScxColumn>
                    </ScxRow>
                );
                rows.push(<span key={'br' + keyCounter++} />);
            });

            return rows;
        } catch (err) {
            return [<ScxTag color="red" key={'error'}>Error in Barcode Generation</ScxTag>];
        }
    };

    if (props.withOutModal) {
        return <React.Fragment><div id='printArea'>{renderContent()}</div></React.Fragment>;
    } else {
        if (props.newWindow) {
            return ReactDOM.createPortal(
                <React.Fragment>
                    <div id='printArea'>{renderContent()}</div>
                </React.Fragment>,
                containerEl
            );
        } else {
            return (
                <React.Fragment>
                    <Modal
                        key={Date.now()}
                        style={{ top: 10 }}
                        width={props.barcodeWidth ? props.barcodeWidth + 48 : 432}
                        title={
                            <React.Fragment>
                                Print Barcodes{" "}
                                <Button type='primary' onClick={printBarCodes}>
                                    Print
                                </Button>{" "}
                            </React.Fragment>
                        }
                        open={showBarcodePopUp}
                        onCancel={hideModal}
                        onOk={hideModal}
                        footer={[]}
                    >
                        <div id='printArea'>{renderContent()}</div>
                    </Modal>
                </React.Fragment>
            );
        }
    }
};

export default BarcodePrint;