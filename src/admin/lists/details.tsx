import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Menu, Result, Spin } from 'antd'
import type { MenuProps } from 'antd'
import {
    AppstoreOutlined, ClusterOutlined, FilePdfOutlined,
    FileTextOutlined, RadarChartOutlined, SettingOutlined, UserOutlined
} from '@ant-design/icons'
import { useApiClient } from '../../hooks/api'
import { useAppDispatch } from '../../redux/hooks'
import { setStateList } from '../../redux/list-slicer'

function Details() {
    const { list_id } = useParams<{ [name: string]: any }>()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const apiClient = useApiClient()
    const [status, setStatus] = useState<string>('loading')

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
            icon: <RadarChartOutlined />,
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

    useEffect(() => {
        apiClient
            .get(`/lists/${list_id}`)
            .then(({ data }) => {
                dispatch(setStateList({
                    current: data.data,
                    [data.data._id]: data.data
                }))
                setStatus('loaded')
            })
            .catch((err) => setStatus((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message))

        // eslint-disable-next-line
    }, [list_id])

    if (status === 'loading') {
        return <Spin />
    }

    if (status !== 'loaded') {
        return <Result status="warning" title={status} />
    }

    return (
        <>
            <Menu
                selectedKeys={[location.pathname]}
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
