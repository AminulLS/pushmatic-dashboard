import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Card, Button, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { DualAxes, Line } from '@ant-design/plots'
import { useApiClient } from '../hooks/api'
import reportColumns from '../components/report-columns'
import { mapDualAxis, mapHourlyLine } from '../utils/chart-mapper'

function Reports() {
    const apiClient = useApiClient()
    const [stats, setStats] = useState<[]>([]);
    const [hourlyStats, setHourlyStats] = useState<[]>([]);
    const [activeKey, setActiveKey] = useState<'summary' | 'welcome' | 'regular'>('summary')

    const actions: ProColumns[] = [
        {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (<Button
                shape="circle"
                icon={<ReloadOutlined />}
                onClick={(e: any) => {
                    e.nativeEvent.target.disabled = true;
                    message.loading({
                        content: 'Requesting...',
                        key: `${record._id}`,
                    });

                    apiClient.post('/reports/master-revenue-update', {
                        id: record.list_id,
                        day: dayjs(record.date).format('YYYY-MM-DD'),
                    }).then(({ data }) => {
                        message.success({
                            content: data.message,
                            key: `${record._id}`,
                        });
                    }).catch((res) => {
                        message.error({
                            content: res?.data?.message ?? res.statusText,
                            key: `${record._id}`,
                        });
                    }).catch(() => {
                        e.nativeEvent.target.disabled = false;
                    });
                }}
            />),
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
                bordered={true}
                scroll={{ x: 1000 }}
                columns={[...reportColumns[activeKey], ...actions]}
                request={(params) => {
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily?${qs}`)
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
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-ad?${qs}`)
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
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-source?${qs}`)
                        .then(({ data }) => data)
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'source-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="Opt-In Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                columns={reportColumns.optin}
                search={{ filterType: 'light' }}
                request={(params) => {
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-optin?${qs}`)
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
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-device?${qs}`)
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
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-os?${qs}`)
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
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-browser?${qs}`)
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
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-provider?${qs}`)
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
                    const qs = (new URLSearchParams(params)).toString()

                    return apiClient
                        .get(`/reports/daily-by-hour?${qs}`)
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
    );
}

export default Reports
