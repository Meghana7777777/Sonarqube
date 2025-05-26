import { useEffect, useState } from 'react';
import { DownCircleFilled, FileExcelFilled, InboxOutlined, UpCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, Form, FormInstance, Row, Tooltip, Upload } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx'; import { defaultDateFormat, defaultDateTimeFormat } from '../../../../common/data-picker/date-picker';
import { AlertMessages } from '../../../../common';
import { useAppSelector } from 'packages/ui/src/common';
import { CommonRequestAttrs, PslOperationModel, PslOpRmModel, RawMaterialInfoModel, manufacturingOrderDumpExcelUploadValidatorMap, ManufacturingOrderDumpModel, ManufacturingOrderDumpRequest, manufacturingOrderDumpTableColumnToExcelColumnMap, SI_ManufacturingOrderInfoAbstractModel, SI_ManufacturingOrderInfoModel, SI_MoLineInfoModel, SI_MoNumberRequest, MoLineModel, MoLineProductModel, MoProductSubLineModel } from '@xpparel/shared-models';
import Table, { ColumnType } from 'antd/es/table';
import { OrderCreationService } from '@xpparel/shared-services';
import UnconfirmedOrdersPage from './un-confirmed-orders';


const { Dragger } = Upload;
interface IProps {
    updateMoNumber?: (moNumber: string) => void;
}
export const ManufacturingOrderDump = (props: IProps) => {
    const [formRef] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const [data, setData] = useState<ManufacturingOrderDumpModel[]>([]);
    const [ordersData, setOrderData] = useState<SI_ManufacturingOrderInfoModel[]>()
    const orderService = new OrderCreationService();
    const [expandedIndex, setExpandedIndex] = useState([]);
    const [updateKey, setUpdateKey] = useState<number>(0);


    // const fetchAllOrders=()=>{
    //     const reqObj = new SI_MoNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,)

    // }

    /**
     * This will parse the uploaded excel and returns the array of data
     * @param file 
     * @returns data array
     */
    const importExcel = (file: any[]) => {
        var data = new Uint8Array(file);
        var wb = XLSX.read(data, { type: 'array', cellDates: true });
        let sheet: any[] = [];
        for (const Sheet in wb.Sheets) {
            if (wb.Sheets.hasOwnProperty(Sheet)) {
                sheet.push(XLSX.utils.sheet_to_json(wb.Sheets[Sheet], { raw: true, header: 1 }));
            }
        }
        return sheet;
    }
    /**
     * This will get the headers as array and converts excell date to given date format
     * @param csvRecordsArr
     * @returns headers array 
     */
    const getHeaderArray = (csvRecordsArr: any) => {
        let headerArray: string[] = [];
        for (let eachRecord of csvRecordsArr) {
            if (typeof eachRecord === "string") {
                headerArray.push(eachRecord.trim().toLowerCase());
            } else if (typeof eachRecord === "undefined") {

            } else {
                headerArray.push(moment(eachRecord).format(defaultDateFormat))
            }

        }
        return headerArray;
    }

    /**
     * This will check if the default required headers are present or not
     * @param headersArray 
     * @returns true or false
     */
    const checkDefaultRequiredFields = (headersArray: string[]): Set<string> => {
        const notAvailableFields: Set<string> = new Set();
        const requireFieldsArray = Array.from(manufacturingOrderDumpTableColumnToExcelColumnMap.keys());
        for (let eachRecord of requireFieldsArray) {
            if (manufacturingOrderDumpExcelUploadValidatorMap.get(manufacturingOrderDumpTableColumnToExcelColumnMap.get(eachRecord)).required) {
                const flag = headersArray.includes(eachRecord.trim().toLocaleLowerCase())
                if (!flag)
                    notAvailableFields.add(eachRecord.trim().toLocaleLowerCase())
            }
        }
        return notAvailableFields;
    }

    const uploadFieldProps = {
        multiple: false,
        onRemove: file => {
            setFileList([]);
        },
        beforeUpload: (file: any) => {
            if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
                AlertMessages.getErrorMessage("Only xlsx,csv,xls files are allowed!");
                return true;
            }
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async data => {
                let csvData1: any = reader.result;
                let csvData = importExcel(csvData1);
                let headersRow = getHeaderArray(csvData[0][0]);
                const headerValidationFlag = checkDefaultRequiredFields(headersRow);
                if (headerValidationFlag.size == 0) {
                    try {
                        processExcelData(csvData[0]);
                    } catch (error) {
                        if (error.message)
                            AlertMessages.getErrorMessage(error.message);
                        return true;
                    }
                    if (fileList.length == 1) {
                        AlertMessages.getErrorMessage("You Cannot Upload More Than One File At A Time");
                        return true;
                    } else {
                        setFileList([...fileList, file]);
                        return false;
                    }
                } else {
                    AlertMessages.getErrorMessage(`Required Fields ${Array.from(headerValidationFlag).toString()} Are Not Available`);
                    return true;
                }
            }
            return false;
        },
        fileList: fileList
    }

    const validateRequiredFieldsAndGetIndexes = (headersArray: string[]): Map<string, number> => {
        try {
            const indexOfAssociatedField: Map<string, number> = new Map();
            const lowerCasedHeadersArray = headersArray.map(rec => rec.trim().toLocaleLowerCase())
            for (const eachRecord of Array.from(manufacturingOrderDumpTableColumnToExcelColumnMap.keys())) {
                if (lowerCasedHeadersArray.includes(eachRecord.trim().toLocaleLowerCase())) {
                    const excelColumnTitle: string = manufacturingOrderDumpTableColumnToExcelColumnMap.get(eachRecord)!;
                    indexOfAssociatedField.set(excelColumnTitle, lowerCasedHeadersArray.indexOf(eachRecord.trim().toLocaleLowerCase()));
                } else {
                    return new Map();
                }
            }
            return indexOfAssociatedField;
        } catch (error) {
            throw new Error(`Error While validating Required Fields`);
        }

    }

    const removeLeadingZerosAndTrailingComma = (input: string): string => {
        const noLeadingZeros = input.replace(/^0+/, '');

        const noTrailingCommas = noLeadingZeros.replace(/,$/, '');

        return noTrailingCommas;
    }

    const processExcelData = (excelData: any[]) => {
        const headersIndexMap: Map<string, number> = validateRequiredFieldsAndGetIndexes(excelData[0]);
        const manufacturingOrderMap = new Map<string, ManufacturingOrderDumpModel>();
        console.log(headersIndexMap, 'headersIndexMap')
        if (headersIndexMap.size) {
            let index = 0
            const moLineValidatorMap = new Map<string, { soNumber: string; soLineNumber: string }>();
            const recordValidator = new Set()
            for (const eachRecord of excelData) {

                {
                    if (index == 0) {
                        index += 1;
                        continue;
                    }
                    const key = JSON.stringify(eachRecord);
                    if(recordValidator.has(key)){
                        throw new Error(`Duplicate Record Found at ${index+2}`)
                    }
                    recordValidator.add(key);
                    for (const [validatorMapKey, validationObj] of manufacturingOrderDumpExcelUploadValidatorMap.entries()) {
                        if (typeof eachRecord[headersIndexMap.get(validatorMapKey)] === 'undefined') {
                            if (validationObj.required) {
                                throw new Error(`${validationObj.label} is Required Please enter value at row ${index + 2}`);
                            }
                        } else {
                            if (eachRecord[headersIndexMap.get(validatorMapKey)].toString().trim().length === 0) {
                                if (validationObj.required) {
                                    throw new Error(`${validationObj.label} is Required Please enter value at row ${index + 2}`);
                                }
                            }
                        }
                    }
                    const manufacturingOrderNumber = eachRecord[headersIndexMap.get('moNumber')];
                    const exFactoryDate = eachRecord[headersIndexMap.get('exFactoryDate')];
                    const moCreationDate = eachRecord[headersIndexMap.get('moCreationDate')];
                    const moClosedDate = eachRecord[headersIndexMap.get('moClosedDate')];

                    if (!manufacturingOrderNumber) return;

                    let manufacturingOrder = manufacturingOrderMap.get(manufacturingOrderNumber);
                    if (!manufacturingOrder) {
                        manufacturingOrder = new ManufacturingOrderDumpModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (manufacturingOrder.hasOwnProperty(field)) manufacturingOrder[field] = value;
                        });

                        manufacturingOrder.moNumber = manufacturingOrderNumber;
                        manufacturingOrder.exFactoryDate = moment(exFactoryDate).add(1, 'hours').format(defaultDateFormat);
                        manufacturingOrder.moCreationDate = moment(moCreationDate).add(1, 'hours').format(defaultDateFormat);
                        manufacturingOrder.moClosedDate = moment(moClosedDate).add(1, 'hours').format(defaultDateFormat);
                        manufacturingOrder.moLines = [];
                        manufacturingOrder.rawMaterials = [];
                        manufacturingOrder.quantity = eachRecord[headersIndexMap.get('moQty')]

                        manufacturingOrderMap.set(manufacturingOrderNumber, manufacturingOrder);
                    }

                    const moLineNumber = eachRecord[headersIndexMap.get('moLineNumber')];
                    const soNumber = eachRecord[headersIndexMap.get('soNumber')];
                    const soLineNumber = eachRecord[headersIndexMap.get('soLineNumber')];
                    if (moLineValidatorMap.has(manufacturingOrder.moNumber + '-' + moLineNumber)) {
                        const existing = moLineValidatorMap.get(manufacturingOrder.moNumber + '-' + moLineNumber)!;
                        if (existing.soNumber != soNumber || existing.soLineNumber != soLineNumber) {
                            throw new Error(`Invalid data: Mo Line "${manufacturingOrder.moNumber}-${moLineNumber}" is mapped to multiple SO combinations.`);
                        }
                    } else {
                        moLineValidatorMap.set(manufacturingOrder.moNumber + '-' + moLineNumber, { soNumber, soLineNumber });
                    }
                    let moLine = manufacturingOrder.moLines.find(line => line.moLineNumber == moLineNumber && line.soNumber == soNumber && line.soLineNumber == soLineNumber);
                    if (!moLine || moLine === undefined || moLine === null) {
                        moLine = new MoLineModel(undefined, undefined, undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (moLine.hasOwnProperty(field)) moLine[field] = value;
                        });
                        moLine.moLineNumber = moLineNumber;
                        moLine.moLineProducts = [];
                        manufacturingOrder.moLines.push(moLine);
                    }

                    const productCode = eachRecord[headersIndexMap.get('productCode')];
                    const productType = eachRecord[headersIndexMap.get('productType')];

                    let product = moLine.moLineProducts.find(prod => prod.productType == productType && prod.productCode == productCode);
                    if (!product) {
                        product = new MoLineProductModel(undefined, undefined, undefined, undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (product.hasOwnProperty(field)) product[field] = value;
                        });
                        product.productCode = productCode;
                        product.productType = productType;
                        product.moProductSubLines = [];
                        moLine.moLineProducts.push(product);
                    }


                    const subLineColor = eachRecord[headersIndexMap.get('fgColor')];
                    const subLineSize = eachRecord[headersIndexMap.get('size')];
                    const subLineDestination = eachRecord[headersIndexMap.get('destination')]
                    const subLineDeliveryDate = eachRecord[headersIndexMap.get('deliveryDate')];
                    const subLineSchedule = eachRecord[headersIndexMap.get('schedule')];
                    const subLineZFeature = eachRecord[headersIndexMap.get('zFeature')];
                    const subLinePlanProdDate = eachRecord[headersIndexMap.get('planProdDate')];
                    const subLinePlanCutDate = eachRecord[headersIndexMap.get('planCutDate')];
                    const subLineBuyerPo = eachRecord[headersIndexMap.get('buyerPo')]


                    let subLine = product.moProductSubLines.find(sub => sub.fgColor == subLineColor && sub.size == subLineSize 
                        && sub.destination == subLineDestination
                         && sub.deliveryDate == moment(subLineDeliveryDate).add(1,'hours').format(defaultDateFormat) 
                        && sub.zFeature == subLineZFeature
                         && sub.schedule == subLineSchedule
                         && sub.buyerPo == subLineBuyerPo
                         && sub.planCutDate == moment(subLinePlanCutDate).add(1,'hours').format(defaultDateFormat)  
                        && sub.planProdDate ==moment(subLinePlanProdDate).add(1,'hours').format(defaultDateFormat));

                    console.log(subLine, 'subLine')
                    if (!subLine) {
                        subLine = new MoProductSubLineModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined , undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (subLine.hasOwnProperty(field)) subLine[field] = value;
                        });
                        console.log(subLine);
                        subLine.fgColor = subLineColor;
                        subLine.deliveryDate = moment(subLineDeliveryDate).add(1,'hours').format(defaultDateFormat);
                        subLine.planCutDate = moment(subLinePlanCutDate).add(1,'hours').format(defaultDateFormat);
                        subLine.planProdDate = moment(subLinePlanProdDate).add(1,'hours').format(defaultDateFormat);
                        subLine.pslOperations = [];
                        product.moProductSubLines.push(subLine);
                    }
                    console.log( product.moProductSubLines, 'mosubline')
                    const operationCode = eachRecord[headersIndexMap.get('internalOperationCode')];
                    let operation = subLine.pslOperations.find(op => op.opCode === operationCode);
                    if (!operation) {
                        operation = new PslOperationModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (operation.hasOwnProperty(field)) operation[field] = value;
                        });
                        operation.opCode = operationCode;
                        operation.iOpCode = operationCode;
                        operation.pslOpRawMaterials = [];
                        subLine.pslOperations.push(operation);
                    }

                    const OpRawMaterialCode = eachRecord[headersIndexMap.get('itemCode')];
                    let OpRawMaterial = operation.pslOpRawMaterials.find(rm => rm.itemCode === OpRawMaterialCode);
                    if (!OpRawMaterial&&OpRawMaterialCode!=undefined) {
                        OpRawMaterial = new PslOpRmModel(undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (OpRawMaterial.hasOwnProperty(field)) OpRawMaterial[field] = value;
                        });
                        OpRawMaterial.itemCode = OpRawMaterialCode;
                        OpRawMaterial.opCode = eachRecord[headersIndexMap.get('internalOperationCode')];
                        operation.pslOpRawMaterials.push(OpRawMaterial);
                    }

                    // const opCode = eachRecord[headersIndexMap.get('opCode')];
                    // let opRm = operation.pslOpRawMaterials.find(rm => rm.opCode === rawMaterialCode);
                    // if (!rawMaterial) {
                    //     rawMaterial = new PslOpRmModel(undefined,undefined);
                    //     rawMaterial.itemCode = rawMaterialCode;
                    //     operation.pslOpRawMaterials.push(rawMaterial);
                    // }

                    const rmCode = eachRecord[headersIndexMap.get('itemCode')];
                    let rawMaterial = manufacturingOrder?.rawMaterials?.find(rm => rm.itemCode === rmCode);

                    if (!rawMaterial) {
                        rawMaterial = new RawMaterialInfoModel(null, null, null, null, null, null, null, null, null, null);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (rawMaterial.hasOwnProperty(field)) rawMaterial[field] = value;
                            // console.log(field, value, rawMaterial.hasOwnProperty(field), rawMaterial[field], "Info")

                        });
                        rawMaterial.itemCode = rmCode;
                        rawMaterial.itemSubType = eachRecord[headersIndexMap.get('itemType')]
                        manufacturingOrder.rawMaterials?.push(rawMaterial)
                    }
                };
            }

            console.log("Processed Manufacturing Order Data:", Array.from(manufacturingOrderMap.values()));
            setData(Array.from(manufacturingOrderMap.values()));
        }
    };

    const downloadExcel = () => {
        const uniqueFilename = `MO-Data-template-${moment(new Date()).unix()}.xlsx`;
        const link = document.createElement('a');
        link.href = './assets/manufacturing_order_data_dump_format.xlsx';
        link.download = uniqueFilename;
        link.click();
    };



    const uploadButtonHandler = () => {
        const reqObj = new ManufacturingOrderDumpRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, data)
        orderService.upLoadOrders(reqObj).then(res => {
            if (res.status) {
                setFileList([]);
                AlertMessages.getSuccessMessage(res.internalMessage);
                setUpdateKey(prevKey => prevKey + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message)
        })
    }

    return (
        <div>
            <Card size='small' title="Manufacturing Order Integration" extra={
                <Tooltip placement="topRight" title="Download Excel Template">
                    <Button
                        size='small'
                        type="default"
                        className={"export-excel-btn"}
                        onClick={downloadExcel}
                        icon={<FileExcelFilled />}
                    >Download Template</Button>
                </Tooltip>} style={{ marginTop: '10px' }}>
                <Form form={formRef} autoComplete="off" layout="vertical">
                    <Row justify={'space-around'}>
                        <Col>
                            <Dragger
                                {...uploadFieldProps}
                                accept='.csv, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single upload. Strictly prohibited from uploading non templated data or other
                                    banned files
                                </p>
                            </Dragger>
                        </Col>
                    </Row>
                    <Row justify={'end'}><Button
                        onClick={uploadButtonHandler}
                        disabled={data.length === 0}
                        style={{margin: '10px'}}
                    >Save</Button></Row>
                </Form>
                <br />
                <br />

            </Card>

            <UnconfirmedOrdersPage reloadKey={updateKey} updateMoNumber={props.updateMoNumber} />

        </div>
    )
}

export default ManufacturingOrderDump;