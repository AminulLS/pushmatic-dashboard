import React from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Menu } from 'antd'
import {
    AppstoreOutlined,
    CalendarOutlined,
    ClusterOutlined,
    FilePdfOutlined,
    FileTextOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';

import type { MenuProps } from 'antd'

function Details() {
    const { list_id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        {
            key: `/admin/lists/${list_id}`,
            label: 'Dashboard',
            icon: <AppstoreOutlined />,
        },
        {
            key: `/admin/lists/${list_id}/ads`,
            label: 'Ads',
            icon: <FileTextOutlined />,
        },
        {
            key: `/admin/lists/${list_id}/segments`,
            label: 'Segments',
            icon: <ClusterOutlined />,
        },
        {
            key: `/admin/lists/${list_id}/campaigns`,
            label: 'Campaigns',
            icon: <CalendarOutlined />,
        },
        {
            key: `/admin/lists/${list_id}/users`,
            label: 'Users',
            icon: <UserOutlined />,
        },
        {
            key: `/admin/lists/${list_id}/reports`,
            label: 'Reports',
            icon: <FileTextOutlined />,
        },
        {
            key: `/admin/lists/${list_id}/configuration`,
            label: 'Configuration',
            icon: <SettingOutlined />,
        },
        {
            key: `/admin/lists/${list_id}/developers`,
            label: 'Developers',
            icon: <FilePdfOutlined />,
        },
    ]

    return (
        <>
            <Menu
                defaultSelectedKeys={[location.pathname]}
                onClick={(item) => navigate(item.key)}
                mode="horizontal"
                items={items}
                style={{ marginBottom: 20 }}
            />

            <Outlet />
        </>
    )
}

export default Details
