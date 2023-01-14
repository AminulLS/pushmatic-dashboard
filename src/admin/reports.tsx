import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Card, Button, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import { DualAxes } from '@ant-design/plots'
import { useApiClient } from '../hooks/api'
import reportColumns from '../components/report-columns'

import type { ProColumns } from '@ant-design/pro-components'

function mapChartData(data: any) {
    return data.map((item: any) => {
        return {
            Date: dayjs(item.date).format('MMM DD, YY'),
            Revenue: item.revenue ?? 0,
            Clicks: item.clicks ?? 0,
        };
    });
}

function Reports() {
    const apiClient = useApiClient()
    const [stats, setStats] = useState([]);
    const [activeKey, setActiveKey] = useState<string>('summary');

    const actions: ProColumns[] = [
        {
            title: 'Action',
            search: false,
            width: 75,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (<Button
                size="small"
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
                    data={[mapChartData(stats.slice().reverse()), mapChartData(stats.slice().reverse())]}
                    xField="Date"
                    yField={['Revenue', 'Clicks']}
                    height={250}
                />
            </Card>
            <ProTable
                bordered={true}
                scroll={{ x: 1000 }}
                defaultSize="small"
                columns={[...reportColumns.summary, ...actions]}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily?${qs}`)

                    setStats(data.data)

                    return data
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
                defaultSize="small"
                columns={reportColumns.ad}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily-by-ad?${qs}`)

                    return data
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
                defaultSize="small"
                columns={reportColumns.source}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily-by-source?${qs}`)

                    return data
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
                defaultSize="small"
                columns={reportColumns.optin}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily-by-optin?${qs}`)

                    return data
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
                defaultSize="small"
                columns={reportColumns.device}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily-by-device?${qs}`)

                    return data
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
                defaultSize="small"
                columns={reportColumns.os}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const { data } = await apiClient.get(`/reports/daily-by-os`, { params })

                    return data
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
                defaultSize="small"
                columns={reportColumns.browser}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily-by-browser?${qs}`);

                    return data
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
                defaultSize="small"
                columns={reportColumns.provider}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily-by-provider?${qs}`)

                    return data
                }}
                rowKey="_id"
                columnsState={{
                    persistenceKey: 'provider-report-table',
                    persistenceType: 'localStorage',
                }}
            />

            <ProTable
                headerTitle="Hourly Report"
                style={{ marginTop: '20px' }}
                bordered={true}
                scroll={{ x: 1000 }}
                defaultSize="small"
                columns={reportColumns.hourly}
                search={{ filterType: 'light' }}
                request={async (params) => {
                    const qs = (new URLSearchParams(params)).toString()
                    const { data } = await apiClient.get(`/reports/daily-by-hour?${qs}`)

                    return data
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
