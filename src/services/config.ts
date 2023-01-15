import type { HostCollection, HostItem } from '../types/hosts'
import cleanHost from '../utils/clean-host'

export const hosts: HostCollection = {
    'localhost:3000': {
        domain: 'localhost',
        cdn: 'http://localhost:3000/storage/',
        api: 'http://localhost:3010/api/v1',
        name: 'Pushmatic',
        title: 'Pushmatic',
        desc: 'The Pushmatic Dashboard.',
        favicon: '/favicon.ico',
        logo: '/logo512.png',
        icon: '/logo192.png',
    },
    'pushmatic.io': {
        domain: 'pushmatic.io',
        cdn: 'cdn.pushmatic.io',
        api: 'https://pushmatic.io/api/v1',
        name: 'Pushmatic',
        title: 'Pushmatic',
        desc: 'The Pushmatic Dashboard.',
        favicon: '/favicon.ico',
        logo: '/logo512.png',
        icon: '/logo192.png',
    },
    'push-alerts.io': {
        domain: 'push-alerts.io',
        cdn: 'cdn.push-alerts.io',
        api: 'https://push-alerts.io/api/v1',
        name: 'Push Alerts',
        title: 'Push Alerts',
        desc: 'The Push Alert Dashboard.',
        favicon: '/favicon.ico',
        logo: '/logo512.png',
        icon: '/logo192.png',
    }
}

export const getHostConfig = (host: string): HostItem => {
    const key = cleanHost(host)

    return hosts[key]
}

export const isValidHost = (host: string): boolean => {
    const key = cleanHost(host)
    const profiles = Object.keys(hosts)

    return profiles.indexOf(key) !== -1
}

export const currentHost = getHostConfig(window.location.host)
