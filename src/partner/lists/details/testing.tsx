import React from 'react'
import { Alert, Card, message } from 'antd'
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useApiClient } from '../../../hooks/api'
import { useAppSelector } from '../../../redux/hooks'
import type { ListItem } from '../../../types/lists'

function Testing() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()

    return (
        <Card title="Send a test push">
            <Alert message="This is only for test." type="warning" style={{ marginBottom: '10px' }} />

            <ProForm
                layout="vertical"
                onFinish={async (params) => {

                    return apiClient
                        .post(`/lists/${list._id}/test`, params)
                        .then(({ data }) => message.success(data.message))
                        .catch(err => message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message))
                }}
                requiredMark="optional"
            >
                <ProFormText
                    label="Subscriber ID"
                    name="sub_id"
                    placeholder="Enter the subscriber id..."
                    rules={[{ required: true }]}
                    extra="To get subscriber id, Open the Developer Tools on the site where you subscribed and then 'Application -> Local Storage' tab. Copy the 'pushmatic_subid' value."
                />

                <ProFormText
                    label="Title"
                    name="title"
                    placeholder="Title..."
                    rules={[{ required: true }]}
                />

                <ProFormTextArea
                    label="Message"
                    name="content"
                    placeholder="Message..."
                    rules={[{ required: true }]}
                />
            </ProForm>
        </Card>
    )
}

export default Testing
