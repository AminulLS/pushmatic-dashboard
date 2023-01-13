import React from 'react'
import { DashboardOutlined, GlobalOutlined } from '@ant-design/icons'
import Dashboard from './dashboard'

function Partner() {
    return <Dashboard menuItems={[
        {
            key: '/partner',
            label: 'Dashboard',
            icon: <DashboardOutlined />,
        },
        {
            key: '/partner/lists',
            label: 'Lists',
            icon: <GlobalOutlined />,
        },
    ]} />
}

export default Partner
