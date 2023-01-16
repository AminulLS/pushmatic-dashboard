import React, { useRef, useState } from 'react'
import dayjs from 'dayjs'
import { Button, Space, Popconfirm, message, Modal } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import AdComposer from '../../../components/ad-composer'
import { useApiClient } from '../../../hooks/api'
import { useProviders } from '../../../hooks/cache'
import { useAppSelector } from '../../../redux/hooks'
import type { AdItem } from '../../../types/ads'
import type { ListItem } from '../../../types/lists'

function Ads() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const providers = useProviders()

    const adsTable = useRef<any>()
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [modalAd, setModalAd] = useState<AdItem>({})

    const handleModal = (record: AdItem) => {
        setModalAd(record)
        setModalVisible(true)
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
                const campaigns = providers?.omxml?.campaigns

                if (txt === 'omxml') {
                    const incl = record.config?.campaign_ids?.map(k => (campaigns ? campaigns[k]?.label : k))
                    const excl = record.config?.exclude_campaign_ids?.map(k => (campaigns ? campaigns[k]?.label : k))

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
                            onConfirm={() => {
                                return apiClient
                                    .delete(`/ads/${record._id}`)
                                    .then(({ data }) => {
                                        adsTable.current.reloadAndRest()

                                        return message.success(data.message)
                                    })
                                    .catch(err => message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message))
                            }}
                        >
                            <Button size="small" danger={true} shape="circle" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ]

    return (
        <>
            <ProTable
                actionRef={adsTable}
                scroll={{ x: 1000 }}
                columns={columns}
                request={(params) => {
                    params.list_id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient(`/ads?${qs.toString()}`).then(({ data }) => data)
                }}
                rowKey="_id"
                search={{ filterType: 'light' }}
                headerTitle="Ads"
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleModal({})} />
                ]}
                columnsState={{
                    persistenceKey: 'ads-by-list-table',
                    persistenceType: 'localStorage',
                }}
            />

            <Modal
                title={modalAd._id ? `Ad Edit: ${modalAd.name}` : 'New Ad'}
                open={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
                afterClose={() => setModalAd({})}
                destroyOnClose={true}
            >
                <AdComposer
                    requiredMark="optional"
                    request={async () => modalAd}
                    initialValues={{
                        icon_type: 'default',
                        cpc: 0.000
                    }}
                    onFinish={async (fields) => {
                        fields.list_id = list._id
                        const endpoint = !modalAd._id ? `/ads` : `/ads/${modalAd._id}`

                        return apiClient
                            .post(endpoint, fields)
                            .then(({ data }) => {
                                setModalVisible(false)
                                setModalAd({})
                                adsTable.current.reloadAndRest()

                                return message.success(data.message)
                            })
                            .catch(err => message.error((err?.response?.data?.message ?? err?.response?.statusText) ?? err.message))
                    }}
                />
            </Modal>
        </>
    )
}

export default Ads
