import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Alert, Button, Card, Form, Input, message } from 'antd'
import { useApiClient } from '../../../hooks/api'
import { useAppSelector } from '../../../redux/hooks'
import type { ListItem } from '../../../types/lists'

function Testing() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const [isLoading, setIsLoading] = useState<boolean>(false)


    return (
        <Card>
            <Alert message="This is only for test." type="warning" style={{ marginBottom: '10px' }} />
            <Form
                layout="vertical"
                onFinish={(params) => {
                    setIsLoading(true)

                    apiClient
                        .post(`/lists/${list._id}/send`, {
                            ...params,
                            name: 'Partner Test: ' + dayjs().unix(),
                            send_to: 'user',
                            provider: 'talent',
                        })
                        .then(({ data }) => message.success(data.message))
                        .catch(err => message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? 'Unable to send test notification'))
                        .finally(() => setIsLoading(false))
                }}
                requiredMark="optional"
            >
                <Form.Item
                    label="Subscriber ID"
                    name="send_filter"
                    rules={[{ required: true }]}
                    extra="To get subscriber id, Open the Developer Tools on the site where you subscribed and then 'Application -> Local Storage' tab. Copy the 'pushmatic_subid' value."
                >
                    <Input placeholder="Enter the user id..." />
                </Form.Item>
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                    <Input placeholder="Title..." />
                </Form.Item>
                <Form.Item
                    label="Message"
                    name="message"
                    rules={[{ required: true }]}
                >
                    <Input.TextArea placeholder="Message..." />
                </Form.Item>

                <Button loading={isLoading} type="primary" htmlType="submit">
                    {isLoading ? 'Sending...' : 'Send'}
                </Button>
            </Form>
        </Card>
    )
}

export default Testing
