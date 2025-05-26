import { ExportOutlined } from "@ant-design/icons";
import { InsFabricInspectionRequestCategoryEnum, InsInspectionStatusEnum, InsIrIdRequest, PackListIdRequest, InsRollBarcodeInspCategoryReq, InsShadeInspectionRequest, InsInspectionActivityStatusEnum, InsInspectionFinalInSpectionStatusEnum, InsInspectionHeaderAttributesDisplayValues } from "@xpparel/shared-models";
import { FabricInspectionInfoService, InspectionReportsService, } from "@xpparel/shared-services";
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
import { InspectionStatusEnum } from "packages/libs/shared-models/src/wms/enum/inspection-status.enum";




export const ShadeInspectionReport: React.FC<CompleteInspectionInfoProps> = ({ irId }) => {
    const { Option } = Select;
    const user = useAppSelector((state) => state.user.user.user);
    const unitCode = user?.orgData?.unitCode;
    const companyCode = user?.orgData?.companyCode;
    const userId = user?.userId;
    const userName = user?.userName;
    const rollBarcode = user?.rollBarcode;
    const [packListData, setPackListData] = useState<any>();
    const [shadeInspDetails, setShadeInspectionDetails] = useState<InsShadeInspectionRequest>(null);
    const [batchNumbers, setBatchNumbers] = useState<any>();
    const [selectedPackListNo, setSelectedPackListNo] = useState(null);
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [searchedText, setSearchedText] = useState("")
    const [selectedInsReqId, setSelectedInsReqId] = useState(null);
    const [showTable, setShowTable] = useState(false);

    // const service = new InspectionReportsService();
    // const inspectionService = new InspectionService();
 const fabricInspectionInfoService=new FabricInspectionInfoService();
    const data = shadeInspDetails?.inspectionRollDetails || [];
    const combinedData = data.reduce((acc, curr) => acc.concat(curr), []);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
         
        if(irId)
        {
            setIsLoading(true);
            getShadeLevelInspectionDetails(unitCode,companyCode,userName,userId,irId,barcodeVal);
        }
        else {
         getPacklistData();
        }
    }, [irId])

    const getPacklistData = () => {
        // service.packListNumbersDropDown().then((res) => {
        //     if (res.status) {
        //         setPackListData(res.data)
        //     }
        //     else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // })
    }

    const getBatchNoByPacklistNo = (packListNo) => {
        // const req = new PacklistIdReq(userName, unitCode, companyCode, userId, packListNo, InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION);
        // // req.packListCode = packListNo;
        // // req.requestCategory = InspectionRequestCategoryEnum.SHADE_SEGREGATION;
        // service.getBatchNoByPacklistNo(req).then((res) => {
        //     if (res.status) {
        //         setBatchNumbers(res.data);
        //     } else {
        //         AlertMessages.getErrorMessage(res.internalMessage);
        //     }
        // });
    };

    const handleSelectChange = (value) => {
        setSelectedPackListNo(value);
        getBatchNoByPacklistNo(value);
    };

    const getShadeLevelInspDetailsByRollBarcode = (e) => {
        console.log(e);
        const rollBarcode = e;
        return getShadeLevelInspectionDetails(user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userName, user?.userId, null, rollBarcode);
    }


    const getShadeLevelInspectionDetails = (unitCode: string, companyCode: string, userName: string, userId: number, inspReqId: number, rollBarcode: string) => {
        if (inspReqId) {
            console.log('coming here');
            const reqObj = new InsIrIdRequest(userName, unitCode, companyCode, userId, inspReqId,true);
            fabricInspectionInfoService.getInspectionDetailsForRequestId(reqObj, true).then((res) => {
                if (res.status) {
                    setInspectionData(res.data.shadeInsInfo);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        }
        if (rollBarcode) {
            const reqObj = new InsRollBarcodeInspCategoryReq(userName, unitCode, companyCode, userId, rollBarcode, InsFabricInspectionRequestCategoryEnum.SHADE_SEGREGATION);
            fabricInspectionInfoService.getInspectionDetailForRollIdAndInspCategory(reqObj, true).then((res) => {
                if (res.status) {
                    setBarcodeVal('');
                    setInspectionData(res.data.shadeInsInfo);
                } else {
                    setBarcodeVal('');
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setIsLoading(false);
            });
        }
    }

    const shadeRollQtyMap = new Map<string, Map<number, number>>();
    shadeInspDetails?.inspectionRollDetails?.forEach((eachRoll) => {
        if (eachRoll.shade) {
            if (!shadeRollQtyMap.has(eachRoll.shade)) {
                shadeRollQtyMap.set(eachRoll.shade, new Map<number, number>());
            }
            if (!shadeRollQtyMap.get(eachRoll.shade).has(eachRoll.rollId)) {
                shadeRollQtyMap.get(eachRoll.shade).set(eachRoll.rollId, eachRoll.rollQty)
            }
        }
    });

    const setInspectionData = (inspData: InsShadeInspectionRequest) => {
        const inspectedDate: any = moment(inspData.inspectionHeader?.inspectedDate);
        inspData.inspectionHeader.inspectedDate = inspData.inspectionHeader?.inspectedDate ? inspectedDate : null;

        const expCompletedDate: any = moment(inspData?.inspectionHeader?.expInspectionCompleteAt);
        inspData.inspectionHeader.expInspectionCompleteAt = inspData?.inspectionHeader?.expInspectionCompleteAt ? expCompletedDate : null;;

        const startDate: any = moment(inspData.inspectionHeader?.inspectionStart);
        inspData.inspectionHeader.inspectionStart = inspData.inspectionHeader?.inspectionStart ? startDate : null;

        const completedDate: any = moment(inspData.inspectionHeader?.inspectionCompleteAt);
        inspData.inspectionHeader.inspectionCompleteAt = inspData.inspectionHeader?.inspectionCompleteAt ? completedDate : null;

        inspData.inspectionHeader.inspector = inspData.inspectionHeader.inspector ? inspData.inspectionHeader.inspector : user?.userName;

        setShadeInspectionDetails(inspData);

        setShowTable(true)

        const totalNoOfRolls = inspData.inspectionRollDetails.length;
        const totalInspOpenRolls = inspData.inspectionRollDetails.filter(eachRoll => eachRoll.inspectionStatus === InsInspectionActivityStatusEnum.OPEN);
        const totalInspRolls = totalNoOfRolls - totalInspOpenRolls.length;
    }

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
            getShadeLevelInspectionDetails(
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

        if (!shadeInspDetails) {
            return;
        }

        const descriptionValues = {};
        shadeInspDetails?.inspectionHeader?.headerAttributes.forEach((data, index) => {
            descriptionValues[data.attributeName] = data.attributeValue;
        });

        const excelData = [{ ...descriptionValues }];
        for (const dataItem of shadeInspDetails.inspectionRollDetails) {
            excelData.push({
                'Roll Id': dataItem.rollId,
                'Roll No': dataItem.externalRollNo,
                'Barcode': dataItem.barcode,
                'Lot Number': dataItem.lotNumber,
                'Roll Qty': dataItem.rollQty,
                'Shade ': dataItem.shade,
                'Inspection Result': dataItem.rollInsResult,
                'Final Inspection Result': dataItem.rollFinalInsResult,
                'Remarks':dataItem.remarks
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

        saveAs(blob, `shade Inspection Reports-${currentDate}.xlsx`);

    };

    const columns = [
        {
            title: 'Roll Id',
            dataIndex: 'rollId',
            key: 'rollId',
        },
        {
            title: 'Roll No',
            dataIndex: 'externalRollNo',
            key: 'externalRollNo',
        },
        {
            title: 'Bar Code',
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
            title: 'Shade',
            dataIndex: 'shade',
            key: 'shade',
        },
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
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
    ];

    // const filteredData = shadeInspDetails?.inspectionRollDetails.filter(data =>
    //     data.externalRollNo?.toString()?.toLowerCase()?.includes(searchedText?.toLowerCase())
    // ); 
    const filteredData = shadeInspDetails?.inspectionRollDetails


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
                                        <ScxButton type="primary" htmlType="submit">
                                            Submit
                                        </ScxButton>
                                    </ScxColumn>
                                </ScxRow>
                            </Form>
                        )}
                    </Spin>
                </div>
                <br />
                <div >
                    <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>Shade Saggregation Inspection</h1>
                    <Descriptions bordered >
                        {shadeInspDetails?.inspectionHeader?.headerAttributes.map((data, index) => (
                            <Descriptions.Item key={index} label={<b>{InsInspectionHeaderAttributesDisplayValues[data.attributeName]}</b>}>
                                {data.attributeValue}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </div>
                <br />
                {showTable &&
                    <>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Input.Search placeholder="Enter Roll No" allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, marginBottom: '15px' }} />
                        </div>
                        <ScxCard title="Roll level inspection">
                            <Table
                                columns={columns}
                                dataSource={filteredData}
                                pagination={false}
                                size="middle"
                            />
                        </ScxCard></>}
            </ScxCard>
        </>
    )
}

