import React, { useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message, Modal, Popconfirm, Radio, Select, Space } from 'antd'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { useApiClient } from '../../../hooks/api'
import {
    useSegmentBrowser,
    useSegmentConditions,
    useSegmentDevice,
    useSegmentOperators,
    useSegmentOs,
    useSegmentTypes
} from '../../../hooks/tags'
import { useAppSelector } from '../../../redux/hooks'
import type { ListItem } from '../../../types/lists'
import type { SegmentItem } from '../../../types/segments'

function Segments() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const segmentsTable = useRef<any>()
    const [isModalOpen, setIsModalOpen] = useState<boolean>()
    const [currentSegment, setCurrentSegment] = useState<SegmentItem>({})
    const [modalForm] = Form.useForm()
    const segmentTypes = useSegmentTypes()
    const operators = useSegmentOperators()
    const conditions = useSegmentConditions()

    const attributeValues: { [name: string]: any } = {
        browser: useSegmentBrowser(),
        device: useSegmentDevice(),
        os: useSegmentOs(),
    }

    const columns: ProColumns<SegmentItem>[] = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Subscribers', dataIndex: 'users_count', key: 'users_count' },
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
                            shape="circle"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCurrentSegment(record)
                                modalForm.setFieldsValue(record)

                                setIsModalOpen(true)
                            }}
                        />
                        <Popconfirm
                            title="Are you sure delete this segment?"
                            okText="Yes"
                            okType="danger"
                            cancelText="No"
                            placement="left"
                            onConfirm={() => {
                                return apiClient
                                    .delete(`/segments/${record._id}`)
                                    .then(({ data }) => {
                                        segmentsTable.current.reloadAndRest()

                                        return message.success(data.message)
                                    })
                                    .catch(err => message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message))
                            }}
                        >
                            <Button
                                danger={true}
                                shape="circle"
                                size="small"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ]

    return (
        <>
            <ProTable
                search={false}
                options={false}
                headerTitle="Segments"
                rowKey="_id"
                actionRef={segmentsTable}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Create New Segment
                    </Button>
                ]}
                columns={columns}
                request={(params) => {
                    params.list_id = list._id
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient.get(`/segments?${qs}`).then(({ data }) => data)
                }}
            />

            <Modal
                title={currentSegment._id ? `Segment Edit: ${currentSegment.name}` : 'New Segment'}
                open={isModalOpen}
                onCancel={() => {
                    modalForm.resetFields()
                    setCurrentSegment({})
                    setIsModalOpen(false)
                }}
                onOk={() => {
                    const data = modalForm.getFieldsValue()
                    const endpoint = currentSegment._id ? `/segments/${currentSegment._id}` : `/segments`

                    data.list_id = currentSegment._id ? undefined : list._id


                    return apiClient
                        .post(endpoint, data)
                        .then(({ data }) => {
                            setIsModalOpen(false)
                            modalForm.resetFields()
                            setCurrentSegment({})
                            segmentsTable.current.reloadAndRest()

                            return message.success(data.message)
                        })
                        .catch(err => message.error((err.response?.data?.message ?? err.response?.statusText) ?? 'Unable to send test notification'))
                }}
                width={700}
                okText={currentSegment._id ? 'Save Segment' : 'Create Segment'}
            >
                <Form form={modalForm} layout="vertical" requiredMark="optional">
                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input placeholder="Name of the segment..." />
                    </Form.Item>
                    <Form.List name="rules">
                        {(fields, { add, remove }) => (
                            <Space direction="vertical" style={{ display: 'flex' }}>
                                {fields.map(({ key, name, ...field }) => (
                                    <Card
                                        key={key}
                                        extra={
                                            <Button size="small" type="text" onClick={() => remove(name)}>
                                                <MinusCircleOutlined />
                                            </Button>
                                        }
                                        title={
                                            <Form.Item {...field} noStyle name={[name, 'condition']} required={true}>
                                                <Radio.Group optionType="button" options={conditions} />
                                            </Form.Item>
                                        }
                                    >
                                        <Input.Group compact>
                                            <Form.Item {...field} name={[name, 'type']} required={true} style={{ width: '25%' }}>
                                                <Select options={segmentTypes} placeholder="Please select filter type..." />
                                            </Form.Item>
                                            <Form.Item {...field} name={[name, 'operator']} required={true} style={{ width: '25%' }}>
                                                <Select options={operators} placeholder="Please select filter type..." />
                                            </Form.Item>
                                            <Form.Item noStyle shouldUpdate>
                                                {() => {
                                                    return <Form.Item {...field} name={[name, 'values']} required={true} style={{
                                                        marginBottom: 0,
                                                        width: '50%'
                                                    }}>
                                                        <Select
                                                            options={attributeValues[modalForm.getFieldValue('rules')[name].type]}
                                                            placeholder="Please select values..."
                                                            mode="tags"
                                                        />
                                                    </Form.Item>
                                                }}
                                            </Form.Item>
                                        </Input.Group>
                                    </Card>
                                ))}
                                <Form.Item style={{ textAlign: 'center' }}>
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={() => add({
                                            type: 'keyword',
                                            condition: 'and',
                                            operator: 'in'
                                        })}
                                    >
                                        Add Filter
                                    </Button>
                                </Form.Item>
                            </Space>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </>
    )
}

export default Segments
