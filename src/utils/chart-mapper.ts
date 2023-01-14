import dayjs from 'dayjs'

type DualAxisStats = {
    Revenue: any
    Clicks: any
    Date: string
}

type LineStats = {
    time: string
    type: string
    value: number
}

type ChartDataItem = {
    date?: string
    hour?: string | number
    revenue?: number
    clicks?: number
    sent?: number
    delivered?: number
    subscribed?: number
    unsubscribed?: number
}

export function mapDualAxis(data: ChartDataItem[]): DualAxisStats[] {
    return data.map((item) => {
        return {
            Date: dayjs(item.date).format('MMM DD, YY'),
            Revenue: item.revenue ?? 0,
            Clicks: item.clicks ?? 0,
        }
    })
}

export function mapHourlyLine(data: ChartDataItem[]): LineStats[] {
    let mapped = [];

    for (const hour of data) {
        const time = dayjs(hour.date).add(Number(hour.hour), 'h').format('MM/DD [at] hh A');

        mapped.push({
            time: time,
            type: 'Sent',
            value: hour.sent || 0
        });
        mapped.push({
            time: time,
            type: 'Delivered',
            value: hour.delivered || 0
        });
        mapped.push({
            time: time,
            type: 'Clicks',
            value: hour.clicks || 0
        });
        mapped.push({
            time: time,
            type: 'Revenue',
            value: hour.revenue || 0
        });
        mapped.push({
            time: time,
            type: 'Subscribed',
            value: hour.subscribed || 0
        });
        mapped.push({
            time: time,
            type: 'Unsubscribed',
            value: hour.unsubscribed || 0
        });
    }

    return mapped;
}
