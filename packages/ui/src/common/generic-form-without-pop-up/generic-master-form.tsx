import { CommonRequestAttrs, GenericOptionsTypeEnum, InputTypesEnum } from '@xpparel/shared-models';
import { GenericCommonAxiosService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Upload } from 'antd';
import { FormInstance, Rule } from 'antd/lib/form';
import React from 'react';
import { SketchPicker } from "react-color";
import DatePicker from '../../components/common/data-picker/date-picker';
import { AlertMessages } from '../../components/common';
import { useAppSelector } from 'packages/ui/src/common';
import { UploadedFile } from '@nestjs/common';
import { InboxOutlined, PlusCircleFilled } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';

const { Option } = Select;
const { TextArea } = Input;
const genericCommonAxiosService = new GenericCommonAxiosService();


export interface IPropOptionsWithOutPopUp {
    value: string;
    label: string;
}

export interface IFieldWithOutPopUp {
    type: InputTypesEnum,
    placeHolder?: string;
    options?: IPropOptionsWithOutPopUp[];
    otherProps?: any;
    callBack?: (data: any) => void;
    optionsType: GenericOptionsTypeEnum;
    optionsSource: string[];

}


export interface IPropsFormItemWithOutPopUp {
    label: string;
    name: string;
    validationRules?: Rule[],
    fieldType: IFieldWithOutPopUp,
    hidden?: boolean
}

export interface IPropsGenericFormWithOutPopUp {
    formItems: IPropsFormItemWithOutPopUp[];
    formRef: FormInstance<any>;
    initialValues: any;
    title: string;
    isUpdate: boolean;
    isNewRecord: boolean;
    closeForm: () => void;
    submitForm?: () => void;
    clearData?: () => void;
    wrapByCard?: boolean;
    children?: React.ReactNode;
    perRowCount?: number;
}

const getInputField = (fieldType: IFieldWithOutPopUp, fieldKey: string, formRef: FormInstance<any>, user: any) => {
    const placeHolder = fieldType.placeHolder
    if (fieldType.type === InputTypesEnum.Input) {
        return <Input placeholder={placeHolder} autoComplete='off' {...fieldType.otherProps} />
    } else if (fieldType.type === InputTypesEnum.InputNumber) {
        return <InputNumber min={0} placeHolder={placeHolder} style={{ width: '100%' }} {...fieldType.otherProps} />
    } else if (fieldType.type === InputTypesEnum.Select) {
        if (fieldType.optionsType === GenericOptionsTypeEnum.API) {
            genericCommonAxiosService.gettingOptions(fieldType.optionsSource[0], new CommonRequestAttrs(user.userName, user.orgData.unitCode, user.orgData.companyCode, user.userId,)).then(res => {
                if (res.status) {
                    fieldType.options = res.data as [{ value: string, label: string }]
                } else {
                    AlertMessages.getErrorMessage('Message From Generic Form:' + " " + res.internalMessage)
                }
            }).catch(err => console.log(err.message))
        } else if (fieldType.optionsType === GenericOptionsTypeEnum.ENUM) {
            fieldType.options = fieldType.optionsSource.map((rec) => {
                return { value: rec, label: rec }
            })
        }
        return <Select
            {...fieldType.otherProps}
            placeholder={placeHolder}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => (option!.children as unknown as string).toString().toLocaleLowerCase().includes(input.toLocaleLowerCase())}
            onChange={fieldType?.callBack ? (value) => fieldType.callBack(value) : () => { }}
        >

            {React.Children.toArray([...fieldType?.options].map(item => {
                return <Option value={item.value}>{item.label}</Option>
            }))}
        </Select>
    }
    else if (fieldType.type === InputTypesEnum.TextArea) {
        return <TextArea aria-multiline {...fieldType.otherProps} placeHolder={placeHolder} />
    }
    else if (fieldType.type === InputTypesEnum.DatePicker) {
        return <DatePicker placeHolder={placeHolder} style={{ width: '100%' }} {...fieldType.otherProps} />
    }

    else if (fieldType.type === InputTypesEnum.SketchPicker) {
        return <SketchPicker
            color={'#ffffff'}
            onChangeComplete={(updatedColor) => {
                formRef.setFieldValue(fieldKey, updatedColor.hex)
            }}
        />
    } 
    // else if (fieldType.type === InputTypesEnum.Upload) {
    //     return <Dragger
    //     >
    //         <p className="ant-upload-drag-icon">
    //             <InboxOutlined />
    //         </p>
    //         <p className="ant-upload-text">Click or drag file to this area to upload</p>
    //         <p className="ant-upload-hint">
    //             Support for a single or bulk upload. Strictly prohibited from uploading company data or other
    //             banned files.
    //         </p>
    //     </Dragger>
    // }
    //  else if (fieldType.type === InputTypesEnum.Radio) {
    //     return <Radio.Group placeHolder={placeHolder}  {...fieldType.otherProps}>
    //         {React.Children.toArray([...fieldType?.options].map(item => {
    //             return <Radio value={item.value}>{item.label}</Radio>
    //         }))}
    //     </Radio.Group>
    // }
    else {
        return <></>
    }
}

