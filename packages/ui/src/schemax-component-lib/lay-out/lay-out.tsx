import { Layout } from 'antd';
import { BasicProps } from 'antd/es/layout/layout';
import React from 'react'

const ScxLayOut = (props: BasicProps & React.RefAttributes<HTMLElement>) => {
    return (
        <Layout {...props} />
    )
}

export default ScxLayOut;