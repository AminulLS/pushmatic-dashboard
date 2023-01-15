import { ProTable } from '@ant-design/pro-components'
import React from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { Button, Space, Tag } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import { useApiClient } from '../../hooks/api'
import type { ListItem } from '../../types/lists'

function Index() {
    const navigate = useNavigate()
    const apiClient = useApiClient()

    const columns: ProColumns<ListItem>[] = [
        {
            dataIndex: 'icon',
            title: 'Name',
            search: false,
            valueType: 'avatar',
            width: 175,
            ellipsis: true,
            fixed: 'left',
            render: (icon, row) => (
                <Space>
                    {row.icon && icon}
                    {row.name}
                </Space>
            ),
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            search: false,
            width: 175,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            search: false,
            ellipsis: true,
            width: 175,
        },
        {
            title: 'Users',
            dataIndex: 'users',
            search: false,
            ellipsis: true,
            valueType: 'digit',
            width: 100,
            sorter: (a, b) => (a.users ?? 0) - (b.users ?? 0),
        }, {
            title: 'Created at',
            dataIndex: 'created_at',
            search: false,
            width: 170,
            renderText: (val) => dayjs(val).format('YYYY-MM-DD hh:mm A'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            search: false,
            ellipsis: true,
            width: 100,
            renderText: (val) => (
                <Tag color={val === 'active' ? 'success' : 'default'}>{val?.toUpperCase() || 'INVALID'}</Tag>
            ),
        },
        {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    onClick={() => navigate(`/partner/lists/${record._id}`)}
                    size="small"
                    icon={<EyeOutlined />}
                />
            ),
        },
    ]

    return (
        <ProTable
            headerTitle="Lists"
            scroll={{ x: 1000 }}
            columns={columns}
            rowKey="_id"
            request={(params) => {
                const qs = new URLSearchParams(params)

                return apiClient.get(`/lists?${qs.toString()}`).then(({ data }) => data)
            }}
            search={{ filterType: 'light' }}
            columnsState={{
                persistenceKey: 'lists-index-table',
                persistenceType: 'localStorage',
            }}
        />
    )
}

export default Index
