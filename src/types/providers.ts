export interface Provider {
    _id?: string,
    value: string
    label: string
}

export type ProviderBase = Provider

export type ProviderWithConfig = Provider & {
    config?: { label: string, name: string }[]
}

export type ProviderOMXML = Provider & {
    campaigns?: {
        [name: string]: {
            label: string,
            value: string
        }
    }
}

export type ProviderItem = Provider & ProviderWithConfig & ProviderOMXML & {
    id?: string
}

export type ProviderCollection = {
    [name: string]: ProviderItem
}
