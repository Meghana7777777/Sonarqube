import {  InsInspectionHeaderAttributesDisplayValues, PKMSAttributesNamesAndValues } from "@xpparel/shared-models";
import { Descriptions } from "antd";


export interface InspectionAttributesInfoProps {
  headerAttributes: PKMSAttributesNamesAndValues[]
}
export const PKMSInspectionAttributesInfo = (props: InspectionAttributesInfoProps) => {
  const { headerAttributes } = props;
  const getAttributeInfo = (attributeInfo: PKMSAttributesNamesAndValues[]) => {

    return attributeInfo.map((attribute, index) => {
      const label = InsInspectionHeaderAttributesDisplayValues[attribute.attributeName] ?? attribute.attributeName;
      return <Descriptions.Item label={<b>{label}</b>}>{attribute?.attributeValue}</Descriptions.Item>
    })
  };

  return <Descriptions bordered size="small" >
    {getAttributeInfo(headerAttributes ? headerAttributes : [])}
  </Descriptions>
}