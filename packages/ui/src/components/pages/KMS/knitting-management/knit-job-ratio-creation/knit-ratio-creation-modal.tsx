import { KC_KnitGroupPoSerialRequest, KC_KnitGroupQtySummaryModel, KC_KnitRatioCreationRequest, ProcessTypeEnum, MOC_MoProductFabConsumptionModel, KC_KnitGroupRatioModel, KC_KnitGroupSizeRatioModel, KC_KnitGroupRatioStatusModel, KC_KnitJobGenStatusEnum, KC_KnitJobConfStatusEnum, StyleProductCodeFgColor } from "@xpparel/shared-models";
import { KnittingManagementService } from "@xpparel/shared-services";
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Row, Space, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useMemo, useState } from "react";



interface KnitJobRatioProps {
	selectedKnitGroup: KC_KnitGroupQtySummaryModel,
	isModalVisible: boolean,
	closeModal: (isReload: boolean) => void,
	columns: ColumnsType<KC_KnitGroupQtySummaryModel>,
	activeProduct: StyleProductCodeFgColor
	productMap: Map<string, { quantity: number }>
	processingSerial: number
}


interface IConsumption {
	component: string;
	itemCode: string;
	[key: string]: any
}
interface IAddRatioTbl {
	labelName: string;
	key: string;
	[key: string]: any
}
const labelObjects = [
	{ label: 'Total qty for this ratio', key: 'totalQtyForTheRatio' },
	{ label: 'Per job Qty', key: 'knitJobQty' },
	{ label: 'Logical Bundle Quantity', key: 'logicalBundleQuantity' }
];
export default function KnitRatioCreationSummaryModal(props: KnitJobRatioProps) {
	const [form] = Form.useForm();
	const { productMap, selectedKnitGroup, processingSerial, activeProduct, closeModal } = props
	const [knitGroupQtySummaryData, setKnitGroupQtySummaryData] = useState<KC_KnitGroupQtySummaryModel[]>([]);
	const [itemCunsumptionData, setItemCunsumptionData] = useState<MOC_MoProductFabConsumptionModel[]>([])

	const [kgSummaryTableData, setKgSummaryTableData] = useState<any[]>([])
	const [addedRatioQty, setAddedRatioQty] = useState<any>({})
	const [itemConsumptionTableData, setItemConsumptionTableData] = useState<IConsumption[]>([])
	const [consumptionEntryTableData, setConsumptionEntryTableData] = useState<IAddRatioTbl[]>([])
	const uniqueSizes = Array.from(
		new Set(selectedKnitGroup.sizeWiseKnitGroupInfo?.map((sizeInfo) => sizeInfo.size) || [])
	);
	const [checkedSizes, setCheckedSizes] = useState<string[]>(uniqueSizes)
	const user = useAppSelector((state) => state.user.user.user);

	const kmsService = new KnittingManagementService();






	useEffect(() => {
		getKnitGroupQtySummaryForPoAndKnitGroup()
		getComponentLevelItemConsumptionForKnitGroup()
	}, [])



	const getKnitGroupQtySummaryForPoAndKnitGroup = async () => {
		try {
			const req = new KC_KnitGroupPoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedKnitGroup.knitGroup, processingSerial, activeProduct.productCode, activeProduct.fgColor, ProcessTypeEnum.KNIT, true)
			const res = await kmsService.getKnitGroupQtySummaryForPoAndKnitGroup(req)
			if (res.status) {
				setKnitGroupQtySummaryData(res.data)
				constructKnitGroupsummaryDataSource(res.data);
				constructQtysEntryTableData(res.data)


			}
		} catch (err) {
			console.error(err)
		}
	}

	const getComponentLevelItemConsumptionForKnitGroup = async () => {
		try {
			const req = new KC_KnitGroupPoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, selectedKnitGroup.knitGroup, processingSerial, activeProduct.productCode, activeProduct.fgColor, ProcessTypeEnum.KNIT, true)
			const res = await kmsService.getComponentLevelItemConsumptionForKnitGroup(req);
			if (res.status) {
				setItemCunsumptionData(res.data)
				constructItemwiseConsumptionTableData(res.data);
			} else {
				AlertMessages.getErrorMessage(res.internalMessage);
			}
		} catch (err) {
			AlertMessages.getErrorMessage(err.message);
		}
	}



	// ----------------------- knit group summary table logics --------------------------------
	function constructKnitgroupSummaryColumns() {

		const poAndKnitSizeColumns: ColumnsType<KC_KnitGroupQtySummaryModel> = uniqueSizes.map(size => ({
			title: size,
			dataIndex: size,
			key: size,
			width: '70',
			align: 'center',
			render: (v, record: KC_KnitGroupQtySummaryModel) => {
				return (
					<Space size={4}>
						<Tooltip title="Knit Order Qty">
							<Tag className='s-tag' color="#257d82">{v?.orderQty || 0}</Tag>
						</Tooltip>
						<Tooltip title="Knit Ratio Qty">
							<Tag className='s-tag' color="#da8d00">{v?.ratioQty || 0}</Tag>
						</Tooltip>
						<Tooltip title="Current Ratio Quantity">
							<Tag color="#5adb00">{v?.currentRatioQty || 0}</Tag>
						</Tooltip>
						<Tooltip title={v?.pendingQty > 0 ? "Pending Qty" : "Excess Qty"}>
							<Tag >
								{v?.newPendingQty === undefined ? v?.pendingQty : v?.newPendingQty}
							</Tag>
						</Tooltip>
					</Space>
				);
			}
		}));
		return [
			...props.columns,
			...poAndKnitSizeColumns
		]
	}


	function constructKnitGroupsummaryDataSource(data) {
		if (data.length) {
			const sizeQtys = {}
			const tempData = data.map((v) => {
				const obj = {
					knitGroup: v.knitGroup,
					components: v.components,
					itemCodes: v.itemCodes,
				};



				v.sizeWiseKnitGroupInfo.forEach(({ size, knitRatioQty }) => {
					const productKey = `${props.activeProduct.productCode}-${props.activeProduct.fgColor}-${size}`;
					const orderQty = productMap.get(productKey)?.quantity || 0;
					const pendingQty = orderQty - parseFloat((knitRatioQty).toFixed(2));

					obj[size] = {
						orderQty: orderQty,
						ratioQty: Math.round(knitRatioQty), // Round off ratioQty
						pendingQty: pendingQty,
						newPendingQty: 0,
						currentRatioQty: Math.abs(pendingQty), // Round off currentRatioQty
					};
					sizeQtys[size] = pendingQty > 0 ? pendingQty : 0
				});
				return obj
			});

			setAddedRatioQty(sizeQtys)
			setKgSummaryTableData(tempData)
		}

	}


	//----------------------- item wise consumption table logics --------------------------------

	function constructItemwiseConsumptionTableData(data: MOC_MoProductFabConsumptionModel[]) {
		if (data?.length && uniqueSizes.length) {
			const tempData: IConsumption[] = data?.flatMap((product) =>
				product.fabCons.map((fab) => ({
					component: fab.component,
					itemCode: fab.itemCode,
					...Object.fromEntries(
						uniqueSizes.map((size) => [
							size,
							fab.sizeCons.find((s) => s.size === size)?.cons ?? 0,
						])
					),
				}))
			) || [];
			setItemConsumptionTableData(tempData)
		}
	}
	function constructItemwiseConsumptionTableColumns() {
		if (itemCunsumptionData.length) {
			const consumptionColumns: ColumnsType<any> = [
				{ title: "Component", dataIndex: "component", key: "component", align: "center" as const, fixed: "left" },
				{ title: "Item", dataIndex: "itemCode", key: "itemCode", align: "center" as const, fixed: "left" },
				...uniqueSizes.map((size) => ({
					title: `${size}`,
					dataIndex: size,
					key: size,
					align: "center" as const,
					render: (cons?: number) => {
						return <Space>
							<Tooltip title={'Per piece consumption'}>
								<Tag className='s-tag' >{cons}</Tag>
							</Tooltip>
							<Tooltip title={"Overall consumption"}>
								<Tag className='s-tag' >{Math.round(Number(addedRatioQty[size]) * Number(cons))}</Tag>
							</Tooltip>
						</Space>
					},
				})),
			];
			return consumptionColumns;
		}
		return []
	}


	//----------------------- Qtys entry table logics -----------------------------------------

	function constructQtysEntryTableData(data) {
		if (data.length) {

			const tempData: IAddRatioTbl[] = labelObjects.map((l, i) => {
				const sizeQtys = {}
				data[0].sizeWiseKnitGroupInfo.forEach((s) => {
					const productKey = `${props.activeProduct.productCode}-${props.activeProduct.fgColor}-${s.size}`;
					const orderQty = productMap.get(productKey)?.quantity || 0;
					const pendingQty = orderQty - parseFloat((s.knitRatioQty).toFixed(2));
					if (l.key === 'knitJobQty') {
						sizeQtys[s.size] = 0
					}
					if (l.key === 'totalQtyForTheRatio') {
						sizeQtys[s.size] = pendingQty > 0 ? pendingQty : 0
					}
					if (l.key === 'logicalBundleQuantity') {
						sizeQtys[s.size] = 0

					}
				})
				return { labelName: l.label, key: l.key, ...sizeQtys }
			})
			setConsumptionEntryTableData(tempData)
		}

	}

	function constructQtysEntryTableColumns(): any {
		const qtysEntryColumns: ColumnsType<any> = uniqueSizes.map(size => ({
			title: <span>{`${size}  `}  <Checkbox style={{ color: 'blue' }} checked={checkedSizes.includes(size)}
				onChange={() => onCheckboxChange(size)} /></span>,
			dataIndex: size,
			key: size,
			width: '70px',
			align: "center",
			render: (_: any, record: any) => (
				<Form.Item name={record.key + "-" + size} key={record.key + size} initialValue={record[size]}   >
					<InputNumber

						disabled={!checkedSizes.includes(size)}
						defaultValue={record[size]}
						placeholder={`Enter ${record.labelName}`}
						key={record.labelName + size}
						// value={record[size]}
						onChange={(e) => onKnitJobQtyChange(e, record, size)}
					/>
				</Form.Item>
			)
		}));
		return [
			{
				title: '',
				dataIndex: 'labelName',
				width: 250
			},
			// {
			// 	title: 'All sizes',
			// 	dataIndex: 'allSizes',
			// 	key: 'allSizes',
			// 	width: '70px',
			// 	align: "center",
			// 	render: (_: any, record: any) => (
			// 		<Form.Item name={record.labelName } key={record.labelName }  >
			// 			<Input
			// 				placeholder={`Enter ${record.labelName}`}
			// 				// value={record[size]}
			// 				// onChange={(e) => onKnitJobQtyChange(e, record, size)}
			// 			/>
			// 		</Form.Item>
			// 	)
			// },

			...qtysEntryColumns
		];
	}

	function onCheckboxChange(size: string) {
		if (checkedSizes.includes(size)) {
			form.setFieldsValue({
				[`totalQtyForTheRatio-${size}`]:0,
				[`knitJobQty-${size}`]:0,
				[`logicalBundleQuantity-${size}`]:0				
			})
			onKnitJobQtyChange(0, { labelName: labelObjects[0].label }, size)
		}
		setCheckedSizes(prev =>
			prev.includes(size)
				? prev.filter(s => s !== size)
				: [...prev, size]
		);
	}

	function onKnitJobQtyChange(e, record, size) {
		const newValue = Number(e) || 0;

		if (record.labelName === labelObjects[0].label) {
			setAddedRatioQty((prev) => {
				const obj = {
					...prev, [size]: newValue
				}
				return obj
			}
			)

			setKgSummaryTableData((prev) => {
				if (!prev.length) return prev;
				const updatedData = { ...prev[0] };
				if (updatedData[size]) {
					updatedData[size] = {
						...updatedData[size],
						currentRatioQty: newValue,
						newPendingQty: Math.abs(updatedData[size].pendingQty - newValue), // Update pendingQty
					};
				}

				return [updatedData];
			});

		}
	}


	//current ratio quantity
	//item consumption quantity
	//total ratio consumption quantity


	function renderKnitGroupSummaryTable() {
		const columns = constructKnitgroupSummaryColumns()
		return <Table dataSource={kgSummaryTableData} columns={columns} pagination={false} rowKey="knitGroupModel" bordered size='small' scroll={{ x: 1200 }} />
	}

	function onReset() {
		form.resetFields()
	}


	// create knit group ratio
	const createKnitGroupRatio = async () => {
		try {
			const formValues = form.getFieldsValue()
			const { ratioName, remarks } = formValues
			const knitGroupSizeRatioarr: KC_KnitGroupSizeRatioModel[] = []
			const knitGroupRatioStatus = new KC_KnitGroupRatioStatusModel(KC_KnitJobGenStatusEnum.OPEN, KC_KnitJobConfStatusEnum.OPEN)

			for (const size of uniqueSizes) {
				if (checkedSizes.length === 0) {
					AlertMessages.getErrorMessage(`Please select at least one size`)
					return
				}
				if (!checkedSizes.includes(size)) continue
				const ratioQty: number = formValues[`totalQtyForTheRatio-${size}`]
				const jobQty: number = formValues[`knitJobQty-${size}`]
				const logicalBundleQty: number = formValues[`logicalBundleQuantity-${size}`]
				if (jobQty < 1) {
					AlertMessages.getErrorMessage(`Job quantity should be greater than 0 for size - ${size}`)
					return
				}
				if (logicalBundleQty < 1) {
					AlertMessages.getErrorMessage(`Logical bundle quantity should be greater than 0 for size - ${size}`)
					return
				}
				if (ratioQty < 1) {
					AlertMessages.getErrorMessage(`Logical bundle quantity should be greater than 0 for size - ${size}`)
					return
				}
				if (jobQty > ratioQty) {
					AlertMessages.getErrorMessage(`Job quantity cannot be greater than Total ratio quantity for size - ${size}`)
					return
				}
				if (logicalBundleQty > ratioQty) {
					AlertMessages.getErrorMessage(`Logical bundle quantity cannot be greater Total than ratio quantity for size - ${size}`)
					return
				}
				const sizeRatio = new KC_KnitGroupSizeRatioModel(size, ratioQty, jobQty, logicalBundleQty)
				knitGroupSizeRatioarr.push(sizeRatio)
			}

			const knitGroupRatios = new KC_KnitGroupRatioModel(selectedKnitGroup.knitGroup, activeProduct.productCode, activeProduct.productCode, activeProduct.productName, processingSerial, activeProduct.fgColor, 0, knitGroupSizeRatioarr, knitGroupRatioStatus, selectedKnitGroup.itemCodes, selectedKnitGroup.components)


			const req = new KC_KnitRatioCreationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, processingSerial, activeProduct.productName, [knitGroupRatios], ProcessTypeEnum.KNIT, ratioName, remarks)
			const res = await kmsService.createKnitGroupRatio(req);
			if (res.status) {
				closeModal(true)
				AlertMessages.getSuccessMessage(res.internalMessage)
			} else {
				AlertMessages.getErrorMessage(res.internalMessage)
			}

		} catch (err) {
			AlertMessages.getErrorMessage(err.message)
			console.error(err)
		}
	}

	return (
		<div>

			{kgSummaryTableData.length ? renderKnitGroupSummaryTable() : <></>}

			<Divider >Consumption</Divider>
			{kgSummaryTableData.length ? <Table
				dataSource={itemConsumptionTableData}
				columns={constructItemwiseConsumptionTableColumns()}
				pagination={false}
				bordered
				rowKey="itemCode"
				size='small' scroll={{ x: 1200 }}
			/> : <></>}

			<br />
			{kgSummaryTableData.length ? <Form form={form} layout="vertical">
				{kgSummaryTableData.length ? <Table
					dataSource={consumptionEntryTableData}
					columns={constructQtysEntryTableColumns()}
					pagination={false}
					rowKey="key"
					size="small"
					bordered
					scroll={{ x: 1200 }}
				/> : <></>}
				<br />
				<Row gutter={16} justify={'center'}>
					<Col span={4}>
						<Form.Item label='Ratio Name' name='ratioName' rules={[{ required: true, message: 'Ratio name is required' }]}>
							<Input placeholder="Enter Ratio Name" />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item label='Remarks' name='remarks'>
							<Input placeholder="Enter Remarks" />
						</Form.Item>
					</Col>
					<Col >
						<Space>
							<Button style={{ marginTop: '30px' }} size='middle' type="primary" onClick={createKnitGroupRatio}>Save</Button>

							<Button onClick={onReset} style={{ marginTop: '30px' }} size='middle' danger >Reset</Button>
						</Space>
					</Col>
				</Row>
			</Form> : <></>}
		</div>
	)
}
