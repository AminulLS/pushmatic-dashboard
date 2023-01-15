import React, { useRef } from 'react'
import { Button, message, Popconfirm, Space } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useApiClient } from '../../../hooks/api'
import { useAppSelector } from '../../../redux/hooks'
import type { CampaignItem } from '../../../types/campaigns'
import type { ListItem } from '../../../types/lists'

function Campaigns() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const navigate = useNavigate()
    const campaignsTable = useRef<any>()
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
                            title="Are you sure delete this ad?"
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
