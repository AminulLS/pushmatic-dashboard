import React from 'react'
import { Card, Col, Row } from 'antd'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import Lists from './lists/index'

function Index() {
    const auth = useAppSelector(({ auth }) => auth)

    return (
        <>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12}>
                    <Card title="Welcome">
                        Hello, {auth.name}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="List">
                        You can manage your lists <NavLink to="/partner/lists">here</NavLink>
                    </Card>
                </Col>
            </Row>

            <Lists />
        </>
    )
}

export default Index
