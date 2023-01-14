import dayjs from 'dayjs'
import type { ProColumns } from '@ant-design/pro-components'

const providers = {
    'appcast': 'Appcast',
    'talent': 'Talent',
    'talroo': 'Talroo',
    'upward': 'Upward',
    'omxml': 'OMXML',
}

const commonColumns: ProColumns[] = [
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
    },
]

const basicColumns: ProColumns[] = [
    {
        title: 'Sends',
        dataIndex: 'sent',
        search: false,
        align: 'center',
        ellipsis: true,
        valueType: 'digit',
        width: 120,
        sorter: (a, b) => a.sent - b.sent,
    }, {
        title: 'Delivered',
        dataIndex: 'delivered',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.delivered - b.delivered,
    }, {
        title: 'Clicks',
        dataIndex: 'clicks',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.clicks - b.clicks,
    }, {
        title: 'CTR',
        dataIndex: 'ctr',
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 80,
        renderText: (_, row) => {
            const { clicks, delivered } = row

            return clicks > 0 && delivered > 0 ? ((clicks / delivered) * 100).toFixed(2) : null
        },
    },
]

const subsColumns: ProColumns[] = [
    {
        title: 'Subscribes',
        dataIndex: 'subscribed',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.subscribed - b.subscribed,
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
        title: 'No-Click Unsubs',
        dataIndex: 'unsubscribed_no_click',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.unsubscribed_no_delivery - b.unsubscribed_no_delivery,
    }, {
        title: 'No-Delivery Unsubs',
        dataIndex: 'unsubscribed_no_delivery',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.unsubscribed_no_delivery - b.unsubscribed_no_delivery,
    },
]

const revenueColumns: ProColumns[] = [
    {
        title: 'Revenue',
        dataIndex: 'revenue',
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (val) => val > 0 ? val.toFixed(2) : null,
        sorter: (a, b) => a.revenue - b.revenue,
    }, {
        title: 'Rev / Clicks',
        dataIndex: 'rev_per_clicks',
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 100,
        renderText: (_, record) => {
            const { revenue, clicks } = record

            return revenue > 0 && clicks > 0 ? `${(revenue / clicks).toFixed(2)}` : null
        }
    }, {
        title: 'RPM',
        dataIndex: 'rpm',
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 100,
        renderText: (_, row) => {
            const { sent, revenue } = row

            return revenue > 0 && sent > 0 ? ((revenue / sent) * 1000).toFixed(2) : null
        },
    },
]

const ad: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Ad',
        dataIndex: 'ad',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
    },
    ...basicColumns,
    ...revenueColumns,
]

const source: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Source',
        dataIndex: 'source',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
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
    },
    ...basicColumns,
    ...revenueColumns,
    ...subsColumns,
]

const optin: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Opt-In Type',
        dataIndex: 'optin',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
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
    },
    ...basicColumns,
    ...revenueColumns,
    ...subsColumns,
]

const device: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Device',
        dataIndex: 'device',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
    }, {
        title: 'Opt in Rate',
        dataIndex: 'opt_in_rate',
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (_, record) => {
            const { impression, subscribed } = record

            return impression > 0 && subscribed > 0 ? `${((subscribed / impression) * 100).toFixed(2)}` : null
        }
    },
    ...basicColumns,
    ...revenueColumns,
    ...subsColumns,
]

const hourly: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Hour',
        dataIndex: 'hour',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
    }, {
        title: 'Opt in Rate',
        dataIndex: 'opt_in_rate',
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (_, record) => {
            const { impression, subscribed } = record

            return impression > 0 && subscribed > 0 ? `${((subscribed / impression) * 100).toFixed(2)}` : null
        }
    },
    ...basicColumns,
    ...revenueColumns,
    ...subsColumns,
]

const os: ProColumns[] = [
    ...commonColumns,
    {
        title: 'OS',
        dataIndex: 'os',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
    }, {
        title: 'Opt in Rate',
        dataIndex: 'opt_in_rate',
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (_, record) => {
            const { impression, subscribed } = record

            return impression > 0 && subscribed > 0 ? `${((subscribed / impression) * 100).toFixed(2)}` : null
        }
    },
    ...basicColumns,
    ...revenueColumns,
    ...subsColumns,
]

const browser: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Browser',
        dataIndex: 'browser',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
    }, {
        title: 'Opt in Rate',
        dataIndex: 'opt_in_rate',
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (_, record) => {
            const { impression, subscribed } = record

            return impression > 0 && subscribed > 0 ? `${((subscribed / impression) * 100).toFixed(2)}` : null
        }
    },
    ...basicColumns,
    ...revenueColumns,
    ...subsColumns,
]

const provider: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Provider',
        dataIndex: 'provider',
        search: false,
        align: 'center',
        ellipsis: true,
        width: 120,
    },
    ...basicColumns,
    ...revenueColumns,
]

