export interface Ad {
    _id?: string
    list_id?: string
    name?: string
    title?: string
    content?: string
    ad_type?: string
    cpc?: number
    icon_type?: 'default' | 'random' | 'custom'
    icon_url?: string
    ad_link?: string
    ad_link_params?: string[]
    keyword?: string
    config?: {
        campaign_ids?: string[]
        exclude_campaign_ids?: string[]
        [name: string]: any
    },
    created_at?: string
    updated_at?: string
}

export type AdItem = Ad
