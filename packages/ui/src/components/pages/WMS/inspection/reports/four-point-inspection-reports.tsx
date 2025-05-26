import { ExportOutlined } from "@ant-design/icons"
import { InsBasicInspectionRequest, InsInspectionFinalInSpectionStatusEnum, InsFabricInspectionRequestCategoryEnum, InsIrIdRequest, PackListIdRequest, InsRollBarcodeInspCategoryReq, InsInspectionHeaderAttributesDisplayValues } from "@xpparel/shared-models"
import { FabricInspectionInfoService, InspectionReportsService } from "@xpparel/shared-services"
import { Button, Descriptions, Form, Input, Select, Spin, Table, Tag } from "antd"
import { saveAs } from 'file-saver'
import moment from "moment"
import { useAppSelector } from "packages/ui/src/common"
import { ScxButton, ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib"
import { useEffect, useState } from "react"
import * as XLSX from 'xlsx'
import { AlertMessages } from "../../../../common"
// import { CompleteInspectionInfoProps } from "./shade-inspection-reports";
export interface CompleteInspectionInfoProps {
    irId: number;
}

export const FourPointInspectionReports: React.FC<CompleteInspectionInfoProps> = ({ irId }) => {
    console.log('FourPointInspectionReports',irId);
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
    // const inspectionService = new InspectionService();
    const [fourPointInspectionDetails, setFourPointInspectionDetails] = useState<InsBasicInspectionRequest>(null);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [selectedInsReqId, setSelectedInsReqId] = useState(null);
    const [searchedText, setSearchedText] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const data = fourPointInspectionDetails?.inspectionRollDetails || [];
    const [isLoading, setIsLoading] = useState(false);
    const fabricInspectionInfoService=new FabricInspectionInfoService();

    useEffect(() => {
        if (irId) {
            setIsLoading(true);
            getFourPointInspectionDetails(unitCode,companyCode,userName,userId,irId,barcodeVal);
        } else {
            getPacklistData();
        }
    }, [irId])

    const getPacklistData = () => {
        service.packListNumbersDropDown().then((res) => {
            if (res.status) {
                setPackListData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })
    }

    const getBatchNoByPacklistNo = (packListNo) => {
        // const req = new PackListIdRequest(userName, unitCode, companyCode, userId ,packListNo,InsFabricInspectionRequestCategoryEnum.INSPECTION);
        // // req.packListCode = packListNo;
        // // req.requestCategory = InspectionRequestCategoryEnum.INSPECTION;
        // service.getBatchNoByPacklistNo(req).then((res) => {
        //     if (res.status) {
        //         setBatchNumbers(res.data);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // });

        console.log('packListNo',packListNo);
    };

    const handleSelectChange = (value) => {
        setSelectedPackListNo(value);
        getBatchNoByPacklistNo(value);
    };

    const getFourPointInspectionDetailsForRoll = (e) => {
        console.log(e);
        const rollBarcode = e;
        setBarcodeVal(rollBarcode);
        return getFourPointInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
    }

    const getFourPointInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
        if (inspReqId) {
            console.log('coming here');
            const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId,true);
            fabricInspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
                if (res.status) {
                    modifyAndSetInspectionData(res.data.basicInsInfo);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        } else if (rollBarcode) {
            const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.INSPECTION);
            fabricInspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
                if (res.status) {
                    setBarcodeVal('');
                    modifyAndSetInspectionData(res.data.basicInsInfo);
                } else {
                    setBarcodeVal('');
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        }
    };


    const modifyAndSetInspectionData = (inspDetails: InsBasicInspectionRequest) => {
        const inspectedDate: any = moment(inspDetails?.inspectionHeader?.inspectedDate);
        inspDetails.inspectionHeader.inspectedDate = inspDetails?.inspectionHeader?.inspectedDate ? inspectedDate : null;

        const expCompletedDate: any = moment(inspDetails?.inspectionHeader?.expInspectionCompleteAt);
        inspDetails.inspectionHeader.expInspectionCompleteAt = inspDetails?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;

        const startDate: any = moment(inspDetails?.inspectionHeader?.inspectionStart);
        inspDetails.inspectionHeader.inspectionStart = inspDetails?.inspectionHeader?.inspectionStart ? startDate : null;

        const completedDate: any = moment(inspDetails?.inspectionHeader?.inspectionCompleteAt);
        inspDetails.inspectionHeader.inspectionCompleteAt = inspDetails?.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

        inspDetails.inspectionHeader.inspector = inspDetails.inspectionHeader.inspector ? inspDetails.inspectionHeader.inspector : user?.userName;
        setFourPointInspectionDetails(old => inspDetails);
        setShowSearch(true);

        const totalNoOfRolls = inspDetails.inspectionRollDetails.length;
        const totalInspOpenRolls = inspDetails.inspectionRollDetails.filter(eachRoll => eachRoll.rollInsResult == InsInspectionFinalInSpectionStatusEnum.OPEN);
        const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
        const percentage = Math.ceil((totalInspRolls / totalNoOfRolls) * 100);
    }

    const handleBatchNumberChange = (value) => {
        // if (value === "selectAll") {
        //     const allBatchNumbers = batchNumbers.map((data) => data.inspReqId);
        //     console.log(batchNumbers,'all batches records')
        //     setSelectedInsReqId(allBatchNumbers);
        // } else {
        // }
        setSelectedInsReqId(value);
    };

    const onFinish = () => {
        if (!selectedPackListNo || selectedPackListNo.length === 0) {
            AlertMessages.getCustomMessage('warning', 'Please select Packlist before submitting');
        } else if (!selectedInsReqId) {
            AlertMessages.getCustomMessage('warning', 'Please select Batch Number before submitting');
        } else {
            setIsLoading(true);
            getFourPointInspectionDetails(
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

        if (!fourPointInspectionDetails) {
            return;
        }
        const descriptionValues = {};
        fourPointInspectionDetails?.inspectionHeader?.headerAttributes.forEach((data, index) => {
            descriptionValues[data.attributeName] = data.attributeValue;
        });

        const excelData = [{...descriptionValues}];
        for (const dataItem of fourPointInspectionDetails.inspectionRollDetails) {
            excelData.push({
                'Roll No': dataItem.rollId,
                'Barcode': dataItem.barcode,
                'Lot Number': dataItem.lotNumber,
                'Roll Qty': dataItem.rollQty,
                'Inspection Result': dataItem.rollInsResult,
                'Final Inspection Result': dataItem.rollFinalInsResult,
                'Roll length(yard)': dataItem,
                'Roll width(inch)': dataItem,
                'Roll length(mtr)': dataItem.rollQty,
                'Roll width(cm)': dataItem.measuredRollWidth,
                'Result': dataItem,
                'Suggestion': dataItem,
            });
            for (const fourPointData of dataItem.fourPointInspection) {
                excelData.push({
                    'At Meter': fourPointData.atMeter,
                    'Reason': fourPointData.reason,
                    'Four Points': fourPointData.points,
                    'Final Points': fourPointData.points,
                    'Remarks': fourPointData.remarks,
                })
            }
        }
        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .split("-")
            .join("/");

        const columns = [
            {
                title: 'Roll No',
                dataIndex: 'rollId',
                key: 'rollId',
            },
            {
                title: 'Barcode',
                dataIndex: 'barcode',
                key: 'barcode',
            },
            {
                title: 'Lot Number',
                dataIndex: 'lotNumber',
                key: 'lotNumber',
            },
            {
                title: 'Roll Qty',
                dataIndex: 'rollQty',
                key: 'rollQty',
            },
            {
                title: 'Inspection Result',
                dataIndex: 'rollInsResult',
                key: 'rollInsResult',
            },
            {
                title: 'Final Inspection Result',
                dataIndex: 'rollFinalInsResult',
                key: 'rollFinalInsResult',
            },
            {
                title: 'At Meter',
                dataIndex: 'atMeter',
                key: 'atMeter',
            },
            {
                title: 'Reason',
                dataIndex: 'reason',
                key: 'reason',
            },
            {
                title: 'Four Points',
                dataIndex: 'points',
                key: 'points',
            },
            {
                title: 'Final Points',
                dataIndex: 'points',
                key: 'finalPoints',
            },
            {
                title: 'Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
                title: 'Roll length(yard)',
                dataIndex: 'rollLengthYard',
                key: 'rollLengthYard',
            },
            {
                title: 'Roll width(inch)',
                dataIndex: 'rollWidthInch',
                key: 'rollWidthInch',
            },
            {
                title: 'Roll length(mtr)',
                dataIndex: 'rollLengthMeter',
                key: 'rollLengthMeter',
            },
            {
                title: 'Roll width(cm)',
                dataIndex: 'measuredRollWidth',
                key: 'measuredRollWidth',
            },
            {
                title: 'Result',
                dataIndex: 'result',
                key: 'result',
            },
            {
                title: 'Suggestion',
                dataIndex: 'suggestion',
                key: 'suggestion',
            },
        ];
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        worksheet['!cols'] = columns.map((col, index) => ({ wch: col.title.length }));
        const columnWidths = excelData.map(() => ({ wch: 20 }));
        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, `four point Inspection Reports-${currentDate}.xlsx`);
    };


    const columns = [
        {
            title: 'At Meter',
            dataIndex: 'atMeter',
            key: 'atMeter',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Four Points',
            dataIndex: 'points',
            key: 'points',
        },
        {
            title: 'Final Points',
            dataIndex: 'points',
            key: 'points',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
    ];

    // const filteredData = fourPointInspectionDetails?.inspectionRollDetails?.filter(data =>
    //     data.externalRollNo?.toString()?.toLowerCase()?.includes(searchedText?.toLowerCase())
    // );  
    const filteredData=fourPointInspectionDetails?.inspectionRollDetails


    console.log('ddd',fourPointInspectionDetails?.inspectionRollDetails);
    console.log('filteredData',filteredData);
    return (
        <>
            <ScxCard extra={
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
                                                placeholder='Select Packing List'
                                                style={{ width: '200px' }}
                                                filterOption={(input, option) => {
                                                    const label = option?.label;
                                                    if (typeof label === 'string') {
                                                        return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                                    }
                                                    return false;
                                                }}
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
                                                placeholder="Select Batch Numbers"
                                                style={{ width: '200px' }}
                                                onChange={(value) => handleBatchNumberChange(value)}
                                                filterOption={(input, option) => {
                                                    const label = option?.label;
                                                    if (typeof label === 'string') {
                                                        return label.toLowerCase().includes(input.toLowerCase());
                                                    }
                                                    return false;
                                                }}
                                                disabled={!selectedPackListNo}
                                            >
                                            {/* <Option key="selectAll" value="selectAll" label="Select All">
                                            Select All
                                            </Option> */}                                                {batchNumbers?.map((data) => (
                                                    <Option key={data.batchNumber} value={data.insReqId} label={data.batchNumber.toString()}>
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
                    <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>Four Point Inspection</h1>
                    <Descriptions bordered >
                        {fourPointInspectionDetails?.inspectionHeader?.headerAttributes.map((data, index) => (
                            <Descriptions.Item key={index} label={<b>{InsInspectionHeaderAttributesDisplayValues[data.attributeName]}</b>}>
                                {data.attributeValue}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </div>
                <br />
                {showSearch &&
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Input.Search placeholder="Enter Roll No" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, marginBottom: '15px' }} />
                    </div>
                }

                <div>
                    {filteredData?.map((data, index) => (
                        <div key={index}>
                            <Descriptions bordered>
                                <Descriptions.Item label={<b>Roll No</b>}>{data.rollId}</Descriptions.Item>
                                <Descriptions.Item label={<b>Roll Barcode</b>}>{data.barcode}</Descriptions.Item>
                                <Descriptions.Item label={<b>Shade</b>}>{data.sShade}</Descriptions.Item>
                                <Descriptions.Item label="Roll length(yard)">{100}</Descriptions.Item>
                                <Descriptions.Item label="Roll width(inch)">{100}</Descriptions.Item>
                                <Descriptions.Item label="Roll length(mtr)">{data.rollQty}</Descriptions.Item>
                                <Descriptions.Item label="Roll width(cm)">{data.measuredRollWidth}</Descriptions.Item>
                                <Descriptions.Item label="Result">{''}</Descriptions.Item>
                                <Descriptions.Item label="Suggestion">{''}</Descriptions.Item>
                                <Descriptions.Item label={<b>Inspection Result</b>}><Tag
                                    color={
                                        data.rollInsResult === InsInspectionFinalInSpectionStatusEnum.FAIL
                                            ? "error"
                                            : data.rollInsResult === InsInspectionFinalInSpectionStatusEnum.PASS
                                                ? "success"
                                                : "warning"
                                    }
                                >
                                    {data.rollInsResult}
                                </Tag></Descriptions.Item>
                                <Descriptions.Item label={<b>Final Inspection Result</b>}>  <Tag
                                    color={
                                        data.rollFinalInsResult === InsInspectionFinalInSpectionStatusEnum.FAIL
                                            ? "error"
                                            : data.rollFinalInsResult === InsInspectionFinalInSpectionStatusEnum.PASS
                                                ? "success"
                                                : "warning"
                                    }
                                >
                                    {data.rollFinalInsResult}
                                </Tag>
                                </Descriptions.Item>
                            </Descriptions>

                            <Table
                                columns={columns}
                                dataSource={data.fourPointInspection}
                                pagination={false}
                                size="middle"
                            />
                        </div>
                    ))}
                </div>
            </ScxCard >
        </>
    )
}


