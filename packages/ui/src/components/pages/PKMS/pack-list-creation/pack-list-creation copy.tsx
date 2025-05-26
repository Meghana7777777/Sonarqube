import { EyeOutlined, FileAddOutlined } from "@ant-design/icons";
import { CartonPrototypeModel, CartonSpecModel, CommonIdReqModal, CommonRequestAttrs, PackingMethodsEnum, PackListCreateModel, PackSerialDropDownModel, PackSerialNumberReqDto, PackSerialRequest, PackSpecDropDownDtoModel, PackTypeModelDto, PLGenQtyInfoModel, PlLineInfo, PLSubLineQtyModel, PolyBagPrototypeModel, PolyBagSizeRatio, PONoRequest } from "@xpparel/shared-models";
import { PackingSpecServices, PackListService, PackTypeService, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Button, Card, Col, Descriptions, Drawer, Form, Input, InputNumber, Row, Select, Space, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../common";
import { AlertMessages } from "../../../common";
import { CartonSummaryPreview } from "./carton-summary-preview";
import { PackFormGrid } from "./pack-form-grid";
import { PLGenQtySummaryGrid } from "./pl-gen-qty-summary-grid";
export interface IPlLineInfoColumns extends PlLineInfo {
	total: number;
	isHavingPendingQty: boolean;
	[key: string]: any;
}
export interface IPLSubLineQtyModel extends PLSubLineQtyModel {
	max: number
}

interface PackCreationIProps {
	selectedSummeryRecord?: PackSerialRequest
}

const { Option } = Select;

export const PackListCreation = (props: PackCreationIProps) => {
	const { selectedSummeryRecord } = props;
	const [openPlGenQtyDrawer, setOpenPlGenQtyDrawer] = useState<boolean>(false);
	const [poData, setPoData] = useState<PackSerialDropDownModel[]>([]);
	const [ptData, setPtData] = useState<PackTypeModelDto[]>()
	const [plData, setPlData] = useState<PLGenQtyInfoModel>();
	const [tblData, setTblData] = useState<IPlLineInfoColumns[]>([]);
	const [packSpecs, setPackSpecs] = useState<PackSpecDropDownDtoModel[]>([]);
	const [tblColumns, setTblColumns] = useState<ColumnsType<IPlLineInfoColumns>>([]);
	const [subLineToIdMap, setSubLineToIdMap] = useState<Map<number, Map<string, PLSubLineQtyModel>>>(new Map());
	const [lineToIdMap, setLineToIdMap] = useState<Map<number, string>>(new Map());
	const [plRatioMaxMap, setPlRatioMaxMap] = useState<Map<number, Map<string, number>>>(new Map());
	const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
	const [packMethod, setPackMethod] = useState();
	const [cartonSpecData, setCartonSpecData] = useState<CartonSpecModel>();
	const [cartonMap, setCartonMap] = useState<Map<string, CartonPrototypeModel>>(new Map());

	const [formRef] = Form.useForm();
	const [headerFormRef] = Form.useForm();

	const user = useAppSelector((state) => state.user.user.user);
	const { userName, orgData, userId } = user
	const preIntegrationService = new PreIntegrationServicePKMS();
	const packingListService = new PackListService();
	const packTypeService = new PackTypeService()
	const packingSpecService = new PackingSpecServices();


	useEffect(() => {
		getAllPos();
		getAllPackTypes();
		getAllSpecDropdownData();
		if (selectedSummeryRecord) {
			headerFormRef.setFieldValue('poId', selectedSummeryRecord?.packSerial);
		}
		getPoToPLGenQtyInfo(headerFormRef.getFieldValue('poId'));
	}, []);

	const getAllSpecDropdownData = () => {
		const req = new PackSerialNumberReqDto(userName, orgData.unitCode, orgData.companyCode, userId,undefined);
		packingSpecService.getAllSpecDropdownData(req).then(res => {
			if (res.status) {
				setPackSpecs(res.data)
			} else {
				setPackSpecs([])
			}
		}).catch(err => {
			console.log(err.message)
			setPackSpecs([])
		});
	};

	const getCartonSpecData = (specId: number) => {
		const req = new CommonIdReqModal(specId, userName, orgData.unitCode, orgData.companyCode, userId);
		packingSpecService.getCartonSpecData(req).then(res => {
			if (res.status) {
				setCartonSpecData(res.data)
			} else {
				setCartonSpecData(undefined)
			}
		}).catch(err => {
			console.log(err.message)
			setCartonSpecData(undefined)
		});
	};

	useEffect(() => {
		if (uniqueSizes.length && subLineToIdMap.size && plRatioMaxMap.size)
			constructColumns(uniqueSizes, subLineToIdMap);
	}, [uniqueSizes, subLineToIdMap, plRatioMaxMap]);


	const getAllPackTypes = () => {
		const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId)
		packTypeService.getAllPackTypesDropDown(req).then(res => {
			if (res.status) {
				setPtData(res.data)
			} else {
				setPtData([])
			}
		}).catch(err => {
			console.log(err.message)
			setPtData([])
		})
	}

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


	const closePlGenQtySummary = () => {
		setOpenPlGenQtyDrawer(false);
	};
	const openPlGenQtySummary = () => {
		setOpenPlGenQtyDrawer(true);
	};

	const getPoToPLGenQtyInfo = (poId) => {
		const reqObj = new PackSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poId, undefined, undefined, undefined);
		packingListService.getPoToPLGenQtyInfo(reqObj)
			.then((res) => {
				if (res.status) {
					setPlData(res.data);
					constructTblData(res.data.plLines);
				} else {
					AlertMessages.getErrorMessage(res.internalMessage);
					setPlData(undefined);
				}
			})
			.catch((err) => {
				AlertMessages.getErrorMessage(err.message);
				setPlData(undefined);
			})
	}

	const constructTblData = (plLinesData: PlLineInfo[]) => {
		const lineData: PlLineInfo[] = JSON.parse(JSON.stringify(plLinesData));
		const uniqueSizes = new Set<string>();
		const subLineToIdMapLocal: Map<number, Map<string, PLSubLineQtyModel>> = new Map();
		const plRatioMaxMapLocal: Map<number, Map<string, number>> = new Map(plRatioMaxMap)
		const lineToIdMapLocal: Map<number, string> = new Map(lineToIdMap);
		// Transform data to include columns for each size
		const dataSource = lineData.map((item, index) => {
			if (!subLineToIdMapLocal.has(item.lineId)) {
				subLineToIdMapLocal.set(item.lineId, new Map())
			}
			if (!lineToIdMapLocal.has(item.lineId)) {
				// lineToIdMapLocal.set(item.lineId, item.lineDesc)
			}
			if (!plRatioMaxMapLocal.has(item.lineId)) {
				plRatioMaxMapLocal.set(item.lineId, new Map())
			}
			let isHavingPendingQty = false;
			const sizesData = {};
			let total = 0
			item.subLineQuantities.forEach(qty => {
				uniqueSizes.add(qty.subLine);
				if (!subLineToIdMapLocal.get(item.lineId).has(qty.subLine)) {
					subLineToIdMapLocal.get(item.lineId).set(qty.subLine, qty)
				}
				if (!plRatioMaxMapLocal.get(item.lineId).has(qty.subLine)) {
					plRatioMaxMapLocal.get(item.lineId).set(qty.subLine, qty.quantity - qty.plGenQty)
				}
				const orderQty = qty.quantity + qty.addQuantity;
				sizesData[qty.subLine] = orderQty
				if (orderQty - qty.plGenQty > 0) {
					isHavingPendingQty = true;
				}
				total += qty.quantity + qty.addQuantity;
			});
			return {
				...item,
				...sizesData,
				total,
				isHavingPendingQty
			};
		});
		setTblData(dataSource);
		setSubLineToIdMap(subLineToIdMapLocal);
		setPlRatioMaxMap(plRatioMaxMapLocal);
		setLineToIdMap(lineToIdMapLocal);
		const uniqueSizesArray = Array.from(uniqueSizes)
		setUniqueSizes(uniqueSizesArray);
	}

	const constructColumns = (uniqueSizes: string[], subLineToIdMapLocal: Map<number, Map<String, PLSubLineQtyModel>>) => {
		// Define dynamic columns for each size
		const columns: ColumnsType<IPlLineInfoColumns> = [
			{
				title: 'Color',
				dataIndex: 'line',
				key: 'line',
				width: 150,
				align: 'center',
				fixed: 'left', 
			},
			{
				title: 'Color',
				dataIndex: 'lineDesc',
				key: 'lineDesc',
				width: 150,
				align: 'center',
				fixed: 'left',
				// render: (productTypes) => productTypes,
			}
		];
		uniqueSizes.forEach(size => {
			columns.push({
				title: size,
				dataIndex: size,
				key: size,
				align: 'center',
				render: (orderQty, record: IPlLineInfoColumns) => {
					const sizeObj = subLineToIdMapLocal?.get(record.lineId)?.get(size);
					const ratioQty = sizeObj ? sizeObj.plGenQty : 0;
					const pendingQty = (orderQty ? orderQty : 0) - ratioQty;
					const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
					return <>
						<Space size={2}>
							<Space size={2} direction='vertical'>
								<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty ? orderQty : 0}</Tag></Tooltip>
								<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='PlGen Qty'><Tag className='s-tag' color="#da8d00">{ratioQty}</Tag></Tooltip>
							</Space>
							<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} className='s-tag' title={pendingQty > 0 ? 'Pending Qty' : "Excess Qty"}><Tag style={{ height: '48px', paddingTop: '11px' }} color={pQtyColor}>{Math.abs(pendingQty)}</Tag></Tooltip>
						</Space>
					</>
				},
			})
		})
		const totalColumn: ColumnsType<IPlLineInfoColumns> = [{
			title: 'Total',
			dataIndex: 'total',
			key: 'total',
			align: 'center',
			fixed: 'right',
			render: (_: any, record: IPlLineInfoColumns) => {
				let orderQty = 0;
				let ratioQty = 0;
				let pendingQty = 0;
				let excessQty = 0;

				record.subLineQuantities.forEach(poQty => {
					const oQty = poQty.quantity + poQty.addQuantity;
					const rQty = poQty.plGenQty;
					const pQty = oQty - rQty;
					pQty > 0 ? pendingQty += pQty : excessQty += pQty;
					orderQty += oQty
					ratioQty += rQty;
				})
				const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
				return <Space direction='vertical' size={2}>
					<Space size={2}>
						<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty ? orderQty : 0}</Tag></Tooltip>
						<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='PlGen Qty'><Tag className='s-tag' color="#da8d00">{ratioQty}</Tag></Tooltip>
					</Space>
					<Space size={2}>
						<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={'Pending Qty'}><Tag className='s-tag' color={pQtyColor}>{pendingQty}</Tag></Tooltip>
						<Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title={'Excess Qty'}><Tag className='s-tag' color="#001d24">{Math.abs(excessQty)}</Tag></Tooltip>
					</Space>
				</Space>
			},
		}];
		columns.push(...totalColumn);
		setTblColumns(columns);
	}

	const getPoHandler = () => {
		if (headerFormRef.getFieldValue('poId') && headerFormRef.getFieldValue('packSpec') && headerFormRef.getFieldValue('packType')) {
			setCartonMap(new Map())
			formRef.resetFields();
			getPoToPLGenQtyInfo(headerFormRef.getFieldValue('poId'));
			getCartonSpecData(headerFormRef.getFieldValue('packSpec'))
		} else {
			AlertMessages.getErrorMessage('Please select PO, Pack Spec and Pack Type');
		}

	}

	const handlePackType = (option) => {
		headerFormRef.setFieldValue('packMethod', option?.packMethod);
		setPackMethod(option?.packMethod)
	}

	const polyBagRatioOnChange = (ratioVal: number, lineId: number, size: string, polyBagId: number) => {
		const mapKey = getMapKey(packMethod, `${lineId}$@$${size}$@$${polyBagId}`);
		const polyBagsPerCrtn = Number(formRef.getFieldValue('polyBagsPerCrtn' + mapKey));
		if (ratioVal) {
			if (cartonSpecData?.polyBags?.length > 1) {
				for (const poly of cartonSpecData?.polyBags) {
					const polyBagsPerCrtn = Number(formRef.getFieldValue('polyBagsPerCrtn' + mapKey + '#' + poly.id));
					polyBagsCountOnChange(mapKey, polyBagsPerCrtn, poly.id);
				}
			} else {
				polyBagsPerCartonOnChange(mapKey, polyBagsPerCrtn);
			}
		}
		const subLineToIdMapLocal = new Map(subLineToIdMap);
		subLineToIdMapLocal.get(lineId).get(size).plGenQty = ratioVal * (Number.isNaN(polyBagsPerCrtn) ? 0 : polyBagsPerCrtn);
		setSubLineToIdMap(subLineToIdMapLocal);
	}

	const polyBagsPerCartonOnChange = (uniqueKey: string, polyBagCount: number) => {
		const cartonMapLocal = new Map(cartonMap);
		const carton = cartonMap.get(uniqueKey);
		if (carton) {
			carton.noOfPBags = polyBagCount;
			let qty = 0;
			carton?.polyBags?.forEach((pBag, index) => {
				qty += pBag.qty;
				carton.polyBags[index].count = polyBagCount
			})
			carton.qty = qty * polyBagCount;
			setCartonMap(cartonMapLocal)
		}

	}

	const polyBagsCountOnChange = (uniqueKey: string, polyBagCount: number, boxMapId: number) => {
		const cartonMapLocal = new Map(cartonMap);
		const carton = cartonMap.get(uniqueKey);
		if (carton) {
			let qty = 0;
			let noOfPBags = 0;
			carton?.polyBags?.forEach((pBag, index) => {
				if (pBag.boxMapId === boxMapId) {
					carton.polyBags[index].count = polyBagCount
				}
				noOfPBags += pBag.count ? pBag.count : 0;
				qty += pBag.qty * pBag.count;
			})
			carton.noOfPBags = noOfPBags;
			formRef.setFieldValue("polyBagsPerCrtn" + uniqueKey, noOfPBags)
			carton.qty = qty;
			setCartonMap(cartonMapLocal)
		}
	}

	const mapCartonSpecToCartonPrototype = (uniqueKey: string, cartonSpec: CartonSpecModel) => {
		const cartonProtoType = new CartonPrototypeModel(uniqueKey, cartonSpec.cartonBoxId, cartonSpec.cartonId, cartonSpec.cartonName, cartonSpec.polyBags.length > 1 ? cartonSpec.polyBags.length : 1, 1, []);
		formRef.setFieldValue("polyBagsPerCrtn" + uniqueKey, cartonProtoType.noOfPBags);
		formRef.setFieldValue("cartonsCount" + uniqueKey, 1);
		cartonSpec.polyBags.forEach(polyBag => {
			formRef.setFieldValue("polyBagsPerCrtn" + uniqueKey + '#' + polyBag.id, 1);
			cartonProtoType.polyBags.push(new PolyBagPrototypeModel(undefined, polyBag.itemId, polyBag.id, polyBag.itemCode, 0, 1, []))
		})
		cartonCountOnChange(uniqueKey, 1, cartonProtoType);
		polyBagsPerCartonOnChange(uniqueKey, cartonProtoType.noOfPBags);
		return cartonProtoType
	}
	const getMapKey = (packMethod: PackingMethodsEnum, formKey: string) => {
		let mapKey = '';
		const pol = formKey.split('$@$')[0];
		const poSubL = formKey.split('$@$')[1];
		if (packMethod === PackingMethodsEnum.SCSS) {
			mapKey = `${pol}$@$${poSubL}`;
		}
		if (packMethod === PackingMethodsEnum.SCMS) {
			mapKey = pol;
		}
		if (packMethod === PackingMethodsEnum.MCSS) {
			mapKey = poSubL;
		}
		if (packMethod === PackingMethodsEnum.MCMS) {
			mapKey = 'poNumber';
		}
		return mapKey;
	}

	const preViewCartonsHandler = () => {
		const formValues = formRef.getFieldsValue();
		const cartonMapLocal = new Map<string, CartonPrototypeModel>();
		Object.keys(formValues).forEach(formKey => {
			if (formKey.includes('$@$') && !formKey.includes('polyBagsPerCrtn') && !formKey.includes('cartonsCount')) {
				const pol = formKey.split('$@$')[0];
				const poSubL = formKey.split('$@$')[1];
				const polyBagId = formKey.split('$@$')[2];
				const mapKey = getMapKey(packMethod, formKey);
				if (formValues[formKey]) {
					const cartonSpec: CartonPrototypeModel = cartonMap?.get(mapKey) ? cartonMap?.get(mapKey) : mapCartonSpecToCartonPrototype(mapKey, cartonSpecData);
					cartonSpec.cartonUniqueKey = mapKey;
					const polyBag = cartonSpec.polyBags.find(rec => rec.boxMapId == Number(polyBagId));
					const sizeObj = subLineToIdMap?.get(Number(pol))?.get(poSubL)
					const sizeRec = new PolyBagSizeRatio(undefined, Number(pol),undefined,undefined,undefined,undefined, lineToIdMap.get(Number(pol)), sizeObj.subLineId, poSubL, formValues[formKey], plData.poId);
					if (polyBag.sizeRatios) {
						const findIndex = packMethod === PackingMethodsEnum.MCMS ? polyBag.sizeRatios.findIndex(rec => rec.poSubLId == sizeObj.subLineId) : polyBag.sizeRatios.findIndex(rec => rec.size == poSubL)
						if (findIndex >= 0) {
							polyBag.sizeRatios[findIndex] = sizeRec;
						} else {
							polyBag.sizeRatios.push(sizeRec)
						}
					} else {
						polyBag.sizeRatios = [sizeRec]
					}
					polyBag.qty = polyBag.sizeRatios.reduce(
						(accumulator, currentValue) => accumulator + currentValue.ratio,
						0,
					);
					cartonMapLocal.set(mapKey, cartonSpec)
				} else if (formValues[formKey] == 0) {
					const cartonSpec: CartonPrototypeModel = cartonMap?.get(mapKey) ? cartonMap?.get(mapKey) : mapCartonSpecToCartonPrototype(mapKey, cartonSpecData);
					cartonSpec.cartonUniqueKey = mapKey;
					const polyBag = cartonSpec.polyBags.find(rec => rec.id == Number(polyBagId));
					if (polyBag) {
						polyBag.sizeRatios = polyBag?.sizeRatios?.filter(rec => rec.size !== poSubL);
						polyBag.qty = polyBag.sizeRatios.reduce(
							(accumulator, currentValue) => accumulator + currentValue.ratio,
							0,
						);
					}

				}
			}
		})
		setCartonMap(cartonMapLocal)
	}

	const cartonCountOnChange = (uniqueKey: string, cartonCount: number, cartonProtoType?: CartonPrototypeModel) => {
		const cartonMapLocal = new Map(cartonMap);
		const carton = cartonMap.get(uniqueKey);
		if (carton) {
			carton.count = cartonCount; 
		} else {
			cartonMapLocal.set(uniqueKey, { ...cartonProtoType, count: 1 })
		}
		let totalCartonCount = 0;
		cartonMapLocal?.forEach((rec, key) => {
			totalCartonCount += rec.count ? rec.count : 0
		})
		headerFormRef.setFieldValue('noOfCartons', totalCartonCount);
		packJobsCalculator();
		setCartonMap(cartonMapLocal);
	}

	const packJobsCalculator = () => {
		const cartons = headerFormRef.getFieldValue('noOfCartons');
		const packJobQty = headerFormRef.getFieldValue('packJobQty');
		headerFormRef.setFieldValue('packJobs', Math.ceil(((cartons ? cartons : 0) / (packJobQty ? packJobQty : 1))));
	}

	const resetData = () => {
		if (selectedSummeryRecord?.packSerial) {
			headerFormRef.resetFields(['packType', 'packMethod', 'packSpec', 'packJobs', 'packJobQty', 'noOfCartons']);
		} else {
			headerFormRef.resetFields();
		}
		formRef.resetFields();
		setTblData([]);
		setSubLineToIdMap(new Map());
		setPlRatioMaxMap(new Map());
		setLineToIdMap(new Map());
		setUniqueSizes([]);
		setCartonMap(new Map());
		setCartonSpecData(undefined);
		setPlData(undefined)
		setTblColumns([])
	}

	const savePackList = () => {
		headerFormRef.validateFields().then(headers => {
			formRef.validateFields().then(ratios => {
				const packListReqObj = new PackListCreateModel(undefined, undefined, headers.plConfigDesc, plData.poId, plData.packSerial, plData.poDate, 0, headers.packSpec, headers.packType, headers.packMethod, headers.noOfCartons, headers.packJobQty, headers.packJobs, [], orgData.companyCode, orgData.unitCode, userId, userName);
				let qty = 0;
				for (const [key, carton] of cartonMap.entries()) {
					if (carton.qty) {
						qty += (carton.qty * carton.count);
					}
					packListReqObj.cartons.push(carton)
				}
				packListReqObj.qty =   qty;
				packingListService.savePackListInfo(packListReqObj)
					.then((res) => {
						if (res.status) {
							AlertMessages.getSuccessMessage(res.internalMessage);
							resetData()
						} else {
							AlertMessages.getErrorMessage(res.internalMessage);
						}
					})
					.catch((err) => {
						AlertMessages.getErrorMessage(err.message);
					})
				console.log(packListReqObj, 'packListReqObj')
			}).catch(err => {
				console.log(err)
			})
		}).catch(err => {
			console.log(err)
		})
	}

	return <><Card title={<span><FileAddOutlined style={{ marginRight: 4 }} />Pack List creation </span>} size="small" extra={
		<>
			<Button icon={<EyeOutlined />} type="primary" onClick={openPlGenQtySummary}>View Summary</Button>
		</>
	}>

		<Form
			form={headerFormRef}
			size="small"
		>
			<Row justify='space-between'>
				<Col>
					<Form.Item
						label="Select Pack Order"
						name="poId"
						rules={[{ required: true, message: "Please select a MO" }]}
						style={{ marginBottom: 0 }}
					>
						<Select
							placeholder="Select Pack Order"
							style={{ width: "200px" }}
							showSearch
							allowClear
							disabled={selectedSummeryRecord?.packSerial ? true : false}						>

							{poData.map((po) => (
								<Select.Option key={po.packSerial} value={po.packSerial}>
									{po.packSerial}-{po.packOrderDescription}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col>
					<Form.Item name={'packType'}
						rules={[{ required: true, message: 'PackType is required' }]} label='Pack Type'
					>
						<Select
							style={{ width: '100%', minWidth: 200 }}
							filterOption={(input, option) => (option.label as string)
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0}
							allowClear
							showSearch
							onChange={(value, option) => handlePackType(option)}
						>
							{ptData?.map((packType) => (
								<Option
									key={packType.id}
									label={packType.packTypeDesc}
									value={packType.id}
									name={packType.packTypeDesc}
									packMethod={packType.packMethod}
								>
									{packType.packTypeDesc}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col>
					<Form.Item name={'packMethod'} label='Pack Method'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Form.Item name={'packSpec'}
					rules={[{ required: true, message: 'Pack Spec is required' }]} label='Pack Spec'
				>
					<Select
						style={{ width: '100%', minWidth: 200 }}
						filterOption={(input, option) => (option.label as string)
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0}
						showSearch
					>
						{packSpecs?.map((packSpec) => (
							<Option
								key={packSpec.id}
								label={packSpec.desc}
								value={packSpec.id}
								name={packSpec.desc}
							>
								{packSpec.desc}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Col offset={1}>
					<Button type="primary" style={{ width: "150px" }} onClick={getPoHandler}>
						Submit
					</Button>
				</Col>
			</Row>
		</Form>
		<br />
		{cartonSpecData && <>
			<div>
				<Descriptions bordered >
					<Descriptions.Item label={<b>Pack Order No</b>}>{plData?.packSerial}</Descriptions.Item>
					<Descriptions.Item label={<b>Po Date</b>}>{plData?.poDate}</Descriptions.Item>
					<Descriptions.Item label={<b>Po Quantity</b>}>{plData?.qty}</Descriptions.Item>
				</Descriptions>
			</div>
			<br />

			<Form
				form={headerFormRef}
				size="small"
			><Row justify='space-between'>
					<Col>
						<Form.Item name={'noOfCartons'} label='No Of Cartons'>
							<InputNumber disabled min={0} onChange={packJobsCalculator} />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item name={'packJobQty'} label='Cartons per PackJob' rules={[{ required: true, message: 'Please enter pack job required' }]}>
							<InputNumber min={0} onChange={packJobsCalculator} max={headerFormRef.getFieldValue('noOfCartons')} />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item name={'plConfigDesc'} label='Pack List Description' rules={[{ required: true, message: 'Please enter pack job required' }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item name={'packJobs'}
							label='PackJobs'
						>
							<InputNumber disabled />
						</Form.Item>
					</Col>
					<Col>
						<Button type="primary" style={{ width: "150px" }} onClick={savePackList}>
							Save PackList
						</Button>
					</Col>
				</Row>
			</Form>
			<br />
			<Form
				form={formRef}
				size="small"
				onValuesChange={(changedValues, allValues) => {
					preViewCartonsHandler()
				}}
			>
				<Row>
					<Col span={12}>
						{/* <PackFormGrid tblData={tblData} formRef={formRef} subLineToIdMap={subLineToIdMap} uniqueSizes={uniqueSizes} cartonSpecData={cartonSpecData} polyBagRatioOnChange={polyBagRatioOnChange} plRatioMaxMap={plRatioMaxMap} /> */}
					</Col>
					<Col span={12}><CartonSummaryPreview cartonMap={cartonMap} polyBagsPerCartonOnChange={polyBagsPerCartonOnChange} polyBagsCountOnChange={polyBagsCountOnChange} cartonCountOnChange={cartonCountOnChange} /></Col>
				</Row></Form></>}
	</Card>

		<Drawer
			title={`PackList Generated Quantity`}
			placement="right"
			size={'large'}
			onClose={closePlGenQtySummary}
			open={openPlGenQtyDrawer}
			width='100%'
			extra={
				<Button type="primary" onClick={closePlGenQtySummary}>
					Close
				</Button>
			}
		>
			<>
				<PLGenQtySummaryGrid tblColumns={tblColumns} tblData={tblData} />
			</>
		</Drawer>
	</>;
};

export default PackListCreation;
