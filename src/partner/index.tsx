import React from 'react'
import { Card, Col, Row } from 'antd'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'

function Index() {
    const auth = useAppSelector(({ auth }) => auth)

    return (
        <Row gutter={16}>
            <Col span={12}>
                <Card title="Welcome">
                    Hello, {auth.name}
                </Card>
            </Col>
            <Col span={12}>
                <Card title="List">
                    You can manage your lists <NavLink to="/partner/lists" replace={true}>here</NavLink>
                </Card>
            </Col>
        </Row>
    )
}

export default Index
