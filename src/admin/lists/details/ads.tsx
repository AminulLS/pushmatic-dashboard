import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { Button, Space, Popconfirm, message, Form, Modal, Input, Select, InputNumber, Radio, Image, Alert } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import { useApiClient } from '../../../hooks/api'
import { useAdImages, useAdTags, useProviders } from '../../../hooks/cache'
import { useProfileFields, useIconTypes } from '../../../hooks/tags'
import { AdItem } from '../../../types/ads'

function Ads() {
    const { list_id } = useParams<{ [name: string]: any }>()
    const apiClient = useApiClient()
    const providers = useProviders()
    const adTags = useAdTags()
    const adImages = useAdImages()
    const useIconType = useIconTypes()
    const adsTable = useRef<any>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [modalAd, setModalAd] = useState<AdItem>({})
    const [adEditForm] = Form.useForm()
    const adLink = Form.useWatch('ad_link', adEditForm)
    const adLinkParams = Form.useWatch('ad_link_params', adEditForm)
    const [adLinkPreview, setAdLinkPreview] = useState<string | null>(null)
    const profileFields = useProfileFields()

    const handleModal = (record: AdItem) => {
        setModalAd(record)
        adEditForm.setFieldsValue(record)
        setModalVisible(true)
    }

    const handleDelete = (record: AdItem) => {
        const id = record._id

        apiClient
            .delete(`/ads/${id}`)
            .then(({ data }) => {
                message.success(data.message ?? 'Ad deleted successfully')
                adsTable.current.reloadAndRest()
            })
            .catch(err => message.error(err?.data?.message ?? err.statusText))
            .finally(() => setIsLoading(false))
    }

    const saveAd = (params: AdItem) => {
        const fields = params
        const id = modalAd._id
        let endpoint = `/ads`
        let msgOk = 'Ad updated successfully'

        if (!id) {
            fields.list_id = list_id
            msgOk = 'Ad created successfully'
        } else {
            endpoint = `/ads/${id}`
        }

        apiClient
            .post(endpoint, fields)
            .then(({ data }) => {
                message.success(data.message ?? msgOk)
                setModalVisible(false)
                adEditForm.resetFields()
                setModalAd({})
                adsTable.current.reloadAndRest()
            })
            .catch(err => message.error(err?.data?.message ?? err.statusText))
            .finally(() => setIsLoading(false))
    }

    const columns: ProColumns<AdItem>[] = [
        {
            title: 'Name',
            dataIndex: 'icon_url',
            ellipsis: true,
            search: false,
            valueType: 'avatar',
            width: 160,
            fixed: 'left',
            render: (icon, row) => {
                return <Space>{row.icon_url && icon}{row.name}</Space>
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            ellipsis: true,
            search: false,
            width: 200,
        },
        {
            title: 'Content',
            dataIndex: 'content',
            ellipsis: true,
            search: false,
            width: 250,
        },
        {
            title: 'Ad Type',
            dataIndex: 'ad_type',
            ellipsis: true,
            search: false,
            width: 200,
            renderText: (_, record) => {
                let txt = record.ad_type
                const campaigns: any = providers?.omxml?.campaigns

                if (txt === 'omxml') {
                    const incl = record.config?.campaign_ids?.map(k => campaigns[k])
                    const excl = record.config?.exclude_campaign_ids?.map(k => campaigns[k])

                    if (incl && incl.length > 0) {
                        txt += ` - Inc: ` + incl.join(', ')
                    }
                    if (excl && excl.length > 0) {
                        txt += ` / Excl: ` + excl.join(', ')
                    }
                }

                return txt
            },
        },
        {
            title: 'CPC',
            dataIndex: 'cpc',
            ellipsis: true,
            search: false,
            width: 90,
        },
        {
            title: 'Icon Type',
            dataIndex: 'icon_type',
            ellipsis: true,
            search: false,
            width: 100,
        },
        {
            title: 'Created at',
            dataIndex: 'created_at',
            search: false,
            width: 170,
            renderText: (val) => dayjs(val).format('YYYY-MM-DD hh:mm A'),
        },
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
                            onClick={() => handleModal(record)}
                        />
                        <Popconfirm
                            title="Are you sure delete this ad?"
                            okText="Yes"
                            okType="danger"
                            cancelText="No"
                            placement="left"
                            onConfirm={() => handleDelete(record)}
                        >
                            <Button
                                danger={true}
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

    useEffect(() => {
        try {
            const url = new URL(adLink)
            const customParams = adLinkParams?.map((val: string) => [val, `{{${val}}}`]) ?? []
            const params = new URLSearchParams([
                ...Array.from(url.searchParams.entries()),
                ...customParams,
            ])

            setAdLinkPreview(`${url.origin}${url.pathname}?${decodeURI(params.toString())}`)
        } catch (_) {
            setAdLinkPreview('')
        }

    }, [adLink, adLinkParams])

    return (
        <>
            <ProTable
                actionRef={adsTable}
                scroll={{ x: 1000 }}
                columns={columns}
                request={(params) => {
                    params.list_id = list_id

                    const qs = new URLSearchParams(params)

                    return apiClient(`/ads?${qs.toString()}`).then(({ data }) => data)
                }}
                defaultSize="small"
                rowKey="_id"
                search={{ filterType: 'light' }}
                headerTitle="Ads"
                toolBarRender={() => [
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleModal({})}
                    />
                ]}
                columnsState={{
                    persistenceKey: 'ads-by-list-table',
                    persistenceType: 'localStorage',
                }}
            />

            <Modal
                title={modalAd ? `Ad Edit: ${modalAd.name}` : 'New Ad'}
                open={modalVisible}
                onOk={() => adEditForm.submit()}
                okText={modalAd?._id ? 'Save Ad' : 'Create Ad'}
                confirmLoading={isLoading}
                onCancel={() => {
                    adEditForm.resetFields()
                    setModalAd({})
                    setModalVisible(false)
                }}
            >
                <Form
                    form={adEditForm}
                    layout="vertical"
                    requiredMark="optional"
                    initialValues={{
                        icon_type: 'default',
                        cpc: 0.000
                    }}
                    onFinish={saveAd}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input placeholder="Ad Name" />
                    </Form.Item>
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input placeholder="Ad Title" />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        extra={(<small>Availble Tags: {adTags.join(', ')}</small>)}
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea placeholder="Ad Content" />
                    </Form.Item>
                    <Form.Item name="ad_type" label="Ad Type" rules={[{ required: true }]}>
                        <Select showSearch placeholder="Select the ad type" options={Object.values(providers)} />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(a, b) => a.ad_type !== b.ad_type}>
                        {({ getFieldValue }) => getFieldValue('ad_type') === 'directlink' ? (
                            <>
                                <Form.Item
                                    name="ad_link"
                                    label="Ad Link"
                                    rules={[{ required: true }, { type: 'url' }]}
                                >
                                    <Input placeholder="Enter the ad link..." />
                                </Form.Item>
                                <Form.Item
                                    name="ad_link_params"
                                    label="Params"
                                    extra={(adLinkPreview &&
                                        <Alert style={{ marginTop: 5 }} message={adLinkPreview} type="info" />)}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Please select params"
                                        options={profileFields}
                                    />
                                </Form.Item>
                            </>
                        ) : null}
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(a, b) => a.ad_type !== b.ad_type}>
                        {({ getFieldValue }) => getFieldValue('ad_type') === 'omxml' ? (
                            <>
                                <Form.Item name={['config', 'campaign_ids']} label="Campaigns">
                                    <Select
                                        mode="multiple"
                                        placeholder="Pick campaigns"
                                        options={Object.values(providers.omxml?.campaigns || {})}
                                    />
                                </Form.Item>
                                <Form.Item name={['config', 'exclude_campaign_ids']} label="Campaigns Exclude">
                                    <Select
                                        mode="multiple"
                                        placeholder="Pick campaigns"
                                        options={Object.values(providers.omxml?.campaigns || {})}
                                    />
                                </Form.Item>
                            </>
                        ) : null}
                    </Form.Item>
                    <Form.Item name="cpc" label="CPC" rules={[{ required: true }]}>
                        <InputNumber min={0.00} step={0.001} placeholder="Ad CPC" />
                    </Form.Item>
                    <Form.Item name="icon_type" label="Icon Type" rules={[{ required: true }]}>
                        <Select options={useIconType} placeholder="Select the icon type" />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(a, b) => a.icon_type !== b.icon_type}>
                        {({ getFieldValue }) => getFieldValue('icon_type') === 'custom' ? (
                            <Form.Item
                                name="icon_url"
                                label="Icon URL"
                                rules={[{ required: true }, { type: 'url' }]}
                            >
                                <Radio.Group
                                    options={adImages && adImages?.map(img => {
                                        return {
                                            value: img,
                                            label: (
                                                <Image src={img} preview={false} width={32} style={{ margin: '2px 0' }} />
                                            ),
                                        }
                                    })}
                                />
                            </Form.Item>
                        ) : null}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Ads
