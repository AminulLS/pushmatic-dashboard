export interface Provider {
    _id?: string,
    value: string
    label: string
}

export type ProviderBase = Provider

export type ProviderWithConfig = ProviderBase & {
    config?: { label: string, name: string }[]
}

export type ProviderOMXML = ProviderBase & {
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
