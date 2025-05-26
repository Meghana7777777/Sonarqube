import { DeleteFilled } from "@ant-design/icons";
import { ItemsModelDto, MaterialReqModel, MaterialTypeEnum } from "@xpparel/shared-models";
import { ItemsServices } from "@xpparel/shared-services";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import "../../pkms.css";


interface PackingSpecFormProps {
	formRef: FormInstance<any>;
	initialValues: any;
}

export const PackingSpecForm = (props: PackingSpecFormProps) => {
	const { formRef, initialValues } = props;
	const service = new ItemsServices();
	const [Items, setIsItems] = useState<ItemsModelDto[]>();
	const [cartons, setCartons] = useState<ItemsModelDto[]>();
	const [polyBagTypesCount, setPolyBagTypesCount] = useState(1);
	const [refreshKey, setRefreshKey] = useState(1);



	const user = useAppSelector((state) => state.user.user.user);
	const { userName, orgData, userId } = user;

	useEffect(() => {
		if (initialValues) {
			formRef.setFieldsValue({ initialValues });
			setPolyBagTypesCount(initialValues.noOfItems)
		}
		getItemStopPackingSpec(MaterialTypeEnum.CARTON);
		getItemStopPackingSpec(MaterialTypeEnum.POLY_BAG);
	}, [initialValues]);

	const getItemStopPackingSpec = (category: MaterialTypeEnum) => {
		const req = new MaterialReqModel(category, userName, userId, orgData.unitCode, orgData.companyCode);
		service.getItemsToPackingSpec(req).then(res => {
			if (res.status) {
				if (category === MaterialTypeEnum.CARTON) {
					setCartons(res.data)
				} else {
					setIsItems(res.data);
				}
			} else {
				if (category === MaterialTypeEnum.CARTON) {
					setCartons([]);
				} else {
					setIsItems([]);
				}
			}
		}).catch(err => {
			if (category === MaterialTypeEnum.CARTON) {
				setCartons([]);
			} else {
				setIsItems([]);
			}
		});
	};

	const handlePolyBagChange = (option, index) => {
		formRef.setFieldValue(['boxMap', index, 'itemCode'], option?.polyBagDesc);
		setRefreshKey(prev => prev + 1)
	}

	const onCartonChangeHandler = (option) => {
		formRef.setFieldValue('itemCode', option?.cartonDesc);
		setRefreshKey(prev => prev + 1)
	}

	const polyBagTypeCountOnChange = (polyBagTypesCount: number) => {
		setPolyBagTypesCount(polyBagTypesCount)
		const availableCount = formRef.getFieldValue(['boxMap'])?.length ? Number(formRef.getFieldValue(['boxMap'])?.length) : 0;
		// console.log(availableCount, polyBagTypesCount, formRef.getFieldValue(['boxMap'])?.slice(0, availableCount))
		if (polyBagTypesCount > availableCount) {
			for (let polyCOunt = availableCount; polyCOunt < polyBagTypesCount; polyCOunt++) {
				formRef.setFieldValue(['boxMap', polyCOunt], {});
			}
		} else if (polyBagTypesCount === availableCount) {

		} else {
			formRef.setFieldValue('boxMap', formRef.getFieldValue(['boxMap'])?.slice(0, polyBagTypesCount));
		}
	}

	const polyBagOnDelete = (deleteFn: (index: number | number[]) => void, index: number) => {
		deleteFn(index);
		setPolyBagTypesCount(prev => {
			formRef.setFieldValue('noOfItems',
				prev - 1);
			return prev - 1;
		})
	}

	return (<div className="pkms">
		<Form form={formRef} layout="vertical">
			<Row>
				<Col span={17}>
					<Form.Item label="Id" name="id" hidden>
						<Input type="number" />
					</Form.Item>

					<Row>
						<Col xs={24} sm={24} md={{ span: 7, offset: 1 }}>
							<Form.Item label="Code" name="code" rules={[{ required: true, message: "Please input your Code" }]}>
								<Input placeholder="Code" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={{ span: 7, offset: 1 }}>
							<Form.Item label="Description" name="desc" rules={[{ required: true, message: "Please input your Description" }]}>
								<Input placeholder="Description" />
							</Form.Item>
						</Col>
					</Row>
					<Row>
					</Row>
					<Row gutter={16}>
						<Form.Item
							label="Box Id"
							name={"boxId"}
							hidden
						>
							<Input type="number" placeholder="Box Level Number" />
						</Form.Item>
						<Col xs={24} sm={24} md={{ span: 7, offset: 1 }}>
							<Form.Item
								label="Carton Box"
								name={"itemId"}
								rules={[{ required: true, }]}
							>
								<Select
									placeholder={'Select Carton Box'}
									allowClear
									showSearch
									filterOption={(input, option) =>
										(option!.children as unknown as string)
											.toString()
											.toLowerCase()
											.includes(input.toLowerCase())
									}
									onChange={(value, option) => onCartonChangeHandler(option)}
								>
									{cartons?.map((item) => (
										<Select.Option
											key={item.id}
											value={item.id}
											cartonDesc={item.desc}
										> {item.code}</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item name="itemCode" hidden>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={{ span: 7, offset: 1 }}>
							<Form.Item
								label="Poly Bag Types"
								name={"noOfItems"}
								rules={[{ required: true, message: "Please input Enter Poly Bag Types" }]}
							>
								<Input type="number" placeholder="Enter PolyBag Types" onChange={(event) => polyBagTypeCountOnChange(Number(event.target.value))} min={1} />
							</Form.Item>
						</Col>

					</Row>
					<Form.List name="boxMap">
						{(fields, { add, remove }) => (
							<Row gutter={16}>
								{fields.map((field) => (
									<>
										<Form.Item
											{...field}
											label="Box Id"
											name={[field.name, "id"]}
											hidden
										>
											<Input type="number" placeholder="Box Level Number" />
										</Form.Item>
										<Col xs={24} sm={24} md={{ span: 7, offset: 1 }}>
											<Row>
												<Col span={20}>
													<Form.Item
														{...field}
														label="Polybag"
														name={[field.name, "itemId"]}
														rules={[{ required: true, }]}
													>
														<Select

															placeholder={'Please select Polybag'}
															allowClear
															showSearch
															filterOption={(input, option) =>
																(option!.children as unknown as string)
																	.toString()
																	.toLowerCase()
																	.includes(input.toLowerCase())
															}
															onChange={(value, option) => handlePolyBagChange(option, field.name)}
														>
															{Items?.map((item) => (
																<Select.Option
																	key={item.id}
																	value={item.id}
																	polyBagDesc={item.desc}
																> {item.code}</Select.Option>
															))}
														</Select>
													</Form.Item></Col>
												<Col span={4}>
													<DeleteFilled
														style={{ color: 'red', fontSize: '20px', marginTop: '30px' }}
														onClick={() => polyBagOnDelete(remove, field.name)}
													/></Col>
											</Row>
										</Col>
									</>
								))}
							</Row>
						)}
					</Form.List>
				</Col>
				<Col span={7}>
					<div style={{ textAlign: 'center' }}>
						<div className="cartoon-container" style={{ marginTop: '30%' }}>
							{formRef.getFieldValue('boxMap')?.map((garment, index) => (
								<div key={index} className="folded-garment">
									<div>
										{formRef.getFieldValue(['boxMap', index, 'itemCode']) ? formRef.getFieldValue(['boxMap', index, 'itemCode']) : 'Please Select PolyBag'}
									</div>
								</div>
							))}
						</div>
						<b>Carton : </b>{formRef.getFieldValue('itemCode')}
					</div>
				</Col>
			</Row>
		</Form>
	</div >

	);
};

export default PackingSpecForm;
