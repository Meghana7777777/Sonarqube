import { Card, CardProps } from "antd";

export interface IscCardProps extends CardProps {

}
export const ScxCard = (props: IscCardProps) => {
    return (
        <Card {...props} >
        </Card>
    )
}

export default ScxCard;