import React, { useRef, useState } from 'react'
import { Button, Form, Tag, Select, Modal, Input, message } from 'antd'
import dayjs from 'dayjs'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useApiClient } from '../hooks/api'
import type { AdminItem } from '../types/admins'

function Admins() {
    const adminIndexTable = useRef<any>()
    const apiClient = useApiClient()
    const [loading, setLoading] = useState<boolean>(false)
    const [adminForm] = Form.useForm()
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false)
    const [editAdmin, setEditAdmin] = useState<AdminItem>({})

    const handleAdminForm = (params: AdminItem) => {
        setLoading(true)
        const endpoint = editAdmin?._id ? `/admins/${editAdmin._id}` : '/admins'

        apiClient.post(endpoint, params)
            .then(({ data }) => {
                message.success(data?.message ?? 'Admin data is recorded.')
                setAddModalVisible(false)
                adminForm.resetFields()
                adminIndexTable.current.reloadAndRest()
                setEditAdmin({})
            })
            .catch(err => message.error(err.message))
            .finally(() => setLoading(false))
    }

    const columns: ProColumns<AdminItem>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            search: false,
            width: 175,
            ellipsis: true,
            fixed: 'left',
        }, {
            title: 'Email',
            dataIndex: 'email',
            search: false,
            ellipsis: true,
            width: 175,
        }, {
            title: 'Role',
            dataIndex: 'role',
            search: false,
            ellipsis: true,
            width: 100,
            renderText: (val) => <Tag
                color={val === 'admin' ? 'success' : 'default'}>{val?.toUpperCase() || 'INVALID'}</Tag>,
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
            title: 'Created at',
            dataIndex: 'created_at',
            search: false,
            width: 170,
            renderText: (val) => dayjs(val).format('YYYY-MM-DD hh:mm'),
        }, {
            title: 'Updated at',
            dataIndex: 'updated_at',
            search: false,
            width: 170,
            renderText: (val) => dayjs(val).format('YYYY-MM-DD hh:mm'),
        }, {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            render: (_, record) => (<Button
                onClick={() => {
                    setEditAdmin({
                        _id: record._id,
                        name: record.name,
                        email: record.email,
                        role: record.role,
                        status: record.status,
                    })

                    setAddModalVisible(true)
                }}
            >
                <EditOutlined />
            </Button>),
        },
    ]
    return (
        <>
            <Modal
                title={editAdmin?._id ? 'Edit admin' : 'Create new admin'}
                open={addModalVisible}
                okText={editAdmin?._id ? "Update" : "Create"}
                okButtonProps={{ loading }}
                destroyOnClose={true}
                onOk={() => adminForm.submit()}
                onCancel={() => {
                    adminForm.resetFields()
                    setAddModalVisible(false)
                    setEditAdmin({})
                }}
            >
                <Form
                    form={adminForm}
                    layout="vertical"
                    disabled={loading}
                    onFinish={handleAdminForm}
                    requiredMark="optional"
                    preserve={false}
                    initialValues={editAdmin}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter the admin name..." />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input placeholder="Enter the admin email..." />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: !editAdmin?._id }]}
                        help={editAdmin?._id ? 'Leave blank for keep old password.' : undefined}
                    >
                        <Input placeholder="Enter the admin password..." />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Select admin role..."
                            options={[
                                {
                                    label: 'Admin',
                                    value: 'admin',
                                }, {
                                    label: 'Partner',
                                    value: 'partner',
                                }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Select admin status..."
                            options={[
                                {
                                    label: 'Active',
                                    value: "active",
                                }, {
                                    label: 'Inactive',
                                    value: 'inactive',
                                }
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <ProTable
                actionRef={adminIndexTable}
                headerTitle="Admins"
                scroll={{ x: 1000 }}
                columns={columns}
                rowKey="_id"
                request={async (params) => {
                    const { data } = await apiClient.get('admins', { params })

                    return data
                }}
                search={{ filterType: 'light' }}
                columnsState={{
                    persistenceKey: 'admins-index-table',
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

export default Admins
