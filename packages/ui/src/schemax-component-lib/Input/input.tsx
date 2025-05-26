import { Input, InputProps, InputRef } from "antd";

export const ScxInput = (props: InputProps & React.RefAttributes<InputRef>) => {
    return (
        <Input {...props} />
    )
}

export default ScxInput;