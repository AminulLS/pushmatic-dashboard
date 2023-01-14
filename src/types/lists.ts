export interface List {
    _id?: string
    name?: string
    email?: string
    icon?: string
    schedules?: string[]
    tokens?: string[]
    private_key?: string
    public_key?: string
    followup?: number
    followup_delay?: number
    welcome_delay?: number
    unsub_delivery_after?: number
    unsub_click_after?: number
    keep?: number
    domain?: string
    status?: 'active' | 'inactive'
    created_at?: string
    updated_at?: string
    users?: number
    admin_id?: string
    failover?: string[]
    fallback_url?: string
    keywords?: string
    providers?: {
        [name: string]: {
            [name: string]: string
        }
    }
    rev_share?: number
    sending_pattern?: 'regular' | 'prefetch'
}

export type ListItem = List

export type ListStates = {
    [name: string]: List
}
