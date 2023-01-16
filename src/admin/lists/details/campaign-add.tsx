import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import {
    ProFormSelect,
    ProFormText, ProFormTextArea,
    StepsForm,
    ProFormDateTimePicker, ProFormDependency, ProFormRadio
} from '@ant-design/pro-components'
import { Alert, Card, DatePicker, Form, message } from 'antd'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useSearchParams } from 'react-router-dom'
import { useApiClient } from '../../../hooks/api'
import { useAdTags, useProviders } from '../../../hooks/cache'
import {
    useAvailableCampaignAudienceTypes,
    useAvailableCampaignTypes,
    useOnlyUserFields,
    useSegmentBrowser,
    useSegmentDevice,
    useSegmentOs,
    useSegmentTypes
} from '../../../hooks/tags'
import { useAppSelector } from '../../../redux/hooks'
import type { ListItem } from '../../../types/lists'
import { appendSearchParams } from '../../../utils/urls'

function CampaignAdd() {
    const [searchParams] = useSearchParams()
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const providers = useProviders()
    const profileFields = useOnlyUserFields()
    const adTags = useAdTags()
    const segmentTypes = useSegmentTypes()
    const apiClient = useApiClient()
    const formBasicRef = useRef<ProFormInstance>()
    const formFiltersRef = useRef<ProFormInstance>()
    const formComposeRef = useRef<ProFormInstance>()
    const segmentBrowsers = useSegmentBrowser()
    const segmentDevices = useSegmentDevice()
    const segmentOSes = useSegmentOs()
    const campaignTypes = useAvailableCampaignTypes()
    const audienceTypes = useAvailableCampaignAudienceTypes()

    const segmentTypesByKeys: { [p: string]: string } = segmentTypes.reduce((obj, cur) => ({
        ...obj,
        [cur.value]: cur.label
    }), {})

    const attributeValues: { [name: string]: any } = {
        browser: segmentBrowsers,
        device: segmentDevices,
        os: segmentOSes,
    }


    useEffect(() => {
        const allowedTypes = campaignTypes.map(({ value }) => value)
        const campaignType = searchParams.get('type')

        if (campaignType && allowedTypes.indexOf(campaignType) !== -1) {
            formBasicRef.current?.setFieldValue('type', campaignType)
        }

        const filters = segmentTypes.map(sgm => sgm.value).filter(sgm => searchParams.get(`${sgm}_filters`))
        if (filters) {
            const rules = filters.reduce((obj, sgm) => ({
                ...obj,
                [sgm]: searchParams.get(`${sgm}_filters`)?.split(',') ?? []
            }), {})

            formFiltersRef.current?.setFieldValue('filters', filters)
            formFiltersRef.current?.setFieldValue('rules', rules)
        }

        const allowedAudience = audienceTypes.map(({ value }) => value)
        const audienceType = searchParams.get('audience')

        if (audienceType && allowedAudience.indexOf(audienceType) !== -1) {
            formFiltersRef.current?.setFieldValue('audience', audienceType)
        }

        const allowedProviders = Object.keys(providers)
        const provider = searchParams.get('provider')
        if (provider && allowedProviders.indexOf(provider) !== -1) {
            formComposeRef.current?.setFieldValue(['message', 'provider'], provider)
        }
    }, [searchParams, segmentTypes, campaignTypes, providers, audienceTypes])

    return (
        <Card title="Create Campaign">
            <StepsForm
                onFinish={async (params) => {
                    params.list_id = list._id
                    params.segment_id = undefined

                    return await apiClient
                        .post('/campaigns', params)
                        .then(({ data }) => message.success(data.message))
                        .catch(async err => {
                            await message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message)

                            return false
                        })
                }}
            >
                <StepsForm.StepForm
                    formRef={formBasicRef}
                    requiredMark="optional"
                    name="base"
                    title="Basic"
                    stepProps={{ description: 'General information' }}
                >
                    <ProFormRadio.Group
                        name="type"
                        label="Type"
                        radioType="button"
                        rules={[{ required: true }]}
                        options={campaignTypes}
                    />
                    <ProFormText
                        name="name"
                        label="Name"
                        placeholder="Campaign name..."
                        rules={[{ required: true }]}
                    />
                    <ProFormTextArea
                        name="description"
                        label="Description"
                        placeholder="A note for the campaign"
                    />
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    formRef={formFiltersRef}
                    name="checkbox"
                    title="Audience"
                    requiredMark="optional"
                    stepProps={{ description: 'Filters your audience', }}
                >
                    <ProFormRadio.Group
                        name="audience"
                        label="Type"
                        radioType="button"
                        rules={[{ required: true }]}
                        options={audienceTypes}
                    />

                    <ProFormDependency name={['audience']}>
                        {({ audience }) => (audience === 'all' && (
                                <Alert type="warning" message="It will send to all active users in the list." style={{ marginBottom: 10 }} />)
                        )}
                    </ProFormDependency>

                    <ProFormDependency name={['audience']}>
                        {({ audience }) => (audience === 'segmented' && (<ProFormSelect
                                name="segment_id"
                                label="Segment"
                                showSearch={true}
                                request={async ({ keyWords }) => {
                                    const params = {
                                        list_id: list._id,
                                        name: keyWords
                                    }
                                    const { data } = await apiClient.get(`/segments`, { params })

                                    return data.data.map((d: any) => ({
                                        value: d._id,
                                        label: d.name,
                                    }))
                                }}
                                rules={[{ required: true }]}
                            />)
                        )}
                    </ProFormDependency>
                    <ProFormDependency name={['audience']}>
                        {({ audience }) => (audience === 'filtered' && (<>
                                <ProFormSelect
                                    mode="multiple"
                                    name="filters"
                                    label="Filters"
                                    options={segmentTypes}
                                    rules={[{ required: true }]}
                                />

                                <ProFormDependency name={['filters']}>
                                    {({ filters }) => (
                                        filters?.map((filter: string, key: number) => (
                                            <ProFormSelect
                                                key={key}
                                                mode={attributeValues[filter] ? "multiple" : 'tags'}
                                                name={['rules', filter]}
                                                label={segmentTypesByKeys[filter]}
                                                options={attributeValues[filter] ?? []}
                                                rules={[{ required: true }]}
                                            />
                                        ))
                                    )}
                                </ProFormDependency>
                            </>)
                        )}
                    </ProFormDependency>
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    formRef={formComposeRef}
                    requiredMark="optional"
                    name="message"
                    title="Message"
                    stepProps={{ description: 'Compose your message' }}
                >
                    <ProFormSelect
                        name={['message', 'provider']}
                        label="Job Source"
                        options={Object.values(providers).map(({ label, value }) => ({ label, value }))}
                        rules={[{ required: true }]}
                    />
                    <ProFormDependency name={['message', 'provider']}>
                        {({ message }) => (message && message.provider === 'directlink' && (<>
                            <ProFormText
                                name={['message', 'ad_link']}
                                label="Ad Link"
                                rules={[{ required: true }, { type: 'url' }]}
                            />
                            <ProFormSelect
                                name={['message', 'ad_link_params']}
                                label="Ad Link Params"
                                placeholder="Please select params"
                                mode="multiple"
                                options={profileFields.map(f => ({ label: f, value: f }))}
                                extra={message && message.ad_link && message.ad_link_params &&
                                    <Alert style={{ marginTop: 10 }} type="info" message={appendSearchParams(message.ad_link, message.ad_link_params)} />}
                            />
                        </>))}
                    </ProFormDependency>
                    <ProFormDependency name={['message', 'provider']}>
                        {({ message }) => (message && message.provider !== 'directlink' && (<ProFormText
                            name={['message', 'keyword']}
                            label="Job Keyword"
                            placeholder="Job search keyword"
                            rules={[{ required: false }]}
                        />))}
                    </ProFormDependency>
                    <ProFormText
                        name={['message', 'title']}
                        label="Title"
                        placeholder="Push Title"
                        rules={[{ required: true }]}
                    />
                    <ProFormTextArea
                        name={['message', 'message']}
                        label="Description"
                        placeholder="Push Message..."
                        rules={[{ required: true }]}
                        extra={`Available tags: ${adTags.join(', ')}`}
                    />
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    name="time"
                    title="Send"
                    stepProps={{ description: 'Schedule or Send' }}
                >
                    <Form.Item label="Sending Time" name="time">
                        <DatePicker
                            disabledDate={(c) => c && c.unix() < dayjs().startOf('day').unix()}
                            disabledTime={(c) => ({
                                disabledHours: () => c && c < dayjs() ? Array.from(Array(c.hour()).keys()) : [],
                                disabledMinutes: () => c && c < dayjs() ? Array.from(Array(c.minute() + 1).keys()) : [],
                            })}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                        />
                    </Form.Item>
                </StepsForm.StepForm>
            </StepsForm>
        </Card>
    )
}

export default CampaignAdd
