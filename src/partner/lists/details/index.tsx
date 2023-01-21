import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Card } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { DualAxes } from '@ant-design/plots'
import { useApiClient } from '../../../hooks/api'
import { useAppSelector } from '../../../redux/hooks'
import type { ListItem } from '../../../types/lists'
import { mapDualAxis } from '../../../utils/chart-mapper'

function Index() {
    const list = useAppSelector<ListItem>(({ list }) => list.current)
    const apiClient = useApiClient()
    const [stats, setStats] = useState<[]>([])

    const columns: ProColumns[] = [
        {
            title: 'Dates',
            dataIndex: 'dates',
            valueType: 'dateRange',
            hideInTable: true,
            initialValue: [dayjs().subtract(1, 'month'), dayjs()],
        }, {
            title: 'Date',
            dataIndex: 'date',
            fixed: 'left',
            search: false,
            renderText: (value) => dayjs(value).format('YYYY-MM-DD'),
            ellipsis: true,
            width: 120,
        }, {
            title: 'Subscribes',
            dataIndex: 'subscribed',
            search: false,
            valueType: 'digit',
            align: 'center',
            ellipsis: true,
            width: 120,
            sorter: (a, b) => a.subscribed - b.subscribed,
        }, {
            title: 'Opt-In Rate',
            dataIndex: 'optin_rate',
            search: false,
            valueType: 'percent',
            align: 'center',
            ellipsis: true,
            width: 120,
            renderText: (_, record) => {
                const { impression, subscribed } = record

                return impression > 0 && subscribed > 0 ? `${((subscribed / impression) * 100).toFixed(2)}` : null
            }
        }, {
            title: 'Unsubscribes',
            dataIndex: 'unsubscribed',
            search: false,
            valueType: 'digit',
            align: 'center',
            ellipsis: true,
            width: 120,
            sorter: (a, b) => a.unsubscribed - b.unsubscribed,
        }, {
            title: 'Revenue',
            dataIndex: 'partner_rev',
            search: false,
            valueType: () => {
                return { type: 'money', locale: 'en-US' }
            },
            align: 'center',
            ellipsis: true,
            width: 120,
            renderText: (val) => val > 0 ? val.toFixed(2) : null,
            sorter: (a, b) => a.partner_rev - b.partner_rev,
        }, {
            title: 'Rev / Sub',
            dataIndex: 'rev_per_sub',
            search: false,
            valueType: () => {
                return { type: 'money', locale: 'en-US' }
            },
            align: 'center',
            ellipsis: true,
            width: 100,
            renderText: (_, record) => {
                const { partner_rev, subscribed } = record

                return partner_rev > 0 && subscribed > 0 ? `${(partner_rev / subscribed).toFixed(2)}` : null
            }
        },
    ]

    return (
        <>
            <Card style={{ marginBottom: '20px' }}>
                <DualAxes
                    data={[mapDualAxis(stats, { revenue: 'partner_rev' }).reverse(), mapDualAxis(stats, { revenue: 'partner_rev' }).reverse()]}
                    xField="Date"
                    yField={['Revenue', 'Clicks']}
                    height={250}
                />
            </Card>

            <ProTable
                bordered={true}
                scroll={{ x: 1000 }}
                search={{ filterType: 'light' }}
                columns={columns}
                request={async (params) => {
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
                    persistenceKey: 'partner-report-table',
                    persistenceType: 'localStorage',
                }}
            />
        </>
    )
}

export default Index
