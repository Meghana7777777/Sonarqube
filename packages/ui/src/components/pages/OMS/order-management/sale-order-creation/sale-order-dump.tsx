import { FileExcelFilled, InboxOutlined } from '@ant-design/icons';
import { saleOrderDumpExcelUploadValidatorMap, SaleOrderDumpModel, SaleOrderDumpRequest, saleOrderDumpTableColumnToExcelColumnMap, SI_SaleOrderInfoModel, SoLineModel, SoLineProductModel, SoProductSubLineModel } from '@xpparel/shared-models';
import { SaleOrderCreationService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Row, Tooltip, Upload } from 'antd';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertMessages } from '../../../../common';
import { defaultDateFormat } from '../../../../common/data-picker/date-picker';
import UnconfirmedSaleOrdersPage from './un-confirmed-sale-orders';


const { Dragger } = Upload;
interface IProps {
    updateSoNumber?: (soNumber: string) => void;
}
export const SaleOrderDump = (props: IProps) => {
    const [formRef] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const [data, setData] = useState<SaleOrderDumpModel[]>([]);
    const [ordersData, setOrderData] = useState<SI_SaleOrderInfoModel[]>()
    // const orderService = new OrderCreationService();
    const [expandedIndex, setExpandedIndex] = useState([]);
    const [updateKey, setUpdateKey] = useState<number>(0);

    const saleOrderCreationService = new SaleOrderCreationService()




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
        const requireFieldsArray = Array.from(saleOrderDumpTableColumnToExcelColumnMap.keys());
        for (let eachRecord of requireFieldsArray) {
            if (saleOrderDumpExcelUploadValidatorMap.get(saleOrderDumpTableColumnToExcelColumnMap.get(eachRecord)).required) {
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
            for (const eachRecord of Array.from(saleOrderDumpTableColumnToExcelColumnMap.keys())) {
                if (lowerCasedHeadersArray.includes(eachRecord.trim().toLocaleLowerCase())) {
                    const excelColumnTitle: string = saleOrderDumpTableColumnToExcelColumnMap.get(eachRecord)!;
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
        const saleOrderMap = new Map<string, SaleOrderDumpModel>();
        const recordValidator = new Set();
        console.log(headersIndexMap, 'headersIndexMap')
        if (headersIndexMap.size) {
            let index = 0
            for (const eachRecord of excelData) {
                {
                    if (index == 0) {
                        index += 1;
                        continue;
                    }

                    const key = JSON.stringify(eachRecord);
                    if (recordValidator.has(key)) {
                        throw new Error(`Duplicate Record Found at ${index + 2}`)
                    }
                    recordValidator.add(key);
                    for (const [validatorMapKey, validationObj] of saleOrderDumpExcelUploadValidatorMap.entries()) {
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
                    const saleOrderNumber = eachRecord[headersIndexMap.get('soNumber')];
                    const exFactoryDate = eachRecord[headersIndexMap.get('exFactoryDate')];
                    const soCreationDate = eachRecord[headersIndexMap.get('soCreationDate')];
                    const soClosedDate = eachRecord[headersIndexMap.get('soClosedDate')];

                    if (!saleOrderNumber) return;

                    let saleOrder = saleOrderMap.get(saleOrderNumber);
                    if (!saleOrder) {
                        saleOrder = new SaleOrderDumpModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (saleOrder.hasOwnProperty(field)) saleOrder[field] = value;
                        });

                        saleOrder.soNumber = saleOrderNumber;
                        saleOrder.quantity = eachRecord[headersIndexMap.get('soQty')]
                        saleOrder.exFactoryDate = moment(exFactoryDate).add(1, 'hours').format(defaultDateFormat);
                        saleOrder.soCreationDate = moment(soCreationDate).add(1, 'hours').format(defaultDateFormat);
                        saleOrder.soClosedDate = moment(soClosedDate).add(1, 'hours').format(defaultDateFormat);
                        saleOrder.soLines = [];
                        saleOrderMap.set(saleOrderNumber, saleOrder);
                    }

                    const soLineNumber = eachRecord[headersIndexMap.get('soLineNumber')];
                    let soLine = saleOrder.soLines.find(line => line.soLineNumber === soLineNumber);
                    if (!soLine) {
                        soLine = new SoLineModel(undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (soLine.hasOwnProperty(field)) soLine[field] = value;
                        });
                        soLine.soLineNumber = soLineNumber;
                        soLine.soLineProducts = [];
                        saleOrder.soLines.push(soLine);
                    }

                    const productCode = eachRecord[headersIndexMap.get('productCode')];
                    const productType = eachRecord[headersIndexMap.get('productType')];

                    let product = soLine.soLineProducts.find(prod => prod.productType === productType && prod.productCode === productCode);
                    if (!product) {
                        product = new SoLineProductModel(undefined, undefined, undefined, undefined, undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (product.hasOwnProperty(field)) product[field] = value;
                        });
                        product.productCode = productCode;
                        product.productType = productType;
                        product.soProductSubLines = [];
                        soLine.soLineProducts.push(product);
                    }

                    const subLineColor = eachRecord[headersIndexMap.get('fgColor')];
                    const subLineCodeSize = eachRecord[headersIndexMap.get('size')];
                    const subLineDestination = eachRecord[headersIndexMap.get('destination')]
                    const subLineDeliveryDate = eachRecord[headersIndexMap.get('deliveryDate')];
                    const subLineSchedule = eachRecord[headersIndexMap.get('schedule')];
                    const subLineZFeature = eachRecord[headersIndexMap.get('zFeature')];
                    const subLineBuyerPo = eachRecord[headersIndexMap.get('buyerPo')];

                    let subLine = product.soProductSubLines.find(sub => sub.fgColor === subLineColor && sub.size === subLineCodeSize && sub.destination == subLineDestination && sub.deliveryDate == subLineDeliveryDate && sub.zFeature == subLineZFeature && sub.schedule == subLineSchedule && sub.buyerPo == subLineBuyerPo);
                    if (!subLine) {
                        subLine = new SoProductSubLineModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined , undefined);
                        headersIndexMap.forEach((columnIndex, field) => {
                            const value = eachRecord[columnIndex]?.toString().trim();
                            if (subLine.hasOwnProperty(field)) subLine[field] = value;
                        });
                        console.log(subLine);
                        subLine.fgColor = subLineColor;
                        subLine.deliveryDate = moment(subLineDeliveryDate).add(1, 'hours').format(defaultDateFormat);
                        product.soProductSubLines.push(subLine);
                    }
                };
            }

            console.log("Processed Sale Order Data:", Array.from(saleOrderMap.values()));
            setData(Array.from(saleOrderMap.values()));
        }
    };

    const downloadExcel = () => {
        const uniqueFilename = `SO-Data-template-${moment(new Date()).unix()}.xlsx`;
        const link = document.createElement('a');
        link.href = './assets/sale_order_data_dump_format.xlsx';
        link.download = uniqueFilename;
        link.click();
    };



    const uploadButtonHandler = () => {
        const reqObj = new SaleOrderDumpRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, data)
        console.log(data, "data")
        saleOrderCreationService.upLoadSaleOrders(reqObj).then(res => {
            if (res.status) {
                setFileList([]);
                AlertMessages.getSuccessMessage('Sale Order Details uploaded successfully');
                setUpdateKey(prevKey => prevKey + 1);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <Card size='small' title="Sale Order Integration" extra={
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

            <UnconfirmedSaleOrdersPage reloadKey={updateKey} updateSoNumber={props?.updateSoNumber} />


        </div>
    )
}

export default SaleOrderDump;