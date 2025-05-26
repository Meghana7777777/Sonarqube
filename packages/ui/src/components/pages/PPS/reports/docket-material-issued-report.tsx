import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { DateRangeRequestForPlannedDocket } from '@xpparel/shared-models';
import { DocketPlanningServices } from '@xpparel/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, Row, Table, TreeSelect } from 'antd';
import moment from 'moment';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;


export const PlannedDocketReport = () => {
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const [formRef] = Form.useForm();
    const [dateRange, setDateRange] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const service = new DocketPlanningServices();
    const [plannedDocketReportDataDateWise, setplannedDocketReportDataDateWise] = useState<any>([]);
    const [fabricReportDataDateWiseExcelData, setFabricReportDataDateWiseExcelData] = useState<any>([]);
    const [isSelectAllDisabled, setIsSelectAllDisabled] = useState(false);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [excelData , setExcelData] = useState<any>([])



    const handleDateChange = (dates) => {
        if (dates) {
            setStartDate(dates[0]);
            setDateRange([dates[0], dates[1]]);
        } else {
            setStartDate(null);
            setDateRange(null);
        }
    };

    const disabledDate = (current) => {
        return startDate && current && current < startDate.startOf('day');
    };

    const handleColumnSelect = (value: string[]) => {
        if (value.includes('select_all')) {
            if (selectedColumns.length === optionalColumns.length) {
                setSelectedColumns([]);
                setIsSelectAllDisabled(false);
            } else {
                setSelectedColumns(optionalColumns.map(col => col.key));
                setIsSelectAllDisabled(true);
            }
        } else {
            setSelectedColumns(value);
            setIsSelectAllDisabled(false);
        }
    };

    const handleDateWiseData = () => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            AlertMessages.getErrorMessage('Please select both start and end dates.');
            return;
        }
        try {
            const request = new DateRangeRequestForPlannedDocket(user?.username,user?.orgData.unitCode,user?.orgData.companyCode,user?.userId,dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : ''
            );
            service.getPlannedDocketReport(request).then(res => {
                if (res.status) {
                    setplannedDocketReportDataDateWise(res.data);
                    setExcelData(
                        res.data.map(item => ({docketGroup: item.docketGroup || '0',requestNumber: item.requestNumber || '0',plannedDateTime: formatDateTime(item.plannedDateTime),materialRequestOn: formatDateTime(item.materialRequestOn),matFullfillDateTime: formatDateTime(item.matFullfillDateTime),remark: item.remark || '0',resourceDesc:item.resourceDesc || '0',
                        }))
                    );
                } else {
                    AlertMessages.getErrorMessage('Error occurred while getting Planned Dockets Date wise report data');
                }
            });
        } catch (error) {
            AlertMessages.getErrorMessage(error.message || 'An error occurred');
        }
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
                <Button onClick={() => {
                    handleReset(clearFilters)
                    setSearchedColumn(dataIndex);
                    confirm({ closeDropdown: true });
                }} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
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
    function handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    function handleReset(clearFilters) {
        clearFilters();
        setSearchText('');
    };

    const handleResetData = () => {
        formRef.resetFields();
        setDateRange(null);
        setStartDate(null);
        setSelectedColumns([]);
        setplannedDocketReportDataDateWise([]);
    };
    const formatDateTime = (value: string | undefined) => {
        if (!value) return '00:00:0000 00:00';
        return moment(value).format('DD:MM:YYYY HH:mm');
    };
    const fixedColumns = [
        { title: 'Request Number', dataIndex: 'requestNumber', key: 'requestNumber', width: 150, fixed: 'left', ...getColumnSearchProps('requestNumber'), sorter: (a, b) => (a.requestNumber || '').localeCompare(b.requestNumber || ''), render: (value) => value || 0, },
        { title: 'Docket Group', dataIndex: 'docketGroup', key: 'docketGroup', width: 150, fixed: 'left', ...getColumnSearchProps('docketGroup'), sorter: (a, b) => (a.docketGroup || '').localeCompare(b.docketGroup || ''), render: (value) => value || 0, },
        { title: 'Planned Date Time', dataIndex: 'plannedDateTime', key: 'plannedDateTime', width: 150, fixed: 'left', ...getColumnSearchProps('plannedDateTime'), sorter: (a, b) => (a.plannedDateTime || '').localeCompare(b.plannedDateTime || ''),render: (value) => formatDateTime(value), },
        { title: 'Material Request On', dataIndex: 'materialRequestOn', key: 'materialRequestOn', width: 150, fixed: 'left', ...getColumnSearchProps('materialRequestOn'), sorter: (a, b) => (a.materialRequestOn || '').localeCompare(b.materialRequestOn || ''),render: (value) => formatDateTime(value), },
        { title: 'Material FullFill D&T', dataIndex: 'matFullfillDateTime', key: 'matFullfillDateTime', width: 150, ...getColumnSearchProps('matFullfillDateTime'), sorter: (a, b) => (a.matFullfillDateTime || '').localeCompare(b.matFullfillDateTime || ''),render: (value) => formatDateTime(value), },
        { title: 'Resource Desc', dataIndex: 'resourceDesc', key: 'resourceDesc', width: 150, ...getColumnSearchProps('resourceDesc'), sorter: (a, b) => (a.resourceDesc || '').localeCompare(b.resourceDesc || ''),render: (value) => value || 0, },
    ];
    
    
    // Optional Columns
    const optionalColumns = [
        { title: 'Remarks', dataIndex: 'remark', key: 'remark', width: 150, ...getColumnSearchProps('remark'), sorter: (a, b) => (a.remark || '0').localeCompare(b.remark || '0') , render: (value) => value || 0,},
    ];

    const dynamicColumns: any = [
        ...fixedColumns,
        ...optionalColumns.filter(column => selectedColumns.includes(column.key)),
    ];

    const handleExport = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
    
        if (excelData.length === 0) {
            AlertMessages.getErrorMessage('No data available to export');
            return;
        }
    
        console.log('Excel Data:', excelData);
    
        const currentDate = new Date().toISOString().slice(0, 10).split("-").join("/");
        const exportingColumns = excelData.map(item => ({
            'Docket Group': item.docketGroup,
            'Request Number': item.requestNumber,
            'Planned Date Time': item.plannedDateTime,
            'Material Request On': item.materialRequestOn,
            'Material FullFill D&T': item.matFullfillDateTime,
            'Remarks': item.remark,
            'Resource Desc':item.resourceDesc,
        }));
    
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportingColumns);
    
        worksheet['!cols'] = Array(Object.keys(exportingColumns[0]).length).fill({ wch: 25 });
    
        XLSX.utils.book_append_sheet(workbook, worksheet, "Planned Docket Report");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `Planned Docket Report - ${currentDate}.xlsx`);
    };
    
    return (
        <Card
            className="custom-antd-card-head"
            title={
                <Row align="middle" style={{ width: '100%' }}>
                    <Col flex="auto" style={{ textAlign: 'center' }}>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>
                            Planned Docket Report
                        </span>
                    </Col>
                    <Col>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                            style={{ marginLeft: 'auto' }}
                        >
                            Export to Excel
                        </Button>
                    </Col>
                </Row>
            }
            headStyle={{ backgroundColor: '#0068AC' }}
        >
            <Form form={formRef} onFinish={handleDateWiseData}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="dateRange" label="Date Range">
                            <RangePicker
                                onChange={handleDateChange}
                                disabledDate={disabledDate}
                                style={{ marginBottom: 16 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button htmlType='submit' type='primary' style={{ marginRight: '10px' }}>Submit</Button>
                        <Button onClick={handleResetData}>Reset</Button>
                    </Col>
                    <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                    </Col>
                    <Col span={6} style={{ display: 'flex', justifyContent: 'end', height: '50px' }}>
                        <TreeSelect
                            treeCheckable
                            value={selectedColumns}
                            onChange={handleColumnSelect}
                            style={{ width: '200px', marginBottom: 16 }}
                            placeholder="Select columns to show"
                            allowClear
                            tagRender={() => null}
                        >
                            <TreeNode key="select_all" value="select_all" title="Select All" />
                            {optionalColumns.map(column => (
                                <TreeNode key={column.key} value={column.key} title={column.title} />
                            ))}
                        </TreeSelect>
                    </Col>
                </Row>
            </Form>
            {plannedDocketReportDataDateWise.length != 0 &&
                <Table columns={dynamicColumns}
                    dataSource={plannedDocketReportDataDateWise}
                    scroll={{ x: 'max-content' }} bordered />
            }
        </Card>
    );
};
