import React from 'react'
import { DashboardOutlined, FileTextOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons'
import Dashboard from './dashboard'

import type { MenuProps } from 'antd';

function Admin() {
    const items: MenuProps['items'] = [
        {
            key: '/admin',
            label: 'Dashboard',
            icon: <DashboardOutlined />,
        },
        {
            key: '/admin/lists',
            label: 'Lists',
            icon: <GlobalOutlined />,
        },
        {
            key: '/admin/reports',
            label: 'Reports',
            icon: <FileTextOutlined />,
        },
        {
            key: '/admin/admins',
            label: 'Admins',
            icon: <UserOutlined />,
        },
    ]

    return <Dashboard menuItems={items} />
}

export default Admin
