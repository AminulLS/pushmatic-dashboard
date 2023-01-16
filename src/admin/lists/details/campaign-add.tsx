import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Alert, Avatar, Button, Card, DatePicker, Form, List, message, Modal
} from 'antd'
import {
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    StepsForm,
    ProFormDependency,
    ProFormRadio, ProFormItem
} from '@ant-design/pro-components'
import { EditOutlined } from '@ant-design/icons'
import type { ProFormInstance } from '@ant-design/pro-components'
import AdComposer from '../../../components/ad-composer'
import { useApiClient } from '../../../hooks/api'
import { useAdImages } from '../../../hooks/cache'
import {
    useAvailableCampaignAudienceTypes,
    useAvailableCampaignTypes,
    useSegmentBrowser,
    useSegmentDevice,
    useSegmentOs,
    useSegmentTypes
} from '../../../hooks/tags'
import { useAppSelector } from '../../../redux/hooks'
import type { AdItem } from '../../../types/ads'
import type { ListItem } from '../../../types/lists'

function CampaignAdd() {
    const [searchParams] = useSearchParams()
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const navigate = useNavigate()
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
    const adImages = useAdImages()
    const [modalAd, setModalAd] = useState<AdItem>({})

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
            formFiltersRef.current?.setFieldValue('filters', filters)
            filters.forEach((filter, index) => {
                const values = searchParams.get(`${filter}_filters`)?.split(',') ?? []

                formFiltersRef.current?.setFieldValue(['rules', index, 'values'], values)
            })
        }

        const allowedAudience = audienceTypes.map(({ value }) => value)
        const audienceType = searchParams.get('audience')

        if (audienceType && allowedAudience.indexOf(audienceType) !== -1) {
            formFiltersRef.current?.setFieldValue('audience', audienceType)
        }
    }, [searchParams, segmentTypes, campaignTypes, audienceTypes])

    return (
        <>
            <Card title="Create Campaign">
                <StepsForm
                    onFinish={async (params) => {
                        params.list_id = list._id
                        params.filters = undefined

                        return await apiClient
                            .post('/campaigns', params)
                            .then(async ({ data }) => {
                                await message.success(data.message)

                                return navigate(`/admin/lists/${list._id}/campaigns`)
                            })
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
                        stepProps={{ description: 'Filters your audience' }}
                    >
                        <ProFormRadio.Group
                            name="audience"
                            label="Type"
                            radioType="button"
                            rules={[{ required: true }]}
                            options={audienceTypes}
                        />

                        <ProFormDependency name={['audience']}>
                            {({ audience }) => {
                                if (audience === 'segmented') {
                                    return <ProFormSelect
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
                                    />
                                }

                                if (audience === 'filtered') {
                                    return (<>
                                        <ProFormSelect
                                            mode="multiple"
                                            name="filters"
                                            label="Filters"
                                            options={segmentTypes}
                                            rules={[{ required: true }]}
                                        />

                                        <ProFormDependency name={['filters']}>
                                            {({ filters }) => (
                                                filters?.map((filter: string, key: number) => (<>
                                                    <ProFormItem name={['rules', key, 'type']} initialValue={filter} hidden />
                                                    <ProFormItem name={['rules', key, 'operator']} initialValue="in" hidden />
                                                    <ProFormItem name={['rules', key, 'condition']} initialValue="and" hidden />
                                                    <ProFormSelect
                                                        key={key}
                                                        mode={attributeValues[filter] ? "multiple" : 'tags'}
                                                        name={['rules', key, 'values']}
                                                        label={segmentTypesByKeys[filter]}
                                                        options={attributeValues[filter] ?? []}
                                                        rules={[{ required: true }]}
                                                    />
                                                </>))
                                            )}
                                        </ProFormDependency>
                                    </>)
                                }

                                if (audience === 'all') {
                                    return <Alert
                                        type="warning"
                                        message="It will send to all active users in the list."
                                        style={{ marginBottom: 10 }}
                                    />
                                }
                            }}
                        </ProFormDependency>
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        formRef={formComposeRef}
                        requiredMark="optional"
                        name="message"
                        title="Message"
                        stepProps={{ description: 'Compose your message' }}
                        onFinish={async () => {
                            const values = formComposeRef.current?.getFieldValue('flows')

                            if (!values || values.length <= 0) {
                                await message.error('Please create at least one ad to continue.')

                                return false
                            }

                            return true
                        }}
                    >
                        <ProFormItem name={['flows']} hidden />

                        <ProFormDependency name={['flows']}>
                            {({ flows }) => {
                                if (flows && flows.length) {
                                    return <List
                                        itemLayout="horizontal"
                                        style={{ marginBottom: 10 }}
                                        dataSource={flows}
                                        renderItem={(item: AdItem, index) => {
                                            let iconUrl = item.icon_type === 'custom' && item.icon_url ? item.icon_url : adImages[0]
                                            return <List.Item
                                                actions={[
                                                    <Button
                                                        shape="circle"
                                                        size="small"
                                                        icon={<EditOutlined />}
                                                        onClick={() => {
                                                            item._id = String(index)
                                                            item.name = 'draft_ad'

                                                            setModalAd(item)
                                                        }}
                                                    />,
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={iconUrl} />}
                                                    title={item.title}
                                                    description={item.content}
                                                />
                                            </List.Item>
                                        }}
                                    />
                                }

                                return <Button
                                    style={{ marginBottom: 10 }}
                                    type="dashed"
                                    onClick={() => setModalAd({
                                        name: `draft_ad`,
                                        ad_type: searchParams.get('provider') ?? undefined
                                    })}
                                >Compose New Ad</Button>
                            }}
                        </ProFormDependency>
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        name="time"
                        title="Send"
                        stepProps={{ description: 'Schedule or Send' }}
                    >
                        <Form.Item label="Sending Time" name="trigger">
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

            <Modal
                title="Ad Composer"
                open={!!modalAd.name}
                footer={null}
                onCancel={() => setModalAd({})}
                destroyOnClose={true}
            >
                <AdComposer
                    requiredMark="optional"
                    request={async () => modalAd}
                    hidename="yes"
                    onFinish={async (fields) => {
                        fields.time_type = 'minute'
                        fields.type = 'custom'
                        fields.time = 0

                        formComposeRef.current?.setFieldValue(['flows', 0], fields)

                        return setModalAd({})
                    }}
                />
            </Modal>
        </>
    )
}

export default CampaignAdd
