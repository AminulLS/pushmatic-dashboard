import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Menu, Result, Spin } from 'antd'
import type { MenuProps } from 'antd'
import { AppstoreOutlined, FilePdfOutlined, SettingOutlined } from '@ant-design/icons'
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
            key: `/partner/lists/${list_id}`,
            label: 'Dashboard',
            icon: <AppstoreOutlined />,
        },
        {
            key: `/partner/lists/${list_id}/developers`,
            label: 'Developers',
            icon: <FilePdfOutlined />,
        },
        {
            key: `/partner/lists/${list_id}/testing`,
            label: 'Testing',
            icon: <SettingOutlined />,
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
            .catch((err) => setStatus(err.message))

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