export const GenericFormWithOutPopUP = (props: IPropsGenericFormWithOutPopUp) => {
    const { title, formRef, initialValues, formItems, } = props;
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;

    const getLayoutSettings = (perRowCount: number = 3) => {
        if (perRowCount === 2) {
            return {
                column1: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 11 },
                    lg: { span: 11 },
                    xl: { span: 11 }
                },
                column2: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 11, offset: 2 },
                    lg: { span: 11, offset: 2 },
                    xl: { span: 11, offset: 2 }
                }
            }
        } else if (perRowCount === 3) {
            return {
                column1: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 7 },
                    lg: { span: 7 },
                    xl: { span: 7 }
                },
                column2: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 7, offset: 1 },
                    lg: { span: 7, offset: 1 },
                    xl: { span: 7, offset: 1 }
                }
            }
        } else if (perRowCount === 4) {
            return {
                column1: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 5 },
                    lg: { span: 5 },
                    xl: { span: 5 }
                },
                column2: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 5, offset: 1 },
                    lg: { span: 5, offset: 1 },
                    xl: { span: 5, offset: 1 }
                }
            }
        } else {
            return {
                column1: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 11 },
                    lg: { span: 11 },
                    xl: { span: 11 }
                },
                column2: {
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 11, offset: 2 },
                    lg: { span: 11, offset: 2 },
                    xl: { span: 11, offset: 2 }
                }
            }
        }
    }
    const layOutSettings = getLayoutSettings(props.perRowCount);

    const getWrappedByCard = () => {

        // const renderInitialValues = (initialValuesFromForm) => {
        //     const findDateField = formItems.filter((rec) => rec.fieldType.type === InputTypesEnum.DatePicker);
        //     if (findDateField.length) {
        //         const dateKeys = Object.keys(initialValuesFromForm).filter((rec) => rec.includes('date'));
        //         for (const rec of dateKeys) {
        //             initialValuesFromForm[rec] = moment(initialValuesFromForm[rec])
        //         }
        //     }
        //     return initialValuesFromForm
        // }

        return (<>
            <Form layout="vertical" form={formRef} initialValues={initialValues} autoComplete="off" >
                {React.Children.toArray(formItems.map((formItem, index) => {
                    if (index % 3 === 0) {
                        return (
                            <Col
                                {...layOutSettings.column1}
                            >
                                <Form.Item
                                    label={formItem.label}
                                    name={formItem.name}
                                    rules={formItem.validationRules}
                                    hidden={formItem.hidden}
                                >
                                    {
                                        getInputField(formItem.fieldType, formItem.name, formRef, user)
                                    }
                                </Form.Item>
                            </Col>
                        );
                    } else {
                        return (
                            <Col
                                {...layOutSettings.column2}
                            >
                                <Form.Item
                                    label={formItem.label}
                                    name={formItem.name}
                                    rules={formItem.validationRules}
                                    hidden={formItem.hidden}
                                >
                                    {
                                        getInputField(formItem.fieldType, formItem.name, formRef, user)

                                    }
                                </Form.Item>
                            </Col>
                        );
                    }
                }).reduce((r, element, index2) => {
                    index2 % 3 === 0 && r.push([]);
                    r[r.length - 1].push(element);
                    return r;
                }, []).map((rowContent) => {
                    return <Row>{rowContent}</Row>;
                }))}
            </Form>
            {props?.children}
        </>)
    }
    if (props.wrapByCard) {
        return (<Card
            title={title}
        >
            {getWrappedByCard()}
        </Card>)
    }
    return (
        getWrappedByCard()
    )
}

export default GenericFormWithOutPopUP;