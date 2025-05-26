import { CheckCircleOutlined, CheckOutlined, CloseOutlined, CommentOutlined, CopyFilled, CopyTwoTone, CustomerServiceOutlined, ExclamationCircleFilled, GroupOutlined, PartitionOutlined, PrinterTwoTone, QuestionOutlined, ReloadOutlined, ScanOutlined, UngroupOutlined } from "@ant-design/icons";
import { BarcodeColumnsDto, CommonRequestAttrs, CurrentPalletLocationEnum, GrnRollInfoModel, InspectionPalletRollsModel, PackListIdRequest, PackListPalletCfNcfPfendingRollsModel, PackingListSummaryModel, PalletDetailsModel, PalletIdRequest, PalletRollMappingRequest, PalletRollsUIModel, PhBatchLotRollRequest, PhItemLinesObjectTypeEnum, RollGrnAndInsRequest, RollInfoModel, RollInfoUIModel, RollsGrnRequest, WarehousePalletRollsModel } from "@xpparel/shared-models";
import { GrnServices, LocationAllocationService, PackingListService } from "@xpparel/shared-services";
import { Alert, Button, Card, Col, Collapse, Descriptions, Divider, Drawer, Empty, FloatButton, Form, Input, InputNumber, Modal, Row, Select, SelectProps, Space, Statistic, Switch, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { RollIdRequest } from "packages/libs/shared-models/src/wms/location-allocation/roll-id.request";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";
import EmptyPalletBox from "./empty-pallet-box";
import BarcodePrint from "../print-barcodes/print-barcode-source";
import { getCssFromComponent, PrintTableModel } from "../print-barcodes";
import Search from "antd/es/input/Search";
import { GRNUnLoadingPage } from "../GRNTab2";
import RollBarcode4By2 from "../print-barcodes/print-barcod-4-2";
import { copyToCliBoard } from "../../../common/handle-to-cliboard-copy/handle-cliboard-write-text";

interface PalletRollProps {
    phId: number;
    summeryDataRecord: PackingListSummaryModel;
}

interface LabelVal {
    label: number;
    value: string;
    groupType?: string;
}
interface DisplayMsg {
    isSuccess: boolean;
    msg: string;
}
export const PalletRollAllocationPage = (props: PalletRollProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const phId = props?.phId;
    const [selectedPalletInfo, setSelectedPalletInfo] = useState<PalletRollsUIModel>();
    const [scannedPalletsRolls, setScannedPalletsRolls] = useState<PalletDetailsModel>();
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [palletsHead, setPalletHead] = useState<PalletDetailsModel[]>([]) // 1,  2
    const [isInspectionScanning, setIsInspectionScanningFlag] = useState<boolean>(false);
    const [isOverRideSysAllocation, setSsOverRideSysAllocation] = useState<boolean>(false);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    const [scanUpdateKey, setScanUpdateKey] = useState<number>(0);
    const [searchedOtherPallets, setSearchedOtherPallets] = useState<SelectProps['options']>([]);
    const [allPallets, setAllPallets] = useState<LabelVal[]>([]);
    const [selectedOtherPallet, setSelectedOtherPallet] = useState<string>();
    const [scannedRollInfo, setScannedRollInfo] = useState<GrnRollInfoModel>();
    const [pendingRolls, setPendingRolls] = useState<PackListPalletCfNcfPfendingRollsModel>();
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [isScanned, setIsScanned] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [printableRolls, setPrintableRolls] = useState<RollInfoModel>(undefined);
    const [disabledPrintRolls, setDisabledPrintRolls] = useState<string[]>([]);
    const locationService = new LocationAllocationService();
    const packingService = new PackingListService();
    const grnServices = new GrnServices();
    const [form] = Form.useForm();
    const { confirm } = Modal;
    const rollInputRef = useRef(null);
    const palletInputRef = useRef(null);
    const { Option } = Select;
    const [searchedText, setSearchedText] = useState("");
    const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);
    const [debounceTimer, setDebounceTimer] = useState<any>();


    useEffect(() => {
        loadData();
    }, []);


    const { summeryDataRecord } = props;
    const loadData = () => {
        if (props.phId) {
            setPalletHead(undefined);
            getPalletsForPackingPallets(props.phId);
            getAllSpaceFreePalletsInWarehouse();
            getAllPendingToPalletConfirmationRollsInPackingList(props.phId);
        }
    }
    const getPalletsForPackingPallets = (phId: number, isUpadte: boolean = true) => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
        locationService.getPalletsMappedForPackingList(phIdReq).then((res => {
            if (res.status) {
                setPalletHead(res.data);
                if (isUpadte) {
                    setRefreshKey(preState => preState + 1);
                }
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setPalletHead([]);
            }
        })).catch(error => {
            setPalletHead([]);
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const getAllPendingToPalletConfirmationRollsInPackingList = (phId: number) => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
        locationService.getAllPendingToPalletConfirmationRollsInPackingList(phIdReq).then((res => {
            if (res.status) {
                setPendingRolls(res.data[0]);
                setDisabledPrintRolls([]);
            } else {
                setPendingRolls(undefined);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const getAllSpaceFreePalletsInWarehouse = () => {
        const phIdReq = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        locationService.getAllSpaceFreePalletsInWarehouse(phIdReq).then((res => {
            if (res.status) {
                const allPallets = res.data.map(palletObj => {
                    return { label: palletObj.palletId, value: palletObj.palletCode, groupType: palletObj.palletGroupType.toString() }
                });
                setAllPallets(allPallets);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setAllPallets([]);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const allocatePalletsToBin = () => {
        const phIdReq = new PackListIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId);
        locationService.allocatePakcListPalletsToBin(phIdReq).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);

            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        })
    }
    const handlePrint = (row: RollInfoModel) => {
        setPrintableRolls(row);
    }
    const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
        const displayObj: DisplayMsg = { isSuccess, msg }
        setDisplayMsg(displayObj);
    }
    const removeDIsplayMsg = () => {
        setDisplayMsg(undefined);
    }
    /**
     * 
     * @param palletInfo 
     */
    const columns: ColumnsType<RollInfoUIModel> = [
        {
            title: 'Object No',
            dataIndex: 'externalRollNumber',
        },
        {
            title: 'Object Barcode ',
            dataIndex: 'barcode',
        },
        {
            title: 'Lot No',
            dataIndex: 'lotNo',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNo',
        },
        // {
        //     title: 'Type',
        //     dataIndex: 'objectType',
        // },
        {
            title: 'Qty',
            dataIndex: 'supplierQuantity',
        },
        // {
        //     title: 'IWUOM',
        //     dataIndex: 'inputWidthUom',
        // },
        {
            title: 'Width',
            dataIndex: 'supplierWidth',
        },
        {
            title: 'Length',
            dataIndex: 'supplierLength',
        },
        {
            title: 'Shade',
            dataIndex: 'shade',
        }
    ]
    const pendingRollColumns: ColumnsType<RollInfoModel> = [
        {
            title: 'Object No',
            dataIndex: 'externalRollNumber',
            fixed: 'left',
        },
        {
            title: 'Object Barcode ',
            dataIndex: 'barcode',
            fixed: 'left',
            render: (v) => {
                return <>{v}<>&nbsp;</><CopyTwoTone
                    onClick={() => copyToCliBoard(v, 'Barcode copied to clipboard')}
                /></>
            }

        },
        {
            title: 'Lot No',
            dataIndex: 'lotNumber',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNumber',
        },

        {
            title: 'Object Type',
            dataIndex: 'objectType',
        },
        {
            title: 'Item Code',
            dataIndex: 'materialItemCode',
        },
        {
            title: 'Object Width',
            dataIndex: 'inputWidth',
            render: (val, record) => {
                return `${val} (${record.inputWidthUom})`
            }
        },
        {
            title: 'Width (CM)',
            dataIndex: 'supplierWidth',
        },
        {
            title: 'Object Qty',
            dataIndex: 'inputLength',
            render: (val, record) => {
                return `${val} (${record.inputLengthUom})`
            }
        },
        {
            title: 'Length (Meters)',
            dataIndex: 'supplierLength',
        },
        {
            title: 'Shade',
            dataIndex: 'shade',
        }, {
            title: 'Inspection',
            dataIndex: 'pickForInspection',
            fixed: 'right',
            render: (data => {
                return data ? "Yes" : "No"
            })
        },
        {
            title: 'Print',
            dataIndex: 'pickForInspection',
            fixed: 'right',
            render: ((data, record) => {
                return <Button icon={<PrinterTwoTone />} disabled={record.printStatus ? true : disabledPrintRolls.includes(record.barcode)} onClick={() => handlePrint(record)} />
            })
        },
    ]
    const [firstColumn, ...restColumns] = pendingRollColumns;
    const lowerCaseSearchText = String(searchedText).toLowerCase();
    const inspectionSearchEnumVal = {
        "yes": 1,
        "no": 0
    }
    const modifiedFirstColumn = {
        ...firstColumn,
        filteredValue: [lowerCaseSearchText],
        onFilter: (value, record: RollInfoModel) => {
            if (record) {
                const aaa = new Set(Object.keys(record).map((key) => {
                    let val = undefined;
                    if (key == 'pickForInspection') {
                        Object.keys(inspectionSearchEnumVal).forEach(objKey => {
                            if (objKey.includes(lowerCaseSearchText)) {
                                val = inspectionSearchEnumVal[objKey];
                            }
                        });
                        return (val == 0 || val == 1) ? String(record[key]).toLowerCase().includes(val.toLocaleString()) : false;
                    } else {
                        return String(record[key]).toLowerCase().includes(value.toLocaleString())
                    }
                }));
                if (aaa.size && aaa.has(true))
                    return true;
                else
                    return false;
            } else {
                return false;
            }
        },
    };

    const searchedTextColumns = [modifiedFirstColumn, ...restColumns];
    const closeModel = () => {
        setModalOpen(false);
        setSelectedPalletInfo(undefined);
    }
    const selectPallet = (palletInfo: PalletRollsUIModel) => {
        if (palletInfo) {
            setSelectedPalletInfo(palletInfo);
            setModalOpen(true);
        }
    }
    const renderTitle = (palletInfoParam: PalletRollsUIModel) => {
        let palletCode = palletInfoParam.palletCode;
        let noOfrolls = palletInfoParam.rollsInfo.length;
        return <Descriptions bordered size={'small'} title={<Space size='middle'><>Pallet Code : {palletCode} </>No Of Objects : {noOfrolls} </Space>}
        // extra={<Button type="primary">Print</Button>}
        >
            {/* <Descriptions.Item label="Pallet Code">{palletCode}</Descriptions.Item>
            <Descriptions.Item label="No Of Rolls">{noOfrolls}</Descriptions.Item> */}
        </Descriptions>
    }
    const getCssFromComponent = (fromDoc, toDoc) => {
        Array.from(fromDoc.styleSheets).forEach((styleSheet: CSSStyleSheet) => {
            try {
                if (styleSheet?.cssRules) { // true for inline styles and same-origin stylesheets
                    const newStyleElement = toDoc.createElement("style");
                    Array.from(styleSheet.cssRules).forEach((cssRule: CSSRule) => {
                        newStyleElement.appendChild(toDoc.createTextNode(cssRule.cssText));
                    });
                    toDoc.head.appendChild(newStyleElement);
                }
            } catch (e) {
                console.warn("Could not access stylesheet rules for", styleSheet.href, e);
            }
        });
    }
    const print = () => {
        const printAreaElement = document.getElementById('printArea') as HTMLElement | null;
        const divContents = printAreaElement?.innerHTML ?? '';
        const element = window.open('', '', 'height=700, width=1024');
        element?.document.write(divContents);
        getCssFromComponent(document, element?.document);
        element?.document.close();
        // Loading image lazy
        setTimeout(() => {
            element?.print();
            element?.close()
        }, 1000);
        // clsoeModel();
    }
    const onChange = () => {
        setOpen(false);
        setScannedPalletsRolls(undefined);
        setSsOverRideSysAllocation(undefined);
        setSelectedPalletInfo(undefined);
        restForms();
        if (isScanned) {
            setIsScanned(false);
            loadData();
        }
    };
    const changeIsOverRide = (checked: boolean) => {
        setSsOverRideSysAllocation(checked);
    }
    const showLargeDrawer = (inspectionFlag: boolean) => {
        setOpen(true);
        setIsInspectionScanningFlag(inspectionFlag);
        removeDIsplayMsg();
        setTimeout(() => {
            rollInputFocus()
        }, 1);
    };


    const searchOtherPallet = (newValue: string) => {
        const matchedObjects = allPallets.filter((item) => {
            // Convert both the label and value to lowercase for case-insensitive matching         
            const valueLowerCase = item.value.toLowerCase();
            const inputLowerCase = newValue.toLowerCase();
            // Check if the label or value contains the input string
            return valueLowerCase.includes(inputLowerCase);
        });
        setSearchedOtherPallets(newValue ? matchedObjects : []);
    };
    console.log(searchedOtherPallets, 'llll')
    const changeOtherPallet = (newValue: string) => {
        setSelectedOtherPallet(newValue);
        setSearchedOtherPallets([])
    };
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const rollInputFocus = () => {
        if (rollInputRef.current) {
            rollInputRef.current.focus();
        }
    }
    const restForms = () => {
        form.resetFields();
        setScannedRollInfo(undefined);
        setBtnDisabled(false);
        setBarcodeVal('');
        setManualBarcodeVal('');
        setPrintableRolls(undefined);
        setTimeout(() => rollInputFocus(), 1)
        rollInputFocus();
    }
    const showConfirm = (msg = 'Do you Want to continue without Measured width') => {
        confirm({
            title: msg,
            icon: <ExclamationCircleFilled />,
            // content: 'Measured Width Not defined',
            onOk() {
                confirmedPallet();
            },
            onCancel() {
                form.setFieldValue('palletBarcode', '')
                setBtnDisabled(false);
            },
        });
    };
    const showConfirmForMultipleMsgs = (msgs: string[], rollIdL: number, rollBarcodeL: string, palletIdL: number) => {
        const msgString = <div>{
            msgs.map((msg, index) => {
                return <><span>{index + 1}.{msg}</span><br></br></>
            })
        }</div>
        confirm({
            width: 'fit-content',
            title: msgString,
            icon: <ExclamationCircleFilled />,
            okText: 'Confirm',
            // okType: 'danger',
            // content: 'Measured Width Not defined',
            onOk() {
                rollPalletMapping(rollIdL, rollBarcodeL, palletIdL);
            },
            onCancel() {
                form.setFieldValue('palletBarcode', '')
                setBtnDisabled(false);
            },
        });
    };
    const getPalletIdForPalletCode = (palletCode: string) => {
        const matchedPllaetObj = allPallets.find(palletObj => palletObj.value == palletCode);
        return matchedPllaetObj?.label;
    }
    const confirmedPallet = () => {
        setBtnDisabled(true);
        const { measuredWidth, measuredWeight, existingPallet, otherPallet, palletBarcode } = form.getFieldsValue();
        let palletNo = existingPallet == 'other' ? getPalletIdForPalletCode(otherPallet) : existingPallet;
        const barcodeParts = palletBarcode && palletBarcode.split('-');
        if (barcodeParts) {
            palletNo = Number(barcodeParts[1]);
        }
        grnForRollId(measuredWeight, measuredWidth, palletNo, false);
    }
    const scanRollBarcode = (value: string) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }

    const scanBarcode = (fullBarcode: string) => {
        removeDIsplayMsg();
        // confirmRollsToPallet pallet roll mapping
        // const fullBarcode = e.target.value;
        const prefix = fullBarcode.charAt(0);
        const barcode = Number(fullBarcode.substring(1));
        setBarcodeVal(fullBarcode);
        if (prefix == 'R') {
            form.setFieldValue('existingPallet', '')
            form.setFieldValue('otherPallet', '')
            const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, barcode, fullBarcode);
            packingService.getGrnRollInfoForRollIdGRN(rollIdReq).then((res => {
                if (res.status) {
                    form.setFieldValue('measuredWidth', res.data.rollInfo.measuredWidth);
                    form.setFieldValue('measuredWeight', res.data.rollInfo.measuredWeight);
                    setScannedRollInfo(res.data);
                    setBtnDisabled(false);
                    setTimeout(() => {
                        if (palletInputRef.current) {
                            palletInputRef.current.focus();
                        }
                    }, 1)

                    // AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    // AlertMessages.getErrorMessage(res.internalMessage);
                    addDisplayMsg(res.internalMessage);
                }
                setScanUpdateKey(preState => preState + 1);
                setBarcodeVal('');
                setManualBarcodeVal('');
                form.setFieldValue('rollBarcode', '');
                form.setFieldValue('manBarcode', '');
            })).catch(error => {
                addDisplayMsg(error.message)
            })
        } else {
            addDisplayMsg('Please Enter A Valid Roll Barcode');
            restForms();
        }

    }
    const beforeScanPalletBarcode = (value: any) => {
        clearTimeout(debounceTimer);
        // Set a new timer to call scanBarcode after 500ms
        const timeOutId = setTimeout(() => {
            scanPalletBarcode(value);
        }, 500);
        setDebounceTimer(timeOutId);
    }
    const scanPalletBarcode = (e: any) => {
        removeDIsplayMsg();
        const fullBarcode = e.target.value;
        const barcodeParts = fullBarcode.split('-');
        const prefix = barcodeParts[0];
        const palletId = Number(barcodeParts[1]);
        const measuredWidth: number = form.getFieldValue('measuredWidth');
        const measuredWeight: number = form.getFieldValue('measuredWeight');
        if (prefix == 'PL' && palletId) {
            setBtnDisabled(true);
            grnForRollId(measuredWeight, measuredWidth, palletId);
        } else {
            addDisplayMsg("Please Scan A Valid Pallet");
            form.setFieldValue('palletBarcode', '');
            setBtnDisabled(false);

        }
    }
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            setBtnDisabled(true);
            const { measuredWeight, measuredWidth, existingPallet, otherPallet, palletBarcode } = values;
            let palletNo = existingPallet == 'other' ? getPalletIdForPalletCode(otherPallet) : existingPallet;
            grnForRollId(measuredWeight, measuredWidth, palletNo);
        }).catch(err => console.log(err.message));
    };
    const grnForRollId = (measuredWeight: number, measuredWidth: number, palletCodeL: number, isValidate: boolean = true): boolean | void => {
        const { barcode, rollNumber } = scannedRollInfo.rollInfo;
        let palletRollMappingFlag = true;
        if (scannedRollInfo.currentPalletId && scannedRollInfo.currentPalletId == palletCodeL) {
            palletRollMappingFlag = false;
        } else if ((!palletCodeL) && scannedRollInfo.currentPalletId) {
            palletRollMappingFlag = false;
        }
        let confirmFlag = false;
        if (isValidate && palletRollMappingFlag) {
            if (palletCodeL) {
                if (scannedRollInfo.currentPalletId && scannedRollInfo.currentPalletId != palletCodeL) {
                    confirmFlag = true;
                } else {
                    if (scannedRollInfo.defaultPalletId && scannedRollInfo.defaultPalletId != palletCodeL) {
                        confirmFlag = true;
                    }
                }
                // if (confirmFlag) {
                //     showConfirm("System Suggested Pallet and Scanned Pallet are different. Do you want proceed Manual Pallet?")
                //     return false;
                // }
            } else {
                addDisplayMsg('Please Select Pallet');
                if (palletInputRef.current) {
                    palletInputRef.current.focus();
                }
                setBtnDisabled(false);
                return false;
            }
        }
        const rollReq = new RollGrnAndInsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollNumber, barcode, undefined, undefined, undefined, phId, measuredWidth, measuredWeight);
        // if there is not measured width entered, then only update the pallet mapping to the roll
        const measuredQty = Number(measuredWidth ? measuredWidth : 0 + measuredWeight ? measuredWeight : 0);
        if (!measuredQty) {
            if (palletRollMappingFlag) {
                validateRollPalletMapping(rollNumber, barcode, palletCodeL, confirmFlag);
            } else {
                if (palletCodeL) {
                    addDisplayMsg('The current roll you are scanning is already in the current pallet you selected');
                } else {
                    addDisplayMsg('Please Select Pallet');
                }
                setBtnDisabled(false);
                form.setFieldValue('palletBarcode', '');
                return false;
            }
        } else {
            const grnReq = new RollsGrnRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, [rollReq], undefined);
            grnServices.saveRollLevelGRN(grnReq).then((res => {
                if (res.status) {
                    if (palletRollMappingFlag) {
                        validateRollPalletMapping(rollNumber, barcode, palletCodeL);
                    } else {
                        addDisplayMsg(res.internalMessage, true);
                        restForms();
                    }
                } else {
                    addDisplayMsg(res.internalMessage);
                }
                setScanUpdateKey(preState => preState + 1);
                setBarcodeVal('');
                form.setFieldValue('rollBarcode', '')
                setManualBarcodeVal('');
                setBtnDisabled(false);
            })).catch(error => {
                setBtnDisabled(false);
                addDisplayMsg(error.message)
            })
        }
    }

    const validateRollPalletMapping = (rollIdL: number, rollBarcodeL: string, palletIdL: number, isPalletDiff = false) => {
        const overrideAlloc = scannedRollInfo.defaultPalletId > 0;
        const reqFor = isInspectionScanning ? CurrentPalletLocationEnum.INSPECTION : CurrentPalletLocationEnum.WAREHOUSE
        const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollIdL, rollBarcodeL);
        const phIdReq = new PalletRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, palletIdL, overrideAlloc, reqFor, false, [rollIdReq]);
        locationService.validateConfirmRollsToPallet(phIdReq).then((res => {
            const validationMsgs: string[] = [];
            if (isPalletDiff) {
                validationMsgs.push('System Suggested Pallet and Scanned Pallet are different. Do you want proceed Manual Pallet?')
            }
            if (res.status) {
                const data = res.data[0];
                // Validate inspection roll or not
                if (!scannedRollInfo.rollInfo.pickForInspection) {
                    // Validate empty pallet
                    if (data.batchesInPallet.length) {
                        if (!data.batchesInPallet.includes(scannedRollInfo.rollInfo.batchNumber)) {
                            validationMsgs.push('Batches are different ' + data.batchesInPallet.toString());
                            // addDisplayMsg('Batches are different' + data.batchesInPallet.toString());
                            if (!user?.roles?.includes('WarehouseManger')) {
                                throw new Error(`Batches are different,you can't do this operation,Please contact WarehouseManger`);
                            }
                        }
                    }
                }
                if (data.currentConfirmedRollsInPallet > data.totalPalletCapacity) {
                    validationMsgs.push('Capacity Override - ' + data.totalPalletCapacity);
                    // addDisplayMsg('Capacity override - ' + data.totalPalletCapacity);
                }
                validationMsgs.length > 0 ? showConfirmForMultipleMsgs(validationMsgs, rollIdL, rollBarcodeL, palletIdL) : rollPalletMapping(rollIdL, rollBarcodeL, palletIdL);
            } else {
                addDisplayMsg(res.internalMessage);
            }
        })).catch(error => {
            addDisplayMsg(error.message);
            setBtnDisabled(false);
        });

    }
    const rollPalletMapping = (rollIdL: number, rollBarcodeL: string, palletIdL: number) => {
        const overrideAlloc = true;
        const reqFor = isInspectionScanning ? CurrentPalletLocationEnum.INSPECTION : CurrentPalletLocationEnum.WAREHOUSE
        const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, rollIdL, rollBarcodeL);
        const phIdReq = new PalletRollMappingRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, phId, palletIdL, overrideAlloc, reqFor, false, [rollIdReq]);
        locationService.confirmRollsToPallet(phIdReq).then((res => {
            if (res.status) {
                addDisplayMsg(res.internalMessage, true);
                restForms();
                getAllPendingToPalletConfirmationRollsInPackingList(phId);
                getPalletsForPackingPallets(phId, false);
                setIsScanned(true);
            } else {
                addDisplayMsg(res.internalMessage);
            }
            setScanUpdateKey(preState => preState + 1);
            setBarcodeVal('');
            setManualBarcodeVal('');
            setBtnDisabled(false);
            form.setFieldValue('palletBarcode', '')
            form.setFieldValue('rollBarcode', '')
        })).catch(error => {
            addDisplayMsg(error.message);
            setBtnDisabled(false);
        })
    }
    const refresh = () => {
        // setRefreshKey(preState => preState + 1)
        loadData();
    }
    const barcodeColumns: BarcodeColumnsDto[] = [
        { lineNumber: 0, title: '', dataIndex: 'qrcodeId', span: 2, showLabel: false, showBarcode: false, showQRCode: true },
        // { lineNumber: 0, title: '', dataIndex: 'seqNoWithBorder', span: 1, showLabel: false, showBarcode: false, showQRCode: false, className: 'margin-top-8' },
        { lineNumber: 1, title: '', dataIndex: 'barcode', span: 2, showLabel: false, showBarcode: true, showQRCode: false },
        { lineNumber: 1, title: 'Batch No', dataIndex: 'batchNumber', span: 1, showLabel: true, showBarcode: false, showQRCode: false },
        { lineNumber: 1, title: 'Lot No', dataIndex: 'lotNumber', span: 1, showLabel: true, showBarcode: false, showQRCode: false },
        { lineNumber: 2, title: 'Material Item Code', dataIndex: 'materialItemCode', span: 4, showLabel: true, showBarcode: false, showQRCode: false },
        { lineNumber: 2, title: 'Item Type', dataIndex: 'itemType', span: 3, showLabel: true, showBarcode: false, showQRCode: false },
        { lineNumber: 3, title: 'Item Category', dataIndex: 'itemCategory', span: 4, showLabel: true, showBarcode: false, showQRCode: false },
        { lineNumber: 0, title: 'Object No', dataIndex: 'externalRollNumber', span: 4, showLabel: true, showBarcode: false, showQRCode: false },
        { lineNumber: 0, title: 'Object Qty', dataIndex: 'supplierQuantity', span: 4, showLabel: true, showBarcode: false, showQRCode: false },
        { lineNumber: 0, title: 'Object Width', dataIndex: 'supplierWidth', span: 4, showLabel: true, showBarcode: false, showQRCode: false },
    ];
    const printBarCodes = (data: RollInfoModel) => {
        const stateDisabledBtns = disabledPrintRolls;
        setDisabledPrintRolls([data.barcode, ...stateDisabledBtns]);
        const rollNumber = data?.id;
        const req: PhBatchLotRollRequest = new PhBatchLotRollRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, null, undefined, `${rollNumber}`, undefined, undefined);
        packingService.printBarCodes(req).then((res) => {
            if (res.status) {

            } else {
                addDisplayMsg(res.errorCode + "-" + res.internalMessage);
            }
        }).catch((err) => {
            addDisplayMsg(err.message);
        })
    }
    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        scanBarcode(val.trim());
    }
    const closeMsg = () => {
        removeDIsplayMsg();
        rollInputFocus();
    }
    return (<>
        <Collapse className="grn"
            items={[{ key: '1', label: 'GRN', children: <GRNUnLoadingPage summeryDataRecord={summeryDataRecord} /> }]}
        />
        <Card size="small" className="card-title-bg-cyan" title="Warehouse Allocation" extra={<><Button onClick={refresh} icon={<ReloadOutlined />} /> <Button onClick={() => showLargeDrawer(false)} icon={<ScanOutlined />} /></>} >

            {palletsHead?.filter(pallet => pallet.palletCurrentLoc == CurrentPalletLocationEnum.WAREHOUSE).map((palletObj, index) => {
                return <><EmptyPalletBox key={`ware-${refreshKey + index}`} showBin selectPallet={selectPallet} phId={phId} palletObj={palletObj} /></>
            })}
            {palletsHead?.filter(pallet => pallet.palletCurrentLoc == CurrentPalletLocationEnum.WAREHOUSE).length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

        </Card>
        <Divider />
        <Card size="small" className="card-title-bg-cyan" title="Inspection Allocation" extra={<><Space>
            {/* <Button className="btn-orange" onClick={allocatePalletsToBin}> SUGGEST BIN</Button> */}
            <Button onClick={refresh} icon={<ReloadOutlined />} />
            {/* <Button onClick={() => showLargeDrawer(true)} icon={<ScanOutlined />} /> */}
        </Space></>} >

            {palletsHead?.filter(pallet => pallet.palletCurrentLoc == CurrentPalletLocationEnum.INSPECTION).map((palletObj, index) => {
                return <><EmptyPalletBox key={`ins-${refreshKey + index}`} selectPallet={selectPallet} phId={phId} palletObj={palletObj} /></>
            })}
            {palletsHead?.filter(pallet => pallet.palletCurrentLoc == CurrentPalletLocationEnum.INSPECTION).length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>


        <Modal
            // title={<Button type="primary">Print</Button>}
            style={{ top: 20 }}
            width={'100%'}
            open={modalOpen}
            onOk={closeModel}
            onCancel={closeModel}
            footer={[<Button key="back" type="primary" onClick={print}>Print</Button>, <Button onClick={closeModel} >Close</Button>]}
        >
            <div id='printArea'>
                {selectedPalletInfo && renderTitle(selectedPalletInfo)}
                <Table
                    columns={columns}
                    pagination={false}
                    scroll={{ x: 'max-content', }}
                    bordered
                    dataSource={selectedPalletInfo ? selectedPalletInfo.rollsInfo : []}
                    size="small"
                />
            </div>
        </Modal>
        <Drawer
            title={`Pallet Object Allocation`}
            placement="right"
            size={'large'}
            onClose={onChange}
            open={open}
            width='100%'
            extra={
                <Space size={'large'}>
                    {displayMsg && <Alert
                        message={displayMsg.msg}
                        type={displayMsg.isSuccess ? "success" : 'error'}
                        style={{ padding: '8px 12px' }}
                        banner
                        showIcon
                        closable
                        afterClose={closeMsg}
                    />}
                    {/* <Button onClick={onChange}>Cancel</Button> */}
                    <Button type="primary" onClick={onChange}>
                        Close
                    </Button>
                </Space>
            }
        >
            <>
                <Row gutter={16}>
                    <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 24, order: 1 }} lg={{ span: 14, order: 2 }} xl={{ span: 12, order: 2 }} >
                        <Card
                        // style={{ width: 'fit-content' }}
                        >
                            <Row justify="center">
                                {/* <Col span={12} offset={2}> */}

                                <Form
                                    {...layout}
                                    form={form}
                                    name="roll-form"
                                    labelAlign="left"
                                    // onFinish={onFinish}
                                    style={{ maxWidth: 612, width: '100%' }}
                                >
                                    <Form.Item label="Scan Object Barcode">
                                        <Space>
                                            <Form.Item name="rollBarcode" noStyle >
                                                <Input placeholder="Scan Object Barcode" ref={rollInputRef} onChange={(e) => scanRollBarcode(e.target.value)} prefix={<ScanOutlined />} />
                                            </Form.Item>
                                            <Form.Item name="manBarcode" noStyle initialValue={manualBarcodeVal}>
                                                <Search placeholder="Type Object Barcode" onSearch={manualBarcode} enterButton />
                                            </Form.Item>
                                        </Space>
                                    </Form.Item>
                                </Form>

                                {/* </Col> */}
                            </Row>
                            <Row justify="center">
                                {scannedRollInfo && <>
                                    <Form
                                        {...layout}
                                        form={form}
                                        name="pallet-form"
                                        labelAlign="left"
                                        // labelWrap
                                        // onFinish={onFinish}
                                        style={{ maxWidth: 612 }}
                                    >
                                        <Row>
                                            <Col flex="100px"></Col>
                                            <Col flex="auto">

                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Object No</th>
                                                            <th>Object Barcode</th>
                                                            <th>Lot Number</th>
                                                            <th>Object Qty</th>
                                                            <th>Object Width</th>
                                                            <th>Shade</th>
                                                            <th>Measured Width</th>
                                                            <th>Measured Weight</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{scannedRollInfo.rollInfo.externalRollNumber}</td>
                                                            <td>{scannedRollInfo.rollInfo.barcode}</td>
                                                            <td>{scannedRollInfo.rollInfo.lotNumber}</td>
                                                            <td>{scannedRollInfo.rollInfo.supplierLength}</td>
                                                            <td>{scannedRollInfo.rollInfo.supplierWidth}</td>
                                                            <td>{scannedRollInfo.rollInfo.shade}</td>

                                                            <td>
                                                                <Form.Item name="measuredWidth" noStyle rules={[{ required: false }]}>
                                                                    <InputNumber style={{ width: "100%" }} />
                                                                </Form.Item></td>
                                                            <td>
                                                                <Form.Item name="measuredWeight" noStyle rules={[{ required: false }]}>
                                                                    <InputNumber style={{ width: "100%" }} />
                                                                </Form.Item></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <Space >
                                                    <Row gutter={16} style={{ padding: '10px' }}>

                                                        <Card size="small" bordered={true}>
                                                            <Statistic
                                                                title={<><GroupOutlined />Pallet Group</>}
                                                                value={scannedRollInfo.pgName}
                                                                valueStyle={{ color: '#3f8600' }}
                                                            />
                                                        </Card>

                                                        <Card size="small" bordered={true}>
                                                            <Statistic
                                                                title={<><PartitionOutlined />Sug Pallet</>}
                                                                value={scannedRollInfo.defaultPalletName ? scannedRollInfo.defaultPalletName : ' '}
                                                                valueStyle={{ color: '#ffbf00' }}
                                                            />
                                                        </Card>

                                                        <Card size="small" bordered={true}>
                                                            <Statistic
                                                                title="Pallet Allocated?"
                                                                value={scannedRollInfo.currentPalletName ? 'Yes' : 'No'}
                                                                valueStyle={{ color: scannedRollInfo.currentPalletName ? '#3f8600' : '#ff0014' }}
                                                            />
                                                        </Card>
                                                        <Card size="small" bordered={true}>
                                                            <Statistic
                                                                title={<><UngroupOutlined />Pallet Name</>}
                                                                value={scannedRollInfo.currentPalletName ? scannedRollInfo.currentPalletName : ' '}
                                                                valueStyle={{ color: scannedRollInfo.currentPalletName ? '#3f8600' : '#000' }}
                                                                prefix={scannedRollInfo.currentPalletName ? <CheckCircleOutlined /> : <QuestionOutlined />}
                                                            />
                                                        </Card>
                                                        <Card size="small" bordered={true}>
                                                            <Statistic
                                                                title={<>Object Type</>}
                                                                value={scannedRollInfo.rollInfo.pickForInspection ? 'Inspection' : 'Warehouse'}
                                                                valueStyle={{ color: '#000' }}
                                                            />
                                                        </Card>

                                                    </Row>
                                                </Space>
                                            </Col>
                                        </Row>

                                        <Form.Item name="palletBarcode" label="Scan Pallet Barcode" rules={[{ required: false }]}>
                                            <Input placeholder="Scan Pallet Barcode" ref={palletInputRef} onChange={beforeScanPalletBarcode} prefix={<ScanOutlined />} />
                                        </Form.Item>
                                        <Form.Item name="existingPallet" label="Scanned Pallets" rules={[{ required: false }]}>
                                            <Select
                                                placeholder="Select Scanned Pallets"
                                                showSearch
                                                allowClear
                                            >
                                                {palletsHead?.map(palletObj => <Option value={palletObj.palletId}>{palletObj.palletCode}</Option>)}
                                                <Option value="other">other</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, currentValues) => {
                                                return prevValues.existingPallet !== currentValues.existingPallet
                                            }}
                                        >
                                            {({ getFieldValue }) => {
                                                return getFieldValue('existingPallet') === 'other' ? (

                                                    <Form.Item name="otherPallet" label="Search Other Pallet" rules={[{ required: true }]}>
                                                        <Select
                                                            showSearch
                                                            value={selectedOtherPallet}
                                                            placeholder={'Search Other Pallet'}
                                                            defaultActiveFirstOption={false}
                                                            suffixIcon={null}
                                                            filterOption={false}
                                                            onSearch={searchOtherPallet}
                                                            onChange={changeOtherPallet}
                                                            notFoundContent={null}
                                                            options={(searchedOtherPallets || []).map((d) => ({
                                                                value: d.value,
                                                                label: d['value'] + ' ' + `${d['groupType'] ? `(${d['groupType']}) ` : 'NA'}`,
                                                                key: d.value
                                                            }))}
                                                        />
                                                    </Form.Item>
                                                ) : null
                                            }
                                            }
                                        </Form.Item>
                                        <Form.Item {...tailLayout}><Space>
                                            <Button type="primary" onClick={onFinish} disabled={btnDisabled}>
                                                Submit
                                            </Button>
                                            <Button htmlType="button"
                                                onClick={restForms}
                                            >
                                                Reset
                                            </Button>
                                        </Space>
                                        </Form.Item>
                                    </Form>
                                </>
                                }
                            </Row>
                        </Card>
                    </Col>
                    {scannedPalletsRolls &&
                        <Row gutter={16}>
                            <Col span={6}>
                                <EmptyPalletBox key={`scan-empty-pallet${scanUpdateKey + 1}`} phId={phId} selectPallet={selectPallet} palletObj={scannedPalletsRolls} />
                            </Col>
                            <Col span={12}>
                                <Switch onChange={changeIsOverRide} checked={isOverRideSysAllocation} style={{ margin: 16 }} /> Override System Allocation
                                <Descriptions bordered size={'small'} title={<Space size='middle'><>Capicity : {scannedPalletsRolls ? scannedPalletsRolls.palletCapacity : 0} </><>UOM : {scannedPalletsRolls ? scannedPalletsRolls.uom : ''}</><>No Of Rolls : {scannedPalletsRolls ? scannedPalletsRolls.totalConfirmedRolls : 0} </></Space>}
                                // extra={<Button type="primary">Print</Button>}
                                >
                                    {/* <Descriptions.Item label="UOM">Meters</Descriptions.Item>
                <Descriptions.Item label="No Of Rolls">{10}</Descriptions.Item> */}
                                </Descriptions></Col>
                        </Row>
                    }
                    <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 24, order: 2 }} lg={{ span: 10, order: 1 }} xl={{ span: 12, order: 1 }} >
                        <Card title='Pending Rolls'
                            bodyStyle={{ overflowY: 'scroll', maxHeight: 500 }}
                            // style={{ width: 'fit-content' }}
                            extra={<Search placeholder="Search Object Barcode" onChange={(e) => setSearchedText(e.target.value)} onSearch={(e) => setSearchedText(e)} enterButton />}
                        >
                            <Table
                                columns={searchedTextColumns}
                                pagination={false}
                                scroll={{ x: 'max-content', }}
                                bordered
                                dataSource={pendingRolls ? pendingRolls.pendingRollsForPalletConfirmation : []}
                                size="small" />
                        </Card>
                    </Col>
                </Row>
            </>

        </Drawer>
        {printableRolls && <RollBarcode4By2 printBarCodes={() => printBarCodes(printableRolls)} key={printableRolls.barcode} rollBarcodeData={[printableRolls]} />}
        {/* <Switch onChange={onChange} checked={open} style={{ margin: 16 }} /> */}
    </>)
}
export default PalletRollAllocationPage;