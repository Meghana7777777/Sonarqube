import { ExportOutlined } from "@ant-design/icons";
import { InsFabricInspectionRequestCategoryEnum, InsIrIdRequest, InsLabInspectionRequest, PackListIdRequest, InsRollBarcodeInspCategoryReq, InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributesDisplayValues } from "@xpparel/shared-models";
import { FabricInspectionInfoService, InspectionReportsService, SectionService } from "@xpparel/shared-services";
import { Button, Descriptions, Form, Input, Select, Spin, Table, Tag } from "antd";
import { IExcelColumn } from "antd-table-saveas-excel/app";
import { saveAs } from 'file-saver';
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { ScxButton, ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { AlertMessages } from "../../../../common";
import { CompleteInspectionInfoProps } from "./four-point-inspection-reports";

export const LabInspectionReport: React.FC<CompleteInspectionInfoProps> = ({ irId }) => {
    const { Option } = Select;
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
    const [labInspDetails, setLabInspectionDetails] = useState<InsLabInspectionRequest>(null);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [selectedInsReqId, setSelectedInsReqId] = useState(null);
    const [searchedText, setSearchedText] = useState('');
    const [showTable, setShowTable] = useState(false)
    const fabricInspectionInfoService = new FabricInspectionInfoService();
    const data = labInspDetails?.inspectionRollDetails || [];
    const combinedData = data.reduce((acc, curr) => acc.concat(curr), []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (irId) {
            setIsLoading(true);
            getLabInspectionDetails(unitCode, companyCode, userName, userId, irId, barcodeVal);
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
        // const req = new PackListIdRequest(userName, unitCode, companyCode, userId, packListNo, InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION);
        // req.packListCode = packListNo;
        // // req.requestCategory = InspectionRequestCategoryEnum.LAB_INSPECTION;
        // service.getBatchNoByPacklistNo(req).then((res) => {
        //     if (res.status) {
        //         setBatchNumbers(res.data);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // });
    };

    const getLabInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
        if (inspReqId) {
            const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId, true);
            fabricInspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
                if (res.status) {
                    setLabInspDetails(res.data.labInsInfo)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        }
        if (rollBarcode) {
            const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.LAB_INSPECTION);
            fabricInspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
                if (res.status) {
                    setBarcodeVal('');
                    setLabInspDetails(res.data.labInsInfo)
                } else {
                    setBarcodeVal('');
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        }

    }

    const setLabInspDetails = (inspDetails: InsLabInspectionRequest) => {
        const inspectedDate: any = moment(inspDetails?.inspectionHeader?.inspectedDate);
        inspDetails.inspectionHeader.inspectedDate = inspDetails?.inspectionHeader?.inspectedDate ? inspectedDate : null;

        const expCompletedDate: any = moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt);
        inspDetails.inspectionHeader.expInspectionCompleteAt = inspDetails?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

        const startDate: any = moment(inspDetails?.inspectionHeader?.inspectionStart);
        inspDetails.inspectionHeader.inspectionStart = inspDetails?.inspectionHeader?.inspectionStart ? startDate : null;

        const completedDate: any = moment(inspDetails?.inspectionHeader?.inspectionCompleteAt);
        inspDetails.inspectionHeader.inspectionCompleteAt = inspDetails?.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

        inspDetails.inspectionHeader.inspector = inspDetails.inspectionHeader.inspector ? inspDetails.inspectionHeader.inspector : user?.userName;

        setLabInspectionDetails(inspDetails);

        setShowTable(true);

    }


    const handleSelectChange = (value) => {
        setSelectedPackListNo(value);
        getBatchNoByPacklistNo(value);
    };

    const handleBatchNumberChange = (value) => {
        setSelectedInsReqId(value);
    };

    const onFinish = () => {
        if (!selectedPackListNo || selectedPackListNo.length === 0) {
            AlertMessages.getCustomMessage('warning', 'Please select Packlist before submitting');
        } else if (!selectedInsReqId) {
            AlertMessages.getCustomMessage('warning', 'Please select Batch Number before submitting');
        } else {
            setIsLoading(true);
            getLabInspectionDetails(
                unitCode,
                companyCode,
                userName,
                userId,
                selectedInsReqId,
                barcodeVal
            );
        }
    };

    const handleExport = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        if (!labInspDetails) {
            return;
        }
        const descriptionValues = {};
        labInspDetails?.inspectionHeader?.headerAttributes.forEach((data, index) => {
            descriptionValues[data.attributeName] = data.attributeValue;
        });

        const excelData = [{ ...descriptionValues }];
        for (const dataItem of labInspDetails.inspectionRollDetails) {
            excelData.push({
                'Roll No': dataItem.externalRollNo,
                'Barcode': dataItem.barcode,
                'Lot Number': dataItem.lotNumber,
                'Roll Qty': dataItem.rollQty,
                'Supplier GSM': dataItem.sGsm,
                'Actual GSM': dataItem.gsm,
                'Variance Value': dataItem,
                'Tolerence from': dataItem.toleranceFrom,
                'Tolerence to': dataItem.toleranceTo,
                'Inspection Result': dataItem.rollInsResult,
                'Final Inspection Result': dataItem.rollFinalInsResult,
                'Remarks': dataItem.remarks
            });
        }
        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .split("-")
            .join("/");

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        worksheet['!cols'] = columns.map((col, index) => ({ wch: col.title.length }));
        const columnWidths = excelData.map(() => ({ wch: 25 }));
        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, `lab Inspection Reports-${currentDate}.xlsx`);

    };


    const columns = [
        { title: 'Roll Id', dataIndex: 'rollId', key: 'rollId' },
        { title: 'Roll No', dataIndex: 'externalRollNo', key: 'externalRollNo' },
        { title: 'Bar Code', dataIndex: 'barcode', key: 'barcode' },
        { title: 'Lot Number', dataIndex: 'lotNumber', key: 'lotNumber' },
        { title: 'Roll Qty', dataIndex: 'rollQty', key: 'rollQty' },
        { title: 'Supplier GSM', dataIndex: 'sGsm', key: 'supplierGSM' },
        { title: 'Actual GSM', dataIndex: 'gsm', key: 'actualGSM' },
        {
            title: 'Variance Value', dataIndex: 'varianceValue', key: 'varianceValue',
            render: (text, record) => { return Number(record.sGsm) - Number(record.gsm) },
        },
        { title: 'Tolerence from', dataIndex: 'toleranceFrom', key: 'tolerenceFrom' },
        { title: 'Tolerence to', dataIndex: 'toleranceTo', key: 'tolerenceTo' },
        {
            title: 'Inspection Result',
            dataIndex: 'rollInsResult',
            key: 'inspectionResult',
            render: (text) => (
                <Tag
                    color={
                        text === InsInspectionFinalInSpectionStatusEnum.FAIL
                            ? 'error'
                            : text === InsInspectionFinalInSpectionStatusEnum.PASS
                                ? 'success'
                                : 'warning'
                    }
                >
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Final Inspection Result',
            dataIndex: 'rollFinalInsResult',
            key: 'rollFinalInsResult',
            render: (text) => (
                <Tag
                    color={
                        text === InsInspectionFinalInSpectionStatusEnum.FAIL
                            ? 'error'
                            : text === InsInspectionFinalInSpectionStatusEnum.PASS
                                ? 'success'
                                : 'warning'
                    }
                >
                    {text}
                </Tag>
            ),
        },

        { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
    ];

    // const filteredData = combinedData.filter((data) =>
    //     data.externalRollNo.toString().toLowerCase().includes(searchedText.toLowerCase())
    // );
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
                <div>
                    <Spin spinning={isLoading} size="large">
                        {!irId && (
                            <Form onFinish={onFinish}>
                                <ScxRow>
                                    <ScxColumn span={8}>
                                        <Form.Item label='Select Packing List'>
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
                </div>
                <br />
                <div >
                    <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>GSM Inspection</h1>
                    <Descriptions bordered >
                        {labInspDetails?.inspectionHeader?.headerAttributes.map((data, index) => (
                            <Descriptions.Item key={index} label={<b>{InsInspectionHeaderAttributesDisplayValues[data.attributeName]}</b>}>
                                {data.attributeValue}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </div>
                <br />
                {showTable && <>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Input.Search
                            placeholder="Enter Roll No"
                            allowClear
                            value={searchedText}
                            onChange={(e) => setSearchedText(e.target.value)}
                            onSearch={(value) => setSearchedText(value)}
                            style={{ width: 200, marginBottom: '15px' }}
                        />
                    </div>
                    <div title="Roll level inspection">
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            size="middle"
                        />
                    </div>
                </>}
            </ScxCard>
        </>
    )
}