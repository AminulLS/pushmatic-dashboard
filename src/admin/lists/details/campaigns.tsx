import React, { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, message, Popconfirm, Result, Space } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useApiClient } from '../../../hooks/api'
import { useAppSelector } from '../../../redux/hooks'
import type { CampaignItem } from '../../../types/campaigns'
import type { ListItem } from '../../../types/lists'
import CampaignAdd from './campaign-add'
import CampaignEdit from './campaign-edit'
import CampaignView from './campaign-view'

function Campaigns() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const navigate = useNavigate()
    const campaignsTable = useRef<any>()
    const [searchParams] = useSearchParams()
    const action = searchParams.get('action')

    const columns: ProColumns<CampaignItem>[] = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            valueType: 'select',
            filters: true,
            valueEnum: {
                all: {
                    text: 'All'
                },
                scheduled: {
                    text: 'Scheduled',
                    status: 'Success',
                },
                onetime: {
                    text: 'Onetime',
                    status: 'Default',
                },
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: true,
            valueType: 'select',
            valueEnum: {
                active: {
                    text: 'Active',
                    status: 'Success'
                },
                inactive: {
                    text: 'Inactive',
                    status: 'Warning'
                },
                exception: {
                    text: 'Exception',
                    status: 'Error'
                },
                pending: {
                    text: 'Pending',
                    status: 'Default',
                },
                proceeded: {
                    text: 'Proceeded',
                    status: 'Success',
                },
                processing: {
                    text: 'Processing',
                    status: 'Processing',
                },
            },
        },
        { title: 'Created at', key: 'created_at', dataIndex: 'created_at', valueType: 'date' },
        {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            render: (_, record) => {
                return (
                    <Space>
                        <Button
                            size="small"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/lists/${list._id}/campaigns?action=edit&id=${record._id}`)}
                        />
                        <Popconfirm
                            title="Are you sure delete this campaign?"
                            okText="Yes"
                            okType="danger"
                            cancelText="No"
                            placement="left"
                            onConfirm={() => {
                                return apiClient
                                    .delete(`/campaigns/${record._id}`)
                                    .then(({ data }) => {
                                        campaignsTable.current.reloadAndRest()

                                        return message.success(data.message)
                                    })
                                    .catch(err => message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message))
                            }}
                        >
                            <Button
                                size="small"
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ]

    if (action === 'add') {
        return <CampaignAdd />
    }

    if (action === 'edit') {
        return <CampaignEdit />
    }

    if (action === 'view') {
        return <CampaignView />
    }

    if (action && action !== 'add' && action !== 'edit' && action !== 'view') {
        return <Result status="warning" title="Invalid action." />
    }

    return (
        <ProTable
            actionRef={campaignsTable}
            search={false}
            rowKey="_id"
            headerTitle="Campaigns"
            columns={columns}
            request={(params, sort, filters) => {
                params.list_id = list._id
                const qs = (new URLSearchParams({ ...params, ...filters })).toString()

                return apiClient.get(`/campaigns?${qs}`).then(({ data }) => data)
            }}
        />
    )
}

export default Campaigns
