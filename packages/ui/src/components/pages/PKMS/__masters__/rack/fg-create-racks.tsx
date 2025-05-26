import { Button, Card, Col, Divider, Form, Input, message, Modal, Popconfirm, QRCode, Row, Select, Space, Switch, Table, Tooltip } from "antd";


import Icon, { EditOutlined, HddOutlined, PrinterTwoTone } from "@ant-design/icons";
import { CommonRequestAttrs, FgRackCreateReq, FgRackCreationModel, FgRackFilterRequest, FgRacksActivateReq, WareHouseModel } from "@xpparel/shared-models";
import { FgRackServices, WareHouseService } from "packages/libs/shared-services/src/pkms";
import { SequenceUtils } from "packages/ui/src/common";
import { useAppSelector } from "packages/ui/src/common/hooks";
import { AlertMessages } from "packages/ui/src/components/common";
import { ScxButton } from "packages/ui/src/schemax-component-lib";
import printJS from "print-js";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { getCssFromComponent } from "../print-barcodes";
import { ColumnsType } from "antd/es/table";
import RacksCreateForm from "../../../WMS/masters/racks-create-form";
import FgRacksCreateForm from "./fg-racks-create-form";

export interface IcreateRackProps {
	barcodeWidth?: number;
	newWindow: boolean;
}
export const FgCreateRacks = (props: IcreateRackProps) => {
	const { newWindow, } = props;
	const service = new FgRackServices();
	const warehouseservice = new WareHouseService();

	const user = useAppSelector((state) => state.user.user.user);

	const [racksdata, setRacksData] = useState<FgRackCreationModel[]>([]);
	const [formRef] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<any>();
	const [selectedWhId, setSelectedWhId] = useState<number>();
	const [whs, setWhs] = useState<WareHouseModel[]>([]);
	// const [selectWh, setSelectWh] = useState<number>(null);
	const [isTitle, setIsTitle] = useState("");
	const [oktext, setOkText] = useState("");
	const [showBarCodeModel, setShowBarCodeModel] = useState<boolean>(false);
	const [searchedText, setSearchedText] = useState("");
	// const [selectedWhData, setSelectedWhData] = useState<WareHouseModel>(null);
	const { Option } = Select;


	let externalWindow: any;
	let containerEl: any;
	// Open in new Window
	if (newWindow) {
		externalWindow = window.open('', '', 'width=600,height=700,left=200,top=50');
		containerEl = externalWindow.document.createElement('div');
		externalWindow.document.body.appendChild(containerEl);
		externalWindow.document.title = 'Barcodes';
		getCssFromComponent(document, externalWindow.document);
	}

	const printAllBarCodes = () => {
		const pageContent = document.getElementById("printArea");
		if (pageContent) {
			printJS({
				printable: pageContent,
				type: "html",
				// base64: true,
				showModal: true,
				modalMessage: "Loading...",
				targetStyles: ['*'],
				style: '@page {size: 384px 192px  ; margin: 0mm; .label {page-break-after: always !important;}} body {margin: 0;} }'
			});
			setShowBarCodeModel(false);
			// });
		} else {
			AlertMessages.getErrorMessage("Page content element not found.");
		}
	};
	useEffect(() => {
		getWareHouseToRacks();
	}, [])

	useEffect(() => {
		getRacks()
	}, [selectedWhId])


	const onRackChange = (whId: number) => {
		console.log('whId',whId);
		console.log(selectedWhId)
		// const finData= whs.find(status=> status.)
		setSelectedWhId(whId);
		// const selectedWh = whs.find(rec => rec.id == whId);
		// setSelectedWhData(selectedWh);
		// getRacks(whId)
		// formRef.setFieldValue('floor', '')
	}


	const getRacks = () => {
		setShowBarCodeModel(false);
		const fgRackFilterReq = new FgRackFilterRequest(
			user?.orgData?.companyCode,
			user?.orgData?.unitCode,
			user?.userName,
			user?.userId,
			selectedWhId
		);
		service
			.getAllRacksData(fgRackFilterReq)
			.then((res) => {
				if (res.status) {
					setRacksData(res.data);
					console.log(res.data,'fghjk')
				} else {
					setRacksData([])
				}
			})
			.catch((err) => {
				AlertMessages.getErrorMessage(err.message);
			});
	};
	const getWareHouseToRacks = () => {
		const req = new CommonRequestAttrs(user?.userName,
			user?.orgData?.unitCode,
			user?.orgData?.companyCode,
			user?.userId)
		warehouseservice.getWareHouseDropDownToRacks(req)
			.then((res) => {
				if (res.status) {
					setWhs(res.data);
				} else {
					setWhs([]);
					message.error(res.internalMessage, 4);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const EditShowModal = (record) => {
	if (!record.isActive) {
		AlertMessages.getErrorMessage('Please Activate the record before Edit')
		return
	}
	setSelectedRecord(record);
	console.log('record', record)
	formRef.setFieldsValue(record)
	setIsModalOpen(true);
	setIsTitle("Update Racks");
	setOkText("Update");

	};
	const createShowModals = () => {
		setSelectedRecord(undefined);
		setTimeout(() => {
			formRef.resetFields();
		}, 100);
		// formRef.resetFields();
		setIsModalOpen(true);
		setIsTitle("Create Racks");
		setOkText("Save");
	};
	const handleCancel = () => {
	    formRef.resetFields();
		setIsModalOpen(false);
	};
	const fieldsReset = () => {
		formRef.resetFields();
	};
	const createRack = () => {
		formRef.validateFields().then((values) => {
			const req = new FgRackCreateReq(
				user?.userName,
				user?.orgData?.unitCode,
				user?.orgData?.companyCode,
				user?.userId,
				values.id,
				values.name,
				values.code,
				values.levels,
				values.weightCapacity,
				values.weightUom,
				values.floor,
				values.whId,
				values.wareHouseCode,
				values.columns,
				values.preferredStorageMaterial,
				values.priority,
				values.length, values.lengthUom, values.width, values.widthUom, values.height, values.heightUom, values.latitude, values.longitude,
				values.isActive,
				"",
				values.createLocations
			);
			service
				.createRacks(req)
				.then((res) => {
					if (res.status) {
						AlertMessages.getSuccessMessage(res.internalMessage);
						setIsModalOpen(false);
						fieldsReset();
						getRacks();
					} else {
						AlertMessages.getErrorMessage(res.internalMessage);
					}
				})
				.catch((err) => {
					AlertMessages.getErrorMessage(err.message);
					fieldsReset();
				});
		}).catch((err) => {
			AlertMessages.getErrorMessage("Please fill required fields before creation.");
		})
	};

	const deactivateRack = (id: number) => {
		const req = new FgRacksActivateReq("", "", "", 5, id);
		service.activedeactiveRacks(req)
			.then((res) => {
				if (res.status) {
					AlertMessages.getSuccessMessage(res.internalMessage);
					getRacks();
				} else {
					AlertMessages.getErrorMessage(res.internalMessage);
				}
			})
			.catch((err) => {
				AlertMessages.getErrorMessage(err.message);
			});
	};

	const handlePrint = () => {
		setShowBarCodeModel(true);

	};
	const hideModal = () => {
		setShowBarCodeModel(false);
	};

	const rackColumns: ColumnsType<any> = [
		{
			title: "Rack Name",
			dataIndex: "name",
			align: 'center',
			key: "name",
			sorter: (a, b) => { return a.name.localeCompare(b.name) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: "Rack Code",
			dataIndex: "code",
			align: 'center',
			key: "code",
			sorter: (a, b) => { return a.code.localeCompare(b.code) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: "Barcode",
			dataIndex: "barcodeId",
			align: 'center',
			key: "barcodeId",
			sorter: (a, b) => { return a.barcodeId.localeCompare(b.barcodeId) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: "No Of Rows",
			dataIndex: "levels",
			align: 'center',
			key: "levels",
			sorter: (a: FgRackCreateReq, b: FgRackCreateReq): number => {
				const columnA = a.levels ? String(a.levels) : '';
				const columnB = b.levels ? String(b.levels) : '';
				return columnA.localeCompare(columnB);
			},
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record);
			}
		},

		{
			title: 'Weight Capacity',
			dataIndex: 'weightCapacity',
			key: 'weightCapacity',
			sorter: (a, b) => { return a.weightCapacity.localeCompare(b.weightCapacity) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: 'Weight UOM',
			dataIndex: 'weightUom',
			key: 'weightUom',
			sorter: (a, b) => { return a.weightUom.localeCompare(b.weightUom) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: "Warehouse Code",
			dataIndex: "wareHouseDesc",
			align: 'center',
			key: "wareHouseDesc",
			sorter: (a: FgRackCreateReq, b: FgRackCreateReq): number => {
				const columnA = a.wareHouseDesc ? String(a.wareHouseDesc) : '';
				const columnB = b.wareHouseDesc ? String(b.wareHouseDesc) : '';
				return columnA.localeCompare(columnB);
			},
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record);
			}
		},
		{
			title: "Columns",
			dataIndex: "columns",
			align: 'center',
			key: "columns",
			sorter: (a: FgRackCreateReq, b: FgRackCreateReq): number => {
				const columnA = a.columns ? String(a.columns) : '';
				const columnB = b.columns ? String(b.columns) : '';
				return columnA.localeCompare(columnB);
			},
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record);
			}

		},
		{
			title: "Preferred Storage Material",
			dataIndex: "preferredStorageMaterial",
			align: 'center',
			key: "preferredStorageMaterial",
			sorter: (a, b) => { return a.preferredStorageMaterial.localeCompare(b.preferredStorageMaterial) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: "Priority",
			dataIndex: "priority",
			align: 'center',
			key: "priority",
			sorter: (a: FgRackCreateReq, b: FgRackCreateReq): number => {
				const columnA = a.priority ? String(a.priority) : '';
				const columnB = b.priority ? String(b.priority) : '';
				return columnA.localeCompare(columnB);
			},
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record);
			}
		},

		{
			title: 'Floor',
			dataIndex: 'floor',
			align: 'center',
			key: 'floor',
			sorter: (a, b) => { return a.floor ? String(a.floor) : ''.localeCompare(b.floor ? String(a.floor) : '') },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: 'Length',
			dataIndex: 'length',
			align: 'center',
			key: 'length',
			sorter: (a, b) => { return a.length ? String(a.length) : ''.localeCompare(b.length ? String(a.length) : '') },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record);
			},
		},
		{
			title: 'Length UOM',
			dataIndex: 'lengthUom',
			key: 'lengthUom',
			sorter: (a, b) => { return a.lengthUom.localeCompare(b.lengthUom) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: 'Width',
			dataIndex: 'width',
			align: 'center',
			key: 'width',
			sorter: (a, b) => { return a.width ? String(a.width) : ''.localeCompare(b.width ? String(a.width) : '') },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: 'Width UOM',
			dataIndex: 'widthUom',
			key: 'widthUom',
			sorter: (a, b) => { return a.widthUom.localeCompare(b.widthUom) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: 'Height',
			dataIndex: 'height',
			align: 'center',
			key: 'height',
			sorter: (a, b) => { return a.height ? String(a.height) : ''.localeCompare(b.height ? String(a.height) : '') },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}

		},
		{
			title: 'Height UOM',
			dataIndex: 'heightUom',
			key: 'heightUom',
			sorter: (a, b) => { return a.heightUom.localeCompare(b.heightUom) },
			sortDirections: ['descend', 'ascend'],
			filteredValue: [String(searchedText).toLowerCase()],
			onFilter: (value, record) => {
				return SequenceUtils.globalFilter(value, record)
			}
		},
		{
			title: 'Latitude',
			dataIndex: 'latitude',
			align: 'center',
			key: 'latitude',
			sorter: (a, b) => { return a.latitude.localeCompare(b.latitude) },
	sortDirections: ['descend', 'ascend'],
	filteredValue: [String(searchedText).toLowerCase()],
	onFilter: (value, record) => {
		return SequenceUtils.globalFilter(value, record)
	}


	},
	{
		title: 'Longitude',
		dataIndex: 'longitude',
		align: 'center',
		key: 'longitude',
		sorter: (a, b) => { return a.longitude.localeCompare(b.longitude) },
		sortDirections: ['descend', 'ascend'],
		filteredValue: [String(searchedText).toLowerCase()],
		onFilter: (value, record) => {
			return SequenceUtils.globalFilter(value, record)
		}

	},
	{
		title: "Action",
		dataIndex: "action",
		align: 'center',
		key: "action",
		render: (value, recod) => {
			return (
				<>
					<Space>
						<EditOutlined 
						onClick={() => EditShowModal(recod)} style={{ fontSize: '20px', color: '#08c' }} />
						<Divider type="vertical" />

						<Popconfirm
							onConfirm={(e) => {
								deactivateRack(recod.id);
							}}
							title={
								recod.isActive
									? "Are you sure to Deactivate Racks ?"
									: "Are you sure to Activate Racks ?"
							}
						>
							<Switch
								size="default"
								defaultChecked
								className={
									recod.isActive ? "toggle-activated" : "toggle-deactivated"
								}
 								checkedChildren={<Icon type="check" />}
								unCheckedChildren={<Icon type="close" />}
								checked={recod.isActive}
							/>
						</Popconfirm>

					</Space>
				</>
			);
		},
	},
	];

	return (
		<div >
			<Card
				title={

					<span><HddOutlined
						style={{ marginRight: '8px' }}
					/>
						Racks</span>
				}
				extra={
					<>
						<Space>
							<Tooltip title='Print'>
								<ScxButton onClick={handlePrint} icon={<PrinterTwoTone style={{ fontSize: '15px' }} />}>
									Print All Barcodes
								</ScxButton>
							</Tooltip>

							<Button
								type="primary"
								onClick={() => {
									createShowModals();
									setSelectedRecord('')
								}

								}>
								Create
							</Button>
						</Space>
					</>

				}
			>
				<Input.Search
					placeholder="Search"
					allowClear
					onChange={(e) => { setSearchedText(e.target.value) }}
					onSearch={(value) => { setSearchedText(value) }}
					style={{ width: 200, float: "right" }}
				/>
				<Form>
					<Form.Item
						label='Warehouse Code'
						name='warehouseCode'>
						 <Row gutter={[24, 24]}>
							<Col xs={24} md={8}>
								<Select
									placeholder={'WareHouse'}
									// value={selectWh}
									onChange={(value) => { onRackChange(value); }}
									allowClear
									showSearch
									style={{width: '80%'}}
									filterOption={(input, option) =>
										(option!.children as unknown as string)
											.toString()
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								>
									{whs?.map((racks) => (
										<Option key={racks.id} value={racks.id}>
											{racks.wareHouseCode}
										</Option>
									))}
								</Select>
							</Col>
						</Row>

					</Form.Item>

				</Form>
				<Table dataSource={racksdata}
					scroll={{ x: 'max-content' }} style={{minWidth: '100%'}}
					size="small" columns={rackColumns} bordered>

				</Table>
			</Card>
			<Modal
				title={
					<span
						style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
					>
						{isTitle}
					</span>
				}
				width={800}
				open={isModalOpen}
				onOk={createRack}
				okText={oktext}
				cancelText="Close"
				onCancel={handleCancel}
				cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
			>
				<Divider type="horizontal"></Divider>
				<FgRacksCreateForm formRef={formRef} initialvalues={selectedRecord || {}} />
			</Modal>
			<>
				<Modal
					style={{ top: 10 }}
					width={432}
					title={
						<React.Fragment>
							Print Barcodes{' '}
							<Button type="primary" onClick={printAllBarCodes}>
								Print
							</Button>{' '}
						</React.Fragment>
					}
					open={showBarCodeModel}
					onCancel={hideModal}
					footer={null}
				>
					<div id="printArea" style={{ width: '384px' }}>
						{racksdata.map((racks, i) => (
							<div key={'r' + i} className="label" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
								<QRCode
									value={racks?.barcodeId || ''}
								/>
								<div>
									<div style={{ padding: '5px', fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>Rack</div>
									<div style={{ padding: '5px', fontSize: '15px', fontWeight: 500 }}>Name : {racks?.code}</div>
									<Barcode
										value={racks?.barcodeId || ''}
										displayValue={true}
										fontSize={14}
										width={1}
										height={30}
										format="CODE128"
									/>
								</div>
							</div>
						))}
					</div>
				</Modal>
			</>
		</div>
	);
};
export default FgCreateRacks;


