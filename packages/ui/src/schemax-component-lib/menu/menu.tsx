import { Menu, MenuProps } from "antd";

export interface IscMenuProps extends MenuProps {

}
export const ScxMenu = (props: IscMenuProps) => {
    return (
        <Menu {...props} >
        </Menu>
    )
}

export default ScxMenu;