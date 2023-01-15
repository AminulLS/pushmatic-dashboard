import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
    Button, Card, Col, Form, Input, InputNumber, message, Modal,
    Radio, Row, Select, Space, Tabs, Tag, TimePicker, TreeSelect
} from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useApiClient } from '../../../hooks/api'
import { useProviders } from '../../../hooks/cache'
import { useAvailableDays, useGeneratedTimesOfDays, useOnlyUserFields, useSuggestedKeywords } from '../../../hooks/tags'
import { useAppSelector } from '../../../redux/hooks'
import type { AdminItem } from '../../../types/admins'
import type { ListItem } from '../../../types/lists'
import type { TreeItem } from '../../../types/misc'

const defaultListFields = {
    followup: 0,
    followup_delay: 20,
    welcome_delay: 20,
    unsub_delivery_after: 0,
    unsub_click_after: 0,
    status: 'active',
}

function Configuration() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const providers = useProviders()
    const suggestedKeywords = useSuggestedKeywords()
    const generatedTimesOfDays = useGeneratedTimesOfDays()
    const userFields = useOnlyUserFields()
    const availableDays = useAvailableDays()
    const apiClient = useApiClient()
    const [configForm] = Form.useForm()
    const [scheduleForm] = Form.useForm()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [customTimeModal, setCustomTimeModal] = useState<boolean>(false)
    const [admins, setAdmins] = useState<AdminItem[]>([])
    const [scheduleTimes, setScheduleTimes] = useState<TreeItem[]>(generatedTimesOfDays)

    useEffect(() => {
        configForm.setFieldsValue(list)

        const exists = scheduleTimes.map(({ value }) => value)
        const nonExists = list.schedules?.filter(schedule => !exists.includes(schedule)).map(schedule => {
            const [day, hour, minute] = schedule.split(':')

            return {
                id: schedule,
                pId: 'other',
                title: `${availableDays[day]} at ${hour}:${minute}`,
                value: schedule,
            }
        })

        if (nonExists && nonExists?.length > 0) {
            setScheduleTimes([...scheduleTimes, ...nonExists])
        }

        apiClient.get('/admins').then(({ data }) => setAdmins(data.data))

        // eslint-disable-next-line
    }, [list])

    return (
        <>
            <Card>
                <Form
                    form={configForm}
                    requiredMark="optional"
                    layout="vertical"
                    onFinish={(params) => {
                        setIsLoading(true)

                        apiClient
                            .post(`/lists/${list._id}`, params)
                            .then(({ data }) => message.success(data.message))
                            .catch(err => message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message))
                            .finally(() => setIsLoading(false))
                    }}
                    initialValues={defaultListFields}
                >
                    <Tabs
                        tabPosition="left"
                        items={[
                            {
                                label: 'General',
                                key: 'general',
                                children: (
                                    <>
                                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                            <Input placeholder="Enter the list name..." />
                                        </Form.Item>
                                        <Form.Item name="domain" label="Domain" rules={[{ required: true }]}>
                                            <Input placeholder="Enter the list domain..." />
                                        </Form.Item>
                                        <Form.Item name="email" label="Sending Email" rules={[{ required: true }]}>
                                            <Input placeholder="Enter the list sending email..." />
                                        </Form.Item>
                                        <Form.Item name="icon" label="Default Icon">
                                            <Input placeholder="Enter push icon url..." />
                                        </Form.Item>
                                        <Form.Item
                                            name="schedules"
                                            label={(
                                                <Space>
                                                    <span>Schedules</span>
                                                    <Tag
                                                        icon={<PlusOutlined />}
                                                        onClick={() => setCustomTimeModal(true)}
                                                    >Custom</Tag>
                                                </Space>
                                            )}
                                            rules={[{ required: true }]}
                                            extra="Search schedules by following formats: 'Sun:14:00' (For Specific Day), 'Any:09:30' (For Everyday), and '05:00' (Everywhere)."
                                        >
                                            <TreeSelect
                                                treeCheckable={true}
                                                placeholder="Please select schedules"
                                                treeLine={{ showLeafIcon: false }}
                                                treeDataSimpleMode={true}
                                                treeData={scheduleTimes}
                                            />
                                        </Form.Item>
                                        <Form.Item name="failover" label="Failover Providers">
                                            <Select
                                                mode="multiple"
                                                placeholder="Please select"
                                                options={Object.values(providers).filter(provider => provider.value !== 'directlink')}
                                            />
                                        </Form.Item>
                                        <Form.Item name="keywords" label="Fallback Keywords">
                                            <Select
                                                mode="tags"
                                                placeholder="Type your keywords..."
                                                options={suggestedKeywords.map(k => ({ value: k, label: k }))}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="fallback_url"
                                            label="Fallback URL"
                                            extra={(<small>Available Tags: {userFields.join(', ')}</small>)}
                                            rules={[{ type: 'url' }]}
                                        >
                                            <Input placeholder="Enter the fallback url..." />
                                        </Form.Item>
                                        <Row gutter={20}>
                                            <Col sm={24} md={8}>
                                                <Form.Item name="welcome_delay" label="Welcome Delay" rules={[{ required: true }]}>
                                                    <InputNumber style={{ width: '100%' }} placeholder="Welcome delay..." min="0" addonAfter="Seconds" />
                                                </Form.Item>
                                            </Col>
                                            <Col sm={24} md={8}>
                                                <Form.Item name="followup" label="Followups" rules={[{ required: true }]}>
                                                    <InputNumber style={{ width: '100%' }} placeholder="Followups..." min="0" addonAfter="Count" />
                                                </Form.Item>
                                            </Col>
                                            <Col sm={24} md={8}>
                                                <Form.Item name="followup_delay" label="Followups Delay" rules={[{ required: true }]}>
                                                    <InputNumber style={{ width: '100%' }} placeholder="Followups delay..." min="0" addonAfter="Seconds" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={20}>
                                            <Col sm={24} md={8}>
                                                <Form.Item name="unsub_delivery_after" label="Unsub After No Delivery" rules={[{ required: true }]} extra="Enter 0 to disable">
                                                    <InputNumber style={{ width: '100%' }} placeholder="Unsub after..." min="0" addonAfter="Days" />
                                                </Form.Item>
                                            </Col>
                                            <Col sm={24} md={8}>
                                                <Form.Item name="unsub_click_after" label="Unsub After No Clicks" rules={[{ required: true }]} extra="Enter 0 to disable">
                                                    <InputNumber style={{ width: '100%' }} placeholder="Keep notifications..." min="0" addonAfter="Days" />
                                                </Form.Item>
                                            </Col>
                                            <Col sm={24} md={8}>
                                                <Form.Item name="keep" label="Keep Notifications" rules={[{ required: true }]}>
                                                    <InputNumber style={{ width: '100%' }} placeholder="Keep notifications..." min="0" addonAfter="Count" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={20}>
                                            <Col sm={24} md={8}>
                                                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                                    <Radio.Group
                                                        optionType="button"
                                                        buttonStyle="solid"
                                                        options={[
                                                            { label: 'Active', value: 'active' },
                                                            { label: 'Inactive', value: 'inactive' },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col sm={24} md={8}>
                                                <Form.Item
                                                    name="sending_pattern"
                                                    label="Sending Pattern"
                                                    tooltip="The prefetch option will take effect form next day."
                                                    rules={[{ required: true }]}
                                                >
                                                    <Radio.Group
                                                        optionType="button"
                                                        buttonStyle="solid"
                                                        options={[
                                                            { label: 'Regular', value: 'regular' },
                                                            { label: 'Prefetch', value: 'prefetch' },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                                )
                            },
                            {
                                label: 'Providers',
                                key: 'providers',
                                children: (
                                    <Tabs items={Object.values(providers).filter(p => p.config?.length).map(provider => ({
                                            label: provider.label,
                                            key: provider.value,
                                            children: provider.config && provider.config.map((config, index) => (
                                                <Form.Item name={['providers', provider.value, config.name]} label={config.label} key={index}>
                                                    <Input />
                                                </Form.Item>
                                            ))
                                        })
                                    )} />
                                )
                            },
                            {
                                label: `Partner`,
                                key: 'partner',
                                children: (
                                    <>
                                        <Form.Item name="admin_id" label="Partner - Owner">
                                            <Select
                                                allowClear={true}
                                                showSearch={true}
                                                placeholder="Select and admin..."
                                                options={admins.map(admin => ({ value: admin._id, label: admin.name }))}
                                            />
                                        </Form.Item>
                                        <Form.Item name="rev_share" label="Revenue Share" help="Any revenue changes will effect next day.">
                                            <InputNumber style={{ width: '100%' }} step="0.01" placeholder="Partner revenue share..." min="0.00" />
                                        </Form.Item>

                                        <p>API Tokens</p>
                                        <Form.List name="tokens">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map((field) => (
                                                        <Form.Item {...field} required={false} key={field.key}>
                                                            <Input
                                                                addonAfter={(
                                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                    ))}
                                                    <Form.Item>
                                                        <Button
                                                            onClick={() => add(crypto.randomUUID())}
                                                            type="dashed"
                                                            icon={<PlusOutlined />}
                                                        >
                                                            New API Token
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </>
                                ),
                            }
                        ]}
                    />
                    <div style={{ marginTop: 10, textAlign: 'right' }}>
                        <Button loading={isLoading} htmlType="submit" type="primary">Save</Button>
                    </div>
                </Form>
            </Card>

            <Modal
                title="Add Custom Schedule"
                width={350}
                open={customTimeModal}
                onOk={() => scheduleForm.submit()}
                onCancel={() => setCustomTimeModal(false)}
                okText="Add"
            >
                <Form
                    form={scheduleForm}
                    initialValues={{
                        day: 'Any',
                        time: dayjs('00:00', 'HH:mm'),
                    }}
                    onFinish={(values) => {
                        const { day, time } = values
                        const timeFormat = time.format('HH:mm')
                        const schedule = `${day}:${timeFormat}`

                        const exist = scheduleTimes.filter(s => s.id === schedule)
                        if (!exist.length) {
                            const addSchedule = [{
                                id: schedule,
                                pId: 'other',
                                title: `${availableDays[day]} at ${timeFormat}`,
                                value: schedule,
                            }]

                            setScheduleTimes([...scheduleTimes, ...addSchedule])
                        }

                        let schedules: string[] = configForm.getFieldValue('schedules')
                        if (Array.isArray(schedules)) {
                            schedules.push(schedule)
                        } else {
                            schedules = [schedule]
                        }

                        configForm.setFieldsValue({ schedules: Array.from(new Set(schedules)) })

                        setCustomTimeModal(false)
                        scheduleForm.resetFields()
                    }}
                >
                    <Input.Group compact>
                        <Form.Item noStyle name="day" rules={[{ required: true }]}>
                            <Select
                                style={{ width: '50%' }}
                                showSearch={true}
                                placeholder="Select day..."
                                options={Object.keys(availableDays).map(key => ({
                                    label: availableDays[key],
                                    value: key
                                }))}
                            />
                        </Form.Item>

                        <Form.Item noStyle name="time" rules={[{ required: true }]}>
                            <TimePicker allowClear={false} placeholder="Pick time..." style={{ width: '50%' }} format="HH:mm" />
                        </Form.Item>
                    </Input.Group>
                </Form>
            </Modal>
        </>
    )
}

export default Configuration
