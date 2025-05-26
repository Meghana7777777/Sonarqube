import { InboxOutlined } from '@ant-design/icons';
import { BatchInfoModel, ItemCodeInfoModel, LotInfoModel, PhItemCategoryEnum, PhItemLinesObjectTypeEnum, PhLinesGrnStatusEnum, RollInfoModel, SpoItemTypeEnum, conversionToCentimeter, conversionToMeter, excelUploadValidatorMap, tableColumnToExcelColumnMap } from '@xpparel/shared-models';
import { Button, Col, Form, FormInstance, Row, Upload } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertMessages } from '../../../common';
import { defaultDateFormat, defaultDateTimeFormat } from '../../../common/data-picker/date-picker';
import PackListInfoForm from './pack-list-info-form';

interface IPackingListFileUploadProps {
    formRef: FormInstance<any>;
    previewHandler: (batchInfo: BatchInfoModel[]) => void;
    itemCodeInfoMap: Map<string, ItemCodeInfoModel>;
    nlPoNumberInfoMap: Map<string, Set<string>>;
}

const { Dragger } = Upload;
export const PackingListFileUpload = (props: IPackingListFileUploadProps) => {
    const { formRef, previewHandler, itemCodeInfoMap, nlPoNumberInfoMap } = props;
    const [fileList, setFileList] = useState<any[]>([]);
    const [batchInfo, setBatchInfo] = useState<BatchInfoModel[]>([])


    /**
     * Tis will parse the uploaded excel and returns the array of data
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
    const checkDefaultRequiredFields = (headersArray: string[]): boolean => {
        const defaultRequiredFieldsFlag: Set<boolean> = new Set();
        const requireFieldsArray = Array.from(tableColumnToExcelColumnMap.keys());
        for (let eachRecord of requireFieldsArray) {
            if (excelUploadValidatorMap.get(tableColumnToExcelColumnMap.get(eachRecord)).required) {
                defaultRequiredFieldsFlag.add(headersArray.includes(eachRecord.trim().toLocaleLowerCase()));
            } else {
                defaultRequiredFieldsFlag.add(true);
            }
        }
        if (defaultRequiredFieldsFlag.size == 1 && defaultRequiredFieldsFlag.has(true)) {
            return true;
        } else {
            return false;
        }
    }

    const checkInputPackListCodeAndDateMatching = (data: any[]) => {
        const packListCode = formRef.getFieldValue('packListCode');
        const packListDate = formRef.getFieldValue('packListDate');
        if (packListDate == "") {
            throw new Error(`Please select Pack List Date prior to upload File.`);
        }

        if (packListCode == "") {
            throw new Error(`Please Fill Packing List No prior to upload File.`);
        }

        if (packListCode != data[0][0][1]) {
            throw new Error(`Excel given Pack list Code and Selected Pack list code not matching`)
        }
        if (moment(data[0][1][1]).add(1, 'hours').format(defaultDateFormat) !== moment(packListDate).format(defaultDateFormat)) {
            throw new Error(`Excel given Pack list date and Selected Date not matching`)
        }
    }

    const uploadFieldProps = {
        multiple: false,
        onRemove: file => {
            setFileList([]);
            setBatchInfo([]);
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
                let headersRow = getHeaderArray(csvData[0][3]);
                const headerValidationFlag = checkDefaultRequiredFields(headersRow);
                if (headerValidationFlag) {
                    try {
                        await formRef.validateFields()
                        checkInputPackListCodeAndDateMatching(csvData)
                        processExcelData(csvData[0].slice(3));
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
                    AlertMessages.getErrorMessage("Required Fields Are Not Available");
                    return true;
                }
            }
            return false;
        },
        fileList: fileList
    }

    const validateRequiredFieldsAndGetIndexes = (headersArray: string[]): Map<string, number> => {
        const indexOfAssociatedField: Map<string, number> = new Map();
        const lowerCasedHeadersArray = headersArray.map(rec => rec.trim().toLocaleLowerCase())
        for (const eachRecord of Array.from(tableColumnToExcelColumnMap.keys())) {
            if (lowerCasedHeadersArray.includes(eachRecord.trim().toLocaleLowerCase())) {
                const excelColumnTitle: string = tableColumnToExcelColumnMap.get(eachRecord)!;
                indexOfAssociatedField.set(excelColumnTitle, lowerCasedHeadersArray.indexOf(eachRecord.trim().toLocaleLowerCase()));
            } else {
                return new Map();
            }
        }
        return indexOfAssociatedField;
    }

    const processExcelData = (excelData: any[]) => {
        const batchLotLevelMap: Map<string, Map<string, RollInfoModel[]>> = new Map();
        const lotLevelMap: Map<string, Set<string>> = new Map();
        const batchInfoModelDatMap: Map<string, BatchInfoModel> = new Map();
        const lotInfoModelDatMap: Map<string, LotInfoModel> = new Map();
        const headersIndexMap: Map<string, number> = validateRequiredFieldsAndGetIndexes(excelData[0]);
        // check if all required header fields and all date fields available
        if (headersIndexMap.size) {
            let index = 0;
            for (const eachRecord of excelData) {
                if (index == 0) {
                    index += 1;
                    continue;
                }
                let flagToCheckAllRequired = true;
                if (eachRecord.length) {
                    const newObj = new RollInfoModel(undefined, undefined, undefined, undefined, undefined, 0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, false, 0, 0,null);
                    for (const [headersKey, headersValue] of headersIndexMap.entries()) {
                        for (const [validatorMapKey, validationObj] of excelUploadValidatorMap.entries()) {
                            if (typeof eachRecord[headersIndexMap.get(validatorMapKey)] === 'undefined') {
                                if (validationObj.required) {
                                    flagToCheckAllRequired = false;
                                    throw new Error(`${validationObj.label} is Required Please enter value at row ${index + 4}`);
                                }
                            } else {
                                if (eachRecord[headersIndexMap.get(validatorMapKey)].toString().trim().length === 0) {
                                    if (validationObj.required) {
                                        flagToCheckAllRequired = false;
                                        throw new Error(`${validationObj.label} is Required Please enter value at row ${index + 4}`);
                                    }
                                }
                            }
                        }

                        if (typeof eachRecord[headersValue] === 'object') {
                            newObj[headersKey] = moment(eachRecord[headersValue]).format(defaultDateTimeFormat);
                        } else {
                            if (headersKey === 'inputQuantityUom') {
                                const conversion: any = conversionToMeter.get(eachRecord[headersValue].trim().toLowerCase()) ? conversionToMeter.get(eachRecord[headersValue].trim().toLowerCase()) : 1
                                const lengthInMeter = eachRecord[headersIndexMap.get('inputQuantity')] * conversion;
                                newObj['supplierQuantity'] = Number(lengthInMeter.toFixed(2));
                                newObj['supplierLength'] = Number(lengthInMeter.toFixed(2));
                                newObj['inputLength'] = eachRecord[headersIndexMap.get('inputQuantity')];
                                newObj['inputLengthUom'] = eachRecord[headersValue];
                            }
                            if (headersKey === 'inputWidthUom') {
                                const conversion: any = conversionToCentimeter.get(eachRecord[headersValue].trim().toLowerCase()) ? conversionToCentimeter.get(eachRecord[headersValue].trim().toLowerCase()) : 1
                                const lengthInMeter = eachRecord[headersIndexMap.get('inputWidth')] * conversion;
                                newObj['supplierWidth'] = Number(lengthInMeter.toFixed(2));
                            }
                            if (headersKey === 'materialItemCode') {
                                const itemInfoModel: ItemCodeInfoModel = itemCodeInfoMap.get(eachRecord[headersValue]);
                                if (!itemInfoModel) {
                                    throw new Error(`Given Material Item ${eachRecord[headersValue]} does not match with Material Codes available for selected supplier at row ${index + 4}`)
                                } else {
                                    // if (!new Set(nlPoNumberInfoMap.keys()).has(eachRecord[headersIndexMap.get('poNumber')].toString())) {
                                    //     throw new Error(`Given Po number ${eachRecord[headersIndexMap.get('poNumber')]} doesn't belongs to the given supplier at row ${index + 4}`)
                                    // } else {
                                        // const materialItemCodes = nlPoNumberInfoMap.get(eachRecord[headersIndexMap.get('poNumber')].toString());
                                        // if (!materialItemCodes.has(eachRecord[headersValue])) {
                                        //     throw new Error(`Given Material Item ${eachRecord[headersValue]} does not match  Po number ${eachRecord[headersIndexMap.get('poNumber')]} at row ${index + 4}`)
                                        // } else {

                                            
                                            newObj.materialItemName = itemInfoModel?.materialItemName;
                                            newObj.materialItemDesc = itemInfoModel?.materialItemDesc;
                                        // }
                                    // }
                                }
                            }

                            if (headersKey === 'lotNumber') {
                                const externalRollNumber = eachRecord[headersIndexMap.get('externalRollNumber')];
                                if (lotLevelMap.has(eachRecord[headersValue])) {
                                    const externalRollNumberSet = lotLevelMap.get(eachRecord[headersValue]);
                                    if (externalRollNumberSet.has(externalRollNumber)) {
                                        throw new Error(`Duplicate roll ${externalRollNumber} found for lot no ${eachRecord[headersValue]}`)
                                    }
                                } else {
                                    lotLevelMap.set(eachRecord[headersValue], new Set([externalRollNumber]));
                                }
                                newObj['batchNumber'] = eachRecord[headersValue];
                            }


                            newObj[headersKey] = eachRecord[headersValue];
                            if (headersKey === 'objectType') {
                                const objectType: any = eachRecord[headersValue].toUpperCase();
                                if (!Object.values(PhItemLinesObjectTypeEnum).includes(objectType)) {
                                    throw new Error(`Package Type ${eachRecord[headersValue]} is not suitable`)
                                }
                                newObj[headersKey] = objectType;
                            }

                        }
                    }
                    if (flagToCheckAllRequired) {
                        newObj['objectSeqNumber'] = index;
                        newObj['measuredWeight'] = 0;
                        let batchKey = eachRecord[headersIndexMap.get('batchNumber')] || eachRecord[headersIndexMap.get('lotNumber')];
                        if (!batchLotLevelMap.has(batchKey)) {
                            const lotMap = new Map();
                            lotMap.set(eachRecord[headersIndexMap.get('lotNumber')], [newObj]);
                            batchLotLevelMap.set(batchKey, lotMap);
                            lotInfoModelDatMap.set(eachRecord[headersIndexMap.get('lotNumber')], new LotInfoModel(undefined, eachRecord[headersIndexMap.get('lotNumber')], eachRecord[headersIndexMap.get('lotRemarks')], [], []));
                            batchInfoModelDatMap.set(batchKey, new BatchInfoModel(undefined, moment(eachRecord['deliveryDate']).format(defaultDateTimeFormat), eachRecord[headersIndexMap.get('lotNumber')], undefined, undefined, eachRecord[headersIndexMap.get('lotRemarks')], []));
                        } else {
                            if (batchLotLevelMap.get(batchKey).has(eachRecord[headersIndexMap.get('lotNumber')])) {
                                batchLotLevelMap.get(batchKey).get(eachRecord[headersIndexMap.get('lotNumber')]).push(newObj)
                            } else {
                                batchLotLevelMap.get(batchKey).set(eachRecord[headersIndexMap.get('lotNumber')], [newObj]);
                            }
                        }
                    }
                }
                index += 1;
            }
        } else {
            throw new Error(`Please use system specified template`);
        }
        const batchInfoLocal: BatchInfoModel[] = [];
        for (const [batchNo, batchMap] of batchLotLevelMap.entries()) {
            const batchModel = batchInfoModelDatMap.get(batchNo);;
            for (const [lotNo, rollInfo] of batchMap.entries()) {
                const lotInfo = lotInfoModelDatMap.get(lotNo);
                lotInfo.rollInfo = rollInfo;
                batchModel.lotInfo.push(lotInfo);
            }
            batchInfoLocal.push(batchModel);
        }
        setBatchInfo(batchInfoLocal);
    }

    return (
        <>
            {/* <Card title='Create PackList'> */}
            <Form form={formRef} autoComplete="off" layout="vertical">
                <PackListInfoForm formRef={formRef} />
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
            </Form>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button disabled={batchInfo.length === 0} type='primary' onClick={() => previewHandler(batchInfo)}>
                    Preview
                </Button>
            </div>
            {/* </Card> */}
        </>
    )
}

export default PackingListFileUpload