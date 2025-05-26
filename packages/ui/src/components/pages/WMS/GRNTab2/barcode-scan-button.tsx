import { InsInspectionLevelEnum, PhBatchLotRollRequest, RollsGrnRequest } from '@xpparel/shared-models';
import { GrnServices, PackingListService } from '@xpparel/shared-services';
import { Html5QrcodeScanType, Html5QrcodeScanner } from 'html5-qrcode';
import { ScxButton } from 'packages/ui/src/schemax-component-lib';
import React, { useEffect, useState } from 'react';
import { toEditorSettings } from 'typescript';

const QrAndBarCodeScanner: React.FC = () => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
    const [tableData, setTableData] = useState<any[]>(([]));
    const packageService = new PackingListService
    const saveService = new GrnServices()

    useEffect(() => {
        let scanner: any;
        if (isBarcodeScannerOpen) {
            scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 5,
                rememberLastUsedCamera: true,
                // Only support camera scan type.
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
            }, false);

            scanner.render(success, error);
        }

        function success(result: string) {
            scanner.clear();
            setScanResult(result);
        }

        function error(err: any) {
            console.warn(err);
        }
        // todo:saveRollLevelGRN
        // const saveRollLevelGRN = () => {
        //     const request = new RollsGrnRequest('', '', '', 123, 0, [], InsInspectionLevelEnum.LOT);
        //     saveService.saveRollLevelGRN(request).then((res) => {
        //         if (res.status) {
        //             //setSaveData(res.data);
        //         }
        //     }).catch((err) => {
        //         console.log(err.message);
        //     })
        // }

        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, [isBarcodeScannerOpen]);

    const handleBarcodeScan = () => {
        setIsBarcodeScannerOpen(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                if (!isBarcodeScannerOpen) {
                    setIsBarcodeScannerOpen(true);
                }
            })
            .catch((error) => {
                console.error('Error accessing camera:', error);
                setIsBarcodeScannerOpen(false);
            });
    };

    const getBarcodeInfo = () => {
        const req = new PhBatchLotRollRequest('', '', '', 6, 9, '', '', '', '',undefined);
        packageService.getPackListInfo(req).then((res) => {
            if (res.status) {
                setTableData(res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    return (
        <div >
            {scanResult ? (
                <div>
                    Success: <a href={scanResult}>{scanResult}</a>
                </div>
            ) : (
                <div>
                    {isBarcodeScannerOpen ? (
                        <div id="reader"></div>
                    ) : (
                        <ScxButton type='primary' onClick={() => { handleBarcodeScan(); getBarcodeInfo(); }}>
                            Barcode Scanner
                        </ScxButton>
                    )}
                </div>
            )}
        </div>
    );
};

export default QrAndBarCodeScanner;
