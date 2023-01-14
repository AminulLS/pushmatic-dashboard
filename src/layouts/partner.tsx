import React from 'react'
import { DashboardOutlined, GlobalOutlined } from '@ant-design/icons'
import Dashboard from './dashboard'

import type { MenuProps } from 'antd';

function Partner() {
    const items: MenuProps['items'] = [
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
    ]

    return <Dashboard menuItems={items} />
}

export default Partner
