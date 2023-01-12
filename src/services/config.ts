import { Host, HostCollection } from '../types/hosts'
import cleanHost from '../utils/cleanHost'

export const hosts: HostCollection = {
    'localhost:3000': {
        domain: 'localhost',
        cdn: 'http://localhost:3000/storage/',
        api: 'http://localhost:3010/api/v1',
        name: 'Pushmatic',
        title: 'Pushmatic',
        desc: 'The Pushmatic Dashboard.',
        favicon: 'http://localhost:3000/storage/img/favicon.ico',
        logo: 'http://localhost:3000/storage/img/logo.png',
        icon: 'http://localhost:3000/storage/img/icon.png',
    },
    'pushmatic.io': {
        domain: 'pushmatic.io',
        cdn: 'cdn.pushmatic.io',
        api: 'https://pushmatic.io/api/v1',
        name: 'Pushmatic',
        title: 'Pushmatic',
        desc: 'The Pushmatic Dashboard.',
        favicon: 'https://pushmatic.io/storage/img/favicon.ico',
        logo: 'https://pushmatic.io/storage/img/logo.png',
        icon: 'https://pushmatic.io/storage/img/icon.png',
    },
    'push-alerts.io': {
        domain: 'push-alerts.io',
        cdn: 'cdn.push-alerts.io',
        api: 'https://push-alerts.io/api/v1',
        name: 'Push Alerts',
        title: 'Push Alerts',
        desc: 'The Push Alert Dashboard.',
        favicon: 'https://push-alerts.io/storage/img/push-alert-favicon.ico',
        logo: 'https://push-alerts.io/storage/img/push-alert-logo.png',
        icon: 'https://push-alerts.io/storage/img/push-alert-icon.png',
    }
}

export const getHostConfig = (host: string): Host => {
    const key = cleanHost(host)

    return hosts[key]
}

export const isValidHost = (host: string): boolean => {
    const key = cleanHost(host)
    const profiles = Object.keys(hosts)

    return profiles.indexOf(key) !== -1
}

export const currentHost = getHostConfig(window.location.host)
