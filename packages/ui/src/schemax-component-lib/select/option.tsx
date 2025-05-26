import { Select } from "antd"
import { IScSelectProps } from "./select";

const { Option } = Select;
export const ScxOption = (props: IScSelectProps) => {
    return (
        <Option {...props}>{props.children}</Option>
    )
}

export default ScxOption