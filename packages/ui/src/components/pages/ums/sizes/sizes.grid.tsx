import Icon, { DeleteOutlined, DownOutlined, EditOutlined, FileExcelOutlined, UploadOutlined, UpOutlined, SortAscendingOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Popconfirm, Spin, Table, Upload } from "antd"
import { useEffect, useState } from "react"
import { useAppSelector } from "packages/ui/src/common";
import { SizesService } from "@xpparel/shared-services";
import { CommonRequestAttrs, SizescreateRequest, sizesModel } from "@xpparel/shared-models";
import { AlertMessages } from "packages/ui/src/components/common";
import { ColumnsType } from "antd/lib/table";
import SizesForm from "./sizes.form";
import * as XLSX from "xlsx";
import { RcFile } from "antd/es/upload";

interface ExcelData {
    sizeCode: string;
    sizeDesc: string;
    sizeIndex: number;
}

export const CreateSize = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<sizesModel>();
    const service = new SizesService();
    const [resData, setResData] = useState<sizesModel[]>([]);
    const [originalData, setOriginalData] = useState<sizesModel[]>([]);
    const [sizeId, setSizeId] = useState(false);
    const [title, setTitle] = useState("Create Size");
    const [maxSizeIndex, setMaxSizeIndex] = useState<number>(0);

    useEffect(() => {
        getAllSizes();
    }, []);

    const fieldsReset = () => {
        formRef.resetFields();
    };

    const showModal = (record: sizesModel) => {
        setSizeId(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
        setOkText("Update");
        setTitle("Update Size");
    };

    const showModals = () => {
        fieldsReset();
        setSelectedRecord(null);
        setOkText("Create");
        setTitle("Create Size");
        setSizeId(false);
        setIsModalOpen(true);
    }

    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);
    }

    const getAllSizes = () => {
        if (!user?.userName || !user?.orgData?.unitCode || !user?.orgData?.companyCode) {
            AlertMessages.getErrorMessage("User or organization data is missing");
            return;
        }
        const obj = new CommonRequestAttrs(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId);

        service.getAllSizes(obj)
            .then(res => {
                if (res.status) {
                    // Sort by sizeIndex to ensure proper ordering
                    const sortedData = [...res.data].sort((a, b) => a.sizeIndex - b.sizeIndex);
                    setResData(sortedData);
                    setOriginalData(JSON.parse(JSON.stringify(sortedData)));
                    setMaxSizeIndex(Math.max(...res.data.map(item => item.sizeIndex)));
                    if (res.data.length > 0) {
                        // AlertMessages.getSuccessMessage(res.internalMessage);
                    }
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage || "Failed to fetch sizes");
                }
            })
            .catch(err => {
                AlertMessages.getErrorMessage(err.message || "An error occurred while fetching sizes");
            });
    }

    const handleOk = () => {
        formRef.validateFields()
            .then(values => {
                const req = new SizescreateRequest(
                    user?.userName,
                    user?.orgData?.unitCode,
                    user?.orgData?.companyCode,
                    user?.userId,
                    values.id,
                    values.sizeCode,
                    values.sizeDesc,
                    values.sizeIndex
                );
    
                const isAlreadyPresent = +values.sizeIndex
                    ? resData.some(a => a.sizeIndex == values.sizeIndex)
                    : false;
                    
    
                if (isAlreadyPresent && oktext=='create') {
                    Modal.confirm({
                        title: 'Index Already Exists',
                        content: `The index "${values.sizeIndex}" already exists. Are you sure you want to adjust all subsequent indexes accordingly?`,
                        okText: 'Yes, Adjust',
                        cancelText: 'No, Cancel',
                        onOk() {
                            proceedToCreateSize(req);
                        },
                    });
                } else {
                    proceedToCreateSize(req);
                }
            })
            .catch(() => {
                AlertMessages.getErrorMessage("Please fill all the required fields before creation.");
            });
    };
    const proceedToCreateSize = (req) => {
        service.createSize(req)
            .then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllSizes();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage || "Failed to create/update size");
                }
            })
            .catch(err => {
                AlertMessages.getErrorMessage(err.message || "An error occurred while creating/updating size");
            });
    };

    const deleteSize = (record: sizesModel) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this size?',
            content: `This will delete size "${record.sizeCode}" permanently.`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                const obj = new SizescreateRequest(
                    user?.userName,
                    user?.orgData?.unitCode,
                    user?.orgData?.companyCode,
                    user?.userId,
                    record.id,
                    [record.sizeCode],
                    [record.sizeDesc],
                    [record.sizeIndex]
                );

                service.deleteSize(obj)
                    .then(res => {
                        if (res.status) {
                            AlertMessages.getSuccessMessage(res.internalMessage);
                            getAllSizes();
                        } else {
                            AlertMessages.getErrorMessage(res.internalMessage || "Failed to delete size");
                        }
                    })
                    .catch(err => {
                        AlertMessages.getErrorMessage(err.message || "An error occurred while deleting size");
                    });
            },
        });
    }

    const downloadTemplate = () => {
        const headers = [["sizeIndex", "sizeCode", "sizeDesc"]];
        const worksheet = XLSX.utils.aoa_to_sheet(headers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        XLSX.writeFile(workbook, "Size_Template.xlsx");
    };

    const handleUpload = (file: RcFile) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const result = e.target?.result;
                if (!(result instanceof ArrayBuffer)) {
                    throw new Error("Failed to read file");
                }

                const data = new Uint8Array(result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData: ExcelData[] = XLSX.utils.sheet_to_json(sheet);

                if (parsedData.length === 0) {
                    AlertMessages.getErrorMessage("Invalid file or empty data.");
                    return;
                }

                // Validate data structure
                const missingFields = parsedData.some(item =>
                    !item.sizeCode || !item.sizeDesc || item.sizeIndex === undefined
                );

                if (missingFields) {
                    AlertMessages.getErrorMessage("Some rows are missing required fields (sizeCode, sizeDesc, or sizeIndex).");
                    return;
                }

                // Check for duplicate indexes
                const sizeIndexes = parsedData.map(item => item.sizeIndex);
                const hasDuplicateIndexes = sizeIndexes.length !== new Set(sizeIndexes).size;

                if (hasDuplicateIndexes) {
                    Modal.confirm({
                        title: "Duplicate Index Detected",
                        content: "There are duplicate size indexes. Do you want to proceed?",
                        onOk: () => {
                            
                            processBulkUpload(parsedData);
                        },
                        onCancel: () => {
                            return
                        }
                    });
                } else {
                    // No duplicates, proceed directly
                    processBulkUpload(parsedData);
                }
            } catch (err) {
                AlertMessages.getErrorMessage((err as Error).message || "Failed to process the file");
            }
        };

        reader.onerror = () => {
            AlertMessages.getErrorMessage("Failed to read the file");
        };

        reader.readAsArrayBuffer(file);
        return false; // Prevent default upload behavior
    };

    const processBulkUpload = (parsedData: ExcelData[]) => {
        const sizeCodes = parsedData.map(item => item.sizeCode);
        const sizeDescs = parsedData.map(item => item.sizeDesc);
        const sizeIndexes = parsedData.map(item => item.sizeIndex);

        const req = new SizescreateRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            undefined,
            sizeCodes,
            sizeDescs,
            sizeIndexes
        );

        service.createSize(req)
            .then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    getAllSizes();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage || "Failed to create size");
                }
            })
            .catch(err => {
                AlertMessages.getErrorMessage(err.message || "An error occurred while creating size");
            });
    };

    const sizeColumns: ColumnsType<sizesModel> = [
        {
            title: 'Size Index',
            dataIndex: 'sizeIndex',
            align: 'center',
            key: 'sizeIndex',
            sorter: (a, b) => a.sizeIndex - b.sizeIndex,
        },
        {
            title: 'Size Code',
            dataIndex: 'sizeCode',
            align: 'center',
            key: 'sizeCode',
        },
        {
            title: 'Size Description',
            dataIndex: 'sizeDesc',
            align: 'center',
            key: 'sizeDesc',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (_, record, index) => (
                <>
                    <Button
                        size="small"
                        icon={<UpOutlined />}
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                    />
                    <Button
                        size="small"
                        icon={<DownOutlined />}
                        disabled={index === resData.length - 1}
                        onClick={() => handleMoveDown(index)}
                    />
                    <Divider type="vertical" />
                    <EditOutlined
                        style={{ color: "blue", fontSize: "20px", cursor: "pointer" }}
                        onClick={() => showModal(record)}
                    />
                    <Divider type="vertical" />
                    <DeleteOutlined
                        style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                        onClick={() => deleteSize(record)}
                    />
                </>
            )
        }
    ];

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newData = [...resData];

        // Swap the items
        [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];

        // Swap their sizeIndex values too
        const tempIndex = newData[index].sizeIndex;
        newData[index].sizeIndex = newData[index - 1].sizeIndex;
        newData[index - 1].sizeIndex = tempIndex;

        setResData(newData);
    };
    const handleMoveDown = (index: number) => {
        if (index === resData.length - 1) return;
        const newData = [...resData];

        // Swap the items
        [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];

        // Swap their sizeIndex values too
        const tempIndex = newData[index].sizeIndex;
        newData[index].sizeIndex = newData[index + 1].sizeIndex;
        newData[index + 1].sizeIndex = tempIndex;

        setResData(newData);
    };

    // New function to normalize the sequence (1,2,3,5 becomes 1,2,3,4)
    const handleNormalizeSequence = () => {


        // Show confirmation message
        Modal.confirm({
            title: "Sequence Normalized",
            content: "Size indexes have been normalized to sequential numbers. Click 'Save Sequence' to save these changes to the database.",
            onOk: () => {
                const newData = [...resData];

                newData.forEach((item, idx) => {
                    item.sizeIndex = idx + 1;
                });
        
                setResData(newData);
            },
            onCancel: () => {
                return
            }
        });
    };

    const handleSaveSequence = () => {
        // Save the current order with their current sizeIndex values
        const updatedRecords = resData.map(item => ({
            id: item.id,
            sizeCode: item.sizeCode,
            sizeDesc: item.sizeDesc,
            sizeIndex: item.sizeIndex, // Keep the existing index values
            companyCode: user?.orgData?.companyCode,
            unitCode: user?.orgData?.unitCode,
            username: user?.userName,
            userId: user?.userId,
        }));

        service.saveSizeIndex(updatedRecords)
            .then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage("Size index order saved successfully.");
                    getAllSizes(); // Refresh data to ensure consistent state
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage || "Failed to save size index order");
                }
            })
            .catch(err => {
                AlertMessages.getErrorMessage(err.message || "An error occurred while saving size index order");
            });
    };

    // Function to check if the sequence has been modified
    const isSequenceModified = () => {
        if (resData.length !== originalData.length) return true;
    
        for (let i = 0; i < resData.length; i++) {
            if (
                resData[i].id !== originalData[i].id ||
                resData[i].sizeIndex !== originalData[i].sizeIndex
            ) {
                return true;
            }
        }
    
        return false;
    };
    
    // Function to detect if indexes are not sequential
    const hasNonSequentialIndexes = () => {
        const indexes = [...resData].sort((a, b) => a.sizeIndex - b.sizeIndex)
            .map(item => item.sizeIndex);

        for (let i = 0; i < indexes.length; i++) {
            // Check if the current index is not equal to i+1 (first should be 1, second 2, etc.)
            if (indexes[i] !== i + 1) {
                return true;
            }
        }

        return false;
    };

    return (
        <Card
            title='Sizes'
            extra={
                <>
                    <Button onClick={showModals} type="primary">Create</Button>
                    <Divider type="vertical" />
                    <Upload
                        beforeUpload={handleUpload}
                        accept=".xlsx,.xls"
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    <Divider type="vertical" />
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={downloadTemplate}
                    >
                        Download Template
                    </Button>
                </>
            }
        >
            <Modal
                cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                title={title}
                style={{ textAlign: "center" }}
                open={isModalOpen}
                okText={oktext}
                onCancel={onClose}
                onOk={handleOk}
                cancelText="Close"
            >
                <SizesForm
                    formRef={formRef}
                    initialvalues={selectedRecord}
                    key={selectedRecord?.id}
                    sizeId={sizeId}
                    maxSizeIndex={maxSizeIndex}
                />
            </Modal>

            <Table
                dataSource={resData}
                columns={sizeColumns}
                rowKey="id"
                size="small"
                bordered
                scroll={{x: 'max-content'}}
                style={{minWidth: '100%'}}
            />

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {hasNonSequentialIndexes() && (
                    <Button
                        type="default"
                        icon={<SortAscendingOutlined />}
                        onClick={handleNormalizeSequence}
                        disabled={resData.length === 0}
                    >
                        Fix Sequence
                    </Button>
                )}

                <Button
                    type="primary"
                    onClick={handleSaveSequence}
                    disabled={resData.length === 0 || !isSequenceModified()}
                >
                    Save Sequence
                </Button>
            </div>
        </Card>
    );
};

export default CreateSize;