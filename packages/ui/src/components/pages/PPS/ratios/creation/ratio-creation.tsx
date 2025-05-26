import { CutRmModel, PoOqUpdateModel, PoProdTypeAndFabModel, PoRatioCreateRequest, PoRatioLineCreateRequest, PoRatioSizeModel, PoSerialRequest, PoSizesModel, PoSizesResponse, PoSummaryModel, SoStatusEnum } from '@xpparel/shared-models';
import { CutOrderService, POService, PoMaterialService, PoRatioService, PoqService } from '@xpparel/shared-services';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../common';
import { AlertMessages, TableForm } from '../../../../common';
import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Select, Table, Tag } from 'antd';
import { IRatioSummaryColumns, poRatioCreateColumns, poRatioSummaryColumns, ratiosCreateRemarksEnum } from './ratio-creation-columns';
import { ColumnType } from 'antd/es/table';
import { CustomColumn } from 'packages/ui/src/schemax-component-lib';

interface IRatioCreationProps {
    po: PoSummaryModel;
    closeRatioCreate: () => void
}
const { Option } = Select;
export const RatioCreation = (props: IRatioCreationProps) => {
    const { po, closeRatioCreate } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const [selectedSizes, setSelectedSizes] = useState([...po.sizes]);

    const [plies, setPlies] = useState(0);
    const [ratiosData, setRatiosData] = useState([]);
    const [productTypesAndFabrics, setProductTypesAndFabrics] = useState<PoProdTypeAndFabModel[]>([]);
    const [selectedProductType, setSelectedProductType] = useState<PoProdTypeAndFabModel[]>([]);
    const [selectedCutRmModel, setSelectedCutRmModel] = useState<CutRmModel[]>([]);
    const [maxPliesAndDescription, setMaxPliesAndDescription] = useState({});
    const [ratioCodes, setRatioCodes] = useState([]);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [summaryData, setSummaryData] = useState<Partial<IRatioSummaryColumns[]>>([]);
    const [dummyRefresh, setDummyRefresh] = useState(0)
    const poqService = new CutOrderService();
    const [oqData, setOqData] = useState<PoSizesModel[]>(undefined);
    const [formRef] = Form.useForm();
    const poRatioService = new PoRatioService();
    const poMaterialService = new PoMaterialService();
    const [sizesTotal, setSizesTotal] = useState<{ size: string, total: number }[]>([{ size: 'Size wise total qty incl addl %', total: 0 }]);
    const [showSizesTotal, setShowSizesTotal] = useState<{ size: string, total: number }[]>([{ size: 'Size wise total qty incl addl %', total: 0 }]);

    useEffect(() => {
        const ratios = []
        const ratiosObj = getDefaultSizeQty();
        ratios.push({ ...ratiosObj, title: 'Ratio' });
        ratios.push({ ...ratiosObj, title: 'Ratio Qty' });
        setRatiosData(ratios);
    }, []);

    const getDefaultSizeQty = () => {
        const ratiosObj = {};
        po.sizes.forEach(rec => {
            ratiosObj[rec] = 0;
        });
        return ratiosObj;
    }

    useEffect(() => {
        getPoProdTypeAndFabrics(new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, po.poSerial, po.poId, false, false));
        getPoAdditionalQtyInfo();


    }, []);

    const getPoAdditionalQtyInfo = () => {
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, po.poSerial, undefined, true, true);
        poqService.getPoLineLevelSizeQtys(req)
            .then((res) => {
                if (res.status) {
                    const sizeQtysMap = new Map<string, number>();
                    for (const linesOqUpdate of res.data) {
                        let breakItteration = false;
                        console.log(linesOqUpdate.sizeQtys);
                        if (linesOqUpdate.sizeQtys.length) {
                            console.log('-----------------');
                            console.log(po.sizes)
                            for (const size of po.sizes) {
                                console.log('+++++++++++++=')
                                console.log(size);
                                const findMatcedSize = linesOqUpdate.sizeQtys.find((item) => item.size === size);
                                console.log(findMatcedSize);
                                if (!sizeQtysMap.has(size)) {
                                    sizeQtysMap.set(size, 0);
                                }
                                const preVal = sizeQtysMap.get(size);
                                if (findMatcedSize) {
                                    const currVal = Number(findMatcedSize.addQuantity + findMatcedSize.originalQuantity + findMatcedSize.ratioQuantity) ?? 0;
                                    sizeQtysMap.set(size, preVal + currVal);
                                }
                            }
                            breakItteration = true;
                            break
                        }
                        if (breakItteration) {
                            break
                        }
                        if (breakItteration) {
                            break
                        }
                    }
                    const sumSizeVals = [];
                    console.log(sizeQtysMap)
                    sizeQtysMap.forEach((total, size) => {
                        sumSizeVals.push({ size: size, total: total });
                    });
                    console.log(sumSizeVals)
                    setSizesTotal(sumSizeVals);
                    setShowSizesTotal(sumSizeVals);
                } else {
                    setOqData(undefined);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const getPoProdTypeAndFabrics = (req: PoSerialRequest) => {
        poMaterialService.getPoProdTypeAndFabrics(req)
            .then((res) => {
                if (res.status) {
                    setProductTypesAndFabrics(res.data);
                } else {
                    setProductTypesAndFabrics([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }

    const handlePliesChange = (noPlies: number) => {
        setPlies(noPlies);
        setRatiosData(prev => {
            let ratiosQty = { ...prev[1] };
            const initialV = [...sizesTotal]
            Object.keys(prev[1]).forEach((size, index) => {
                if (size !== 'title') {
                    ratiosQty[size] = prev[0][size] * noPlies;
                    initialV[index] = { size, total: showSizesTotal[index]?.total > 0 ? showSizesTotal[index]?.total - (prev[0][size] * noPlies) : 0 }
                }
            });
            setSizesTotal(initialV)
            return [prev[0], ratiosQty]
        });
    };

    const ratiosOnChange = (ratio: number, size: string) => {
        setRatiosData(prev => {
            return [{ ...prev[0], [size]: ratio }, { ...prev[1], [size]: ratio * plies }]
        });
        const sizeWiseValue = showSizesTotal.find((rec) => rec.size === size);
        const sizeWiseValueIndex = showSizesTotal.findIndex((rec) => rec.size === size);
        const calculateValue = sizeWiseValue?.total - (ratio * plies);
        const initialV = [...sizesTotal]
        initialV[sizeWiseValueIndex] = { size: size, total: calculateValue };
        setSizesTotal(initialV)
    };


    const getSizeWiseColumns = () => {
        return [...poRatioCreateColumns,
        ...selectedSizes.map((rec, index) => {

            return {
                title: rec?.toLocaleUpperCase(), dataIndex: rec, key: rec, isDefaultSelect: true,
                align: 'center',
                width: '20px',
                render: (text, record) => {
                    return <div style={{ textAlign: 'center' }}>{(record.title === 'Ratio') ? <InputNumber
                        disabled={isConfirmed}
                        formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9]/g, '') : '')}
                        parser={(value) => value ? parseInt(value, 10) : 0}
                        style={{ margin: '-5px' }}
                        min={0}
                        value={text}
                        onChange={(value) => ratiosOnChange(value, rec)} /> : <>{Number(text)}</>}
                    </div>
                }
            }
        })] as any
    };

    /**
     * TODO : need to make dependent drop downs
     * @param prodName 
     * @param index 
     */
    const productNameOnChange = (prodName: string, index: number) => {
        // const selected = productTypesAndFabrics.find(rec => rec.productName === prodName);
        // formRef.setFieldValue(['ratios', index, 'color'], selected?.color);
        // setSelectedProductType(prev => {
        //     const prevData = [...prev];
        //     prevData[index] = selected;
        //     return prevData
        // });
        // formRef.setFieldValue(['ratios', index, 'color'], '');
        console.log(prodName);
        formRef.setFieldValue(['ratios', index, 'productName'], prodName);
        console.log(formRef);
        formRef.setFieldValue(['ratios', index, 'fabric'], '');
        formRef.setFieldValue(['ratios', index, 'ratioCode'], '');
        formRef.setFieldValue(['ratios', index, 'fabricName'], undefined);
        formRef.setFieldValue(['ratios', index, 'maxPlies'], undefined);
        formRef.setFieldValue(['ratios', index, 'components'], undefined);
    };

    const onFgColorChange = (fgColor: string, index: number) => {
        console.log(formRef);
        const selectedProductName = formRef.getFieldValue(['ratios', index, 'productName']);;
        console.log(selectedProductName);
        if (!selectedProductName) {
            AlertMessages.getErrorMessage('Please select Product Name');
            return;
        }
        const selected = productTypesAndFabrics.find(rec => rec.productName === selectedProductName && rec.color == fgColor);
        if (!selected) {
            AlertMessages.getErrorMessage('Selected Product Does not have this color.');
            return;
        }
        formRef.setFieldValue(['ratios', index, 'color'], fgColor);
        setSelectedProductType(prev => {
            const prevData = [...prev];
            prevData[index] = selected;
            return prevData
        });
        formRef.setFieldValue(['ratios', index, 'fabric'], '');
        formRef.setFieldValue(['ratios', index, 'ratioCode'], '');
        formRef.setFieldValue(['ratios', index, 'fabricName'], undefined);
        formRef.setFieldValue(['ratios', index, 'maxPlies'], undefined);
        formRef.setFieldValue(['ratios', index, 'components'], undefined);
    };

    const handleFabricChange = (selectedValue, selectedOption, index) => {
        const selectedProductName = formRef.getFieldValue(['ratios', index, 'productName']);;
        const selectedColor = formRef.getFieldValue(['ratios', index, 'color']);;
        const selected = selectedProductType[index].iCodes.find(rec => rec.iCode === selectedValue && rec.productName == selectedProductName && rec.fgColor == selectedColor);
        setSelectedCutRmModel(prev => {
            const prevData = [...prev];
            prevData[index] = selected;
            return prevData
        });
        formRef.setFieldValue(['ratios', index, 'fabricName'], selectedOption?.children);
        formRef.setFieldValue(['ratios', index, 'maxPlies'], selected?.maxPlies);
        formRef.setFieldValue(['ratios', index, 'ratioCode'], '');
    };
    const isArraysEqual = (arr1: string[], arr2: string[]): boolean => {
        // Check if the lengths are the same
        if (arr1?.length !== arr2?.length) {
            return false;
        }

        // Check if every element is the same
        return arr1?.every((value, index) => value === arr2[index]);
    }

    const helperGetCompsForProdNameAndFabric = (prodName: string, fgColor: string, itemCode: string) => {
        if (prodName && itemCode && fgColor) {
            const prodNameInfo = productTypesAndFabrics.find(r => r.productName == prodName && r.color == fgColor);
            const comps = prodNameInfo.iCodes.find(f => f.iCode == itemCode);
            return comps.components;
        }
        return [];
    }

    const handleRatioChange = (selectedValue, selectedOption, currentIndex) => {
        const formValues = formRef.getFieldValue('ratios');
        if (!formValues[currentIndex]?.fabric) {
            AlertMessages.getErrorMessage('Select the fabric before selecting ratio group ');
            // reset the ratio code back to empty
            formRef.setFieldValue(['ratios', currentIndex, 'ratioCode'], '');
        }
        const ratioCodeFabSet = new Map<string, Set<string>>();
        for (const eachFormValue of formValues) {
            if (!ratioCodeFabSet.has(eachFormValue.ratioCode)) {
                ratioCodeFabSet.set(eachFormValue.ratioCode, new Set<string>());
            }
            ratioCodeFabSet.get(eachFormValue.ratioCode).add(eachFormValue.fabricName);
        }
        console.log(ratioCodeFabSet);
        for (const [eachRatioCode, ratioCodeDetail] of ratioCodeFabSet) {
            if (ratioCodeDetail.size > 1) {
                formRef.setFieldValue(['ratios', currentIndex, 'ratioCode'], '');
                AlertMessages.getErrorMessage('Fabric should be equal for same grouping code');
            }
        }
        // const setOfIsAllSame = new Set(formValues.reduce((accumulator: boolean[], currentValue: any, index: number) => {
        //     if (index !== currentIndex && currentValue?.ratioCode == selectedValue) {
        //         console.log(formValues[currentIndex]);
        //         const preComps = helperGetCompsForProdNameAndFabric(formValues[currentIndex]?.productName, formValues[currentIndex]?.color, formValues[currentIndex]?.fabric);
        //         const currentComps = helperGetCompsForProdNameAndFabric(currentValue.productName, currentValue.color, currentValue.fabric);
        //         // isArraysEqual(formValues[currentIndex]?.['components'], currentValue?.['components'])
        //         if ( isArraysEqual(preComps, currentComps) ) {
        //             accumulator.push(true);
        //         } else {
        //             accumulator.push(false);
        //         }
        //     }
        //     return accumulator;
        // }, []));
        // if (setOfIsAllSame.size && setOfIsAllSame.has(false)) {
        //     formRef.setFieldValue(['ratios', currentIndex, 'ratioCode'], '');
        //     setDummyRefresh(prev => prev + 1);
        //     AlertMessages.getErrorMessage('Components are not same of these fabrics');
        // }
    };


    const columns: any = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            align: 'center',
            render: (value, row, index) => {
                return (
                    <Form.Item name={[index, "productName"]} rules={[{ required: true }]}>
                        <Select
                            disabled={isConfirmed}
                            onChange={(val) => productNameOnChange(val, index)}
                            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                            placeholder="Select Product Name"
                            showSearch
                        >
                            {[...new Set(productTypesAndFabrics.map(bO => bO.productName))].map(productName => (
                                <Option key={productName} value={productName}>{productName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            }
        },
        {
            title: 'Color',
            dataIndex: 'color',
            align: 'center',
            render: (value, row, index) => {
                return (
                    <Form.Item name={[index, "color"]} rules={[{ required: true }]}>
                        <Select
                            disabled={isConfirmed}
                            onChange={(val) => onFgColorChange(val, index)}
                            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                            placeholder="Select FG Color"
                            showSearch
                        >
                            {[...new Set(productTypesAndFabrics.map(bO => bO.color))].map(color => (
                                <Option key={color} value={color}>{color}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            }
        },
        {
            title: 'Fabric',
            dataIndex: 'fabric',
            align: 'center',
            render: (value, row, index) => {
                return (
                    <>
                        <Form.Item name={[index, "fabric"]} rules={[{ required: true }]}>
                            <Select
                                disabled={isConfirmed}
                                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                placeholder="Select Fabric"
                                showSearch
                                onChange={(selectedValue, selectedOption) => handleFabricChange(selectedValue, selectedOption, index)}
                            >
                                {selectedProductType?.[index]?.iCodes?.map(bO => <Option key={bO.iCode} value={bO.iCode}>{bO.iCode}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }} name="fabricName">
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }} name={[index, "maxPlies"]}>
                            <InputNumber />
                        </Form.Item>
                    </>
                );
            }
        },
        // {
        //     title: 'Components',
        //     dataIndex: 'components',
        //     align: 'center',
        //     render: (value, row, index) => {
        //         return (
        //             <>
        //                 <Form.Item name={[index, "components"]} rules={[{ required: true, message: 'Please select' }]}>
        //                     <Select
        //                         disabled={isConfirmed}
        //                         filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
        //                         placeholder="Select Grouping Code"
        //                         mode='multiple'
        //                         showSearch
        //                     >
        //                         {selectedCutRmModel[index]?.components?.map(component => <Option key={component} value={component}>{component}</Option>)}
        //                     </Select>
        //                 </Form.Item>
        //             </>
        //         );
        //     }
        // },
        {
            title: 'Components',
            dataIndex: 'components',
            align: 'center',
            render: (value, row, index) => {
                return selectedCutRmModel[index]?.components?.map(component => { return <Tag color="blue">{component}</Tag> });
            }
        },
        {
            title: 'Grouping Code',
            dataIndex: 'ratioCode',
            align: 'center',
            render: (value, row, index) => {
                return (
                    <>
                        <Form.Item name={[index, "ratioCode"]} rules={[{ required: true, message: 'Please select' }]}>
                            <Select
                                onChange={(selectedValue, selectedOption) => handleRatioChange(selectedValue, selectedOption, index)}
                                disabled={isConfirmed}
                                filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                placeholder="Select Grouping Code"
                                showSearch
                            >
                                {ratioCodes?.map(ratioCode => <Option key={ratioCode} value={ratioCode}>{`R-${ratioCode}`}</Option>)}
                            </Select>
                        </Form.Item>
                    </>
                );
            }
        }
    ];


    const handleOnRatiosChange = (_, values: any) => {
        if (values?.ratios) {
            const transactions = [...values.ratios];
            setRatioCodes(Array.from({ length: transactions.length }, (value, index) => index + 1));
        }

    }


    const generateSummeryTable = async () => {
        let maxPliesAndDescriptionObj = {};

        let totalSizeRatios = 0;
        // check if there are any ratios enteres
        po.sizes.forEach(s => {
            totalSizeRatios += ratiosData[0][s] ?? 0;
        });
        if (totalSizeRatios == 0) {
            AlertMessages.getErrorMessage('Size wise bundle counts are not enetered');
            return;
        }
        await formRef.validateFields().then(values => {

            if (!values.ratios) {
                AlertMessages.getErrorMessage('No ratios are entered');
                return;
            }

            setIsConfirmed(true);
            const ratioWiseDataMap = new Map();
            values.ratios.forEach((rec, index) => {
                // get the components directly from the fabric object
                const productFabs = selectedProductType.find(p => p.productName == rec.productName && p.color == rec.color);
                console.log(productFabs);
                const currentFab = productFabs.iCodes.find(i => i.iCode === rec.fabric);
                const abc: IRatioSummaryColumns = {
                    ratioCode: rec.ratioCode,
                    fabric: rec.fabric,
                    fabricName: rec.fabricName,
                    productName: rec.productName,
                    fgColor: rec.color,
                    maxPlies: rec.maxPlies,
                    // components: rec.components,
                    components: currentFab.components,
                    plies: plies,
                    remarks: values.ratios.length === 1 ? ratiosCreateRemarksEnum.NORMAL : ratiosCreateRemarksEnum.CLONE,
                    rowSpan: 1,
                    ...ratiosData[0]
                }
                if (!ratioWiseDataMap.has(rec.ratioCode)) {
                    ratioWiseDataMap.set(rec.ratioCode, [abc])
                } else {
                    ratioWiseDataMap.get(rec.ratioCode).push(abc)
                }
            });
            const total: IRatioSummaryColumns = {
                ratioCode: '',
                fabric: '',
                productName: '',
                fgColor: '',
                fabricName: '',
                plies: null,
                maxPlies: null,
                remarks: '',
                rowSpan: 1,
                ...getDefaultSizeQty()
            }
            const data = [];
            console.log(ratioWiseDataMap);
            ratioWiseDataMap.forEach(rec => {
                if (rec.length === 1) {
                    data.push(...rec);
                    rec.forEach((interRec, index) => {
                        po.sizes.forEach(size => {
                            if (interRec[size])
                                total[size] += Number(interRec[size]) * interRec.plies;
                        })
                    });
                    maxPliesAndDescriptionObj[rec[0].ratioCode] = { maxPlies: rec[0].maxPlies, ratioDescription: '' }
                } else {
                    const child = [];
                    const fabricsSet = new Set();
                    const maxPliesSet = new Set<number>();
                    const componentsSet = new Set<string>();
                    rec.forEach(interRec => {
                        maxPliesSet.add(interRec.maxPlies);
                        fabricsSet.add(interRec.fabric);
                        for (const eachComp of interRec.components) {
                            componentsSet.add(eachComp)
                        }
                    });
                    console.log(componentsSet);
                    const maxPlies = Math.min(...Array.from(maxPliesSet));
                    maxPliesAndDescriptionObj[rec[0].ratioCode] = { maxPlies, ratioDescription: '' }
                    const remarks = fabricsSet.size === 1 ? ratiosCreateRemarksEnum.SHARING : ratiosCreateRemarksEnum.SANDWICH_CUT_WITH_CLONE;
                    rec.forEach((interRec, index) => {
                        console.log(interRec);
                        if (index === 0) {
                            child.push({ ...interRec, rowSpan: rec.length, remarks, maxPlies, components: Array.from(componentsSet) });
                            po.sizes.forEach(size => {
                                if (interRec[size])
                                    total[size] += Number(interRec[size]) * interRec.plies;
                            })
                        } else {
                            if (fabricsSet.size === 1) {
                                child.push({ ...interRec, rowSpan: 0, ...getDefaultSizeQty(), remarks, maxPlies });
                            } else {
                                child.push({ ...interRec, rowSpan: 0, remarks, maxPlies, components: Array.from(componentsSet) });
                                po.sizes.forEach(size => {
                                    if (interRec[size])
                                        total[size] += Number(interRec[size]) * interRec.plies;
                                })
                            }
                        }
                        console.log(child);
                    });
                    data.push(...child);
                }

            });
            data.push(total);
            console.log('+++++++++++++++++')
            console.log(data);
            console.log('+++++++++++++++++')
            setSummaryData(data);
            setMaxPliesAndDescription(maxPliesAndDescriptionObj);
        }).catch(err => {
            console.log(err)
        })
    }

    const resetSummeryTable = () => {
        setIsConfirmed(false);
    }
    const pliesAndDescChange = (ratioCode, key, value) => {
        setMaxPliesAndDescription(prev => {
            return { ...prev, [ratioCode]: { ...prev[ratioCode], [key]: value } }
        })
    }

    const getPoRatioSummaryColumns = () => {
        return [...poRatioSummaryColumns,
        {
            title: 'Max Plies',
            dataIndex: 'maxPlies',
            align: 'center',
            onCell: (record, index,) => {
                return { rowSpan: record.rowSpan }
            },
            render: (value, row, index) => {
                return (
                    value != null && <InputNumber formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9]/g, '') : '')}
                        parser={(value) => value ? parseInt(value, 10) : 0} value={maxPliesAndDescription[row.ratioCode]['maxPlies']} onChange={(val => pliesAndDescChange(row.ratioCode, 'maxPlies', val))} />
                );
            }
        },
        {
            title: 'Components',
            dataIndex: 'components',
            align: 'center',
            onCell: (record, index,) => {
                return { rowSpan: record.rowSpan }
            },
            render: (value, row, index) => {
                return value?.map(v => {
                    return <Tag color="blue">{v}</Tag>
                });
            }
        },
        {
            title: 'Ratio Description',
            dataIndex: 'ratioDescription',
            align: 'center',
            onCell: (record, index,) => {
                return { rowSpan: record.rowSpan }
            },
            render: (value, row, index) => {
                return (
                    maxPliesAndDescription[row.ratioCode] && <Input value={maxPliesAndDescription[row.ratioCode]['ratioDescription']} onChange={(e => pliesAndDescChange(row.ratioCode, 'ratioDescription', e.target.value))} />
                );
            }
        },
        ...selectedSizes.map(rec => {
            return {
                title: rec?.toLocaleUpperCase(), dataIndex: rec, key: rec, isDefaultSelect: true, align: 'center',
                onCell: (record, index,) => {
                    return { rowSpan: record.remarks === ratiosCreateRemarksEnum.SHARING ? record.rowSpan : 1 }
                },
                render: (text, record) => {
                    return <div style={{ textAlign: 'end' }}><b>{Number(text)}</b></div>
                }
            }
        })]
    };

    const handleRemove = (indexToRemove: number) => {
        const currentValues = formRef.getFieldValue('ratios');
        const updatedValues = currentValues.filter((_, index) => index !== indexToRemove);
        formRef.setFieldsValue({
            ratios: updatedValues.map((value, index) => ({ ...value, key: index.toString() })),
        });
        setSelectedProductType(selectedProductType.filter((_, index) => index !== indexToRemove).map(rec => rec));
        setSelectedCutRmModel(selectedCutRmModel.filter((_, index) => index !== indexToRemove).map(rec => rec))
    };

    const saveHandler = async () => {
        const req = [];
        await formRef.validateFields().then(values => {
            const ratioWiseDataMap = new Map();
            values.ratios.forEach((rec, index) => {
                // get the components directly from the fabric object
                const productFabs = selectedProductType.find(p => p.productName == rec.productName && p.color == rec.color);
                const currentFab = productFabs.iCodes.find(i => i.iCode === rec.fabric);
                const abc: IRatioSummaryColumns = {
                    ratioCode: rec.ratioCode,
                    fabric: rec.fabric,
                    fabricName: rec.fabricName,
                    productName: rec.productName,
                    maxPlies: rec.maxPlies,
                    // components: rec.components,
                    components: currentFab.components,
                    plies: plies,
                    remarks: values.ratios.length === 1 ? ratiosCreateRemarksEnum.NORMAL : ratiosCreateRemarksEnum.CLONE,
                    rowSpan: 1,
                    fgColor: rec.color,
                    ...ratiosData[0]
                }
                if (!ratioWiseDataMap.has(rec.ratioCode)) {
                    ratioWiseDataMap.set(rec.ratioCode, [abc])
                } else {
                    ratioWiseDataMap.get(rec.ratioCode).push(abc)
                }
            });
            for (const [_, rec] of ratioWiseDataMap) {
                const ratioDescription = maxPliesAndDescription[rec[0].ratioCode].ratioDescription;
                const maxPlies = maxPliesAndDescription[rec[0].ratioCode].maxPlies;
                if (!ratioDescription)
                    throw new Error(`Please Enter Ratio Description for Grouping Code R-${rec[0].ratioCode}`);
                if (!maxPlies)
                    throw new Error(`Please Enter Max Plies for Grouping Code R-${rec[0].ratioCode}`);
                const actualComponents = new Set<string>();
                for (const eachRec of rec) {
                    for (const eachComp of eachRec.components) {
                        actualComponents.add(eachComp);
                    }
                }
                const createReq = new PoRatioCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, po.poSerial, rec[0].ratioCode, rec[0].ratioCode, [], '', ratioDescription, maxPlies, Array.from(actualComponents));
                if (rec.length === 1) {
                    const dataObj = { ...rec[0] };
                    console.log('())))))))))))))')
                    console.log(dataObj);
                    console.log('())))))))))))))')
                    const ratioLine = new PoRatioLineCreateRequest(dataObj.fabric, dataObj.productName, dataObj.fgColor,  dataObj.plies, undefined, []);
                    po.sizes.forEach(size => {
                        if (dataObj[size]) {
                            ratioLine.sizeRatios.push(new PoRatioSizeModel(size, dataObj[size]));
                        } else {
                            ratioLine.sizeRatios.push(new PoRatioSizeModel(size, 0));
                        }
                    })
                    createReq.ratioLines.push(ratioLine);
                } else {
                    const fabricsSet = new Set();
                    rec.forEach(interRec => {
                        fabricsSet.add(interRec.fabric);
                    })
                    const remarks = fabricsSet.size === 1 ? ratiosCreateRemarksEnum.SHARING : ratiosCreateRemarksEnum.SANDWICH_CUT_WITH_CLONE;
                    createReq.remarks = remarks;
                    rec.forEach((interRec, index) => {
                        console.log('())))))))))))))')
                        console.log(interRec);
                        console.log('())))))))))))))')
                        const ratioLine = new PoRatioLineCreateRequest(interRec.fabric, interRec.productName, interRec.fgColor, interRec.plies, undefined, []);
                        po.sizes.forEach(size => {
                            if (interRec[size]) {
                                ratioLine.sizeRatios.push(new PoRatioSizeModel(size, interRec[size]));
                            } else {
                                ratioLine.sizeRatios.push(new PoRatioSizeModel(size, 0));
                            }
                        })
                        createReq.ratioLines.push(ratioLine);
                    });
                }
                req.push(createReq);
            };

            poRatioService.createPoRatio(req)
                .then((res) => {
                    if (res.status) {
                        closeRatioCreate();
                        AlertMessages.getSuccessMessage(res.internalMessage);
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage);
                    }
                })
                .catch((err) => {
                    AlertMessages.getErrorMessage(err.message);
                });
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
            console.log(err)
        });
    }


    const getTotalPlies = () => {
        return po.sizes.reduce((a, c) => {
            return a + (summaryData.slice(-1)?.[0]?.[c] ? Number(summaryData.slice(-1)?.[0]?.[c]) : 0)
        }, 0)
    }

    return (
        <>
            <Row justify='space-between'>
                <Col><InputNumber
                    disabled={isConfirmed}
                    formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9]/g, '') : '')}
                    parser={(value) => value ? parseInt(value, 10) : 0}
                    min={1}
                    addonBefore="Plies"
                    value={plies}
                    onChange={(val) => handlePliesChange(val)}
                /></Col>
                <Col><b>Total Ratio Plies : {summaryData.slice(-1) ? getTotalPlies() : 0}</b></Col>
            </Row>
            <br />
            <Table size='small' bordered columns={getSizeWiseColumns()} dataSource={[...ratiosData, {
                title: "Total",
                ...sizesTotal.reduce((acc, cur) => {
                    acc[cur.size] = cur.total ?? 0;
                    return acc;
                }, {})
            }]} pagination={false} />
            <br />
            <Form
                layout='vertical'
                form={formRef}
                autoComplete='off'
                onValuesChange={handleOnRatiosChange}
            >
                <Form.List name="ratios">
                    {(ratios, { add, remove }) => {
                        return <TableForm dataSource={ratios} add={add} remove={handleRemove} bordered={true} columns={columns} hideAdd={isConfirmed} hideDelete={isConfirmed} />;
                    }}
                </Form.List>
                <Row justify='space-between' style={{ marginTop: '5px' }}>
                    <Col>
                    </Col>
                    <Col >
                        <div >
                            <Button type="primary" className='btn-green' onClick={generateSummeryTable} disabled={isConfirmed}>
                                Confirm
                            </Button>
                            &nbsp;
                            <Button type="primary" danger onClick={resetSummeryTable} disabled={!isConfirmed}>
                                Clear Summary
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
            {isConfirmed && < >
                <Divider>Summary</Divider>
                <Table size='small' bordered columns={getPoRatioSummaryColumns() as CustomColumn<IRatioSummaryColumns>[]} dataSource={summaryData} pagination={false} />
                <Row justify='space-between' style={{ marginTop: '5px' }}>
                    <Col>
                    </Col>
                    <Col >
                        <div >
                            <Button type="primary" className='btn-green' onClick={saveHandler} disabled={!isConfirmed}>
                                Save
                            </Button>
                        </div>
                    </Col>
                </Row>
            </>}
        </>
    )
}

export default RatioCreation;