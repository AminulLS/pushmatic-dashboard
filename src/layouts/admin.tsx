import React from 'react'
import { DashboardOutlined, FileTextOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons'
import Dashboard from './dashboard'

function Admin() {
    return <Dashboard menuItems={[
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
    ]} />
}

export default Admin
