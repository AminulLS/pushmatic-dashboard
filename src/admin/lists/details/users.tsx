import { ProTable } from '@ant-design/pro-components'
import React from 'react'
import dayjs from 'dayjs'
import { Dropdown } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ProColumns } from '@ant-design/pro-components'
import { RocketOutlined, EyeOutlined } from '@ant-design/icons'
import { useApiClient } from '../../../hooks/api'
import { useAppSelector } from '../../../redux/hooks'
import type { ListItem } from '../../../types/lists'
import type { UserItem } from '../../../types/users'

function Users() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const navigate = useNavigate()

    const columns: ProColumns<UserItem>[] = [
        {
            title: 'Name',
            dataIndex: 'full_name',
            width: 150,
            ellipsis: true,
            search: false,
            fixed: 'left',
            render: (_, row) => `${row.first_name} ${row.last_name}`,
        }, {
            title: 'Search',
            dataIndex: 'search',
            width: 150,
            ellipsis: true,
            search: false,
        }, {
            title: 'Location',
            dataIndex: 'location',
            width: 150,
            ellipsis: true,
            search: false,
        }, {
            title: 'Browser',
            dataIndex: 'browser',
            width: 130,
            ellipsis: true,
            search: false,
        }, {
            title: 'User Agent',
            dataIndex: 'agent',
            ellipsis: true,
            width: 175,
            search: false,
        }, {
            title: 'CHNL#1',
            dataIndex: 'chnl1',
            ellipsis: true,
            width: 100,
            search: false,
        }, {
            title: 'CHNL#2',
            dataIndex: 'chnl2',
            ellipsis: true,
            width: 100,
            search: false,
        }, {
            title: 'CHNL#3',
            dataIndex: 'chnl3',
            ellipsis: true,
            width: 100,
            search: false,
        }, {
            title: 'Subscribed at',
            dataIndex: 'created_at',
            search: false,
            width: 170,
            renderText: (val) => dayjs(val).format('YYYY-MM-DD hh:mm A'),
        }, {
            title: 'Status',
            dataIndex: 'status',
            ellipsis: true,
            width: 100,
            search: false,
        }, {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            render: (_, record) => (<Dropdown.Button
                size="small"
                menu={{
                    items: [{
                        key: 'send_push',
                        label: 'Send Push',
                        icon: <RocketOutlined />,
                        onClick: () => navigate(`/admin/lists/${list._id}/campaigns?type=onetime&send_filter=${record._id}&send_to=user`),
                    }]
                }}
            >
                <EyeOutlined />
            </Dropdown.Button>),
        },
    ]

    return (
        <ProTable
            scroll={{ x: 1000 }}
            columns={columns}
            rowKey="_id"
            request={(params) => {
                params.list_id = list._id
                const qs = new URLSearchParams(params)

                return apiClient(`/users?${qs.toString()}`).then(({ data }) => data)
            }}
            search={{ filterType: 'light' }}
            columnsState={{
                persistenceKey: 'users-by-list-table',
                persistenceType: 'localStorage',
            }}
            headerTitle="Users"
        />
    )
}

export default Users
