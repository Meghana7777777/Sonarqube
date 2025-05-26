import { AuditOutlined, CheckCircleOutlined, CloseCircleOutlined, FileProtectOutlined, FolderOpenOutlined, FolderOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, ItemsModelDto, MaterialTypeEnum, MrnStatusEnum, PackItemsModel, PackJobItems, PackJobResponseModel, PackJobsByPackListIdsRequest, PackListCreateModel, PackMAterialRequest, PackMatReqModel, PackSerialDropDownModel, PackSerialNumberReqDto, PK_ItemWiseAllocationModel_C, PK_ItemWiseMaterialRequirementModel, PONoRequest } from "@xpparel/shared-models";
import { ItemsServices, PackListViewServices, PackMaterialReqServices, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Table, Tabs } from "antd";
import { PackMAterialsForPackLists } from "packages/libs/shared-models/src/pkms/packing-material-request/pack-mat-req-response.model";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../common";
import { AlertMessages } from "../../../common";
import PKMaterialSelectionTab from "./material-selection-grid";
import { PKMaterialJobsColumns } from "./pk-job-material-interface";

const { Option } = Select;
export const PackingMaterialCreate = () => {
	const [poData, setPoData] = useState<PackSerialDropDownModel[]>([]);
	const [packListData, setPackListData] = useState<PackListCreateModel[]>([]);
	const [itemsData, setItemsData] = useState<ItemsModelDto[]>([]);
	const [selectedPackList, setSelectedPackList] = useState(null);
	const [selectedJobs, setSelectedJobs] = useState<PackJobItems[]>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
	const [itemSummaryData, setItemSummaryData] = useState<PackItemsModel[]>([]);
	const [extraItemData, setExtraItemData] = useState<PackItemsModel[]>([]);

	const [packJobItemsData, setPackJobItemsData] = useState<PackJobResponseModel>();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [materialsData, setMaterialsData] = useState<PK_ItemWiseMaterialRequirementModel[]>([]);

	const [formRef] = Form.useForm();
	const [itemsAddFormRef] = Form.useForm();


	const user = useAppSelector((state) => state.user.user.user);
	const { userName, orgData, userId } = user;

	const preIntegrationService = new PreIntegrationServicePKMS();
	const packListService = new PackListViewServices();
	const mrService = new PackMaterialReqServices();
	const itemsService = new ItemsServices();


	useEffect(() => {
		getAllPos();
	}, []);

	useEffect(() => {
		const itemGroupByData = new Map<number, PackItemsModel>();
		for (const job of selectedJobs) {
			for (const jobItem of job.itemsData) {
				if (!itemGroupByData.has(jobItem.itemsId)) {
					itemGroupByData.set(jobItem.itemsId, JSON.parse(JSON.stringify(jobItem)))
				} else {
					itemGroupByData.get(jobItem.itemsId).qty += jobItem.qty
				}
			}
		}
		for (const extra of extraItemData) {
			if (!itemGroupByData.has(extra.itemsId)) {
				itemGroupByData.set(extra.itemsId, JSON.parse(JSON.stringify(extra)))
			} else {
				itemGroupByData.get(extra.itemsId).qty += extra.qty
			}
		}
		setItemSummaryData(Array.from(itemGroupByData.values()))
	}, [selectedJobs, extraItemData]);




	const getAllPos = () => {
		const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
		preIntegrationService.getAllPackSerialDropdownData(reqObj)
			.then((res) => {
				if (res.status) {
					setPoData(res.data);
				} else {
					AlertMessages.getErrorMessage(res.internalMessage);
					setPoData([]);
				}
			})
			.catch((err) => {
				AlertMessages.getErrorMessage(err.message);
				setPoData([]);
			})
	};

	const getUnMappedItemsToSpecByPo = async (poId: number) => {
		const req = new PackSerialNumberReqDto(userName, orgData.unitCode, orgData.companyCode, userId, poId)
		itemsService.getUnMappedItemsToSpecByPo(req).then(res => {
			if (res.status) {
				setItemsData(res.data)
			} else {
				setItemsData([])
			}
		}).catch(error => console.log(error.message))
	}


	const getPackListsForPo = () => {
		const poNumber: number = formRef.getFieldValue('poNumber')
		const req = new PONoRequest(userName, userId, orgData.unitCode, orgData.companyCode, poNumber, undefined, undefined);
		packListService.getPackListsForPo(req)
			.then((res) => {
				if (res.status) {
					setPackListData(res.data);
				} else {
					AlertMessages.getErrorMessage(res.internalMessage);
					setPackListData([]);
				}
			})
			.catch((err) => {
				console.log(err.message);
				setPackListData([]);
			});
	};

	const getPackJobsForPackListIds = async (packListId: number) => {
		const req = new PackJobsByPackListIdsRequest(packListId, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
		mrService.getPackJobsForPackListIds(req)
			.then((res) => {
				if (res.status) {
					res.data.packJobItems.map(rec => {
						const itemsMap = new Map<number, PackItemsModel>();
						rec.itemsData.map((item) => {
							itemsMap.set(item.itemsId, { ...item, isEligibleQty: true })
						});
						rec.itemsData = Array.from(itemsMap.values())
					})
					setPackJobItemsData(res.data)
				} else {
					AlertMessages.getErrorMessage(res.internalMessage);
					setPackJobItemsData(null)
				}
			})
			.catch((err) => {
				AlertMessages.getErrorMessage(err.message);
				setPackJobItemsData(null)
			})
	}

	const handlePackListChange = (value) => {
		setSelectedPackList(value);
		setSelectedJobs([]);
	};

	const summaryColumns: any[] = [
		{
			title: "ItemCode",
			dataIndex: "itemCode",
		},
		{
			title: "Category",
			dataIndex: "itemType",
		},
		{
			title: "Quantity",
			dataIndex: "qty",
		},
		{
			title: "Quantity",
			dataIndex: "qty",
			width: 100,
			render: (v, r, i) => {
				if (r?.isEligibleQty) {
					formRef.setFieldValue([i, 'qty'], v)
				}
				return <>
					<Form.Item name={[i, `qty`]}>
						<InputNumber
							disabled={r?.isEligibleQty}
							onChange={(e) => addItemsHandler(r.itemsId, Number(e), i)}
							type="number" placeholder="Qty"
						/>
					</Form.Item>

				</>
			}
		},
	]


	let timeOutIdForAddItems;
	const addItemsHandler = (itemsId: number, qty: number, index: number) => {
		clearInterval(timeOutIdForAddItems);
		timeOutIdForAddItems = setTimeout(() => {
			setExtraItemData(prev => {
				const newVal = [...prev]
				const itemIndex = prev.findIndex(rec => rec.itemsId === itemsId);
				if (itemIndex >= 0) {
					newVal[itemIndex].qty = Number(newVal[itemIndex].qty) + Number(qty);
					return newVal;
				} else {
					const itemCode = itemsData.find(rec => rec.id === itemsId)
					newVal.push(new PackItemsModel(itemsId, itemCode.code, qty, itemCode.category, false))
					return newVal
				}
			});
			formRef.setFieldValue([index, 'qty'], 0)
		}, 500)

	}

	const poChangeHandler = async (opt) => {
		console.log(opt, 'opt');

		if (opt) {
			formRef.setFieldValue('poId', opt?.value);
			await getUnMappedItemsToSpecByPo(opt?.value)
			getPackListsForPo();
		} else {
			formRef.setFieldValue('poId', undefined);
		}

	}

	const submitHandler = async () => {
		await getPackJobsForPackListIds(selectedPackList);
	}

	const getRowSelection = () => {
		const obj = {
			columnTitle: <></>,
			selectedRowKeys: selectedRowKeys
		};
		obj['getCheckboxProps'] = (record: PackJobItems) => ({
			disabled: record.isMaterialCreated ? true : false,
			selected: true,
			style: {
				color: 'red'
			}
		});

		obj['onChange'] = (selectedRowKeys: number[], selectedRows: PackJobItems[]) => {
			setSelectedRowKeys(selectedRowKeys);
			setSelectedJobs(selectedRows);
		};
		return obj;
	}

	const handleItemOnChange = (opt) => {
		itemsAddFormRef.setFieldValue('itemType', opt.itemType);
		itemsAddFormRef.setFieldValue('itemCode', opt.itemCode);
	}



	const deleteHandler = (itemId: number) => {
		setExtraItemData(prev => {
			return prev.filter(rec => rec.itemsId !== itemId);
		})
	}





	const getBOMInfoForPackJobs = () => {
		const poNumber: number = formRef.getFieldValue('poNumber')
		const packListId: number = formRef.getFieldValue('packListId')
		const req = new PackMatReqModel(poNumber, packListId, undefined, selectedJobs, extraItemData, [], user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId)
		mrService.getBOMInfoForPackJobs(req)
			.then((res) => {
				if (res.status) {
					setMaterialsData(res.data);
					setIsModalVisible(true);
				} else {
					setMaterialsData([]);
					setIsModalVisible(false);
					AlertMessages.getErrorMessage(res.internalMessage);
				}
			})
			.catch((err) => {
				setIsModalVisible(false);
				setMaterialsData([]);
				AlertMessages.getErrorMessage(err.message);
			})
	}
	const createMaterialRequest = (materialRequiredDate: any, allocatedObjects: PK_ItemWiseAllocationModel_C[]) => {
		let isItemCodeEmpty = false;
		let itemCode = "";
		for (const rec of allocatedObjects) {
			if (rec.objectWiseDetail.length == 0) {
				isItemCodeEmpty = true;
				itemCode = rec.itemCode;
				break;
			}
		}
		if (isItemCodeEmpty) {
			AlertMessages.getErrorMessage("Please allocate warehouse items for " + itemCode);
			return
		}
		// const poId: number = formRef.getFieldValue('poId')
		const poNumber: number = formRef.getFieldValue('poNumber')
		const packListId: number = formRef.getFieldValue('packListId')
		const req = new PackMatReqModel(poNumber, packListId, materialRequiredDate, selectedJobs, extraItemData, allocatedObjects, user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId)
		mrService.createMaterialRequest(req)
			.then((res) => {
				if (res.status) {
					AlertMessages.getSuccessMessage("Pack Material Request Raised for Selected Pack Jobs");
					getPackJobsForPackListIds(packListId);
					closeModal(true);
				} else {
					AlertMessages.getErrorMessage(res.internalMessage);
				}
			})
			.catch((err) => {
				AlertMessages.getErrorMessage(err.message);
			})
	}
	const closeModal = (isReload: boolean = false) => {
		setIsModalVisible(false);
		if (isReload) {
			setSelectedRowKeys([]);
			setSelectedJobs([]);
			setSelectedRowKeys([]);
			setItemSummaryData([]);
			setExtraItemData([]);
		}
	}
	return (
		<Card title={<span><AuditOutlined style={{ marginRight: 4 }} />Pack BOM Request</span>} size='small' className='MRN Request'>
			<Form form={formRef} layout='horizontal'>
				<Row gutter={[16, 16]}>
					 <Col xs={24} sm={24} md={9} lg={7} xl={6}>
						<Form.Item
							label="Pack Order No"
							name='poNumber'
							rules={[{ required: true, message: 'Please Select Pack Order No' }]}>
							<Select
								allowClear
								placeholder='Select Pack Order No'
								onChange={(val, opt) => poChangeHandler(opt)}
								filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}
								showSearch

							>
								{poData.map((po) => (
									<Select.Option key={po.packSerial} value={po.packSerial}>
										{po.packSerial}-{po.packOrderDescription}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item name={'poId'} hidden>
							<Input />
						</Form.Item>
					</Col>
					 <Col xs={24} sm={24} md={9} lg={7} xl={6}>
						<Form.Item
							label="Pack List"
							name='packListId'
							rules={[{ required: true, message: 'Please Select Pack List' }]}>
							<Select
								placeholder='Select Pack List'
								onChange={handlePackListChange}
								value={selectedPackList}
								filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
								showSearch
								allowClear
							>
								{packListData.map((list) => (
									<Option key={list.plConfigId} value={list.plConfigId}>
										{list.plConfigNo}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col style={{marginBottom: '10px'}}>
						<Button type="primary" style={{ width: "150px" }} onClick={submitHandler}>
							Submit
						</Button>
					</Col>
				</Row>
			</Form>

			{selectedJobs.length > 0 && (
				<Card size="small" title={'Pack Material Summary'} extra={<></>}>
					<Form form={formRef}>
						<Table
							size="small"
							columns={summaryColumns}
							dataSource={itemSummaryData}
							pagination={false}
							bordered
							rowKey="packJobId"
							scroll={{x: 'max-content'}}
						/>
					</Form>

					<Button
						type="primary"
						style={{ marginTop: 10, float: 'right' }}
						onClick={getBOMInfoForPackJobs}
					>
						Allocated BOM
					</Button>
				</Card>
			)}
			<br />
			<h4>Selected Pack Job Items</h4>

			<Table
				style={{ marginTop: 10 }}
				size="small"
				columns={PKMaterialJobsColumns}
				dataSource={packJobItemsData?.packJobItems}
				pagination={false}
				rowKey={record => record.packJobId}
				bordered
				scroll={{x: 'max-content'}}
				rowSelection={{
					type: 'checkbox',
					...getRowSelection(),
				}}
			/>
			<Modal
				title={`Request Materials`}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={'100%'}
				style={{ top: '0' }}
				destroyOnClose
				maskClosable={false}
			>
				<PKMaterialSelectionTab closeModal={e => closeModal(e)} materialsData={materialsData} packListId={formRef.getFieldValue('packListId')} poSerial={formRef.getFieldValue('poNumber')} selectedJobs={selectedRowKeys} selectedJobTableData={selectedJobs} createMaterialRequest={createMaterialRequest} />
			</Modal>

		</Card>
	)

};

export default PackingMaterialCreate;
