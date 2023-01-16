import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Card, Dropdown, message } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import { DualAxes, Line } from '@ant-design/plots'
import { EllipsisOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import { useApiClient } from '../../../hooks/api'
import { useAppSelector } from '../../../redux/hooks'
import type { ListItem } from '../../../types/lists'
import { mapDualAxis, mapHourlyLine } from '../../../utils/chart-mapper'
import reportColumns from '../../../components/report-columns'

function Reports() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const [stats, setStats] = useState<[]>([])
    const [hourlyStats, setHourlyStats] = useState<[]>([])
    const [activeKey, setActiveKey] = useState<'summary' | 'welcome' | 'regular'>('summary')

    const actions: ProColumns[] = [
        {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (<Dropdown
                arrow
                placement="bottomRight"
                menu={{
                    items: ['appcast', 'talent', 'talroo', 'upward', 'omxml'].map(item => {
                        const key = `${item}_${record._id}`
                        return {
                            label: `Refresh ${item}`,
                            key: key,
                            onClick: () => {
                                console.log(item)
                                message.loading({
                                    content: 'Requesting...',
                                    key,
                                })

                                apiClient
                                    .post('/reports/revenue-update', {
                                        id: record.list_id,
                                        provider: item,
                                        day: dayjs(record.date).format('YYYY-MM-DD'),
                                    })
                                    .then(({ data }) => message.success({
                                        key,
                                        content: data.message
                                    }))
                                    .catch((err) => message.error({
                                            key,
                                            content: (err?.response?.data?.message ?? err?.response?.statusText) ?? err.message
                                        })
                                    )
                            },
                        }
                    })
                }}
            >
                <Button size="small" shape="circle"><EllipsisOutlined /></Button>
            </Dropdown>),
        }
    ]

    return (
        <>
            <Card style={{ marginBottom: '20px' }}>
                <DualAxes
                    data={[mapDualAxis(stats).reverse(), mapDualAxis(stats).reverse()]}
                    xField="Date"
                    yField={['Revenue', 'Clicks']}
                    height={250}
                />
            </Card>

            <ProTable
                search={{ filterType: 'light' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={[...reportColumns[activeKey], ...actions]}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list?${qs.toString()}`)
                        .then(({ data }) => {
                            setStats(data.data)

                            return data
                        })
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'welcome-alert-report-table',
                    persistenceType: 'localStorage',
                }}
                toolbar={{
                    menu: {
                        type: 'tab',
                        activeKey,
                        onChange: (key: any) => setActiveKey(key),
                        items: [
                            {
                                key: 'summary',
                                label: 'Summary',
                            }, {
                                key: 'welcome',
                                label: 'Welcome',
                            }, {
                                key: 'regular',
                                label: 'Regular',
                            },
                        ],
                    },
                }}
            />

            <ProTable
                headerTitle="Ad Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.ad}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-ad?${qs.toString()}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'ads-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="Source Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.source}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-source?${qs.toString()}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'source-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="Opt-in Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.optin}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-optin?${qs.toString()}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'optin-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="Device Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.device}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-device?${qs.toString()}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'device-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="OS Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.os}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-os?${qs.toString()}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'os-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="Browser Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.browser}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-browser?${qs.toString()}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'browser-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="Provider Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.provider}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-provider?${qs.toString()}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'provider-report-table',
                    persistenceType: 'localStorage',
                }}
            />
            <Card style={{ margin: '20px 0' }}>
                <Line
                    data={mapHourlyLine(hourlyStats).reverse()}
                    xField="time"
                    yField="value"
                    seriesField="type"
                    height={150}
                />
            </Card>
            <ProTable
                headerTitle="Hourly Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.hourly}
                search={{ filterType: 'light' }}
                request={(params) => {
                    params.id = list._id

                    const qs = new URLSearchParams(params)

                    return apiClient
                        .get(`/reports/daily-by-list-hour?${qs.toString()}`)
                        .then(({ data }) => {
                            setHourlyStats(data.data)

                            return data
                        })
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'hour-report-table',
                    persistenceType: 'localStorage',
                }}
            />
        </>
    )
}

export default Reports
