import { Button, ButtonProps } from "antd";


export interface IscButtonProps extends ButtonProps {

}
export const ScxButton = (props: IscButtonProps) => {
    return (
        <Button {...props} >
        </Button>
    )
}

export default ScxButton;