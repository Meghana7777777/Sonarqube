import { ActualMarkerModel, DocMaterialAllocationModel, DocMaterialAllocationRequest, DocRollsRequest, DocketBasicInfoModel, MaterialRequestNoRequest, PO_PoSerialRequest, PoDocketGroupRequest, PoDocketNumberRequest, PoSummaryModel, SaleOrderItemRequest, StockCodesRequest, StockObjectInfoModel, StockRollInfoModel } from '@xpparel/shared-models';
import { CutOrderService, DocketMaterialServices, PackingListService } from '@xpparel/shared-services';
import { Button, Card, Checkbox, Col, Descriptions, Divider, Form, Input, InputNumber, Row, Select, Table, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { returnZeroIfNaN, useAppSelector } from '../../../../common';
import { AlertMessages, calculateMaterialRequirement } from '../../../common';
import AllocatedRolls from './allocated-rolls';
import { stockRollInfoModelColumns, IDocMaterialAllocationColumns } from './material-allocation-columns';
import { IDisplayDocketInfo } from './interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { CustomColumn } from 'packages/ui/src/schemax-component-lib';
import FabricCodeQuantities from '../../OMS/order-manipulation/fabric-code-quantites';

interface IAllocationPopUpProps {
    selectedPo: number,
    closeMaterialAllocation: (isException: boolean) => void;
    selectedDocketRecord: IDisplayDocketInfo
}
const { Option } = Select;
type aaa = StockObjectInfoModel & { checkbox: boolean, allocatingQuantity: number }
export const AllocationPopUp = (props: IAllocationPopUpProps) => {
    const { selectedPo, selectedDocketRecord, closeMaterialAllocation } = props;
    const [openStockInRolls, setOpenStockInRolls] = useState<aaa[]>([]);
    const [currentAllocatedQty, setCurrentAllocatedQty] = useState(0);
    const [previousAllocatedQty, setPreviousAllocatedQty] = useState(0);
    const [allocatedRollsData, setAllocatedRollsData] = useState<DocMaterialAllocationModel[]>([]);
    const [markerValues, setMarkerValues] = useState<ActualMarkerModel>(null);
    const [formRef] = Form.useForm();
    const [requiredQuantity, setRequiredQuantity] = useState(0);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const packlistService = new PackingListService()
    const [fabricCodeData, setFabricCodedata] = useState([])
    const user = useAppSelector((state) => state.user.user.user);
    const docketMaterialServices = new DocketMaterialServices();
    const processingOrderService =  new CutOrderService()
    useEffect(() => {
        getStockForGivenPoItemCode(selectedPo, selectedDocketRecord.itemCode)
        // TODO:CUT
        // const stockCodesRequest = new StockCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDocketRecord.itemCode, [], [], selectedPo.orderRefNo
        // );
        // getInStockRollsForItemCode(stockCodesRequest);
        // TODO:CUT
        // getSoItemQty(stockCodesRequest.saleOrderCode);
        getDocketMaterialRequests();
        getActualMarkerForDocketGroup();
    }, []);
    // Calculation for required quantity by using actual marker length
    useEffect(() => {
        calculateRequiredQuantity();
    }, [formRef.getFieldValue('aMarkerLength')]);


    const getStockForGivenPoItemCode = (processingSerial: number, itemCode: string) => {
        const poSerialReq = new PO_PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, null)
        processingOrderService.getMoInfoByProcessingSerial(poSerialReq).then((res) => {
            if (!res.status) {
                AlertMessages.getErrorMessage(res.internalMessage);
                return
            };
            const moInfoOfPoSerial = res.data;
            const stockCodesRequest = new StockCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDocketRecord.itemCode, [], [], moInfoOfPoSerial[0].moNo.split(',')
            );
            console.log(stockCodesRequest);
            getInStockRollsForItemCode(stockCodesRequest);
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message)
        })
    }


    // Calculation for required quantity by using actual marker length
    const calculateRequiredQuantity = () => {
        const { plies, cutWastage, bindReqWithOutWastage } = selectedDocketRecord;
        const aMarkerLength = formRef.getFieldValue('aMarkerLength') || 0;
        const calculatedQuantity = calculateMaterialRequirement(plies,cutWastage,aMarkerLength,bindReqWithOutWastage);
        setRequiredQuantity(calculatedQuantity);
        // reset checked boxes after changing the Actual Marker Length
        resetCheckboxes();
    };

    // reset checked boxes after changing the Actual Marker Length
    const resetCheckboxes = () => {
        const updatedOpenStock = openStockInRolls.map(item => ({
            ...item,
            checkbox: false,
            allocatingQuantity: undefined
        }));
        setOpenStockInRolls(updatedOpenStock);
        setCurrentAllocatedQty(0);
    };

    const getActualMarkerForDocketGroup = () => {
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedPo, selectedDocketRecord.docketGroup, true, false, null);
        docketMaterialServices.getActualMarkerByDocketGroup(req).then(res => {
            // if the actual marker is present, then update the default values and make readonly
            if (res.status) {
                setMarkerValues(res.data[0]);
                const amInfo = res.data[0];
                if (amInfo) {
                    formRef.setFieldValue("aMarkerName", amInfo.markerName);
                    formRef.setFieldValue("aMarkerWidth", amInfo.markerWidth);
                    formRef.setFieldValue("aMarkerLength", amInfo.markerLength);
                }
            } else {
                setMarkerValues(null);
            }
        }).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });;
    }

    const getDocketMaterialRequests = () => {
        // CORRECT
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedPo, selectedDocketRecord.docketGroup, true, false, null);
        docketMaterialServices.getDocketMaterialRequests(req).then((res => {
            if (res.status) {
                // TODO: Added for bug fix
                if (res.data?.length == 0) {
                    // TODO: Added for bug fix
                    setPreviousAllocatedQty(0);
                }
                setAllocatedRollsData(res.data);
                let prevAllocatedQty = 0;
                for (const eachReq of res.data) {
                    prevAllocatedQty += eachReq.rollsInfo.reduce((pre, current) => {
                        return pre + Number(current.allocatedQuantity)
                    }, 0);
                    setPreviousAllocatedQty(prevAllocatedQty);
                }
                // after everytime we do this, set the current alocation qty to 0 as we have either saved/deleted the mat request
                // TODO: Added for bug fix
                setCurrentAllocatedQty(0);
            } else {
                // TODO: Added for bug fix
                setPreviousAllocatedQty(0);
                setAllocatedRollsData([]);
                AlertMessages.getErrorMessage(res.internalMessage);
                closeMaterialAllocation(true);
            }
        })).catch(error => {
            setAllocatedRollsData([]);
            AlertMessages.getErrorMessage(error.message);
            closeMaterialAllocation(true);
        });
    }


    const getInStockRollsForItemCode = (req: StockCodesRequest) => {
        docketMaterialServices.getAvailableRollsForItemCode(req).then((res) => {
            if (res.status) {
                // TODO:CUT
                setOpenStockInRolls(res.data.map(rec => {
                    // rec.leftOverQuantity = (Number(rec.originalQty) - Number(rec.issuedQuantity));
                    let checkBoxEnableLogic = true;
                    // console.log(rec.leftOverQuantity+);
                    if (Number(rec.leftOverQuantity) == 0) {
                        checkBoxEnableLogic = false;
                    }
                    return {
                        ...rec,
                        checkbox: false,
                        allocatingQuantity: undefined
                    }
                }));
            } else {

                AlertMessages.getErrorMessage(res.internalMessage);
                closeMaterialAllocation(true);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            closeMaterialAllocation(true);
        });
    };

    const createDocketMaterialRequest = () => {
        // TODO: Added for bug fix
        const selectedRolls: DocRollsRequest[] = [];
        const checkedRolls = openStockInRolls.filter(rec => rec?.checkbox === true);
        for (const filteredRec of checkedRolls) {
            if (filteredRec.allocatingQuantity <= 0) {
                AlertMessages.getErrorMessage(`You are trying to allocate 0 quantity for the Roll : ${filteredRec.barcode}`);
                return;
            }
            selectedRolls.push(new DocRollsRequest(filteredRec.objectId, filteredRec.barcode, filteredRec.allocatingQuantity));
        }
        // safe validation
        if (selectedRolls?.length == 0) {
            AlertMessages.getErrorMessage(`You are trying to allocate 0 quantity`);
            return;
        }
        // TODO: Added for bug fix -- ENDS
        let defaultPreviousAllocatedQty = 0;
        for (const eachReq of allocatedRollsData) {
            defaultPreviousAllocatedQty += eachReq.rollsInfo.reduce((pre, current) => {
                return pre + Number(current.allocatedQuantity)
            }, 0);
        }
        // Determine the comparison required quantity based on aMarkerLength
        const aMarkerLength = formRef.getFieldValue('aMarkerLength');
        const comparisonRequiredQuantity = aMarkerLength
            ? Number(requiredQuantity || 0)
            : Number(selectedDocketRecord.materialRequirement || 0);

        if (returnZeroIfNaN(Number(defaultPreviousAllocatedQty + currentAllocatedQty)) > returnZeroIfNaN(comparisonRequiredQuantity)) {
            AlertMessages.getErrorMessage(`You are trying to allocate more than ${aMarkerLength ? 'the required' : 'the docket requirement'} quantity`);
            return;
        }
        // CORRECT
        // formRef.validateFields().then(values => {
        //     const record = Object.values(values).filter((rec) => rec !== undefined)
        //     if (record.length) {
        //         if (record.length !== 3) {
        //             AlertMessages.getErrorMessage('Please fill the markers data')
        //             return
        //         }
        //     }
        // })
        const req = new DocMaterialAllocationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedPo, selectedRolls, null, selectedDocketRecord.docketGroup,
            formRef.getFieldValue('aMarkerName'), formRef.getFieldValue('aMarkerWidth'), formRef.getFieldValue('aMarkerLength')
        );

        docketMaterialServices.createDocketMaterialRequest(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                // TODO:CUT
                // getInStockRollsForItemCode(new StockCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDocketRecord.itemCode, [], [], selectedPo.orderRefNo));
                formRef.resetFields();
                // after saving, reload the saved values to the screen
                getDocketMaterialRequests();
                getActualMarkerForDocketGroup();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
        });
    }

    const handleCheckboxChange = (record, checked) => {
        const aMarkerLength = formRef.getFieldValue('aMarkerLength');
        const balanceQty = aMarkerLength
            ? Number(requiredQuantity || 0) - Number(previousAllocatedQty + currentAllocatedQty)
            : Number(selectedDocketRecord.materialRequirement || 0) - Number(previousAllocatedQty + currentAllocatedQty);
        if (checked) {
            if (balanceQty == 0) {
                AlertMessages.getErrorMessage('You are trying to allocating more than required quantity');
                return;
            }
        }
        record.checkbox = checked;
        const updatedOpenStock = [...openStockInRolls];
        // console.log(updatedOpenStock)
        // updatedOpenStock[rollId].checkbox = checked;
        if (checked) {
            const allowedQty = Math.min(record.leftOverQuantity, balanceQty);
            record.allocatingQuantity = allowedQty;
            setCurrentAllocatedQty(prev => prev + allowedQty);
        } else {
            setCurrentAllocatedQty(prev => prev - record.allocatingQuantity);
            record.allocatingQuantity = undefined;
        };
        // console.log(updatedOpenStock);
        setOpenStockInRolls(updatedOpenStock);
    };

    const handleAllocatingQtyChange = (record, value) => {
        const updatedOpenStock = [...openStockInRolls];
        setCurrentAllocatedQty(prev => prev - record.allocatingQuantity + value);
        record.allocatingQuantity = value;
        setOpenStockInRolls(updatedOpenStock);
    };

    const handleDeleteRequest = (reqNumber: string) => {
        // console.log(reqNumber);
        const reqDetails = allocatedRollsData.find(req => req.requestNumber == reqNumber);
        // console.log(reqDetails);
        // CORRECT
        const req: MaterialRequestNoRequest = new MaterialRequestNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, reqDetails.requestNumber, [], selectedDocketRecord.docketGroup)
        docketMaterialServices.deleteDocketMaterialRequest(req).then((res => {
            if (res.status) {
                // TODO:CUT
                // getInStockRollsForItemCode(new StockCodesRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedDocketRecord.itemCode, [], [], selectedPo.orderRefNo));
                // TODO: Added for bug fix only 1 line
                formRef.resetFields();
                setCurrentAllocatedQty(0);
                getDocketMaterialRequests();
                getActualMarkerForDocketGroup();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    };
    const boldLabelStyle = { fontWeight: 'bold' };

    function handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    function handleReset(clearFilters) {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button size="small" style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters)
                        setSearchedColumn(dataIndex);
                        confirm({ closeDropdown: true });
                    }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search"style={{ color: filtered ? '#1890ff' : '#FFFF00' }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: text =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            )
                : null

    });
    const getColumnsWithSearchProps = (stockRollInfoModelColumns: CustomColumn<StockRollInfoModel>[]): any => {
        const columns = [];
        stockRollInfoModelColumns.forEach((rec) => {
            columns.push({
                ...rec,
                ...getColumnSearchProps(rec.dataIndex),
                sorter: (a, b) => {
                    const valueA = typeof a[rec.dataIndex] === 'string' ? a[rec.dataIndex].toLowerCase() : a[rec.dataIndex];
                    const valueB = typeof b[rec.dataIndex] === 'string' ? b[rec.dataIndex].toLowerCase() : b[rec.dataIndex];

                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return valueA - valueB;
                    } else {

                        if (valueA < valueB) {
                            return -1;
                        }
                        if (valueA > valueB) {
                            return 1;
                        }
                        return 0;
                    }
                },
            });
        });
        return columns;
    };

    const getSoItemQty = (saleOrderCode: string) => {
        try {
            const soNumber = saleOrderCode;
            const request = new SaleOrderItemRequest(user?.useName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, soNumber, [selectedDocketRecord.itemCode]);
            // TODO:CUT
            // packlistService.getSoItemQty(request).then(res => {
            //     if (res.status) {
            //         setFabricCodedata(res.data);
            //     }
            // });

        } catch (error) {
            console.error(error.message);
        }
    };

    const calculateFabricData = (fabricCodeData) => {
        return fabricCodeData.map((fabricItem) => {
            const { itemCode, itemPoQty, itemPackQty, itemGrnQty, itemAllocQty, itemIssueQty } = fabricItem;
            const totalGRNQuantity = parseFloat(itemGrnQty);
            const allocatedNotIssued = parseFloat(itemAllocQty) - parseFloat(itemIssueQty);
            const inWarehouse = parseFloat(itemGrnQty) - parseFloat(itemIssueQty);
            const pendingArrival = parseFloat(itemPoQty) - parseFloat(itemPackQty);
            return {
                itemCode,
                totalGRNQuantity: totalGRNQuantity.toFixed(2),
                allocatedNotIssued: allocatedNotIssued.toFixed(2),
                inWarehouse: inWarehouse.toFixed(2),
                pendingArrival: pendingArrival.toFixed(2),
            };
        });
    };
    const fabricDataResults = calculateFabricData(fabricCodeData);
    return (
        <Card>
            <Descriptions
                bordered
                size='small'
                column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Docket No">{selectedDocketRecord.docketGroup}</Descriptions.Item>
                <Descriptions.Item label="Sub Dockets">{selectedDocketRecord.dgDocNumber.join(", ")}</Descriptions.Item>
                <Descriptions.Item label="Components">{selectedDocketRecord.dgComponents.map(c => <Tag color="blue">{c}</Tag>)}</Descriptions.Item>
                <Descriptions.Item label="Fabric Code">{selectedDocketRecord.itemCode}</Descriptions.Item>
                <Descriptions.Item label="Fabric Description">{selectedDocketRecord.itemDesc}</Descriptions.Item>
                <Descriptions.Item label="Planned Marker Name">{selectedDocketRecord.mName}</Descriptions.Item>
                <Descriptions.Item label="Planned Plies">{selectedDocketRecord.plies}</Descriptions.Item>
                {/* <Descriptions.Item label="Lot No">
                    <Select
                        style={{ width: '100%' }}
                        placeholder='Select Lot No'
                        filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                        showSearch>
                        <Option value='All'>All</Option>
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="Batch No">
                    <Select
                        style={{ width: '100%' }}
                        placeholder='Select Batch No'
                        filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                        showSearch>
                        <Option value='All'>All</Option>
                    </Select>
                </Descriptions.Item>
                <Descriptions.Item label="Allocation type" >
                    <Select
                        style={{ width: '250px' }}
                        placeholder='Select Allocation type'
                        filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                        showSearch>
                        <Option value='All'>All</Option>
                    </Select>
                </Descriptions.Item> */}
            </Descriptions>
            <FabricCodeQuantities fabricDataResults={fabricDataResults} />
            <Divider>Allocate stock</Divider>
            <Form layout="vertical" form={formRef}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item
                            label={<span style={boldLabelStyle}>Actual Marker Name</span>}
                            name="aMarkerName"
                        >
                            <Input readOnly={markerValues?.markerName ? true : false} placeholder="Enter Actual Marker Name" name='aMarkerName' />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label={<span style={boldLabelStyle}>Actual Marker Width</span>}
                            name="aMarkerWidth"
                        >
                            <InputNumber
                                name='aMarkerWidth'
                                min={0}
                                // decimalSeparator='.'
                                precision={2}
                                step={0.01}
                                onKeyUp={(e: any) => {
                                    const enteredVal = e.target.value;
                                    const enterValToString = enteredVal?.toString();
                                    const totalChars = enterValToString?.length;
                                    if (!enterValToString) {
                                        return;
                                    }
                                    if (enterValToString?.includes('.')) {
                                        const parts = enterValToString.split('.');
                                        const part1 = parts[0];
                                        const part2 = parts[1];
                                    } else {
                                        const parts = enterValToString.split('.');
                                        let part1 = parts[0];
                                        if (Number(part1) > 999) {
                                            part1 = part1.substring(0, 3);
                                        }
                                        formRef.setFieldValue('aMarkerWidth', isNaN(Number(part1)) ? 0 : Number(part1))
                                    }
                                }}
                                readOnly={markerValues?.markerWidth ? true : false}
                                placeholder="Enter Actual Marker Width" style={{ width: '140px' }}

                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={<span style={boldLabelStyle}>Actual Marker Length With End Allowance</span>}
                            name="aMarkerLength"
                        >
                            <InputNumber
                                name='aMarkerLength'
                                min={0}
                                precision={3}
                                step={0.01}
                                onChange={(value) => {
                                    formRef.setFieldValue('aMarkerLength', value);
                                    calculateRequiredQuantity();
                                }}
                                onKeyUp={(e: any) => {
                                    const enteredVal = e.target.value;
                                    const enterValToString = enteredVal?.toString();
                                    const totalChars = enterValToString?.length;
                                    if (!enterValToString) {
                                        return;
                                    }
                                    if (enterValToString?.includes('.')) {
                                        const parts = enterValToString.split('.');
                                        const part1 = parts[0];
                                        const part2 = parts[1];
                                    } else {
                                        const parts = enterValToString.split('.');
                                        let part1 = parts[0];
                                        if (Number(part1) > 999) {
                                            part1 = part1.substring(0, 3);
                                        }
                                        formRef.setFieldValue('aMarkerLength', isNaN(Number(part1)) ? 0 : Number(part1))
                                    }
                                }}
                                readOnly={markerValues?.markerLength ? true : false} placeholder="Enter Actual Marker Length" style={{ width: '140px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    <Form.Item
                            label={<span style={boldLabelStyle}>Cut Wastage</span>}
                            name="cutWastage"
                        >
                           {selectedDocketRecord?.cutWastage ? selectedDocketRecord?.cutWastage : ''}
                            {/* <Input readOnly={selectedDocketRecord?.plies ? true : false} placeholder="Enter Modified Wastage" name='cutWastage' /> */}
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    </Col>
                </Row>
                <Row>
                    <span style={{ color: 'red' }}>
                        <b>NOTE : </b>
                        Actual marker will be saved only if all the 3 fields marker name, marker width & marker length are provided.
                    </span>
                </Row>
            </Form>
            <Descriptions bordered
                column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Required Quantity">
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={'Required Quantity'}>
                        <Tag className='s-tag' color={'#f32c90'}>
                            {formRef.getFieldValue('aMarkerLength') ?
                                Number(requiredQuantity ? requiredQuantity.toFixed(2) : 0) :
                                Number(selectedDocketRecord.materialRequirement ? selectedDocketRecord.materialRequirement : 0)}
                        </Tag>
                    </Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label="Allocated Quantity">
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={'Total Allocated Qty'}><Tag className='s-tag' color={'#5adb00'}>{returnZeroIfNaN(Number(previousAllocatedQty + currentAllocatedQty))?.toFixed(2)}</Tag></Tooltip>
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='previous'><Tag className='s-tag' color="#1187bc">{returnZeroIfNaN(previousAllocatedQty)?.toFixed(2)}</Tag></Tooltip>
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='current'><Tag className='s-tag' color="#ffa500">{returnZeroIfNaN(currentAllocatedQty)?.toFixed(2)}</Tag></Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label="Balance">
                    <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={'Balance'}>
                        <Tag className='s-tag' color={'#ea4a4a'}>
                            {formRef.getFieldValue('aMarkerLength') ?
                                (returnZeroIfNaN(Number(requiredQuantity) - Number(previousAllocatedQty + currentAllocatedQty))).toFixed(2) :
                                (returnZeroIfNaN(Number(selectedDocketRecord.materialRequirement) - Number(previousAllocatedQty + currentAllocatedQty))).toFixed(2)}
                        </Tag>
                    </Tooltip>
                </Descriptions.Item>
            </Descriptions>
            <Table
                bordered
                scroll={{ x: true }}
                pagination={false}
                columns={[ ...getColumnsWithSearchProps(stockRollInfoModelColumns),
                {
                    title: 'Allocating Qty',
                    dataIndex: 'allocatingQuantity',
                    key: 'allocatingQuantity',
                    render: (text, record: any, rollId) => (
                        <InputNumber
                            formatter={(value) => {
                                // Remove non-numeric characters and keep up to two decimal places
                                const numericValue = value.replace(/[^0-9.]/g, '');
                                const parts = numericValue.split('.');
                                return parts.length <= 1 ? numericValue : `${parts[0]}.${parts[1].slice(0, 2)}`;
                            }}
                            parser={(value) => {
                                // Parse the numeric value and round to two decimal places
                                return parseFloat(value).toFixed(2);
                            }}
                            min={0}
                            max={record.leftOverQuantity}
                            value={text}
                            readOnly={!record?.checkbox}
                            onChange={(value) => handleAllocatingQtyChange(record, value)}
                        />
                    ),
                },
                {
                    title: 'Checkbox',
                    dataIndex: 'checkbox',
                    key: 'checkbox',
                    render: (text, record, rollId) => {
                        // console.log(record)
                       return  <Checkbox
                            checked={text}
                            onChange={(e) => handleCheckboxChange(record, e.target.checked)}
                        />
                    }
                    ,
                },
                ]}
                dataSource={openStockInRolls}
                size='small'
            />
            <Row justify='space-between' style={{ marginTop: '5px' }}>
                <Col>
                </Col>
                <Col >
                    <div >
                        <Button type="primary" onClick={createDocketMaterialRequest}
                            disabled={!currentAllocatedQty}
                        >
                            Save
                        </Button>
                    </div>
                </Col>
            </Row>
            <br />
            <Divider>Already allocated stock</Divider>
            <AllocatedRolls isDeleteNeeded={true} docMaterialAllocatedDetails={allocatedRollsData} handleDeleteRequest={handleDeleteRequest} isMrn={false} />
        </Card>
    )
}

export default AllocationPopUp;