import { Row, RowProps } from "antd";

export interface IscRowProps extends RowProps {

}
export const ScxRow = (props: IscRowProps) => {
    return (
        <Row {...props} >
        </Row>
    )
}

export default ScxRow;