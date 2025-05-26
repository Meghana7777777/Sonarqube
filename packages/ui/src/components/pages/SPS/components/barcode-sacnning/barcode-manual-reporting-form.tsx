import React, { useEffect, useState } from "react";
import { Descriptions, Table, Input, Button, Modal, Select, Form, Typography, Tag, Space, Tooltip, Row, Flex } from "antd";
import { BarcodeDetailsForBundleScanning, BarcodeScanningStatusModel, ReasonCategoryEnum, ReasonCategoryRequest, ReasonModel } from "@xpparel/shared-models";
import { ReasonsService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";

const { Option } = Select;
const { Text } = Typography;

export interface ReportingFormProps {
    barcodeDetails: BarcodeDetailsForBundleScanning;
    manualBarcodeScanSubmit: (req: BarcodeDetailsForBundleScanning) => void;
    updatedKey: number;
}
const BarcodeManualReportingForm = (props: ReportingFormProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [barcodeDetails, setBarcodeDetails] = useState<BarcodeDetailsForBundleScanning>();
    const [reasons, setReasons] = useState<ReasonModel[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRejection, setCurrentRejection] = useState(null);
    const [form] = Form.useForm();
    const reasonService = new ReasonsService()
    useEffect(() => {
        setBarcodeDetails(props.barcodeDetails);
        getReasons()
    }, [props.updatedKey])

    // Show modal for rejection details
    const showRejectionModal = (sizeDetails) => {
        setCurrentRejection(sizeDetails);

        // Pre-fill form with current rejection details
        form.setFieldsValue({
            rejections:
                sizeDetails.rejectionDetails.length > 0
                    ? sizeDetails.rejectionDetails
                    : [{ reasonCode: undefined, rejectedQty: undefined }],
        });
        setModalVisible(true);
    };

    const getReasons = () => {
        const req = new ReasonCategoryRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, ReasonCategoryEnum.EMB_REJECTIONS)
        reasonService.getReasonsByCategory(req)
            .then((res) => {
                if (res.status) {
                    setReasons(res.data);
                } else {
                    setReasons([]);
                }
            })
            .catch((err) => {
            });
    }


    // Handle modal OK
    const handleModalOk = () => {
        form.validateFields().then((values) => {
            if (currentRejection) {
                const updatedDetails = { ...barcodeDetails };
                const color = updatedDetails.colorAndSizeDetails.find((c) =>
                    c.sizesDetails.some((s) => s.size === currentRejection.size)
                );
                if (color) {
                    color.sizesDetails = color.sizesDetails.map((s) => {
                        if (s.size === currentRejection.size) {
                            // Update rejection details with form values
                            s.rejectionDetails = values.rejections.map((item) => ({
                                reasonCode: item.reasonCode,
                                rejectedQty: Number(item.rejectedQty),
                            }));
                        }
                        return s;
                    });
                }
                // setBarcodeDetails(updatedDetails);
            }
            setModalVisible(false);
            form.resetFields();
        });
    };

    // Handle modal cancel
    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    // Columns for the table
    const sizeColumns = barcodeDetails?.colorAndSizeDetails ? barcodeDetails?.colorAndSizeDetails
        .reduce((sizes, color) => {
            color.sizesDetails.forEach((size) => {
                if (!sizes.some((s) => s.size === size.size)) {
                    sizes.push(size);
                }
            });
            return sizes;
        }, [])
        .map((size) => ({
            title: size.size,
            dataIndex: size.size,
            key: size.size,
            render: (_, record) => {
                const sizeDetail = record.sizeDetails.find((s) => s.size === size.size);

                // Calculate the total rejected quantity
                const totalRejectedQty = sizeDetail?.rejectionDetails.reduce(
                    (sum, rejection) => sum + rejection.rejectedQty,
                    0
                );

                // const pQtyColor = sizeDetail?.eligibleToReportQty > 0 ? '#ff0000' : sizeDetail?.eligibleToReportQty === 0 ? "#5adb00" : "#001d24";
                return sizeDetail ? (<>

                    <>
                        <Space size={1} direction="vertical">
                            <Space size={1} direction='horizontal'>
                                <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Original Qty'><Tag className='s-tag m-0' color="#257d82">{sizeDetail ? sizeDetail.originalQty : 0}</Tag></Tooltip>
                                <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Reported Qty'><Tag className='s-tag m-0' color="#77af11">{sizeDetail ? sizeDetail.reportedQty : 0}</Tag></Tooltip>
                                <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Rejected Qty'><Tag className='s-tag m-0' color="#df1313">{totalRejectedQty || 0}</Tag></Tooltip>
                                <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Eligible Qty'><Tag className='s-tag m-0' color="#dfdf13">{sizeDetail.eligibleToReportQty || 0}</Tag></Tooltip>
                            </Space>
                            <Space size={1}  direction='horizontal'>
                               
                            </Space>
                            {/* <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} className='s-tag' title={sizeDetail.eligibleToReportQty > 0 ? 'Pending Qty' : "Excess Qty"}><Tag style={{ height: '48px', paddingTop: '11px' }} color={pQtyColor}>{Math.abs(sizeDetail.eligibleToReportQty)}</Tag></Tooltip> */}
                        </Space>
                    </>
                    <div style={{marginTop:'3px'}}>
                        {/* <div>
                            <Text>Original:</Text> {sizeDetail.originalQty}
                        </div>
                        <div>
                            <Text>Reported:</Text> {sizeDetail.reportedQty}
                        </div>
                        <div>
                            <Text>Eligible:</Text> {sizeDetail.eligibleToReportQty}
                        </div>
                        <div>
                            <Text>Total Rejected:</Text> {totalRejectedQty || 0}
                        </div> */}
                        <Input
                            style={{ width: "100px" }}
                            value={sizeDetail.reportingGoodQty}
                            onChange={(e) => {
                                const updatedDetails = { ...barcodeDetails };
                                const color = updatedDetails.colorAndSizeDetails.find((c) => c.color === record.color);
                                const sizeToUpdate = color.sizesDetails.find((s) => s.size === size.size);

                                // Validation: Ensure the sum of goodQty and rejectedQty does not exceed eligibleToReportQty
                                const goodQty = Number(e.target.value);
                                if (goodQty + totalRejectedQty > sizeToUpdate.eligibleToReportQty) {
                                    alert(
                                        "Reporting Good Quantity and Rejected Quantity should not exceed Eligible to Report Quantity!"
                                    );
                                    return;
                                }
                                sizeToUpdate.reportingGoodQty = goodQty;
                                setBarcodeDetails(updatedDetails);
                            }}
                        />
                        {/* <Button type="link" onClick={() => showRejectionModal(sizeDetail)}>
                            Add Rejection
                        </Button> */}
                    </div></>
                ) : null;
            },
        })) : [];

    // Combine the static and dynamic columns
    const columns = [
        {
            title: "Color",
            dataIndex: "color",
            key: "color",
            render: (_, record) => record.color,
        },
        ...sizeColumns,
    ];

    const handleSubmit = () => {
        props.manualBarcodeScanSubmit(barcodeDetails);
    }

    // Data source for the table
    const dataSource =
        barcodeDetails?.colorAndSizeDetails.map((color) => ({
            key: color.color,
            color: color.color,
            sizeDetails: color.sizesDetails,
        })) || [];

    return (
        <div>
            {barcodeDetails && (
                <>
                    <Descriptions title="" bordered size="small">
                        <Descriptions.Item label="Barcode">{barcodeDetails.barcode}</Descriptions.Item>
                        {/* <Descriptions.Item label="Barcode Type">{`${barcodeDetails.barcodeType}`}</Descriptions.Item> */}
                        <Descriptions.Item label="Operation Code"><Tag color='#000'>{barcodeDetails.operationCode}</Tag></Descriptions.Item>
                        <Descriptions.Item label="Process Type">{barcodeDetails.processType}</Descriptions.Item>
                        {/* <Descriptions.Item label="MO Number">{barcodeDetails.barcodeProps.moNumbers}</Descriptions.Item> */}
                        <Descriptions.Item label="Style">{barcodeDetails.barcodeProps.style}</Descriptions.Item>
                        <Descriptions.Item label="Order Number">{barcodeDetails.barcodeProps.moNumber}</Descriptions.Item>
                        <Descriptions.Item label="MO Line No">{barcodeDetails.barcodeProps.moLineNo}</Descriptions.Item>
                        <Descriptions.Item label="Destination">{barcodeDetails.barcodeProps.destination}</Descriptions.Item>
                        <Descriptions.Item label="Planned Delivery Date">{barcodeDetails.barcodeProps.plannedDelDate}</Descriptions.Item>
                        <Descriptions.Item label="Planned Production Date">{barcodeDetails.barcodeProps.planProdDate}</Descriptions.Item>
                        <Descriptions.Item label="Planned Cut Date">{barcodeDetails.barcodeProps.planCutDate}</Descriptions.Item>
                        <Descriptions.Item label="CO Line">{barcodeDetails.barcodeProps.coLine}</Descriptions.Item>
                        <Descriptions.Item label="Buyer PO">{barcodeDetails.barcodeProps.buyerPo}</Descriptions.Item>
                        {/* <Descriptions.Item label="MO Numbers">{barcodeDetails.barcodeProps.moNumbers}</Descriptions.Item> */}
                        <Descriptions.Item label="Product Name">{barcodeDetails.barcodeProps.productName}</Descriptions.Item>
                        <Descriptions.Item label="FG Color">{barcodeDetails.barcodeProps.fgColor}</Descriptions.Item>
                        <Descriptions.Item label="Size"><Tag color='#b98235'>{barcodeDetails.barcodeProps.size}</Tag></Descriptions.Item>
                    </Descriptions>
                    <Table columns={columns} dataSource={dataSource} pagination={false} size="small" />
                    <Flex justify="flex-end">
                    <Button type="primary" className="btn-green" style={{ marginTop: "16px" }} onClick={() => handleSubmit()}>
                        Submit
                    </Button>
                    </Flex>
                    <Modal
                        title="Add Rejection Details"
                        visible={modalVisible}
                        onOk={handleModalOk}
                        onCancel={handleModalCancel}
                        width={600}
                    >
                        <Form form={form} layout="vertical">
                            <Form.List name="rejections">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                                            <div key={key} style={{ display: "flex", marginBottom: "8px" }}>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "reasonCode"]}
                                                    fieldKey={[fieldKey, "reasonCode"]}
                                                    rules={[{ required: true, message: "Missing reason code" }]}
                                                    style={{ flex: 1, marginRight: "8px" }}
                                                >

                                                    <Select
                                                        placeholder={'Select Reason'}
                                                        style={{ width: '100%' }}
                                                        allowClear
                                                    >
                                                        {reasons.map((reasonInfo) => (
                                                            <Option key={reasonInfo.reasonName} value={reasonInfo.reasonName}>
                                                                {reasonInfo.reasonName}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "rejectedQty"]}
                                                    fieldKey={[fieldKey, "rejectedQty"]}
                                                    rules={[{ required: true, message: "Missing rejected quantity" }]}
                                                    style={{ flex: 1, marginRight: "8px" }}
                                                >
                                                    <Input placeholder="Rejected Qty" type="number" />
                                                </Form.Item>
                                                <Button danger onClick={() => remove(name)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block>
                                            Add Reason
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default BarcodeManualReportingForm;
