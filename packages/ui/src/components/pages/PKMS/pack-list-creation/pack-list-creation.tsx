import { EyeOutlined, FileAddOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { CartonPrototypeModel, CartonSpecModel, CommonIdReqModal, CommonRequestAttrs, PackingMethodsEnum, PackListCreateModel, PackSerialDropDownModel, PackSerialNumberReqDto, PackSerialRequest, PackSpecDropDownDtoModel, PackTypeModelDto, PLGenQtyInfoModel, PlLineInfo, PLSubLineQtyModel, PolyBagPrototypeModel, PolyBagSizeRatio, PONoRequest } from "@xpparel/shared-models";
import { PackingSpecServices, PackListService, PackTypeService, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Button, Card, Col, Collapse, Descriptions, Drawer, Form, Input, InputNumber, Row, Select, Space, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../common";
import { AlertMessages } from "../../../common";
import { CartonSummaryPreview } from "./carton-summary-preview";
import { PackFormGrid } from "./pack-form-grid";
import { PLGenQtySummaryGrid } from "./pl-gen-qty-summary-grid";
import { PackingSpecGrid } from "../__masters__";

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
	const [subLineToIdMap, setSubLineToIdMap] = useState<Map<string, Map<string, PLSubLineQtyModel>>>(new Map());
	const [lineToIdMap, setLineToIdMap] = useState<Map<string, PlLineInfo>>(new Map());
	const [plRatioMaxMap, setPlRatioMaxMap] = useState<Map<string, Map<string, number>>>(new Map());
	const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
	const [packMethod, setPackMethod] = useState();
	const [cartonSpecData, setCartonSpecData] = useState<CartonSpecModel>();
	const [cartonMap, setCartonMap] = useState<Map<string, CartonPrototypeModel>>(new Map());
	const [openPackSpecDrawer, setPackSpecDrawer] = useState<boolean>(false);
	const [dummyRefresh, setDummyRefresh] = useState<number>(0)

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
		const req = new PackSerialNumberReqDto(userName, orgData.unitCode, orgData.companyCode, userId, selectedSummeryRecord?.packSerial);
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
		const subLineToIdMapLocal: Map<string, Map<string, PLSubLineQtyModel>> = new Map();
		const plRatioMaxMapLocal: Map<string, Map<string, number>> = new Map(plRatioMaxMap)
		const lineToIdMapLocal: Map<string, PlLineInfo> = new Map(lineToIdMap);
		// Transform data to include columns for each size
		const dataSource = lineData.map((item, index) => {
			const lineKey = `${item.lineId}&$&${item.productRef}&$&${item.fgColor}`;
			if (!subLineToIdMapLocal.has(lineKey)) {
				subLineToIdMapLocal.set(lineKey, new Map())
			}
			if (!lineToIdMapLocal.has(lineKey)) {
				lineToIdMapLocal.set(lineKey, item)
			}
			if (!plRatioMaxMapLocal.has(lineKey)) {
				plRatioMaxMapLocal.set(lineKey, new Map())
			}
			let isHavingPendingQty = false;
			const sizesData = {};
			let total = 0
			item.subLineQuantities.forEach(qty => {
				uniqueSizes.add(qty.subLine);
				if (!subLineToIdMapLocal.get(lineKey).has(qty.subLine)) {
					subLineToIdMapLocal.get(lineKey).set(qty.subLine, qty)
				}
				if (!plRatioMaxMapLocal.get(lineKey).has(qty.subLine)) {
					plRatioMaxMapLocal.get(lineKey).set(qty.subLine, qty.quantity - qty.plGenQty)
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

	const constructColumns = (uniqueSizes: string[], subLineToIdMapLocal: Map<string, Map<String, PLSubLineQtyModel>>) => {
		// Define dynamic columns for each size
		const columns: ColumnsType<IPlLineInfoColumns> = [
			{
				title: 'Line',
				dataIndex: 'line',
				key: 'line',
				width: 150,
				align: 'center',
				fixed: 'left',
			},
			{
				title: 'Color',
				dataIndex: 'fgColor',
				key: 'fgColor',
				width: 150,
				align: 'center',
				fixed: 'left',
			},
			{
				title: 'Product',
				dataIndex: 'productName',
				key: 'productName',
				width: 150,
				align: 'center',
				fixed: 'left',
			}
		];
		uniqueSizes.forEach(size => {
			columns.push({
				title: size,
				dataIndex: size,
				key: size,
				align: 'center',
				render: (orderQty, record: IPlLineInfoColumns) => {
					const lineKey = `${record.lineId}&$&${record.productRef}&$&${record.fgColor}`
					const sizeObj = subLineToIdMapLocal?.get(lineKey)?.get(size);
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

	const polyBagRatioOnChange = (ratioVal: number, lineId: string, size: string, polyBagId: number) => {
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
	}

	const polyBagsPerCartonOnChange = (uniqueKey: string, polyBagCount: number) => {
		const cartonMapLocal = new Map(cartonMap);
		const carton = cartonMap.get(uniqueKey);

		const cartonsCount = Number(formRef.getFieldValue('cartonsCount' + uniqueKey));
		const subLineToIdMapLocal = new Map(subLineToIdMap);
		if (carton) {
			carton.noOfPBags = polyBagCount;
			let qty = 0;
			// carton?.polyBags?.forEach((pBag, index) => {
			// 	qty += pBag.qty;
			// 	carton.polyBags[index].count = polyBagCount
			// 	pBag.sizeRatios.forEach(sizeRatio => {
			// 		const lineId = `${sizeRatio.lineId}&$&${sizeRatio.productRef}&$&${sizeRatio.fgColor}`;
			// 		subLineToIdMapLocal.get(lineId).get(sizeRatio.size).plGenQty = sizeRatio.ratio * ((Number.isNaN(polyBagCount) ? 0 : polyBagCount)) * (Number.isNaN(cartonsCount) ? 0 : cartonsCount);
			// 	})
			// })
			const plGenMap = new Map();
			carton?.polyBags?.forEach((pBag, index) => {
				carton.polyBags[index].count = polyBagCount;
				qty += pBag.qty;
				pBag.sizeRatios.forEach(sizeRatio => {
					const lineId = `${sizeRatio.lineId}&$&${sizeRatio.productRef}&$&${sizeRatio.fgColor}`;
					if (!plGenMap.has(lineId)) {
						plGenMap.set(lineId, new Map());
					}
					if (!plGenMap.get(lineId).has(index)) {
						plGenMap.get(lineId).set(index, new Map());
					}
					if (!plGenMap.get(lineId).get(index).has(sizeRatio.size)) {
						plGenMap.get(lineId).get(index).set(sizeRatio.size, sizeRatio.ratio * ((Number.isNaN(polyBagCount) ? 0 : polyBagCount)) * (Number.isNaN(cartonsCount) ? 0 : cartonsCount));
					}
					subLineToIdMapLocal.get(lineId).get(sizeRatio.size).plGenQty = 0;
				})
			});

			for (const [lineId, polyBagMap] of plGenMap) {
				const sizeLocalMap = new Map();
				for (const [polyBagId, sizeMap] of polyBagMap) {
					for (const [size, ratio] of sizeMap) {
						if (!sizeLocalMap.has(size))
							sizeLocalMap.set(size, ratio);
						else
							sizeLocalMap.set(size, sizeLocalMap.get(size) + ratio);
					}
				}
				for (const [size, ratio] of sizeLocalMap) {
					subLineToIdMapLocal.get(lineId).get(size).plGenQty = ratio
				}
			}
			carton.qty = qty * polyBagCount;
			setCartonMap(cartonMapLocal);
			setSubLineToIdMap(subLineToIdMapLocal);
		}

	}

	const polyBagsCountOnChange = (uniqueKey: string, polyBagCount: number, boxMapId: number) => {
		const cartonMapLocal = new Map(cartonMap);
		const carton = cartonMap.get(uniqueKey);
		const cartonsCount = Number(formRef.getFieldValue('cartonsCount' + uniqueKey));
		const subLineToIdMapLocal = new Map(subLineToIdMap);
		if (carton) {
			let qty = 0;
			let noOfPBags = 0;
			const plGenMap = new Map();
			carton?.polyBags?.forEach((pBag, index) => {
				if (pBag.boxMapId === boxMapId) {
					carton.polyBags[index].count = polyBagCount
				}
				noOfPBags += pBag.count ? pBag.count : 0;
				qty += pBag.qty * pBag.count;
				pBag.sizeRatios.forEach(sizeRatio => {
					const lineId = `${sizeRatio.lineId}&$&${sizeRatio.productRef}&$&${sizeRatio.fgColor}`;
					if (!plGenMap.has(lineId)) {
						plGenMap.set(lineId, new Map());
					}
					if (!plGenMap.get(lineId).has(index)) {
						plGenMap.get(lineId).set(index, new Map());
					}
					if (!plGenMap.get(lineId).get(index).has(sizeRatio.size)) {
						plGenMap.get(lineId).get(index).set(sizeRatio.size, sizeRatio.ratio * ((Number.isNaN(polyBagCount) ? 0 : polyBagCount)) * (Number.isNaN(cartonsCount) ? 0 : cartonsCount));
					}
					subLineToIdMapLocal.get(lineId).get(sizeRatio.size).plGenQty = 0;
				})
			});

			for (const [lineId, polyBagMap] of plGenMap) {
				const sizeLocalMap = new Map();
				for (const [polyBagId, sizeMap] of polyBagMap) {
					for (const [size, ratio] of sizeMap) {
						if (!sizeLocalMap.has(size))
							sizeLocalMap.set(size, ratio);
						else
							sizeLocalMap.set(size, sizeLocalMap.get(size) + ratio);
					}
				}
				for (const [size, ratio] of sizeLocalMap) {
					subLineToIdMapLocal.get(lineId).get(size).plGenQty = ratio
				}
			}
			carton.noOfPBags = noOfPBags;
			formRef.setFieldValue("polyBagsPerCrtn" + uniqueKey, noOfPBags)
			carton.qty = qty;
			setCartonMap(cartonMapLocal);
			setSubLineToIdMap(subLineToIdMapLocal);
		}
	}

	const mapCartonSpecToCartonPrototype = (uniqueKey: string, cartonSpec: CartonSpecModel) => {
		const cartonProtoType = new CartonPrototypeModel(uniqueKey, cartonSpec.cartonBoxId, cartonSpec.cartonId, cartonSpec.cartonName, cartonSpec.polyBags.length > 1 ? cartonSpec.polyBags.length : 1, 1, []);
		formRef.setFieldValue("polyBagsPerCrtn" + uniqueKey, cartonProtoType.noOfPBags);
		formRef.setFieldValue("cartonsCount" + uniqueKey, 1);
		cartonSpec.polyBags.forEach(polyBag => {
			formRef.setFieldValue("polyBagsPerCrtn" + uniqueKey + '#' + polyBag.id, 1);
			cartonProtoType.polyBags.push(new PolyBagPrototypeModel(undefined, polyBag.itemId, polyBag.id, polyBag.itemCode, 0, 1, []));
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
				const plSplitArray = pol.split(`&$&`);
				const mapKey = getMapKey(packMethod, formKey);
				if (formValues[formKey]) {
					let isMapExists = Boolean(cartonMap?.has(mapKey));
					const cartonSpec: CartonPrototypeModel = cartonMap?.get(mapKey) ? cartonMap?.get(mapKey) : mapCartonSpecToCartonPrototype(mapKey, cartonSpecData);
					if (!isMapExists) {
						cartonSpec.qty = formValues[formKey];
					}
					cartonSpec.cartonUniqueKey = mapKey;
					const polyBag = cartonSpec.polyBags.find(rec => rec.boxMapId == Number(polyBagId));
					const sizeObj = subLineToIdMap?.get(pol)?.get(poSubL);
					const sizeRec = new PolyBagSizeRatio(undefined, Number(plSplitArray[0]), plSplitArray[1], plSplitArray[2], lineToIdMap.get(pol).productCode, lineToIdMap.get(pol).productName, lineToIdMap.get(pol).productType, sizeObj.subLineId, poSubL, formValues[formKey], plData.poId);

					if (polyBag.sizeRatios) {
						const findIndex = (packMethod === PackingMethodsEnum.MCMS || packMethod === PackingMethodsEnum.MCSS) ? polyBag.sizeRatios.findIndex(rec => rec.poSubLId == sizeObj.subLineId) : polyBag.sizeRatios.findIndex(rec => rec.size == poSubL)
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
		const subLineToIdMapLocal = new Map(subLineToIdMap);
		if (carton) {
			carton.count = cartonCount;
			carton?.polyBags?.forEach((pBag, index) => {
				pBag.sizeRatios.forEach(sizeRatio => {
					const lineId = `${sizeRatio.lineId}&$&${sizeRatio.productRef}&$&${sizeRatio.fgColor}`;
					subLineToIdMapLocal.get(lineId).get(sizeRatio.size).plGenQty = sizeRatio.ratio * ((Number.isNaN(pBag.count) ? 0 : pBag.count)) * (Number.isNaN(cartonCount) ? 0 : cartonCount);
				})
			})
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
		setSubLineToIdMap(subLineToIdMapLocal);

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
				packListReqObj.qty = qty;
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
			}).catch(err => {
				console.log(err)
			})
		}).catch(err => {
			console.log(err)
		})
	}

	return <><Card title={<span><FileAddOutlined style={{ marginRight: 4 }} />Pack List creation </span>} size="small" >

		<Form
			form={headerFormRef}
			size="small"
			layout="horizontal"
		>
			<Row gutter={[8, 8]} align="top" wrap>
				<Col xs={24} sm={12} md={5}>
					<Form.Item
						label="Select Pack Order"
						name="poId"
						rules={[{ required: true, message: "Please select a MO" }]}
						style={{ marginBottom: 0 }}
					>
						<Select
							placeholder="Select Pack Order"
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
				<Col xs={24} sm={12} md={5}>
					<Form.Item name={'packType'}
						rules={[{ required: true, message: 'PackType is required' }]} label='Pack Type'
					>
						<Select
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
				 <Col xs={24} sm={12} md={4}>
					<Form.Item name={'packMethod'} label='Pack Method'>
						<Input placeholder="Pack Method" disabled />
					</Form.Item>
				</Col>
				 <Col xs={24} sm={12} md={5}>
				<Form.Item name={'packSpec'}
					rules={[{ required: true, message: 'Pack Spec is required' }]} label='Pack Spec'
				>
					<Select
						placeholder={'Select Pack Spec'}
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
				</Col>
				{packSpecs?.length === 0 && (
					<Col xs={24} sm={12} md={3} style={{ display: "flex", alignItems: "end" }}>
					<Button
						onClick={() => {
							setPackSpecDrawer(true);
							setDummyRefresh(dummyRefresh + 1)

						}}
						type="primary">Create Pack Spec</Button>
				</Col>)}
				<Col xs={24} style={{ textAlign: "right", marginBottom: 8 }}>
					<Button type="primary" style={{ width: "150px" }} onClick={getPoHandler}>
						Submit
					</Button>
				</Col>
			</Row>
		</Form>
		<Collapse size='small' accordion={false}
			expandIconPosition="end"
			expandIcon={({ isActive }) =>
				isActive ? (
					<MinusOutlined style={{ fontSize: '15px' }} />
				) : (
					<PlusOutlined style={{ fontSize: '15px' }} />
				)
			}
		>
			<Collapse.Panel
				key={1}
				header={<>
					<Descriptions bordered size="small">
						<Descriptions.Item label={<b style={{ color: 'white' }}>Pack Order No</b>}><b style={{ color: 'white' }}>{plData?.packSerial}</b></Descriptions.Item>
						<Descriptions.Item label={<b style={{ color: 'white' }}>Po Date</b>}><b style={{ color: 'white' }}>{plData?.poDate}</b></Descriptions.Item>
						<Descriptions.Item label={<b style={{ color: 'white' }}>Po Quantity</b>}><b style={{ color: 'white' }}>{plData?.qty}</b></Descriptions.Item>
					</Descriptions>
				</>
				}
			>
				<PLGenQtySummaryGrid tblColumns={tblColumns} tblData={tblData} />
			</Collapse.Panel>
		</Collapse>
		<br />
		{cartonSpecData && <>
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
						<PackFormGrid tblData={tblData} formRef={formRef} subLineToIdMap={subLineToIdMap} uniqueSizes={uniqueSizes} cartonSpecData={cartonSpecData} polyBagRatioOnChange={polyBagRatioOnChange} plRatioMaxMap={plRatioMaxMap} />
					</Col>
					<Col span={12}><CartonSummaryPreview cartonMap={cartonMap} polyBagsPerCartonOnChange={polyBagsPerCartonOnChange} polyBagsCountOnChange={polyBagsCountOnChange} cartonCountOnChange={cartonCountOnChange} /></Col>
				</Row></Form></>}
	</Card>
		<Drawer
			key={dummyRefresh}
			width={1200}
			open={openPackSpecDrawer}
			onClose={() => {
				getAllSpecDropdownData();
				setPackSpecDrawer(false);
				setDummyRefresh(dummyRefresh + 1);

			}}
		>
			<PackingSpecGrid
				packSerial={selectedSummeryRecord?.packSerial}
			/>
		</Drawer>
	</>;
};

export default PackListCreation;
