import {  Tag, TagProps } from "antd";

export interface IscTagProps extends TagProps {

}
export const ScxTag = (props: IscTagProps) => {
    return (
        <Tag {...props} >
        </Tag>
    )
}

export default ScxTag;