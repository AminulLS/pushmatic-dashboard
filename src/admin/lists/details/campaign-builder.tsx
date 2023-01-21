import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Button, Card, message, Modal, Popconfirm, Space, Timeline } from 'antd'
import {
    ProFormSelect, ProFormText, ProFormTextArea, StepsForm, ProFormDependency, ProFormRadio,
    ProFormItem, ProFormDateTimePicker, ProForm, ProFormSegmented, ProFormDigit
} from '@ant-design/pro-components'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { ProFormInstance } from '@ant-design/pro-components'
import AdComposer from '../../../components/ad-composer'
import AdView from '../../../components/ad-view'
import { useApiClient } from '../../../hooks/api'
import {
    useAvailableCampaignAudienceTypes,
    useAvailableCampaignTypes,
    useSegmentBrowser,
    useSegmentDevice,
    useSegmentOs,
    useSegmentTypes
} from '../../../hooks/tags'
import { useAppSelector } from '../../../redux/hooks'
import type { AdItem, FlowItem } from '../../../types/ads'
import type { CampaignItem } from '../../../types/campaigns'
import type { ListItem } from '../../../types/lists'

function CampaignBuilder() {
    const [searchParams] = useSearchParams()
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const [modalAd, setModalAd] = useState<FlowItem>()
    const [modalAdId, setModalAdId] = useState<number | undefined>()
    const [campaign, setCampaign] = useState<CampaignItem>()
    const formBasicRef = useRef<ProFormInstance>()
    const formFiltersRef = useRef<ProFormInstance>()
    const formComposeRef = useRef<ProFormInstance>()
    const formSendRef = useRef<ProFormInstance>()
    const formAdRef = useRef<ProFormInstance>()
    const formAdConfigRef = useRef<ProFormInstance>()
    const navigate = useNavigate()
    const location = useLocation()
    const segmentTypes = useSegmentTypes()
    const apiClient = useApiClient()
    const segmentBrowsers = useSegmentBrowser()
    const segmentDevices = useSegmentDevice()
    const segmentOSes = useSegmentOs()
    const campaignTypes = useAvailableCampaignTypes()
    const audienceTypes = useAvailableCampaignAudienceTypes()

    useEffect(() => {
        setCampaign(location?.state?.campaign)
    }, [location])

    // if it is editing mode.
    useEffect(() => {
        if (!campaign?._id) {
            return
        }

        const formCampaign: any = campaign ?? {}
        formCampaign.filters = Object.values(campaign?.rules || {}).map(({ type }) => type)
        formBasicRef.current?.setFieldsValue(formCampaign)
        formFiltersRef.current?.setFieldsValue(formCampaign)
        formComposeRef.current?.setFieldsValue(formCampaign)
        formSendRef.current?.setFieldsValue(campaign)
    }, [campaign])

    const segmentTypesByKeys: { [p: string]: string } = segmentTypes.reduce((obj, cur) => ({
        ...obj,
        [cur.value]: cur.label
    }), {})
    const attributeValues: { [name: string]: any } = {
        browser: segmentBrowsers,
        device: segmentDevices,
        os: segmentOSes,
    }


    // if mode is not editing, get values from search params.
    useEffect(() => {
        if (campaign?._id) {
            return
        }

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
    }, [searchParams, segmentTypes, campaignTypes, audienceTypes, campaign])

    return (
        <>
            <Card title={campaign?._id ? `Editing Campaign: ${campaign.name}` : 'Create Campaign'}>
                <StepsForm
                    onFinish={async (params) => {
                        params.list_id = list._id
                        params.filters = undefined

                        const endpoint = campaign?._id ? `/campaigns/${campaign?._id}` : `/campaigns/`

                        return await apiClient.post(endpoint, params)
                            .then(async ({ data }) => {
                                await message.success(data.message)

                                return navigate(`/admin/lists/${list._id}/campaigns`, { state: { campaign: undefined } })
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
                            {({ flows }) => (<Timeline mode="left">
                                {flows && flows.length && flows.map((ad: FlowItem, idx: number) => <Timeline.Item
                                    key={idx}
                                    dot={(
                                        <Button shape="circle" size="small" type="dashed">{idx + 1}</Button>
                                    )}
                                >
                                    <Card
                                        size="small"
                                        title={<>After<b> {ad.time} </b>{ad.time_type}</>}
                                        extra={<>
                                            <Button
                                                shape="circle"
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => {
                                                    setModalAd(ad)
                                                    setModalAdId(idx)
                                                }}
                                            />
                                            <Popconfirm
                                                title="Delete this ad?"
                                                onConfirm={() => {
                                                    const flows = formComposeRef
                                                        .current?.getFieldValue('flows')
                                                        .filter((_: FlowItem, i: number) => i !== idx)

                                                    formComposeRef.current?.setFieldValue('flows', flows)
                                                }}
                                            >
                                                <Button
                                                    shape="circle"
                                                    size="small"
                                                    danger={true}
                                                    icon={<DeleteOutlined />}
                                                />
                                            </Popconfirm>
                                        </>}
                                        children={ad.type === 'predefined' ? `Predefined ad: ${ad.name}` :
                                            <AdView ad={ad} />}
                                    />
                                </Timeline.Item>)}
                                <Timeline.Item>
                                    <Button
                                        onClick={() => setModalAd({
                                            time: 1,
                                            time_type: 'minute',
                                            type: 'custom'
                                        })}
                                        icon={<PlusOutlined />}
                                    >Compose New Ad</Button>
                                </Timeline.Item>
                            </Timeline>)}
                        </ProFormDependency>
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        title="Send"
                        name="time"
                        formRef={formSendRef}
                        requiredMark="optional"
                        stepProps={{ description: 'Schedule or Send' }}
                    >
                        <ProFormDateTimePicker
                            label="Sending Time"
                            name="trigger"
                            rules={[{ required: true }]}
                            fieldProps={{
                                disabledDate: (c: any) => c && c.unix() < dayjs().startOf('day').unix(),
                                disabledTime: (c: any) => ({
                                    disabledHours: () => c && c < dayjs() ? Array.from(Array(c.hour()).keys()) : [],
                                    disabledMinutes: () => c && c < dayjs() ? Array.from(Array(c.minute() + 1).keys()) : [],
                                }),
                                showTime: { format: 'HH:mm' },
                                format: "YYYY-MM-DD HH:mm"
                            }}
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </Card>

            <Modal
                title="Ad Composer"
                open={!!modalAd}
                onCancel={() => {
                    setModalAd(undefined)
                }}
                destroyOnClose={true}
                okText="Save Ad"
                onOk={() => {
                    const adConfig = formAdConfigRef.current?.validateFields()
                    const adFields = formAdRef.current?.validateFields()

                    return Promise
                        .all([adConfig, adFields])
                        .then(() => {
                            const flows = formComposeRef.current?.getFieldValue('flows') ?? []

                            if (modalAdId === undefined) {
                                flows.push(modalAd)
                            } else {
                                flows[modalAdId] = modalAd
                            }

                            formComposeRef.current?.setFieldValue('flows', flows)

                            setModalAd(undefined)
                            setModalAdId(undefined)
                        })
                        .catch(_ => false)
                }}
            >
                <ProForm
                    requiredMark="optional"
                    request={async () => modalAd ?? {}}
                    onValuesChange={(values) => setModalAd({ ...modalAd, ...values })}
                    formRef={formAdConfigRef}
                    submitter={{ render: () => null }}
                >
                    <Space align="center">
                        <ProFormText placeholder="Send it after" disabled />
                        <ProFormDigit
                            name="time"
                            fieldProps={{ step: 1 }}
                            min={1}
                            max={59} // hard limit, see time_type disabled values.
                            rules={[{ required: true }]}
                        />
                        <ProFormSelect
                            name="time_type"
                            allowClear={false}
                            options={[
                                { label: 'Minute', value: 'minute' },
                                { label: 'Hour', value: 'hour', disabled: true },
                                { label: 'Day', value: 'Day', disabled: true }
                            ]}
                            rules={[{ required: true }]}
                        />
                    </Space>
                    <ProFormSegmented
                        name="type"
                        label="Ad Type"
                        valueEnum={{
                            predefined: 'Predefined',
                            custom: 'Custom',
                        }}
                        rules={[{ required: true }]}
                    />

                    {modalAd?.type === 'predefined' && <ProFormSelect
                        name="name"
                        label="Ad Name"
                        placeholder="Please select a ad."
                        showSearch={true}
                        request={async () => {
                            const params = {
                                list_id: list._id,
                                pageSize: 100,
                            }

                            return apiClient.get('/ads', { params }).then(({ data }) => data.data.map((ad: AdItem) => ({
                                label: ad.name,
                                value: ad.name
                            })))
                        }}
                        rules={[{ required: true }]}
                    />}
                </ProForm>

                {modalAd?.type !== 'predefined' && <AdComposer
                    formRef={formAdRef}
                    requiredMark="optional"
                    request={async () => modalAd ?? {}}
                    hideName={true}
                    onValuesChange={(values) => setModalAd({ ...modalAd, ...values })}
                    submitter={{ render: () => null }}
                />}
            </Modal>
        </>
    )
}

export default CampaignBuilder
