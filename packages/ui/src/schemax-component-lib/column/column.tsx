import { Col,ColProps } from "antd";

export interface IscColProps extends ColProps {

}
export const ScxColumn = (props: IscColProps) => {
    return (
        <Col {...props} >
        </Col>
    )
}

export default ScxColumn;