const summary: ProColumns[] = [
    ...commonColumns,
    ...basicColumns,
    ...revenueColumns,
    {
        title: 'New Subscribers',
        dataIndex: 'subscribed',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 140,
        sorter: (a, b) => a.subscribed - b.subscribed,
    }, {
        title: 'Total Subscribers',
        dataIndex: 'active_subscribers',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 140,
        sorter: (a, b) => a.active_subscribers - b.active_subscribers,
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
            const { revenue, subscribed } = record

            return revenue > 0 && subscribed > 0 ? `${(revenue / subscribed).toFixed(2)}` : null
        }
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
        title: 'No-Click Unsubs',
        dataIndex: 'unsubscribed_no_click',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.unsubscribed_no_delivery - b.unsubscribed_no_delivery,
    }, {
        title: 'No-Delivery Unsubs',
        dataIndex: 'unsubscribed_no_delivery',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.unsubscribed_no_delivery - b.unsubscribed_no_delivery,
    },
]

const regular: ProColumns[] = [
    ...commonColumns,
    ...basicColumns,
    {
        title: 'Revenue',
        dataIndex: 'revenue',
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (val) => val > 0 ? val.toFixed(2) : null,
        sorter: (a, b) => a.revenue - b.revenue,
    }, {
        title: 'RPM',
        dataIndex: 'rpm',
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 100,
        renderText: (_, row) => {
            const { sent, revenue } = row

            return revenue > 0 && sent > 0 ? ((revenue / sent) * 1000).toFixed(2) : null
        },
    }, {
        title: 'New Subscribers',
        dataIndex: 'subscribed',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 140,
        sorter: (a, b) => a.subscribed - b.subscribed,
    }, {
        title: 'Unsubscribed',
        dataIndex: 'unsubscribed',
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.unsubscribed - b.unsubscribed,
    },
]

const welcome: ProColumns[] = [
    ...commonColumns,
    {
        title: 'Sends',
        dataIndex: ['welcome', 'sent'],
        search: false,
        align: 'center',
        ellipsis: true,
        valueType: 'digit',
        width: 120,
    }, {
        title: 'Delivered',
        dataIndex: ['welcome', 'delivered'],
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
    }, {
        title: 'Clicks',
        dataIndex: ['welcome', 'clicks'],
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
    }, {
        title: 'CTR',
        dataIndex: ['welcome', 'ctr'],
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 80,
        renderText: (_, row) => {
            const { clicks, delivered } = row?.welcome || {}

            return clicks > 0 && delivered > 0 ? ((clicks / delivered) * 100).toFixed(2) : null
        },
    }, {
        title: 'Revenue',
        dataIndex: 'welcome_revenue',
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 120,
        sorter: (a, b) => a.welcome_revenue - b.welcome_revenue,
    }, {
        title: 'RPM',
        dataIndex: 'rpm',
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 100,
        renderText: (_, row) => {
            const { sent } = row?.welcome ?? {}
            const revenue = row?.welcome_revenue ?? 0

            return revenue > 0 && sent > 0 ? ((revenue / sent) * 1000).toFixed(2) : null
        },
    },
]

for (const [key, name] of Object.entries(providers)) {
    // regular columns
    regular.push({
        title: `${name} Clicks`,
        dataIndex: ['providers', key, 'clicks'],
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (val) => val > 0 ? val : null,
    })
    regular.push({
        title: `${name} Rev`,
        dataIndex: ['providers', key, 'revenue'],
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (val) => val > 0 ? val.toFixed(2) : null,
    })
    regular.push({
        title: `${name} CTR`,
        dataIndex: ['providers', key, 'ctr'],
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (_, row) => {
            const { _clicks, delivered } = row.providers?.[key] ?? {}

            return _clicks > 0 && delivered > 0 ? ((_clicks / delivered) * 100).toFixed(2) : null
        },
    })

    // welcome columns
    welcome.push({
        title: `${name} Clicks`,
        dataIndex: ['welcome_providers', key, 'clicks'],
        search: false,
        valueType: 'digit',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (val) => val > 0 ? val : null,
    })
    welcome.push({
        title: `${name} Rev`,
        dataIndex: ['welcome_providers', key, 'revenue'],
        search: false,
        valueType: () => {
            return { type: 'money', locale: 'en-US' }
        },
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (val) => val > 0 ? val.toFixed(2) : null,
    })
    welcome.push({
        title: `${name} CTR`,
        dataIndex: ['welcome_providers', key, 'ctr'],
        search: false,
        valueType: 'percent',
        align: 'center',
        ellipsis: true,
        width: 120,
        renderText: (_, row) => {
            const { _clicks, delivered } = row.welcome_providers?.[key] ?? {}

            return _clicks > 0 && delivered > 0 ? ((_clicks / delivered) * 100).toFixed(2) : null
        },
    })
}

const columns = { ad, source, optin, summary, regular, welcome, os, device, hourly, browser, provider }

export default columns
