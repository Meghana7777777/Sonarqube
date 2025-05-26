import { Select, SelectProps } from 'antd'
export interface IScSelectProps extends SelectProps {

}
export const ScSelect = (props: IScSelectProps) => {
    return (
        <Select {...props} >
        </Select>
    )
}

export default ScSelect