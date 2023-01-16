import { AdItem } from './ads'

export interface CampaignMessage extends AdItem {
    time?: number
    time_type?: string
    type?: string
}

export type CampaignMessageItem = CampaignMessage

export interface Campaign {
    _id?: string
    list_id?: string
    segment_id?: string
    name?: string
    type?: string,
    queue?: string
    processor?: string
    status?: string
    flows?: CampaignMessageItem[]
    created_at?: string
    updated_at?: string
}

export type CampaignItem = Campaign
