import { ExportOutlined } from "@ant-design/icons";
import { InsInspectionFinalInSpectionStatusEnum, InsFabricInspectionRequestCategoryEnum, InsIrIdRequest, PackListIdRequest, InsRollBarcodeInspCategoryReq, InsShrinkageInspectionRequest, InsInspectionHeaderAttributesDisplayValues } from "@xpparel/shared-models";
import { FabricInspectionInfoService, InspectionReportsService, SectionService } from "@xpparel/shared-services";
import { Button, Descriptions, Form, Input, Select, Spin, Tag } from "antd";
import { saveAs } from 'file-saver';
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { ScxButton, ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { AlertMessages } from "../../../../common";
import { CompleteInspectionInfoProps } from "./four-point-inspection-reports";
import React from "react";

export const ShrinkageInspectionReport: React.FC<CompleteInspectionInfoProps> = ({ irId }) => {
    const { Option } = Select
    const user = useAppSelector((state) => state.user.user.user);
    const unitCode = user?.orgData?.unitCode;
    const companyCode = user?.orgData?.companyCode;
    const userId = user?.userId;
    const userName = user?.userName;
    const rollBarcode = user?.rollBarcode;
    const [packListData, setPackListData] = useState<any>();
    const [batchNumbers, setBatchNumbers] = useState<any>();
    const [selectedPackListNo, setSelectedPackListNo] = useState(null);
    const service = new InspectionReportsService();
    const [shrinkageInspDetails, setShrinkageInspDetails] = useState<InsShrinkageInspectionRequest>(null);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [selectedInsReqId, setSelectedInsReqId] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [searchedText, setSearchedText] = useState("")
    const data = shrinkageInspDetails?.inspectionRollDetails || [];
    const [isLoading, setIsLoading] = useState(false);
    const fabricInspectionInfoService = new FabricInspectionInfoService();


    useEffect(() => {
        if (irId) {
            setIsLoading(true);
            getShrinkageInspectionDetails(unitCode, companyCode, userName, userId, irId, barcodeVal);
        }
        else {
            getPacklistData();
        }

    }, [irId])

    const getPacklistData = () => {
        service.packListNumbersDropDown().then((res) => {
            if (res.status) {
                setPackListData(res.data)
            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })
    }

    const getBatchNoByPacklistNo = (packListNo) => {
        // const req = new PacklistIdReq(userName, unitCode, companyCode, userId ,packListNo,InspectionRequestCategoryEnum.SHRINKAGE);
        // // req.packListCode = packListNo;
        // // req.requestCategory = InspectionRequestCategoryEnum.SHRINKAGE;
        // service.getBatchNoByPacklistNo(req).then((res) => {
        //     if (res.status) {
        //         setBatchNumbers(res.data);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // });
    };

    const getShrinkageInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
        if (inspReqId) {
            const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId, true);
            fabricInspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
                if (res.status) {
                    setInspectionData(res.data.shrinkageInfo)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        }
        if (rollBarcode) {
            const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.SHRINKAGE);
            fabricInspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
                if (res.status) {
                    setBarcodeVal('');
                    setInspectionData(res.data.shrinkageInfo)
                } else {
                    setBarcodeVal('');
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        }
    }

    const setInspectionData = (inspData: InsShrinkageInspectionRequest) => {
        const inspectedDate: any = moment(inspData.inspectionHeader?.inspectedDate);
        inspData.inspectionHeader.inspectedDate = inspData.inspectionHeader?.inspectedDate ? inspectedDate : null;

        const expCompletedDate: any = moment(inspData.inspectionHeader?.expInspectionCompleteAt);
        inspData.inspectionHeader.expInspectionCompleteAt = inspData.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

        const startDate: any = moment(inspData.inspectionHeader?.inspectionStart);
        inspData.inspectionHeader.inspectionStart = inspData.inspectionHeader?.inspectionStart ? startDate : null;

        const completedDate: any = moment(inspData.inspectionHeader?.inspectionCompleteAt);
        inspData.inspectionHeader.inspectionCompleteAt = inspData.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

        inspData.inspectionHeader.inspector = inspData.inspectionHeader.inspector ? inspData.inspectionHeader.inspector : user?.userName;
        setShrinkageInspDetails(inspData);
        setShowTable(true);

        const totalNoOfRolls = inspData.inspectionRollDetails.length;
        const totalInspOpenRolls = inspData.inspectionRollDetails.filter(eachRoll => eachRoll.rollInfo.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN);
        const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
        const percentage = Math.ceil((totalInspRolls / totalNoOfRolls) * 100);
    }

    const handleSelectChange = (value) => {
        setSelectedPackListNo(value);
        getBatchNoByPacklistNo(value);
    };

    const handleBatchNumberChange = (value) => {
        setSelectedInsReqId(value);
    };


    const handleExport = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        if (!shrinkageInspDetails) {
            return;
        }
        const descriptionValues = {};
        shrinkageInspDetails?.inspectionHeader?.headerAttributes.forEach((data, index) => {
            descriptionValues[data.attributeName] = data.attributeValue;
        });
        const excelData = [
            descriptionValues,
            ...shrinkageInspDetails.inspectionRollDetails.map((dataItem) => ({
                'Roll No': dataItem.rollInfo.externalRollNo,
                'Barcode': dataItem.rollInfo.barcode,
                'Lot Number': dataItem.rollInfo.lotNumber,
                'Roll Qty': dataItem.rollInfo.rollQty,
                'Inspection Result': dataItem.rollInfo.rollInsResult,
                'Final Inspection Result': dataItem.rollInfo.rollFinalInsResult,
                '24 Measurement Wrap (L)': dataItem.shrinkageTypes[0].measurementLength,
                '24 Measurement Weft (W)': dataItem.shrinkageTypes[0].measurementWidth,
                '24 Measurement Day Wrap (L)': dataItem.shrinkageTypes[0].lengthAfterSk,
                '24 Measurement Day Weft (W)': dataItem.shrinkageTypes[0].widthAfterSk,
                '24 Shrinkage% Wrap(L)': dataItem.shrinkageTypes[0],
                '24 Shrinkage% Weft(W)': dataItem.shrinkageTypes[0],
                'Steam Measurement Wrap (L)': dataItem.shrinkageTypes[1].measurementLength,
                'Steam Measurement Weft (W)': dataItem.shrinkageTypes[1].measurementWidth,
                'Steam Measurement Steam Wrap (L)': dataItem.shrinkageTypes[1].lengthAfterSk,
                'Steam Measurement  Weft (W)': dataItem.shrinkageTypes[1].widthAfterSk,
                'Steam Shrinkage% Wrap(L)': dataItem.shrinkageTypes[1],
                'Steam Shrinkage% Weft(W)': dataItem.shrinkageTypes[1],
                'After Wash Measurement Wrap (L)': dataItem.shrinkageTypes[2].measurementLength,
                'After Wash Measurement Weft (W)': dataItem.shrinkageTypes[2].measurementWidth,
                'After Wash Measurement AW Wrap (L)': dataItem.shrinkageTypes[2].lengthAfterSk,
                'After Wash Measurement AW Weft (W)': dataItem.shrinkageTypes[2].widthAfterSk,
                'After Wash Shrinkage% Wrap(L)': dataItem.shrinkageTypes[2],
                'After Wash Shrinkage% Weft(W)': dataItem.shrinkageTypes[2],
            })),
        ];

        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .split("-")
            .join("/");

        const columns = [
            { title: 'Roll No', dataIndex: 'Roll No', key: 'Roll No' },
            { title: 'Barcode', dataIndex: 'Barcode', key: 'Barcode' },
            { title: 'Lot Number', dataIndex: 'Lot Number', key: 'Lot Number' },
            { title: 'Roll Qty', dataIndex: 'Roll Qty', key: 'Roll Qty' },
            { title: 'Inspection Result', dataIndex: 'Inspection Result', key: 'Inspection Result' },
            { title: 'Final Inspection Result', dataIndex: 'Final Inspection Result', key: 'Final Inspection Result' },
            { title: '24 Hours Measurement Wrap (L)', dataIndex: '24 Measurement Wrap (L)', key: '24 Measurement Wrap (L)' },
            { title: '24 Hours MeasurementWeft (W)', dataIndex: '24 Measurement Weft (W)', key: '24 Measurement Weft (W)' },
            { title: '24 Hours Measurement After 24 Hours Wrap (L)', dataIndex: '24 Measurement Day Wrap (L)', key: '24 Measurement Day Wrap (L)' },
            { title: '24 Hours Measurement After 24 Hours Weft (W)', dataIndex: '24 Measurement Day Weft (W)', key: '24 Measurement Day Weft (W)' },
            { title: '24 Hours Shrinkage% Wrap(L)', dataIndex: '24 Shrinkage% Wrap(L)', key: '24 Shrinkage% Wrap(L)' },
            { title: '24 Hours Shrinkage% Weft(W)', dataIndex: '24 Shrinkage% Weft(W)', key: '24 Shrinkage% Weft(W)' },
            { title: 'Steam Measurement Wrap (L)', dataIndex: 'Steam Measurement Wrap (L)', key: 'Steam Measurement Wrap (L)' },
            { title: 'Steam Measurement Weft (W)', dataIndex: 'Steam Measurement Weft (W)', key: 'Steam Measurement Weft (W)' },
            { title: 'Steam Measurement After Steam Wrap (L)', dataIndex: 'Steam Measurement Steam Wrap (L)', key: 'Steam Measurement Steam Wrap (L)' },
            { title: 'Steam Measurement After Steam Weft (W)', dataIndex: 'Steam Measurement Steam Weft (W)', key: 'Steam Measurement Steam Weft (W)' },
            { title: 'Steam Shrinkage% Wrap(L)', dataIndex: 'Steam Shrinkage% Wrap(L)', key: 'Steam Shrinkage% Wrap(L)' },
            { title: 'Steam Shrinkage% Weft(W)', dataIndex: 'Steam Shrinkage% Weft(W)', key: 'Steam Shrinkage% Weft(W)' },
            { title: 'After Wash Measurement Wrap (L)', dataIndex: 'After Wash Measurement Wrap (L)', key: 'After Wash Measurement Wrap (L)' },
            { title: 'After Wash Measurement Weft (W)', dataIndex: 'After Wash Measurement Weft (W)', key: 'After Wash Measurement Weft (W)' },
            { title: 'After Wash Measurement After Wash Wrap (L)', dataIndex: 'After Wash Measurement AW Wrap (L)', key: 'After Wash Measurement AW Wrap (L)' },
            { title: 'After Wash Measurement After Wash Weft (W)', dataIndex: 'After Wash Measurement AW Weft (W)', key: 'After Wash Measurement AW Weft (W)' },
            { title: 'After Wash Shrinkage% Wrap(L)', dataIndex: 'After Wash Shrinkage% Wrap(L)', key: 'After Wash Shrinkage% Wrap(L)' },
            { title: 'After Wash Shrinkage% Weft(W)', dataIndex: 'After Wash Shrinkage% Weft(W)', key: 'After Wash Shrinkage% Weft(W)' },
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        worksheet['!cols'] = columns.map((col, index) => ({ wch: col.title.length }));

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const columnWidths = excelData.map(() => ({ wch: 20 }));
        worksheet['!cols'] = columnWidths;
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, `Shrinkage Inspection Reports-${currentDate}.xlsx`);
    };

    const onFinish = () => {
        if (!selectedPackListNo || selectedPackListNo.length === 0) {
            AlertMessages.getCustomMessage('warning', 'Please select Packlist before submitting');
        } else if (!selectedInsReqId) {
            AlertMessages.getCustomMessage('warning', 'Please select Batch Number before submitting');
        } else {
            setIsLoading(true);
            getShrinkageInspectionDetails(
                unitCode,
                companyCode,
                userName,
                userId,
                selectedInsReqId,
                barcodeVal
            );
        }
    };

    // const filteredData = shrinkageInspDetails?.inspectionRollDetails.filter(data =>
    //     data.rollInfo.externalRollNo.toString().toLowerCase().includes(searchedText.toLowerCase())
    // );
    const filteredData = shrinkageInspDetails?.inspectionRollDetails

    return (
        <>
            <ScxCard
                extra={
                    !irId && (
                        <div>
                            <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                                Export as Excel
                            </Button>
                        </div>
                    )
                }
            >
                <Spin spinning={isLoading} size="large">
                    {!irId && (
                        <Form onFinish={onFinish}>
                            <ScxRow>
                                <ScxColumn span={8}>
                                    <Form.Item label="Select Packing List">
                                        <Select
                                            showSearch
                                            allowClear
                                            onChange={handleSelectChange}
                                            value={selectedPackListNo}
                                            placeholder="Select Packing List"
                                            style={{ width: '200px' }}
                                            filterOption={(input, option) =>
                                                (option.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {packListData?.map((data) => (
                                                <Option key={data.Id} value={data.Id} label={data.packListNo}>
                                                    {data.packListNo}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </ScxColumn>
                                <ScxColumn span={8}>
                                    <Form.Item label='Select Batch Number'>
                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Select a Batch No"
                                            style={{ width: '200px' }}
                                            onChange={handleBatchNumberChange}
                                            filterOption={(input, option) =>
                                                (option.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            disabled={!selectedPackListNo}
                                        >
                                            {batchNumbers?.map((data) => (
                                                <Option key={data.batchNumber} value={data.insReqId} label={data.batchNumber}>
                                                    {data.batchNumber}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </ScxColumn>
                                <ScxColumn span={8}>
                                    <ScxButton type="primary" htmlType="submit">Submit</ScxButton>
                                </ScxColumn>
                            </ScxRow>
                        </Form>
                    )}
                </Spin>
                <br />
                <div >
                    <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>Shrinkage Inspection</h1>
                    <Descriptions bordered >
                        {shrinkageInspDetails?.inspectionHeader?.headerAttributes.map((data, index) => (
                            <Descriptions.Item key={index} label={<b>{InsInspectionHeaderAttributesDisplayValues[data.attributeName]}</b>}>
                                {data.attributeValue}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </div>
                <br />
                <div >
                    {showTable &&
                        <>
                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                <Input.Search placeholder="Enter Roll No" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, marginBottom: '15px' }} />
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ borderCollapse: 'collapse', width: '100%' }} >
                                    <thead>
                                        <tr>

                                            <th colSpan={2} style={{ border: '1px solid gray', width: '100px' }}></th>
                                            {filteredData?.map((data, index) => (
                                                <th colSpan={2} key={index} style={{ border: '1px solid gray', width: '100px' }}>
                                                    {data.rollInfo.externalRollNo}
                                                </th>
                                            ))}
                                        </tr>
                                        <tr>
                                            <th colSpan={2} style={{ border: '1px solid gray' }}></th>
                                            {filteredData?.map(() => (
                                                <>
                                                    <th style={{ border: '1px solid gray' }}>Wrap(Length)</th>
                                                    <th style={{ border: '1px solid gray' }}>Weft(Width)</th>
                                                </>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th rowSpan={3} style={{ border: '1px solid gray' }}>24</th>
                                            <td style={{ border: '1px solid gray', }}>Measurement</td>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[1]?.measurementLength}</td>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[1]?.measurementWidth}</td>
                                                </>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid gray' }}>Measurement Day</td>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[1]?.lengthAfterSk}</td>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[1]?.widthAfterSk}</td>
                                                </>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid gray' }}>Shrinkage %</td>
                                            {filteredData?.map((d, idx) => {
                                                const s = d.shrinkageTypes[1];
                                                const shrinkLength = s?.measurementLength ? ((1 - (s.lengthAfterSk / s.measurementLength)) * 100).toFixed(2) : '';
                                                const shrinkWidth = s?.measurementWidth ? ((1 - (s.widthAfterSk / s.measurementWidth)) * 100).toFixed(2) : '';
                                                return (
                                                    <React.Fragment key={idx}>
                                                        <td style={{ border: '1px solid gray' }}>{shrinkLength}%</td>
                                                        <td style={{ border: '1px solid gray' }}>{shrinkWidth}%</td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>

                                        <tr>
                                            <th rowSpan={3} style={{ border: '1px solid gray' }}>STEAM</th>
                                            <td style={{ border: '1px solid gray' }}>Measurement</td>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[0]?.measurementLength}</td>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[0]?.measurementWidth}</td>
                                                </>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid gray' }}>Measurement STEAM</td>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[0]?.lengthAfterSk}</td>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[0]?.widthAfterSk}</td>
                                                </>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid gray' }}>Shrinkage %</td>
                                            {filteredData?.map((d, idx) => {
                                                const s = d.shrinkageTypes[0];
                                                const shrinkLength = s?.measurementLength ? ((1 - (s.lengthAfterSk / s.measurementLength)) * 100).toFixed(2) : '';
                                                const shrinkWidth = s?.measurementWidth ? ((1 - (s.widthAfterSk / s.measurementWidth)) * 100).toFixed(2) : '';
                                                return (
                                                    <React.Fragment key={idx}>
                                                        <td style={{ border: '1px solid gray' }}>{shrinkLength}%</td>
                                                        <td style={{ border: '1px solid gray' }}>{shrinkWidth}%</td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>

                                        <tr>
                                            <th rowSpan={3} style={{ border: '1px solid gray' }}>AFTER WASH</th>
                                            <td style={{ border: '1px solid gray' }}>Measurement</td>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[2]?.measurementLength}</td>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[2]?.measurementWidth}</td>
                                                </>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid gray' }}>Measurement AFTER WASH</td>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[2]?.lengthAfterSk}</td>
                                                    <td style={{ border: '1px solid gray' }}>{data.shrinkageTypes[2]?.widthAfterSk}</td>
                                                </>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid gray' }}>Shrinkage %</td>
                                            {filteredData?.map((d, idx) => {
                                                const s = d.shrinkageTypes[2];
                                                const shrinkLength = s?.measurementLength ? ((1 - (s.lengthAfterSk / s.measurementLength)) * 100).toFixed(2) : '';
                                                const shrinkWidth = s?.measurementWidth ? ((1 - (s.widthAfterSk / s.measurementWidth)) * 100).toFixed(2) : '';
                                                return (
                                                    <React.Fragment key={idx}>
                                                        <td style={{ border: '1px solid gray' }}>{shrinkLength}%</td>
                                                        <td style={{ border: '1px solid gray' }}>{shrinkWidth}%</td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>

                                        <tr>
                                            <th colSpan={2} style={{ border: '1px solid gray' }}>Roll Insp Result</th>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td colSpan={2} style={{ border: '1px solid gray' }}>
                                                        <Tag
                                                            color={
                                                                data.rollInfo.rollInsResult === InsInspectionFinalInSpectionStatusEnum.FAIL
                                                                    ? 'error'
                                                                    : data.rollInfo.rollInsResult === InsInspectionFinalInSpectionStatusEnum.PASS
                                                                        ? 'success'
                                                                        : 'warning'
                                                            }
                                                        >
                                                            {data.rollInfo.rollInsResult}
                                                        </Tag></td>
                                                </>
                                            ))}
                                        </tr>
                                        <tr>
                                            <th colSpan={2} style={{ border: '1px solid gray' }}>Final Roll Insp Result</th>
                                            {filteredData?.map((data) => (
                                                <>
                                                    <td colSpan={2} style={{ border: '1px solid gray' }}>
                                                        <Tag
                                                            color={
                                                                data.rollInfo.rollFinalInsResult === InsInspectionFinalInSpectionStatusEnum.FAIL
                                                                    ? 'error'
                                                                    : data.rollInfo.rollFinalInsResult === InsInspectionFinalInSpectionStatusEnum.PASS
                                                                        ? 'success'
                                                                        : 'warning'
                                                            }
                                                        >
                                                            {data.rollInfo.rollFinalInsResult}
                                                        </Tag></td>
                                                </>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    }
                </div>
            </ScxCard >
        </>
    )
}