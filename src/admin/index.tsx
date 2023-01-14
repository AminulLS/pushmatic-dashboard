import React, { useEffect, useState } from 'react'
import { TinyArea } from '@ant-design/plots';
import { ProCard, StatisticCard, Statistic } from '@ant-design/pro-components';
import { useApiClient } from '../hooks/api'

const defaultStats = {
    subscribed: 0,
    unsubscribed: 0,
    sent: 0,
    clicks: 0,
    revenue: null
}

function Index() {
    const apiClient = useApiClient()
    const [stats, setStats] = useState({
        current: [defaultStats],
        previous: [defaultStats],
        currentDay: defaultStats,
        previousDay: defaultStats,
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        apiClient
            .get('/reports/dashboard')
            .then(({ data }) => {
                setStats({
                    currentDay: data.current?.[0] ?? {},
                    previousDay: data.previous?.[0] ?? {},
                    current: (data.current ?? []).reverse(),
                    previous: (data.previous ?? []).reverse(),
                })
            }).finally(() => setIsLoading(false))

        // eslint-disable-next-line
    }, [])


    return (
        <ProCard className="app-custom-shadow" split="vertical">
            <StatisticCard colSpan={6} title="Today's Activities" loading={isLoading}>
                <Statistic value={stats.currentDay.subscribed ?? 0} title="Subscribed" layout="horizontal" />
                <Statistic value={(stats.currentDay.unsubscribed ?? 0)} title="Unsubscribed" layout="horizontal" />
                <Statistic value={stats.currentDay.sent ?? 0} title="Sends" layout="horizontal" />
                <Statistic value={stats.currentDay.clicks ?? 0} title="Clicks" layout="horizontal" />
                <Statistic value={(stats.currentDay.revenue ?? 0).toFixed(2)} title="Revenues" layout="horizontal" />
            </StatisticCard>
            <StatisticCard.Group colSpan={18}>
                <StatisticCard
                    title="Subscriptions"
                    loading={isLoading}
                    statistic={{
                        value: stats.current?.map((v: any) => v.subscribed ?? 0).reduce((current, previous) => current + previous, 0),
                    }}
                    chart={
                        <TinyArea
                            height={60}
                            autoFit={false}
                            smooth={true}
                            data={[
                                ...stats.current?.map((val: any) => val.subscribed ?? 0),
                                ...Array(7 - (stats.current?.length ?? 0)).fill(0)
                            ]}
                        />
                    }
                />
                <StatisticCard
                    title="Clicks"
                    loading={isLoading}
                    statistic={{
                        value: stats.current?.map((v: any) => v.clicks ?? 0).reduce((current, previous) => current + previous, 0),
                    }}
                    chart={
                        <TinyArea
                            height={60}
                            autoFit={false}
                            smooth={true}
                            data={[
                                ...stats.current?.map((val: any) => val.clicks ?? 0),
                                ...Array(7 - (stats.current?.length ?? 0)).fill(0)
                            ]}
                        />
                    }
                />
                <StatisticCard
                    title="Revenues"
                    loading={isLoading}
                    statistic={{
                        value: stats.current?.map((v: any) => v.revenue ?? 0).reduce((current, previous) => current + previous, 0).toFixed(2),
                    }}
                    chart={
                        <TinyArea
                            height={60}
                            autoFit={false}
                            smooth={true}
                            data={[
                                ...stats.current?.map((val: any) => val.revenue ?? 0),
                                ...Array(7 - (stats.current?.length ?? 0)).fill(0)
                            ]}
                        />
                    }
                />
            </StatisticCard.Group>
        </ProCard>
    )
}

export default Index
