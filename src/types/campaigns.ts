export interface CampaignMessageConfig {
    [name: string]: any

    campaign_ids?: string[]
    exclude_campaign_ids?: string[]
}

export interface CampaignMessage {
    time?: number
    time_type?: string
    type?: string
    provider?: string
    title?: string
    message?: string
    config?: CampaignMessageConfig
}

export interface Campaign {
    _id?: string
    list_id?: string
    segment_id?: string
    name?: string
    type?: string,
    queue?: string
    processor?: string
    status?: string
    flows?: CampaignMessage[]
    created_at?: string
    updated_at?: string
}

export type CampaignItem = Campaign
