import { AttributesMasterModelDto, InputTypesEnum } from '@xpparel/shared-models'
import { FormInstance } from 'antd';
import { GenericFormWithOutPopUP, IFieldWithOutPopUp, IPropsFormItemWithOutPopUp } from 'packages/ui/src/common';
import React, { useEffect, useState } from 'react'

interface PreviewIProps {
    selectedAttributes: AttributesMasterModelDto[];
    formRef: FormInstance<any>
}

const GlobalConfigPreview = (props: PreviewIProps) => {
    const { selectedAttributes, formRef } = props;
    const [genericFormItems, setGenericFormItems] = useState<IPropsFormItemWithOutPopUp[]>([])

    useEffect(() => {
        const formItems: IPropsFormItemWithOutPopUp[] = [];
        const fixedFields = [
            new AttributesMasterModelDto(undefined, 'code', 'Code', InputTypesEnum.Input, true, 'Code', 'Code is required', undefined, undefined, true),
            new AttributesMasterModelDto(undefined, 'name', 'Name', InputTypesEnum.Input, true, 'Name', 'Name is required', undefined, undefined, true),
        ];
        selectedAttributes.unshift(...fixedFields);
        selectedAttributes.forEach((att) => {
            const fields: IFieldWithOutPopUp = {
                type: att.inputType,
                placeHolder: att.placeHolder,
                options: att.options,
                optionsSource: att.optionsSource,
                optionsType: att.optionsType
            }
            const items: IPropsFormItemWithOutPopUp = {
                label: att.labelName,
                name: att.name,
                fieldType: fields,
                hidden: att.hidden,
                validationRules: [{ message: att.validationMessage, required: att.requiredField }]
            }
            formItems.push(items)
        })

        setGenericFormItems(formItems)
    }, [selectedAttributes])


    return <>
        <GenericFormWithOutPopUP
            formItems={genericFormItems}
            formRef={undefined}
            initialValues={undefined}
            title={formRef.getFieldValue('masterName')}
            isUpdate={false}
            isNewRecord={false}
            closeForm={undefined}
            submitForm={undefined}
            clearData={undefined}
            wrapByCard={true}
        />

    </>
}

export default GlobalConfigPreview