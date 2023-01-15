import React, { useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { Button, Dropdown, Form, Input, message, Modal, Space, Tag } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { EyeOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { useApiClient } from '../../hooks/api'
import type { ListItem } from '../../types/lists'

function Index() {
    const apiClient = useApiClient()
    const [loading, setLoading] = useState<boolean>(false)
    const [listForm] = Form.useForm()
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false)
    const listIndexTable = useRef<any>()
    const navigate = useNavigate()

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
        }, {
            title: 'Domain',
            dataIndex: 'domain',
            search: false,
            width: 175,
            ellipsis: true,
        }, {
            title: 'Email',
            dataIndex: 'email',
            search: false,
            ellipsis: true,
            width: 175,
        }, {
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
        }, {
            title: 'Status',
            dataIndex: 'status',
            search: false,
            ellipsis: true,
            width: 100,
            renderText: (val) => (
                <Tag color={val === 'active' ? 'success' : 'default'}>{val?.toUpperCase() || 'INVALID'}</Tag>
            ),
        }, {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            render: (_, record) => (<Dropdown.Button
                onClick={() => navigate(`/admin/lists/${record._id}`)}
                menu={{
                    items: [{
                        label: 'Configuration',
                        icon: <SettingOutlined />,
                        key: `config_${record._id}`,
                        onClick: () => navigate(`/admin/lists/${record._id}/configuration`),
                    }]
                }}
            >
                <EyeOutlined />
            </Dropdown.Button>),
        },
    ]

    const createNewList = (params: any) => {
        setLoading(true)

        apiClient.post('/lists', params)
            .then(({ data }) => {
                message.success(data.message ?? 'New list has been created')
                setAddModalVisible(false)
                listForm.resetFields()
                listIndexTable.current.reloadAndRest()
            })
            .catch(err => message.error(err?.data?.message ?? err?.statusText))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <Modal
                title="Create new list"
                open={addModalVisible}
                okText="Create"
                okButtonProps={{
                    loading: loading
                }}
                onOk={() => listForm.submit()}
                onCancel={() => {
                    listForm.resetFields()
                    setAddModalVisible(false)
                }}
            >
                <Form
                    form={listForm}
                    layout="vertical"
                    disabled={loading}
                    onFinish={createNewList}
                    requiredMark="optional"
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter the list name..." />
                    </Form.Item>

                    <Form.Item
                        name="domain"
                        label="Domain"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter the list domain..." />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Sending Email"
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input placeholder="Enter the sending email..." />
                    </Form.Item>
                </Form>
            </Modal>

            <ProTable
                actionRef={listIndexTable}
                headerTitle="Lists"
                scroll={{ x: 1000 }}
                columns={columns}
                rowKey="_id"
                request={async (params) => {
                    const { data } = await apiClient.get(`/lists`, { params })

                    return data
                }}
                search={{ filterType: 'light' }}
                columnsState={{
                    persistenceKey: 'lists-index-table',
                    persistenceType: 'localStorage',
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setAddModalVisible(true)}
                    />
                ]}
            />
        </>
    )
}

export default Index
