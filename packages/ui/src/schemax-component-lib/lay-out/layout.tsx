import { Layout, LayoutProps } from "antd";

export interface IscLayoutProps extends LayoutProps {

}
export const ScxLayout = (props: IscLayoutProps) => {
    return (
        <Layout {...props} >
        </Layout>
    )
}

export default ScxLayout;