import { InsAttributeNameValueModel, InsInspectionHeaderAttributes, InsInspectionHeaderAttributesDisplayValues } from "@xpparel/shared-models";
import { Descriptions } from "antd";


export interface InspectionAttributesInfoProps {
  headerAttributes: InsAttributeNameValueModel[]
}
export const InspectionAttributesInfo = (props: InspectionAttributesInfoProps) => {
  const { headerAttributes } = props;
  const getAttributeInfo = (attributeInfo: InsAttributeNameValueModel[]) => {

    return attributeInfo.filter(attribute => attribute.attributeName != InsInspectionHeaderAttributes.MILL_SHADE).map((attribute, index) => {
      const label = InsInspectionHeaderAttributesDisplayValues[attribute.attributeName] ?? attribute.attributeName;
      return <Descriptions.Item label={<b>{label}</b>}>{attribute?.attributeValue}</Descriptions.Item>
    })
  };

  return <Descriptions bordered size="small" >
    {getAttributeInfo(headerAttributes ? headerAttributes : [])}
  </Descriptions>
}