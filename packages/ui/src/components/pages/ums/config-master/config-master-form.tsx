import { ConfigGcIdModelDto, MasterModelDto, ConfigMastersDropDownResponseDto, CommonRequestAttrs, AttributesMasterModelDto, GetAttributesByGcId, InputTypesEnum } from '@xpparel/shared-models';
import { MasterService } from '@xpparel/shared-services';
import { Col, Form, Input, Row, Select } from 'antd';
import { FormInstance } from 'antd/lib';
import { GenericFormWithOutPopUP, IFieldWithOutPopUp, IPropsFormItemWithOutPopUp, useAppSelector } from 'packages/ui/src/common';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IProps {
  formRef: FormInstance<any>;
  initialValues: any;
  parentData?: MasterModelDto;
  closeModel: () => void;
  dummyRefreshKey: number;
  setConfigAttributes: Dispatch<SetStateAction<GetAttributesByGcId[]>>
}

export const ConfigMasterForm = (props: IProps) => {
  const { formRef, initialValues, parentData, closeModel, dummyRefreshKey, setConfigAttributes } = props;
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const service = new MasterService();
  const [genericFormItems, setGenericFormItems] = useState<IPropsFormItemWithOutPopUp[]>([]);


  useEffect(() => {
    if (initialValues) {
      formRef.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    getParentIdDropDownAgainstGcID();
  }, [parentData]);


  const getParentIdDropDownAgainstGcID = () => {
    const req = new ConfigGcIdModelDto(userName, orgData.unitCode, orgData.companyCode, userId, parentData?.parentId);
    service.getParentIdDropDownAgainstGcID(req).then((res) => {
      if (res.status) {
        const data: ConfigMastersDropDownResponseDto[] = res.data
        getAttributesByGcId(data)
      } else {
        getAttributesByGcId([])
      }
    })
      .catch((error) => console.error(error));
  };



  const getAttributesByGcId = (parentDropDownData: ConfigMastersDropDownResponseDto[]) => {
    const req = new ConfigGcIdModelDto(userName, orgData.unitCode, orgData.companyCode, userId, parentData?.id)
    service.getAttributesByGcId(req).then(res => {
      if (res.status) {
        setConfigAttributes(res.data);
        const options = parentDropDownData.map((rec) => {
          return {
            value: String(rec.id),
            label: rec.code
          }
        })
        const formItems: IPropsFormItemWithOutPopUp[] = [];
        const fixedFields = [
          new AttributesMasterModelDto(undefined, 'code', 'Code', InputTypesEnum.Input, true, 'Code', 'Code is required', undefined, undefined, true),
          new AttributesMasterModelDto(undefined, 'name', 'Name', InputTypesEnum.Input, true, 'Name', 'Name is required', undefined, undefined, true),
        ];
        // hidden fields for showing 
        if (parentDropDownData?.length > 0) {
          fixedFields.push(new AttributesMasterModelDto(undefined, 'parentId', parentDropDownData?.[0]?.masterLabel, InputTypesEnum.Select, false, 'Parent', '', undefined, undefined, true, options, false))
        }
        res.data.map((rec) => {
          rec.attributeProperties.unshift(...fixedFields);
          rec.attributeProperties.push(new AttributesMasterModelDto(undefined, 'id', 'Id', InputTypesEnum.Input, false, 'Name', 'Name is required', undefined, undefined, true, undefined, true, true))
          // hidden fields for hidden 
          if (!parentDropDownData?.length) {
            rec.attributeProperties.push(new AttributesMasterModelDto(undefined, 'parentId', 'Parent', InputTypesEnum.Select, false, 'Parent', '', undefined, undefined, true, options, true))
          }
          rec.attributeProperties.forEach((att) => {
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
        });
        setGenericFormItems(formItems)
      } else {
        setConfigAttributes([])
      }
    }).catch(err => console.log(err.message))
  }




  return <>
    <GenericFormWithOutPopUP
      key={dummyRefreshKey}
      wrapByCard={true}
      title={parentData?.masterName}
      formRef={formRef}
      initialValues={initialValues}
      formItems={genericFormItems}
      perRowCount={3}
      isUpdate={initialValues?.id ? true : false}
      isNewRecord={initialValues?.id ? false : true}
      closeForm={closeModel}
    // submitForm={saveConfigMasters}
    // clearData={resetFields}
    />
  </>

    ;
};

export default ConfigMasterForm;
