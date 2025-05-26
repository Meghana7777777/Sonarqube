import { PoProdTypeAndFabModel, PoRmUpdateModel, PoRmUpdateRequest } from "@xpparel/shared-models";
import { PoMaterialService } from "@xpparel/shared-services";
import { Button, Card, Descriptions, DescriptionsProps, Form, Radio, RadioChangeEvent, Table, Input, Select, Switch, InputNumber, Tag, Checkbox, CheckboxProps } from "antd";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import form from "antd/es/form";
import { useAppSelector } from "packages/ui/src/common";
import { ColumnsType } from "antd/es/table";

const { Option } = Select;

interface IFabricPro {
    id: number;
    productType: string;
    productName: string;
    color: string;
    iCode: string;
    maxPlies: number;
    consumption: number;
    wastage: number;
    bindingConsumption: number;
    mainFabric: boolean;
    isBinding: boolean;
    components: string;
    // size: string;
    rowSpan: number;

}

interface IProps {
    getFabricPro: PoProdTypeAndFabModel[]
    poSerial: number

}


export const FabricProprietiesTable = (props: IProps) => {
    const { getFabricPro } = props;
    const [data, setData] = useState<PoProdTypeAndFabModel[]>(getFabricPro);
    const [formRef] = Form.useForm();
    const poMaterialService = new PoMaterialService();
    const [mainFabricIds, setMainFabricIds] = useState<{ [key: string]: number }>({});

    const [tableData, setTableData] = useState<IFabricPro[]>([])
    const [selectedSwitchValue, setSelectedSwitchValue] = useState<{ [key: string]: Set<number> }>({});
    const user = useAppSelector((state) => state.user.user.user);
    const [columnValues, setColumnValues] = useState({});
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [fabCodes, setFabcodes] = useState<number[]>([]);
    const handleInputChange = (e, columnName) => {
        setColumnValues(prevState => ({
            ...prevState,
            [columnName]: e,
        }));
    };

    useEffect(() => {
        if (props.getFabricPro) {
            constructTableData(props.getFabricPro)
        }
    }, [props.getFabricPro])

    const handleSelectionChange = (value: number, record: IFabricPro) => {
        const itemKey = record.productName+'@'+record.color;
        setMainFabricIds(prevState => ({
            ...prevState,
            [itemKey]: value
        }));
    };


    const switchOnchangeHandler = (id, productName, isChecked: boolean) => {
        if(!selectedSwitchValue[productName]) {
            selectedSwitchValue[productName] = new Set<number>;
        }
        if(isChecked) {
            selectedSwitchValue[productName].add(id);
        } else {
            selectedSwitchValue[productName].delete(id);
        }

        setSelectedSwitchValue((prev) => {
            return {
                ...prev,
                [productName]: selectedSwitchValue[productName] ?? []
            }
        });
    };

    const handleCheckboxChange = (ind: number, checked: boolean, value) => {
        if (checked) {
            setCheckedList(pre => [...pre, ind]);

        }
        else {
            setCheckedList(pre => pre.filter(e => e != ind));

        }
    }

    const selectedfabricCodes = (fabValue) => {
        tableData.map((res, i) => {
            if (fabValue.includes(res.iCode)) {
                setFabcodes(pre => [...pre, i]);
                setCheckedList(pre => [...pre, i]);
            }
            else {
                setFabcodes(pre => pre.filter(e => e != i));
                setCheckedList(pre => pre.filter(e => e != i));
            }
        })
    }



    const reflectToColumns = (columnRef: string) => {

        const fields = formRef.getFieldsValue();
        Object.keys(fields).forEach((eachKey, i) => {
            if (checkedList.includes(i)) {
                fields[eachKey][columnRef] = columnValues[columnRef];
            }
            if (fabCodes.includes(i)) {
                fields[eachKey][columnRef] = columnValues[columnRef];
            }

        });
        formRef.setFieldsValue(fields);

    }


    const columns: ColumnsType<IFabricPro> = [
        {
            title: 'Product Type',
            dataIndex: 'productType',
            key: 'productType',
            align: 'center',
            onCell: (record, index) => ({
                rowSpan: record.rowSpan
            }),
            render: (value, record) => {
                return <Tag color="orange">{value}</Tag>
            }

        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
            align: 'center',
            onCell: (record, index) => ({
                rowSpan: record.rowSpan
            }),
            render: (value, record) => {
                return <span>{value}</span>
            }
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            align: 'center',
            onCell: (record, index) => ({
                rowSpan: record.rowSpan
            }),
            render: (value, record) => {
                return <span>{value}</span>
            }
        },
        {
            title: 'Fabric Code',
            dataIndex: 'iCode',
            key: 'iCode',
            align: 'center',
            render: (value, record, index) => {
                return <>
                    <div>
                        <Checkbox
                            key={index}
                            defaultChecked={checkedList.includes(index)}
                            checked={checkedList.includes(index)}
                            onChange={(e) => handleCheckboxChange(index, e.target.checked, value)} />
                        <br />
                        {value}
                    </div>
                </>
            }
        },
        {
            title: <><span>Max Plies </span><InputNumber style={{width: "100%"}}
                step={1} precision={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} min={0} parser={(value: any) => value.replace(/[^0-9]/g, "")}
                placeholder="Enter value"
                onChange={e => handleInputChange(e, 'maxPlies')}
                value={columnValues['maxPlies'] || ''}
            /><br/><Button type="primary" className="btn-orange" onClick={e => reflectToColumns('maxPlies')}>Fill</Button></>,
            dataIndex: 'maxPlies',
            key: 'maxPlies',
            align: 'center',
            render: (text: number | string, record: IFabricPro, index: number) => (
                <Form.Item name={[index, 'maxPlies']} initialValue={text}>
                    <InputNumber step={1} precision={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} min={0} parser={(value: any) => value.replace(/[^0-9]/g, "")} />
                </Form.Item>
            ),
        },
        {
            title: <>Consumption<InputNumber style={{width: "100%"}}
            min={0}
            placeholder="Enter value"
            onChange={e => handleInputChange(e, 'consumption')}
            value={columnValues['consumption'] || ''}
        /><br/><Button type="primary" className="btn-orange" onClick={e => reflectToColumns('consumption')}>Fill</Button></>,
            dataIndex: 'consumption',
            key: 'consumption',
            align: 'center',
            render: (text: string, record: IFabricPro, index: number) => (
                <Form.Item name={[index, 'consumption']} initialValue={text}>
                    <InputNumber min={0} />
                </Form.Item>
            ),
        },
        {
            title: <>Wastage (%)<InputNumber style={{width: "100%"}}
            min={0}
            placeholder="Enter value"
            onChange={e => handleInputChange(e, 'wastage')}
            value={columnValues['wastage'] || ''}
        /><br/><Button type="primary" className="btn-orange" onClick={e => reflectToColumns('wastage')}>Fill</Button></>,
            dataIndex: 'wastage',
            key: 'wastage',
            align: 'center',
            render: (text: string, record: IFabricPro, index: number) => (
                <Form.Item name={[index, 'wastage']} initialValue={text}>
                    <InputNumber min={0} />
                </Form.Item>
            ),
        },
        {
            title: <>Binding Consumption<InputNumber style={{width: "100%"}}
            min={0} 
            placeholder="Enter value"
            onChange={e => handleInputChange(e, 'bindingConsumption')}
            value={columnValues['bindingConsumption'] || ''}
        /><br/><Button type="primary" className="btn-orange" onClick={e => reflectToColumns('bindingConsumption')}>Fill</Button></>,
            dataIndex: 'bindingConsumption',
            key: 'bindingConsumption',
            align: 'center',
            render: (text: string, record: IFabricPro, index: number) => (
                <Form.Item name={[index, 'bindingConsumption']} initialValue={text}>
                    <InputNumber min={0} />
                </Form.Item>
            ),
        },
        {
            title: 'Main Fabric',
            dataIndex: 'mainFabric',
            key: 'mainFabric',
            align: 'center',
            render: (_, record: IFabricPro, index) => {
                const mainFabKey = record.productName+"@"+record.color;
               return  <Radio.Group
                    onChange={(e) => handleSelectionChange(e.target.value, record)}
                    value={mainFabricIds[mainFabKey]} // Use productName and color as key for selectedRowKey
                >
                    <Radio value={record.id} checked={mainFabricIds[mainFabKey] == record.id} />
                </Radio.Group>
               
            },
        },

        {
            title: 'Binding',
            dataIndex: 'isBinding',
            key: 'isBinding',
            align: 'center',
            render: (_, record: IFabricPro) => {
                const selectedBindings = selectedSwitchValue?.[record?.productName] ?? new Set<number>();
                return <Switch
                    checked={selectedBindings.has(record?.id) ? true : false}
                    onChange={(e) => {
                        switchOnchangeHandler(record?.id, record?.productName, e)
                    }}
                />
            },
        },
        {
            title: 'Components',
            dataIndex: 'components',
            key: 'components',
            align: 'center',
            render: (value: string) => {
                return value.split(',')?.map(c => {
                    return <Tag color="blue">{c}</Tag>
                })
            }
        },
        // {Depenedent Group
        //     title: 'Size',
        //     dataIndex: 'size',
        //     align: 'center',
        //     onCell: (record, index) => ({
        //         rowSpan: record.rowSpanForSize
        //     }),
        //     render: (value, record) => {
        //         return <span>{value}</span>
        //     },
        //     style: { border: 'none' }
        // },
    ];
    const constructTableData = (getFabricPro: PoProdTypeAndFabModel[]) => {
        const data: IFabricPro[] = [];

        const mainFabricObj = new Object() as { [key: string]: number };
        const bindingObj = new Object() as { [key: string]: Set<number> };
        getFabricPro.forEach((parent) => {
            parent.iCodes.forEach((child, index) => {
                if (child.mainFabric) {
                    const mainFabKey = parent.productName+'@'+parent.color;
                    mainFabricObj[mainFabKey] = child.id;
                }
                if (child.isBinding) {
                    if(!bindingObj[parent.productName]) {
                        bindingObj[parent.productName] = new Set<number>();
                    }
                    bindingObj[parent.productName].add(child.id);
                }
                data.push({
                    id: child.id,
                    productType: parent.productType,
                    productName: parent.productName,
                    color: parent.color,
                    rowSpan: index === 0 ? parent.iCodes.length : 0,
                    iCode: child.iCode,
                    maxPlies: child.maxPlies,
                    consumption: child.consumption,
                    wastage: child.wastage,
                    bindingConsumption: child.bindingConsumption,
                    mainFabric: child.mainFabric,
                    isBinding: child.isBinding,
                    components: child.components.join(', '),
                });
            });
        });
        setMainFabricIds(mainFabricObj);
        setSelectedSwitchValue(bindingObj);
        setTableData(data);
    };



    const save = () => {
        formRef.validateFields().then(values => {
            const productNameSet = new Set<string>();
            const rmReqArray: PoRmUpdateModel[] = tableData.map((row: IFabricPro, i) => {
                const bindingFabs = selectedSwitchValue[row.productName] ?? new Set<number>();                
                const mainFabricKey = row.productName+'@'+row.color;
                productNameSet.add(mainFabricKey);
                const isMainFabric = mainFabricIds.hasOwnProperty(mainFabricKey) ? mainFabricIds[mainFabricKey] == row.id : false;
                const isBinding = bindingFabs.has(row.id) ? true : false;
                if (!(values[i].maxPlies)) {
                    throw new Error(`Please Enter Max Plies For ${row.iCode}`)
                }
                // check if any fabric that is marked as binding is also marked as main
                if(isBinding && isMainFabric) {
                    throw new Error(`Main faric cannot be selected as binding. Instead enter the binding consumption for product: ${row.productName} and fabric : ${row.iCode}`)
                }
                return new PoRmUpdateModel(row.id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, values[i].maxPlies ? values[i].maxPlies : 0, values[i].consumption ? values[i].consumption : 0, values[i].wastage ? values[i].wastage : 0, isMainFabric, values[i].bindingConsumption ? values[i].bindingConsumption : 0, isBinding, undefined, undefined);
            });
            productNameSet.forEach(pName => {
                if (!mainFabricIds.hasOwnProperty(pName)) {
                    throw new Error(`Please Select Main Fabric for ${pName}`)
                }
            });

            const req = new PoRmUpdateRequest(
                user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,
                props.poSerial,
                rmReqArray
            );
            poMaterialService.updatePoMaterialProps(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch(err => {
                AlertMessages.getErrorMessage(err.message);
            });
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    };

    const distinctValues = [...new Set(tableData.map(value => value.iCode))];

    return (
        <div>
            <div style={{ color: "red"}}> 
            <b>Note :</b> <br/> 
            1. If the Binding is cut along with other components, then do not enable the binding. Instead pass the binding consumption in the same fabric<br/>
            2. If Binding is enabled, we cannot track the embellishment for that specific components.
            </div>
            <Form form={formRef} >
                <Form.Item
                    label="Fabric Code"
                    name="iCode"
                    rules={[{ required: false, message: 'Select the Fabric Code' }]}>

                    <Select onChange={(selectedValues) => selectedfabricCodes(selectedValues)} mode="multiple" placeholder="Please select Fabric Code" value={tableData}>
                        {distinctValues.map((value) => (
                            <Option key={value} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Table
                    bordered
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    rowKey={row => row.id}
                    scroll={{ x: true }}
                />
            </Form>
            <br></br>
            <div style={{ textAlign: 'right' }}>
                <Button onClick={save} type="primary">
                    Save
                </Button>
            </div>
        </div>
    );
};
