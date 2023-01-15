import type { TreeItem } from '../types/misc'

type DefaultValue = { label: string, value: string }
export const useProfileFields = (): DefaultValue[] => [
    {
        label: 'First Name',
        value: 'first_name',
    },
    {
        label: 'Last Name',
        value: 'last_name',
    },
    {
        label: 'Full Name',
        value: 'full_name',
    },
    {
        label: 'Email',
        value: 'email',
    },
    {
        label: 'Phone',
        value: 'phone',
    },
    {
        label: 'Search',
        value: 'search',
    },
    {
        label: 'Location',
        value: 'location',
    },
    {
        label: 'Source',
        value: 'source',
    },
]

export const useSegmentTypes = (): DefaultValue[] => [
    {
        label: 'Keyword',
        value: 'keyword'
    },
    {
        label: 'Browser',
        value: "browser"
    },
    {
        label: 'Device',
        value: 'device'
    },
    {
        label: 'Operating System',
        value: 'os'
    },
    {
        label: 'Location',
        value: 'location'
    },
    {
        label: 'Source',
        value: 'source'
    },
    {
        label: 'All Time Clicks',
        value: 'clicks_any'
    },
    {
        label: 'Weekly Clicks',
        value: 'clicks_weekly'
    },
    {
        label: 'Monthly Clicks',
        value: 'clicks_monthly'
    }
]

export const useSegmentBrowser = (): DefaultValue[] => [
    {
        label: 'Chrome',
        value: 'Chrome',
    },
    {
        label: 'Firefox',
        value: 'Firefox'
    },
    {
        label: 'Samsung',
        value: 'Samsung',
    },
    {
        label: 'Safari',
        value: 'Safari'
    },
    {
        label: 'Unknown',
        value: 'Unknown'
    },
]

export const useSegmentDevice = (): DefaultValue[] => [
    {
        label: 'Tablet',
        value: 'Tablet'
    },
    {
        label: 'Mobile',
        value: 'Mobile'
    },
    {
        label: 'Desktop',
        value: 'Desktop'
    },
]

export const useSegmentOs = (): DefaultValue[] => [
    {
        label: 'macOS',
        value: 'macOS',
    },
    {
        label: 'iOS',
        value: 'iOS'
    },
    {
        label: 'Windows',
        value: 'Windows',
    },
    {
        label: 'Android',
        value: 'Android'
    },
    {
        label: 'Linux',
        value: 'Linux'
    },
    {
        label: 'Unknown',
        value: 'Unknown'
    },
]

export const useIconTypes = (): DefaultValue[] => [
    {
        value: 'default',
        label: 'Default',
    },
    {
        value: 'random',
        label: 'Random',
    },
    {
        value: 'custom',
        label: 'Custom',
    }
]

export const useAvailableDays = (): { [name: string]: string } => ({
    Any: 'Everyday',
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
})


export const useGeneratedTimes = (): DefaultValue[] => {
    const times = []

    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0')

        times.push({
            label: `${hour}:00`,
            value: `${hour}:00`,
        })
        times.push({
            label: `${hour}:15`,
            value: `${hour}:15`,
        })
        times.push({
            label: `${hour}:30`,
            value: `${hour}:30`,
        })
    }

    return times
}

export const useGeneratedTimesOfDays = (): TreeItem[] => {
    const days = useAvailableDays()
    const times = useGeneratedTimes()
    const treeData = []

    for (const [day, fullDay] of Object.entries(days)) {
        treeData.push({
            title: fullDay,
            value: day,
            pId: 0,
            id: day,
            disabled: true,
        })


        times.forEach(({ label, value }) => {
            treeData.push({
                id: `${day}:${value}`,
                pId: day,
                title: `${fullDay} at ${label}`,
                value: `${day}:${value}`,
            })
        })
    }

    treeData.push({
        pId: 0,
        id: 'other',
        title: 'Other',
        value: 'other',
        disabled: true,
    })

    return treeData
}
export const useSuggestedKeywords = (): string[] => [
    'warehouse', 'retail', 'driver', 'customer support'
]

export const useOnlyUserFields = () => [
    '{{first_name}}', '{{last_name}}', '{{full_name}}', '{{email}}', '{{phone}}', '{{search}}', '{{location}}', '{{source}}',
]
