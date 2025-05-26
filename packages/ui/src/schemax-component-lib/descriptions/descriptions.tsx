import { Descriptions, DescriptionsProps } from "antd";

export interface IscDescriptionsProps extends DescriptionsProps {

}
export const ScxDescriptions = (props: IscDescriptionsProps) => {
    return (
        <Descriptions {...props} >
        </Descriptions>
    )
}

export default ScxDescriptions;